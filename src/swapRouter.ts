import { BigintIsh, Percent, TradeType } from '@uniswap/sdk-core'
import { Trade } from './entities/trade'
import { FeeOptions } from './payments'
import { SlippageParams, sortBefore } from './utils/cl'
import { SuiCoin, CurrencyAmount, Pool, Route } from './entities'
import { SimpleTickState } from './stateFetcher'
import { SimpleTickDataProvider } from './tickFetcher'
import { UnserializedSignableTransaction } from '@mysten/sui.js'
import invariant from 'tiny-invariant'
import { getFeeType } from './constants'
/**
 * Options for producing the arguments to send calls to the router.
 */
export interface SwapOptions {
  /**
   * How much the execution price is allowed to move unfavorably from the trade execution price.
   */
  slippageTolerance: SlippageParams

  /**
   * The account that should receive the output.
   */
  recipient: string

  /**
   * When the transaction expires, in epoch seconds.
   */
  deadline: BigintIsh

  /**
   * The optional price limit for the trade.
   */
  sqrtPriceLimitX96?: BigintIsh

  /**
   * Optional information for taking a fee on output.
   */
  fee?: FeeOptions
}

export interface PoolWithTicks {
  pool: Pool
  ticks: SimpleTickState[]
}

export interface Quote {
  trade: Trade<SuiCoin, SuiCoin, TradeType>
  isBest: boolean
}

/**
 * Represents the Uniswap V3 SwapRouter, and has static methods for helping execute trades.
 */
export class SwapRouter {
  moduleAddress: string
  swapRouter: string
  poolConfig: string
  public constructor(addr: string, swapRouter: string, poolConfig: string) {
    this.moduleAddress = addr
    this.swapRouter = swapRouter
    this.poolConfig = poolConfig
  }

  public getModuleAddress(): string {
    return this.moduleAddress
  }

  public getSwapRouterAddress(): string {
    return this.swapRouter
  }

  public async getQuotes(
    tokenIn: SuiCoin,
    tokenOut: SuiCoin,
    swapType: TradeType,
    amount: string,
    poolsWithTicks: PoolWithTicks[]
  ): Promise<Quote[]> {
    const pools = poolsWithTicks.map(p => {
      const pool = p.pool
      // invariant(pool.token0 == tokenIn || pool.token0 == tokenOut, 'TOKEN_IN_DIFF')
      // invariant(pool.token1 == tokenIn || pool.token1 == tokenOut, 'INVALID_TOKEN')

      pool.updateTickProvider(SimpleTickDataProvider.fromSimpleTickStates(p.ticks))
      return pool
    })
    const quotes: Quote[] = []
    let bestTrade: Trade<SuiCoin, SuiCoin, TradeType> | undefined = undefined
    if (swapType == TradeType.EXACT_INPUT) {
      for (const pool of pools) {
        try {
          const trade = await Trade.exactIn(
            new Route([pool], tokenIn, tokenOut),
            CurrencyAmount.fromRawAmount(tokenIn, amount)
          )
          if (bestTrade == undefined) {
            bestTrade = trade
          } else {
            if (bestTrade.outputAmount.lessThan(trade.outputAmount)) {
              bestTrade = trade
            }
          }
          quotes.push({
            trade,
            isBest: false
          })
        } catch (e) {
          console.log('error get quote', (e as any).toString())
        }
      }
    } else {
      for (const pool of pools) {
        try {
          const trade = await Trade.exactOut(
            new Route([pool], tokenIn, tokenOut),
            CurrencyAmount.fromRawAmount(tokenOut, amount)
          )
          if (bestTrade == undefined) {
            bestTrade = trade
          } else {
            if (bestTrade.inputAmount.greaterThan(trade.inputAmount)) {
              bestTrade = trade
            }
          }
          quotes.push({
            trade,
            isBest: false
          })
        } catch (e) {
          console.log('error get quote', (e as any).toString())
        }
      }
    }

    for (const q of quotes) {
      if (q.trade == bestTrade) {
        q.isBest = true
        break
      }
    }

    return quotes
  }

  /**
   * Produces the on-chain method name to call and the hex encoded parameters to pass as arguments for a given trade.
   * @param trade to produce call parameters for
   * @param options options for the call parameters
   */
  public createSwapTx(
    coinStores: any,
    coinIns: string[],
    trade: Trade<SuiCoin, SuiCoin, TradeType>,
    options: SwapOptions,
    gasBudget: number
  ): UnserializedSignableTransaction {
    const sampleTrade = trade
    const tokenIn = sampleTrade.inputAmount.currency.wrapped
    const tokenOut = sampleTrade.outputAmount.currency.wrapped

    // All trades should have the same starting and ending token.
    invariant(trade.inputAmount.currency.wrapped.equals(tokenIn), 'TOKEN_IN_DIFF')
    invariant(trade.outputAmount.currency.wrapped.equals(tokenOut), 'TOKEN_OUT_DIFF')

    const deadline = options.deadline

    const { route, inputAmount, outputAmount } = trade.swaps[0]
    const singleHop = route.pools.length === 1

    //invariant(singleHop, 'singleHop')
    //invariant(route.pools.length == 1, 'singlePool')
    const slippage = new Percent(options.slippageTolerance.numerator, options.slippageTolerance.denominator)
    const amountIn: string = trade.maximumAmountIn(slippage, inputAmount).quotient.toString()
    const amountOut: string = trade.minimumAmountOut(slippage, outputAmount).quotient.toString()

    // flag for whether the trade is single hop or not
    if (singleHop) {
      const pool = route.pools[0]
      const typeArgs = [
        pool.token0.address.toString(),
        pool.token1.address.toString(),
        this.moduleAddress + getFeeType(pool.fee)
      ]
      const zeroForOne = route.tokenPath[0].address.replace(' ', '') == pool.token0.address.replace(' ', '')
      const args = [
        this.poolConfig,
        pool.objectId ? pool.objectId.toString() : '',
        coinStores[pool.token0.address],
        coinStores[pool.token1.address],
        zeroForOne ? coinIns : [],
        zeroForOne ? [] : coinIns,
        amountIn,
        amountOut,
        (options.sqrtPriceLimitX96 ?? 0).toString(),
        zeroForOne,
        deadline.toString()
      ]
      if (trade.tradeType === TradeType.EXACT_INPUT) {
        const moveCallTx = {
          packageObjectId: this.getSwapRouterAddress(),
          module: 'swap_router',
          function: 'exact_input_2',
          typeArguments: typeArgs,
          arguments: args,
          gasBudget: gasBudget
        }

        return {
          kind: 'moveCall',
          data: moveCallTx
        }
      } else {
        const moveCallTx = {
          packageObjectId: this.getSwapRouterAddress(),
          module: 'swap_router',
          function: 'exact_output_2',
          typeArguments: typeArgs,
          arguments: args,
          gasBudget: gasBudget
        }

        return {
          kind: 'moveCall',
          data: moveCallTx
        }
      }
    } else if (route.pools.length == 2) {
      const pools = route.pools
      let [token0, token1] = [pools[0].token0.address, pools[0].token1.address]
      let token2 =
        pools[1].token0.address == token0 || pools[1].token0.address == token1
          ? pools[1].token1.address
          : pools[1].token0.address
      if (!sortBefore(token1, token2)) {
        ;[token1, token2] = [token2, token1]
        if (!sortBefore(token0, token1)) {
          ;[token0, token1] = [token1, token0]
        }
      }

      const isExactIn = trade.tradeType === TradeType.EXACT_INPUT
      let intremediateToken = token0
      let funName = isExactIn ? 'exact_input_two_hops' : 'exact_output_two_hops'

      let coinLists = [coinIns, [], []]
      if (route.input.address === token1) {
        coinLists = [[], coinIns, []]
      } else if (route.input.address === token2) {
        coinLists = [[], [], coinIns]
      }

      let firstPool = pools[0].token0.address == token0 && pools[0].token1.address == token1 ? pools[0] : pools[1]
      let secondPool = pools[0].token0.address == token0 && pools[0].token1.address == token1 ? pools[1] : pools[0]

      if (intremediateToken === route.input.address || intremediateToken === route.output.address) {
        intremediateToken = token1
        firstPool = pools[0].token0.address == token0 && pools[0].token1.address == token1 ? pools[0] : pools[1]
        secondPool = pools[0].token0.address == token0 && pools[0].token1.address == token1 ? pools[1] : pools[0]
      }
      if (intremediateToken === route.input.address || intremediateToken === route.output.address) {
        intremediateToken = token2
        firstPool = pools[0].token0.address == token0 && pools[0].token1.address == token2 ? pools[0] : pools[1]
        secondPool = pools[0].token0.address == token0 && pools[0].token1.address == token2 ? pools[1] : pools[0]
      }

      const typeArgs = [
        token0,
        token1,
        token2,
        route.input.address,
        route.output.address,
        this.moduleAddress + getFeeType(firstPool.fee),
        this.moduleAddress + getFeeType(secondPool.fee)
      ]

      const args = [
        this.poolConfig,
        firstPool.objectId ? firstPool.objectId.toString() : '',
        secondPool.objectId ? secondPool.objectId.toString() : '',
        coinStores[token0],
        coinStores[token1],
        coinStores[token2],
        coinLists[0],
        coinLists[1],
        coinLists[2],
        amountIn,
        amountOut,
        (options.sqrtPriceLimitX96 ?? 0).toString(),
        deadline.toString()
      ]

      const moveCallTx = {
        packageObjectId: this.getSwapRouterAddress(),
        module: 'swap_router',
        function: funName,
        typeArguments: typeArgs,
        arguments: args,
        gasBudget: gasBudget
      }

      return {
        kind: 'moveCall',
        data: moveCallTx
      }
    } else if (route.pools.length == 3) {
      const pools = route.pools
      let [token0, token1] = [pools[0].token0.address, pools[0].token1.address]
      let token2 =
        pools[1].token0.address == token0 || pools[1].token0.address == token1
          ? pools[1].token1.address
          : pools[1].token0.address
      if (!sortBefore(token1, token2)) {
        ;[token1, token2] = [token2, token1]
        if (!sortBefore(token0, token1)) {
          ;[token0, token1] = [token1, token0]
        }
      }
      const tokenPreOutAddress = pools[2].token0.address == route.output.address ? pools[2].token1.address : pools[2].token0.address

      const isExactIn = trade.tradeType === TradeType.EXACT_INPUT
      let intremediateToken = token0
      let funName = isExactIn ? 'exact_input_three_hops' : 'exact_output_three_hops'

      let coinLists = [coinIns, [], []]
      if (route.input.address === token1) {
        coinLists = [[], coinIns, []]
      } else if (route.input.address === token2) {
        coinLists = [[], [], coinIns]
      }

      let firstPool = pools[0].token0.address == token0 && pools[0].token1.address == token1 ? pools[0] : pools[1]
      let secondPool = pools[0].token0.address == token0 && pools[0].token1.address == token1 ? pools[1] : pools[0]

      if (intremediateToken === route.input.address || intremediateToken === tokenPreOutAddress) {
        intremediateToken = token1
        firstPool = pools[0].token0.address == token0 && pools[0].token1.address == token1 ? pools[0] : pools[1]
        secondPool = pools[0].token0.address == token0 && pools[0].token1.address == token1 ? pools[1] : pools[0]
      }
      if (intremediateToken === route.input.address || intremediateToken === tokenPreOutAddress) {
        intremediateToken = token2
        firstPool = pools[0].token0.address == token0 && pools[0].token1.address == token2 ? pools[0] : pools[1]
        secondPool = pools[0].token0.address == token0 && pools[0].token1.address == token2 ? pools[1] : pools[0]
      }

      const typeArgs = [
        token0,
        token1,
        token2,
        route.input.address,
        tokenPreOutAddress,
        route.output.address,
        this.moduleAddress + getFeeType(firstPool.fee),
        this.moduleAddress + getFeeType(secondPool.fee),
        this.moduleAddress + getFeeType(pools[2].fee)
      ]

      const args = [
        this.poolConfig,
        firstPool.objectId ? firstPool.objectId.toString() : '',
        secondPool.objectId ? secondPool.objectId.toString() : '',
        pools[2].objectId ? pools[2].objectId.toString() : '',
        coinStores[token0],
        coinStores[token1],
        coinStores[token2],
        coinStores[route.output.address],
        coinLists[0],
        coinLists[1],
        coinLists[2],
        amountIn,
        amountOut,
        (options.sqrtPriceLimitX96 ?? 0).toString(),
        deadline.toString()
      ]

      const moveCallTx = {
        packageObjectId: this.getSwapRouterAddress(),
        module: 'swap_router',
        function: funName,
        typeArguments: typeArgs,
        arguments: args,
        gasBudget: gasBudget
      }

      return {
        kind: 'moveCall',
        data: moveCallTx
      }
    } else {
      //TODO: implement multihops
      throw new Error('unsupported multihop')
      // invariant(options.sqrtPriceLimitX96 === undefined, 'MULTIHOP_PRICE_LIMIT')

      // const path: string = encodeRouteToPath(route, trade.tradeType === TradeType.EXACT_OUTPUT)

      // if (trade.tradeType === TradeType.EXACT_INPUT) {
      //   const exactInputParams = {
      //     path,
      //     recipient: routerMustCustody ? ADDRESS_ZERO : recipient,
      //     deadline,
      //     amountIn,
      //     amountOutMinimum: amountOut
      //   }

      //   calldatas.push(SwapRouter.INTERFACE.encodeFunctionData('exactInput', [exactInputParams]))
      // } else {
      //   const exactOutputParams = {
      //     path,
      //     recipient: routerMustCustody ? ADDRESS_ZERO : recipient,
      //     deadline,
      //     amountOut,
      //     amountInMaximum: amountIn
      //   }

      //   calldatas.push(SwapRouter.INTERFACE.encodeFunctionData('exactOutput', [exactOutputParams]))
      // }
    }
  }
}
