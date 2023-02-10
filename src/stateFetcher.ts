// import { BigintIsh, Currency, CurrencyAmount, Percent, TradeType } from '@uniswap/sdk-core'
// import invariant from 'tiny-invariant'
// import { Trade } from './entities/trade'
// import { toHex } from './utils/calldata'
// import { FeeOptions } from './payments'
// import { Pool } from './entities'
import { FeeAmount, feeTypeToFeeAmount, getFeeType } from './constants'
import { Pool, SuiCoin, Tick } from './entities'
import JSBI from 'jsbi'
import { BigintIsh } from '@uniswap/sdk-core'
import { JsonRpcProvider, StructTag } from '@mysten/sui.js';
import { i64ToNumber, parseTypeFromStr, structTagToString, tryCallWithTrial } from './utils/cl';

export interface PoolConfig {
  id: string,
  admin: string,
  daoAddress: string,
  emergency: boolean
}

export interface PoolIdsList {
  id: string,
  poolIds: string[]
}

export interface ProtocolFees {
  token0: BigintIsh
  token1: BigintIsh
}

export interface ObservationState {
  tickCumulative: number,
  secondsPerLiquidityCumulativeX128: BigintIsh,
  initialized: boolean
}

export interface TickState {
  liquidityGross: JSBI,
  liquidityNet: JSBI,
  feeGrowthOutside0X128: BigintIsh,
  feeGrowthOutside1X128: BigintIsh,
  tickCumulativeOutside: number,
  secondsPerLiquidityOutsideX128: BigintIsh,
  secondsOutside: number,
  initialized: boolean,
  index: number
}

export interface SimpleTickState {
  liquidityGross: string,
  liquidityNet: string,
  index: number
}
export interface Slot0State {
  sqrtPriceX96: JSBI
  tick: number
  observationIndex: number
  observationCardinality: number
  observationCardinalityNext: number
  feeProtocol: number
  unlocked: boolean
}

export interface PoolState {
  reserve0: BigintIsh
  reserve1: BigintIsh
  fee: number
  tickSpacing: number
  maxLiquidityPerTick: BigintIsh
  feeGrowthGlobal0X128: BigintIsh
  feeGrowthGlobal1X128: BigintIsh
  protocolFees: ProtocolFees
  liquidity: BigintIsh
  slot0: Slot0State
  poolAddress: string
  tickHandle: string
  tickBitmapHandle: string
  positionHandle: string
  observationHandle: string
  initializedTicks: number[],
}

export interface PositionState {
  liquidity: BigintIsh
  feeGrowthInside0LastX128: JSBI
  feeGrowthInside1LastX128: JSBI
  tokensOwned0: BigintIsh
  tokensOwned1: BigintIsh
}

export interface NFTLiquidityPosition {
  token0: string,
  token1: string,
  fee: FeeAmount,
  id: string,
  tickLower: number,
  tickUpper: number,
  liquidity: BigintIsh
  feeGrowthInside0LastX128: JSBI
  feeGrowthInside1LastX128: JSBI
  tokensOwned0: BigintIsh
  tokensOwned1: BigintIsh
}
/**
 * Represents the Uniswap V3 SwapRouter, and has static methods for helping execute trades.
 */
export class StateFetcher {
  public static getPoolResourceType(
    moduleAddress: string,
    token0Address: string,
    token1Address: string,
    feeAmount: FeeAmount
  ): string {
    return `${moduleAddress}::pool::Pool<${token0Address}, ${token1Address}, ${moduleAddress}${getFeeType(feeAmount)}>`
  }
  /**
   * Produces the on-chain method name to call and the hex encoded parameters to pass as arguments for a given trade.
   * @param trade to produce call parameters for
   * @param options options for the call parameters
   */
  public static async fetchPool(
    token0Address: string,
    token1Address: string,
    feeAmount: FeeAmount,
    packageId: string,
    suiRPC: string
  ): Promise<{ pool: Pool; poolState: PoolState }> {
    const provider = new JsonRpcProvider(suiRPC)
    const newPoolEventQualifiedName = `${packageId}::pool::NewPoolEvent<${token0Address}, ${token1Address}, ${packageId}${getFeeType(feeAmount)}>`

    const [coin0, coin1, newPoolEvents] = await Promise.all([
      await StateFetcher.fetchCoinInfo(token0Address, suiRPC),
      await StateFetcher.fetchCoinInfo(token1Address, suiRPC),
      await provider.getEvents({
        MoveEvent: newPoolEventQualifiedName
      }, null, 1)
    ])

    if (!newPoolEvents || !newPoolEvents.data || newPoolEvents.data.length == 0) {
      throw new Error('pool not exist')
    }
    const newPoolEvent = newPoolEvents.data[0].event as any
    const poolObjectId = newPoolEvent.moveEvent.fields.pool_address
    const poolObject = (await provider.getObject(poolObjectId)) as any
    const poolFields = poolObject.details.data.fields
    const pool = new Pool(
      coin0,
      coin1,
      feeAmount,
      poolFields.slot0.fields.sqrt_price_x96,
      poolFields.liquidity,
      i64ToNumber(poolFields.slot0.fields.tick.fields),
      [],
      poolObjectId
    )
    const poolState = {
      reserve0: poolFields.reserve_0,
      reserve1: poolFields.reserve_1,
      fee: parseInt(poolFields.fee),
      tickSpacing: i64ToNumber(poolFields.tick_spacing.fields),
      maxLiquidityPerTick: poolFields.max_liquidity_per_tick,
      feeGrowthGlobal0X128: poolFields.fee_growth_global0_X128,
      feeGrowthGlobal1X128: poolFields.fee_growth_global1_X128,
      protocolFees: {
        token0: poolFields.protocol_fees.fields.token0,
        token1: poolFields.protocol_fees.fields.token1
      },
      liquidity: poolFields.liquidity,
      slot0: {
        sqrtPriceX96: JSBI.BigInt(poolFields.slot0.fields.sqrt_price_x96),
        tick: i64ToNumber(poolFields.slot0.fields.tick.fields),
        observationIndex: poolFields.slot0.fields.observation_index as number,
        observationCardinality: poolFields.slot0.fields.observation_cardinality as number,
        observationCardinalityNext: poolFields.slot0.fields.observation_cardinality_next as number,
        feeProtocol: poolFields.slot0.fields.fee_protocol as number,
        unlocked: poolFields.slot0.fields.unlocked as boolean
      },
      poolAddress: poolObjectId,
      tickHandle: poolFields.ticks.fields.id.id,
      tickBitmapHandle: poolFields.tick_bitmap.fields.id.id,
      positionHandle: poolFields.positions.fields.id.id,
      observationHandle: poolFields.observations.fields.id.id,
      initializedTicks: poolFields.initialized_ticks.map((e: { fields: any; }) => e.fields).map((e: { bits: string }) => i64ToNumber(e))
    }

    return { pool, poolState }
  }

  public static async fetchCoinInfo(coinType: string, suiRPC: string): Promise<SuiCoin> {
    let ct = coinType
    if (ct.startsWith('coin::Coin<')) {
      ct = ct.substring('coin::Coin<'.length, ct.length - 1)
    }
    ct = ct.replace(' ', '')
    const provider = new JsonRpcProvider(suiRPC)
    
    const coinMetadata = await provider.getCoinMetadata(ct)

    return new SuiCoin(ct, coinMetadata.decimals, coinMetadata.symbol, coinMetadata.name)
  }

  public static async fetchPoolLiquidity(
    token0Address: string,
    token1Address: string,
    feeAmount: FeeAmount,
    packageId: string,
    suiRPC: string
  ): Promise<string> {
    const provider = new JsonRpcProvider(suiRPC)
    const newPoolEventQualifiedName = `${packageId}::pool::NewPoolEvent<${token0Address}, ${token1Address}, ${packageId}${getFeeType(feeAmount)}>`
    const newPoolEvents = await provider.getEvents({
      MoveEvent: newPoolEventQualifiedName
    }, null, 1)

    if (!newPoolEvents || !newPoolEvents.data || newPoolEvents.data.length == 0) {
      throw new Error('pool not exist')
    }
    const newPoolEvent = newPoolEvents.data[0].event as any
    const poolObjectId = newPoolEvent.moveEvent.fields.pool_address
    const poolObject = (await provider.getObject(poolObjectId)) as any
    const poolFields = poolObject.details.data.fields

    return poolFields.liquidity
  }

  public static async fetchSimplePoolInfo(poolObjectId: string, suiRPC: string): Promise<{ reserve0: string, reserve1: string, liquidity: string }> {
    const provider = new JsonRpcProvider(suiRPC)
    const poolObject = (await provider.getObject(poolObjectId)) as any
    const poolFields = poolObject.details.data.fields
    return { liquidity: poolFields.liquidity, reserve0: poolFields.reserve_0, reserve1: poolFields.reserve_1 }    
  }

  public static async fetchNFTPosition(
    objectId: string,
    suiRPC: string
  ): Promise<NFTLiquidityPosition> {
    const provider = new JsonRpcProvider(suiRPC)
    const resourcePosition = (await provider.getObject(objectId)) as any
    if (!resourcePosition || resourcePosition.status !== `Exists`) {
      throw new Error('no position associated')
    }
    const parsed = parseTypeFromStr(resourcePosition.details.data.type)
    const fields = resourcePosition.details.data.fields
    console.log(fields)
    return {
      token0: structTagToString(((parsed as any).struct as StructTag).typeParams[0]),
      token1: structTagToString(((parsed as any).struct as StructTag).typeParams[1]),
      fee: feeTypeToFeeAmount(structTagToString(((parsed as any).struct as StructTag).typeParams[2])),
      id: objectId,
      tickLower: i64ToNumber(fields.tick_lower.fields),
      tickUpper: i64ToNumber(fields.tick_upper.fields),
      liquidity: fields.liquidity,
      feeGrowthInside0LastX128: JSBI.BigInt(fields.fee_growth_inside0_last_X128),
      feeGrowthInside1LastX128: JSBI.BigInt(fields.fee_growth_inside1_last_X128),
      tokensOwned0: fields.tokens_owed0,
      tokensOwned1: fields.tokens_owed1
    }
  }

  public static async fetchNFTPositions(
    owner: string,
    packageId: string,
    suiRPC: string
  ): Promise<NFTLiquidityPosition[]> {
    const provider = new JsonRpcProvider(suiRPC)
    let ownedInfoObjects = await provider.getObjectsOwnedByAddress(owner)
    if (!ownedInfoObjects || ownedInfoObjects.length == 0) {
      return []
    }

    ownedInfoObjects = ownedInfoObjects.filter((e: { type: string; }) => e.type.startsWith(`${packageId}::router::LiquidityPosition<`))
    const objectIds = ownedInfoObjects.map((e: { objectId: string; }) => e.objectId)

    const fetchPositionTrial = async function(objectId: string): Promise<NFTLiquidityPosition> {
      const nftLiquidityPosition = tryCallWithTrial(async (): Promise<NFTLiquidityPosition> => {
        return StateFetcher.fetchNFTPosition(objectId, suiRPC)
      })
      if (nftLiquidityPosition == undefined) {
        throw new Error("cant read position " + objectId)
      }
      return nftLiquidityPosition as unknown as NFTLiquidityPosition
    }

    const positions = await Promise.all(objectIds.map((e: string) => fetchPositionTrial(e)))
    return positions
  }

  // public static async fetchPackageConfig(packageId: string, suiRPC: string): Promise<SuiCoin> {
  //   let ct = coinType
  //   if (ct.startsWith('coin::Coin<')) {
  //     ct = ct.substring('coin::Coin<'.length, ct.length - 1)
  //   }
  //   ct = ct.replace(' ', '')
  //   const provider = new JsonRpcProvider(suiRPC)
  //   const currencyCreatedEvents = await provider.getEvents({
  //     MoveEvent: `0x2::coin::CurrencyCreated<${ct}>`
  //   }, null, null)
  //   if (!currencyCreatedEvents || currencyCreatedEvents.data.length == 0) {
  //     throw new Error("invalid coin type")
  //   }

  //   const currencyCreatedEvent = currencyCreatedEvents.data[0].event as any
  //   const splits = ct.split('::')
  //   const name = splits[splits.length - 1]
  //   const symbol = name
  //   const decimals = currencyCreatedEvent.moveEvent.fields.decimals

  //   return new SuiCoin(ct, decimals, symbol, name)
  // }

  public static sortTicks(tickStates: TickState[]): TickState[] {
    return tickStates.sort((a, b) => a.index - b.index)
  }

  public static sortSimpleTicks(tickStates: SimpleTickState[]): SimpleTickState[] {
    return tickStates.sort((a, b) => a.index - b.index)
  }

  public static toTicks(tickStates: TickState[]): Tick[] {
    return tickStates.map(t => new Tick({ index: t.index, liquidityGross: t.liquidityGross, liquidityNet: t.liquidityNet }))
  }

  public static simpleStatetoTicks(tickStates: SimpleTickState[]): Tick[] {
    return tickStates.map(t => new Tick({ index: t.index, liquidityGross: JSBI.BigInt(t.liquidityGross), liquidityNet: JSBI.BigInt(t.liquidityNet) }))
  }

  // public static async fetchObservation(
  //   index: number,
  //   moduleAddress: string,
  //   aptosRPC: string,
  //   pool: Pool,
  //   poolState: PoolState): Promise<ObservationState> {
  //   const aptosClient = new AptosClient(aptosRPC)
  //   const [token0Address, token1Address, feeAmount] = [pool.token0.address, pool.token1.address, pool.fee]

  //   const handle = poolState.observationHandle
  //   const keyType = `u64`
  //   const valueType = `
  //   ${moduleAddress}::iterable_table::IterableValue<${keyType}, ${moduleAddress}::pool::Observation<${token0Address}, ${token1Address}, ${moduleAddress}${getFeeType(
  //     feeAmount
  //   )}>>
  //   `
  //   const tableItemRequest: Types.TableItemRequest = {
  //     key_type: keyType,
  //     value_type: valueType,
  //     key: index,
  //   };
  //   const observationResource = await aptosClient.getTableItem(handle, tableItemRequest)
  //   const observationVal = observationResource.val
  //   return {
  //     tickCumulative: i64ToNumber(observationVal.tick_cumulative),
  //     secondsPerLiquidityCumulativeX128: bnToBigInt(observationVal.seconds_per_liquidity_cumulative_X128),
  //     initialized: observationVal.initialized
  //   }
  // }
}
