import { BigintIsh, CurrencyAmount, Currency, NativeCurrency } from '@uniswap/sdk-core'
import JSBI from 'jsbi'
import { Position } from './entities/position'

import { FeeAmount, getFeeType, TICK_SPACINGS } from './constants'
import { StateFetcher } from './stateFetcher'
import { TickMath } from './utils/tickMath'
import { Pool } from './entities/pool'
import { SuiCoin } from './entities'
import { nearestUsableTick, SlippageParams } from './utils'
import { UnserializedSignableTransaction } from '@mysten/sui.js'
import invariant from 'tiny-invariant'
import { ZERO } from './internalConstants'
import { Percent } from '@uniswap/sdk-core'

export interface MintSpecificOptions {
  /**
   * The account that should receive the minted NFT.
   */
  recipient: string

  /**
   * Creates pool if not initialized before mint.
   */
  createPool?: boolean
}

export interface IncreaseSpecificOptions {
  /**
   * Indicates the ID of the position to increase liquidity for.
   */
  tokenId: BigintIsh
}

/**
 * Options for producing the calldata to add liquidity.
 */
export interface CommonAddLiquidityOptions {
  /**
   * How much the pool price is allowed to move.
   */
  slippageTolerance: SlippageParams

  /**
   * When the transaction expires, in epoch seconds.
   */
  deadline: BigintIsh

  /**
   * Whether to spend ether. If true, one of the pool tokens must be WETH, by default false
   */
  useNative?: NativeCurrency
}

export type MintOptions = CommonAddLiquidityOptions & MintSpecificOptions
export type IncreaseOptions = CommonAddLiquidityOptions & IncreaseSpecificOptions

export type AddLiquidityOptions = MintOptions | IncreaseOptions

export interface SafeTransferOptions {
  /**
   * The account sending the NFT.
   */
  sender: string

  /**
   * The account that should receive the NFT.
   */
  recipient: string

  /**
   * The id of the token being sent.
   */
  tokenId: BigintIsh
  /**
   * The optional parameter that passes data to the `onERC721Received` call for the staker
   */
  data?: string
}

export interface CollectOptions {
  /**
   * Indicates the ID of the position to collect for.
   */
  tokenId: BigintIsh

  /**
   * Expected value of tokensOwed0, including as-of-yet-unaccounted-for fees/liquidity value to be burned
   */
  expectedCurrencyOwed0: CurrencyAmount<Currency>

  /**
   * Expected value of tokensOwed1, including as-of-yet-unaccounted-for fees/liquidity value to be burned
   */
  expectedCurrencyOwed1: CurrencyAmount<Currency>

  /**
   * The account that should receive the tokens.
   */
  recipient: string
}

export interface NFTPermitOptions {
  v: 0 | 1 | 27 | 28
  r: string
  s: string
  deadline: BigintIsh
  spender: string
}

/**
 * Options for producing the calldata to exit a position.
 */
export interface RemoveLiquidityOptions {
  /**
   * The ID of the token to exit
   */
  tokenId: BigintIsh

  /**
   * The percentage of position liquidity to exit.
   */
  liquidityPercentage: SlippageParams

  /**
   * How much the pool price is allowed to move.
   */
  slippageTolerance: SlippageParams

  /**
   * When the transaction expires, in epoch seconds.
   */
  deadline: BigintIsh

  /**
   * Whether the NFT should be burned if the entire position is being exited, by default false.
   */
  burnToken?: boolean

  /**
   * The optional permit of the token ID being exited, in case the exit transaction is being sent by an account that does not own the NFT
   */
  permit?: NFTPermitOptions

  /**
   * Parameters to be passed on to collect
   */
  collectOptions: Omit<CollectOptions, 'tokenId'>
}

export class PositionManager {
  moduleAddress: string
  poolConfig: string
  poolIdsList: string
  sharedPositionOwnership: string
  /**
   * Cannot be constructed.
   */
  public constructor(moduleId: string, poolConfig: string, poolIdsList: string, sharedPositionOwnership: string) {
    this.moduleAddress = moduleId
    this.poolConfig = poolConfig
    this.poolIdsList = poolIdsList
    this.sharedPositionOwnership = sharedPositionOwnership
  }

  public getModuleAddress(): string {
    return this.moduleAddress
  }

  public async makeCreatePoolTxWithAmounts(
    token0: string,
    token1: string,
    coin0s: string[],
    coin1s: string[],
    amount0: BigintIsh,
    amount1: BigintIsh,
    useFullPrecision: boolean,
    feeAmount: FeeAmount,
    sqrtPricex96: string,
    sqrtMinPricex96: string,
    sqrtMaxPricex96: string,
    deadline: number,
    recipient: string,
    suiRPC: string,
    gasBudget: number
  ): Promise<UnserializedSignableTransaction> {
    const coin0Type = await StateFetcher.fetchCoinInfo(token0, suiRPC)
    const coin1Type = await StateFetcher.fetchCoinInfo(token1, suiRPC)
    const position = this.createPosition(coin0Type, coin1Type, amount0, amount1, useFullPrecision, feeAmount, sqrtPricex96, sqrtMinPricex96, sqrtMaxPricex96)
    const payload = await this.makeCreatePoolTx(coin0s, coin1s, position, deadline, recipient, gasBudget)
    return payload
  }

  public createPosition(
    coin0: SuiCoin,
    coin1: SuiCoin,
    amount0: BigintIsh,
    amount1: BigintIsh,
    useFullPrecision: boolean,
    feeAmount: FeeAmount,
    sqrtPricex96: string,
    sqrtMinPricex96: string,
    sqrtMaxPricex96: string
  ): Position {
    const tickCurrent = nearestUsableTick(TickMath.getTickAtSqrtRatio(JSBI.BigInt(sqrtPricex96)), TICK_SPACINGS[feeAmount]) 
    const tickLower = nearestUsableTick(TickMath.getTickAtSqrtRatio(JSBI.BigInt(sqrtMinPricex96)), TICK_SPACINGS[feeAmount])
    const tickUpper = nearestUsableTick(TickMath.getTickAtSqrtRatio(JSBI.BigInt(sqrtMaxPricex96)), TICK_SPACINGS[feeAmount])
    // console.log('tickLower', tickLower, tickUpper)
    const pool = new Pool(coin0, coin1, feeAmount, TickMath.getSqrtRatioAtTick(tickCurrent), '0', tickCurrent)
    const position = Position.fromAmounts({
      pool,
      tickLower,
      tickUpper,
      amount0,
      amount1,
      useFullPrecision
    })
    return position
  }

  public async makeCreatePoolTx(
    coin0s: string[],
    coin1s: string[],
    position: Position,
    deadline: number,
    recipient: string,
    gasBudget: number
  ): Promise<UnserializedSignableTransaction> {
    const typeArgs = [
      position.pool.token0.address,
      position.pool.token1.address,
      this.moduleAddress + getFeeType(position.pool.fee)
    ]

    const moveCallTx = {
      packageObjectId: this.getModuleAddress(),
      module: 'router',
      function: 'create_pool',
      typeArguments: typeArgs,
      arguments: [
        this.poolConfig,
        this.poolIdsList,
        this.sharedPositionOwnership,
        recipient,
        coin0s, 
        coin1s,
        position.mintAmounts.amount0.toString(),
        position.mintAmounts.amount1.toString(),
        `${(position.tickLower >= 0 ? position.tickLower : -position.tickLower)}`,
        position.tickLower >= 0,
        `${(position.tickUpper >= 0 ? position.tickUpper : -position.tickUpper)}`,
        position.tickUpper >= 0,
        position.pool.sqrtRatioX96.toString(),
        `${deadline.toString()}`
      ],
      gasBudget: gasBudget
    }

    return {
      kind: "moveCall",
      data: moveCallTx
    }
  }

  public async makeMintTx(
    coin0s: string[],
    coin1s: string[],
    position: Position,
    slippageTolerance: SlippageParams,
    recipient: string,
    deadline: number,
    gasBudget: number): Promise<UnserializedSignableTransaction> {
    invariant(JSBI.greaterThan(position.liquidity, ZERO), 'ZERO_LIQUIDITY')

    // get amounts
    const { amount0: amount0Desired, amount1: amount1Desired } = position.mintAmounts

    // adjust for slippage
    const minimumAmounts = position.mintAmountsWithSlippage(new Percent(slippageTolerance.numerator, slippageTolerance.denominator))
    const amount0Min = minimumAmounts.amount0.toString()
    const amount1Min = minimumAmounts.amount1.toString()

    const typeArgs = [
      position.pool.token0.address,
      position.pool.token1.address,
      this.moduleAddress + getFeeType(position.pool.fee)
    ]

    if (!position.pool.objectId) {
      throw new Error('invalid pool object id')
    }
    const moveCallTx = {
      packageObjectId: this.getModuleAddress(),
      module: 'router',
      function: 'mint',
      typeArguments: typeArgs,
      arguments: [
        this.poolConfig,
        position.pool.objectId?.toString(),
        this.sharedPositionOwnership,
        coin0s, 
        coin1s,
        `${(position.tickLower >= 0 ? position.tickLower : -position.tickLower)}`,
        position.tickLower >= 0,
        `${(position.tickUpper >= 0 ? position.tickUpper : -position.tickUpper)}`,
        position.tickUpper >= 0,
        amount0Desired.toString(),
        amount1Desired.toString(),
        amount0Min,
        amount1Min,
        recipient,
        `${deadline.toString()}`
      ],
      gasBudget: gasBudget
    }

    return {
      kind: "moveCall",
      data: moveCallTx
    }
  }

  public async makeIncreaseLiquidityTx(
      coin0s: string[],
      coin1s: string[],
      position: Position, 
      positionObjectId: string, 
      slippage: SlippageParams, 
      deadline: number,
      gasBudget: number): Promise<UnserializedSignableTransaction> {
    invariant(JSBI.greaterThan(position.liquidity, ZERO), 'ZERO_LIQUIDITY')

    // get amounts
    const { amount0: amount0Desired, amount1: amount1Desired } = position.mintAmounts

    // adjust for slippage
    const minimumAmounts = position.mintAmountsWithSlippage(new Percent(slippage.numerator, slippage.denominator))
    const amount0Min = minimumAmounts.amount0.toString()
    const amount1Min = minimumAmounts.amount1.toString()

    const typeArgs = [
      position.pool.token0.address,
      position.pool.token1.address,
      this.moduleAddress + getFeeType(position.pool.fee)
    ]
    const moveCallTx = {
      packageObjectId: this.getModuleAddress(),
      module: 'router',
      function: 'increase_liquidity',
      typeArguments: typeArgs,
      arguments: [
        this.poolConfig,
        (position.pool.objectId ? position.pool.objectId : '0').toString(),
        this.sharedPositionOwnership,
        positionObjectId,
        coin0s, 
        coin1s,
        amount0Desired.toString(),
        amount1Desired.toString(),
        amount0Min,
        amount1Min,
        `${deadline.toString()}`
      ],
      gasBudget: gasBudget
    }

    return {
      kind: "moveCall",
      data: moveCallTx
    }
  }

  public async makeRemoveLiquidityTx(
      position: Position, 
      positionObjectId: string, 
      slippage: SlippageParams, 
      deadline: number, 
      collectCoin: boolean,
      gasBudget: number): Promise<UnserializedSignableTransaction> {
    invariant(JSBI.greaterThan(position.liquidity, ZERO), 'ZERO_LIQUIDITY')

    // adjust for slippage
    const minimumAmounts = position.burnAmountsWithSlippage(new Percent(slippage.numerator, slippage.denominator))
    const amount0Min = minimumAmounts.amount0.toString()
    const amount1Min = minimumAmounts.amount1.toString()

    const typeArgs = [
      position.pool.token0.address,
      position.pool.token1.address,
      this.moduleAddress + getFeeType(position.pool.fee)
    ]
    const moveCallTx = {
      packageObjectId: this.getModuleAddress(),
      module: 'router',
      function: 'decrease_liquidity',
      typeArguments: typeArgs,
      arguments: [
        this.poolConfig,
        (position.pool.objectId ? position.pool.objectId : '0').toString(),
        this.sharedPositionOwnership,
        positionObjectId,
        position.liquidity.toString(),
        amount0Min,
        amount1Min,
        collectCoin,
        `${deadline.toString()}`
      ],
      gasBudget: gasBudget
    }

    return {
      kind: "moveCall",
      data: moveCallTx
    }
  }
}
