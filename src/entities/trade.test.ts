import { Percent, sqrt, TradeType } from '@uniswap/sdk-core'
import JSBI from 'jsbi'
import { FeeAmount, TICK_SPACINGS } from '../constants'
import { encodeSqrtRatioX96 } from '../utils/encodeSqrtRatioX96'
import { nearestUsableTick } from '../utils/nearestUsableTick'
import { TickMath } from '../utils/tickMath'
import { Pool } from './pool'
import { Route } from './route'
import { Trade } from './trade'
import { SuiCoin } from './suiCoin'
import { CurrencyAmount } from './currencyAmount'
import { Price } from './price'
describe('Trade', () => {
  const token0 = new SuiCoin('0x066b804a94649350140e4d85d9fc28bd7ae52981e71cc2a35b1e661bb095d129::faucet::t0', 6, 't0', 't0')
  const token1 = new SuiCoin('0x066b804a94649350140e4d85d9fc28bd7ae52981e71cc2a35b1e661bb095d129::faucet::t1', 6, 't1', 't1')
  const token2 = new SuiCoin('0x066b804a94649350140e4d85d9fc28bd7ae52981e71cc2a35b1e661bb095d129::faucet::t2', 6, 't2', 't2')
  const token3 = new SuiCoin('0x066b804a94649350140e4d85d9fc28bd7ae52981e71cc2a35b1e661bb095d129::faucet::t3', 6, 't3', 't3')

  function v2StylePool(
    reserve0: CurrencyAmount<SuiCoin>,
    reserve1: CurrencyAmount<SuiCoin>,
    feeAmount: FeeAmount = FeeAmount.MEDIUM
  ) {
    const sqrtRatioX96 = encodeSqrtRatioX96(reserve1.quotient, reserve0.quotient)
    const liquidity = sqrt(JSBI.multiply(reserve0.quotient, reserve1.quotient))
    return new Pool(
      reserve0.currency,
      reserve1.currency,
      feeAmount,
      sqrtRatioX96,
      liquidity,
      TickMath.getTickAtSqrtRatio(sqrtRatioX96),
      [
        {
          index: nearestUsableTick(TickMath.MIN_TICK, TICK_SPACINGS[feeAmount]),
          liquidityNet: liquidity,
          liquidityGross: liquidity
        },
        {
          index: nearestUsableTick(TickMath.MAX_TICK, TICK_SPACINGS[feeAmount]),
          liquidityNet: JSBI.multiply(liquidity, JSBI.BigInt(-1)),
          liquidityGross: liquidity
        }
      ]
    )
  }

  const pool_0_1 = v2StylePool(
    CurrencyAmount.fromRawAmount(token0, 100000),
    CurrencyAmount.fromRawAmount(token1, 100000)
  )
  const pool_0_2 = v2StylePool(
    CurrencyAmount.fromRawAmount(token0, 100000),
    CurrencyAmount.fromRawAmount(token2, 110000)
  )
  const pool_0_3 = v2StylePool(
    CurrencyAmount.fromRawAmount(token0, 100000),
    CurrencyAmount.fromRawAmount(token3, 90000)
  )
  const pool_1_2 = v2StylePool(
    CurrencyAmount.fromRawAmount(token1, 120000),
    CurrencyAmount.fromRawAmount(token2, 100000)
  )
  const pool_1_3 = v2StylePool(
    CurrencyAmount.fromRawAmount(token1, 120000),
    CurrencyAmount.fromRawAmount(token3, 130000)
  )

  describe('#createUncheckedTrade', () => {
    it('throws if input currency does not match route', () => {
      expect(() =>
        Trade.createUncheckedTrade({
          route: new Route([pool_0_1], token0, token1),
          inputAmount: CurrencyAmount.fromRawAmount(token2, 10000),
          outputAmount: CurrencyAmount.fromRawAmount(token1, 10000),
          tradeType: TradeType.EXACT_INPUT
        })
      ).toThrow('INPUT_CURRENCY_MATCH')
    })
    it('throws if output currency does not match route', () => {
      expect(() =>
        Trade.createUncheckedTrade({
          route: new Route([pool_0_1], token0, token1),
          inputAmount: CurrencyAmount.fromRawAmount(token0, 10000),
          outputAmount: CurrencyAmount.fromRawAmount(token2, 10000),
          tradeType: TradeType.EXACT_INPUT
        })
      ).toThrow('OUTPUT_CURRENCY_MATCH')
    })
    it('can create an exact input trade without simulating', () => {
      Trade.createUncheckedTrade({
        route: new Route([pool_0_1], token0, token1),
        inputAmount: CurrencyAmount.fromRawAmount(token0, 10000),
        outputAmount: CurrencyAmount.fromRawAmount(token1, 100000),
        tradeType: TradeType.EXACT_INPUT
      })
    })
    it('can create an exact output trade without simulating', () => {
      Trade.createUncheckedTrade({
        route: new Route([pool_0_1], token0, token1),
        inputAmount: CurrencyAmount.fromRawAmount(token0, 10000),
        outputAmount: CurrencyAmount.fromRawAmount(token1, 100000),
        tradeType: TradeType.EXACT_OUTPUT
      })
    })
  })
  describe('#createUncheckedTradeWithMultipleRoutes', () => {
    it('throws if input currency does not match route with multiple routes', () => {
      expect(() =>
        Trade.createUncheckedTradeWithMultipleRoutes({
          routes: [
            {
              route: new Route([pool_1_2], token2, token1),
              inputAmount: CurrencyAmount.fromRawAmount(token2, 2000),
              outputAmount: CurrencyAmount.fromRawAmount(token1, 2000)
            },
            {
              route: new Route([pool_0_1], token0, token1),
              inputAmount: CurrencyAmount.fromRawAmount(token2, 8000),
              outputAmount: CurrencyAmount.fromRawAmount(token1, 8000)
            }
          ],
          tradeType: TradeType.EXACT_INPUT
        })
      ).toThrow('INPUT_CURRENCY_MATCH')
    })
    it('throws if output currency does not match route with multiple routes', () => {
      expect(() =>
        Trade.createUncheckedTradeWithMultipleRoutes({
          routes: [
            {
              route: new Route([pool_0_2], token0, token2),
              inputAmount: CurrencyAmount.fromRawAmount(token0, 10000),
              outputAmount: CurrencyAmount.fromRawAmount(token2, 10000)
            },
            {
              route: new Route([pool_0_1], token0, token1),
              inputAmount: CurrencyAmount.fromRawAmount(token0, 10000),
              outputAmount: CurrencyAmount.fromRawAmount(token2, 10000)
            }
          ],
          tradeType: TradeType.EXACT_INPUT
        })
      ).toThrow('OUTPUT_CURRENCY_MATCH')
    })

    it('can create an exact input trade without simulating with multiple routes', () => {
      Trade.createUncheckedTradeWithMultipleRoutes({
        routes: [
          {
            route: new Route([pool_0_1], token0, token1),
            inputAmount: CurrencyAmount.fromRawAmount(token0, 5000),
            outputAmount: CurrencyAmount.fromRawAmount(token1, 50000)
          },
          {
            route: new Route([pool_0_2, pool_1_2], token0, token1),
            inputAmount: CurrencyAmount.fromRawAmount(token0, 5000),
            outputAmount: CurrencyAmount.fromRawAmount(token1, 50000)
          }
        ],
        tradeType: TradeType.EXACT_INPUT
      })
    })

    it('can create an exact output trade without simulating with multiple routes', () => {
      Trade.createUncheckedTradeWithMultipleRoutes({
        routes: [
          {
            route: new Route([pool_0_1], token0, token1),
            inputAmount: CurrencyAmount.fromRawAmount(token0, 5001),
            outputAmount: CurrencyAmount.fromRawAmount(token1, 50000)
          },
          {
            route: new Route([pool_0_2, pool_1_2], token0, token1),
            inputAmount: CurrencyAmount.fromRawAmount(token0, 4999),
            outputAmount: CurrencyAmount.fromRawAmount(token1, 50000)
          }
        ],
        tradeType: TradeType.EXACT_OUTPUT
      })
    })
  })

  describe('#route and #swaps', () => {
    const singleRoute = Trade.createUncheckedTrade({
      route: new Route([pool_0_1, pool_1_2], token0, token2),
      inputAmount: CurrencyAmount.fromRawAmount(token0, 100),
      outputAmount: CurrencyAmount.fromRawAmount(token2, 69),
      tradeType: TradeType.EXACT_INPUT
    })
    const multiRoute = Trade.createUncheckedTradeWithMultipleRoutes({
      routes: [
        {
          route: new Route([pool_0_1, pool_1_2], token0, token2),
          inputAmount: CurrencyAmount.fromRawAmount(token0, 50),
          outputAmount: CurrencyAmount.fromRawAmount(token2, 35)
        },
        {
          route: new Route([pool_0_2], token0, token2),
          inputAmount: CurrencyAmount.fromRawAmount(token0, 50),
          outputAmount: CurrencyAmount.fromRawAmount(token2, 34)
        }
      ],
      tradeType: TradeType.EXACT_INPUT
    })
    it('can access route for single route trade if less than 0', () => {
      expect(singleRoute.route).toBeDefined()
    })
    it('can access routes for both single and multi route trades', () => {
      expect(singleRoute.swaps).toBeDefined()
      expect(singleRoute.swaps).toHaveLength(1)
      expect(multiRoute.swaps).toBeDefined()
      expect(multiRoute.swaps).toHaveLength(2)
    })
    it('throws if access route on multi route trade', () => {
      expect(() => multiRoute.route).toThrow('MULTIPLE_ROUTES')
    })
  })

  describe('#worstExecutionPrice', () => {
    describe('tradeType = EXACT_INPUT', () => {
      const exactIn = Trade.createUncheckedTrade({
        route: new Route([pool_0_1, pool_1_2], token0, token2),
        inputAmount: CurrencyAmount.fromRawAmount(token0, 100),
        outputAmount: CurrencyAmount.fromRawAmount(token2, 69),
        tradeType: TradeType.EXACT_INPUT
      })
      const exactInMultiRoute = Trade.createUncheckedTradeWithMultipleRoutes({
        routes: [
          {
            route: new Route([pool_0_1, pool_1_2], token0, token2),
            inputAmount: CurrencyAmount.fromRawAmount(token0, 50),
            outputAmount: CurrencyAmount.fromRawAmount(token2, 35)
          },
          {
            route: new Route([pool_0_2], token0, token2),
            inputAmount: CurrencyAmount.fromRawAmount(token0, 50),
            outputAmount: CurrencyAmount.fromRawAmount(token2, 34)
          }
        ],
        tradeType: TradeType.EXACT_INPUT
      })
      it('throws if less than 0', () => {
        expect(() => exactIn.minimumAmountOut(new Percent(-1, 100))).toThrow('SLIPPAGE_TOLERANCE')
      })
      it('returns exact if 0', () => {
        expect(exactIn.worstExecutionPrice(new Percent(0, 100))).toEqual(exactIn.executionPrice)
      })
      it('returns exact if nonzero', () => {
        expect(exactIn.worstExecutionPrice(new Percent(0, 100))).toEqual(new Price(token0, token2, 100, 69))
        expect(exactIn.worstExecutionPrice(new Percent(5, 100))).toEqual(new Price(token0, token2, 100, 65))
        expect(exactIn.worstExecutionPrice(new Percent(200, 100))).toEqual(new Price(token0, token2, 100, 23))
      })
      it('returns exact if nonzero with multiple routes', () => {
        expect(exactInMultiRoute.worstExecutionPrice(new Percent(0, 100))).toEqual(new Price(token0, token2, 100, 69))
        expect(exactInMultiRoute.worstExecutionPrice(new Percent(5, 100))).toEqual(new Price(token0, token2, 100, 65))
        expect(exactInMultiRoute.worstExecutionPrice(new Percent(200, 100))).toEqual(new Price(token0, token2, 100, 23))
      })
    })
    describe('tradeType = EXACT_OUTPUT', () => {
      const exactOut = Trade.createUncheckedTrade({
        route: new Route([pool_0_1, pool_1_2], token0, token2),
        inputAmount: CurrencyAmount.fromRawAmount(token0, 156),
        outputAmount: CurrencyAmount.fromRawAmount(token2, 100),
        tradeType: TradeType.EXACT_OUTPUT
      })
      const exactOutMultiRoute = Trade.createUncheckedTradeWithMultipleRoutes({
        routes: [
          {
            route: new Route([pool_0_1, pool_1_2], token0, token2),
            inputAmount: CurrencyAmount.fromRawAmount(token0, 78),
            outputAmount: CurrencyAmount.fromRawAmount(token2, 50)
          },
          {
            route: new Route([pool_0_2], token0, token2),
            inputAmount: CurrencyAmount.fromRawAmount(token0, 78),
            outputAmount: CurrencyAmount.fromRawAmount(token2, 50)
          }
        ],
        tradeType: TradeType.EXACT_OUTPUT
      })

      it('throws if less than 0', () => {
        expect(() => exactOut.worstExecutionPrice(new Percent(-1, 100))).toThrow('SLIPPAGE_TOLERANCE')
      })
      it('returns exact if 0', () => {
        expect(exactOut.worstExecutionPrice(new Percent(0, 100))).toEqual(exactOut.executionPrice)
      })
      it('returns slippage amount if nonzero', () => {
        expect(
          exactOut.worstExecutionPrice(new Percent(0, 100)).equalTo(new Price(token0, token2, 156, 100))
        ).toBeTruthy()
        expect(
          exactOut.worstExecutionPrice(new Percent(5, 100)).equalTo(new Price(token0, token2, 163, 100))
        ).toBeTruthy()
        expect(
          exactOut.worstExecutionPrice(new Percent(200, 100)).equalTo(new Price(token0, token2, 468, 100))
        ).toBeTruthy()
      })
      it('returns exact if nonzero with multiple routes', () => {
        expect(
          exactOutMultiRoute.worstExecutionPrice(new Percent(0, 100)).equalTo(new Price(token0, token2, 156, 100))
        ).toBeTruthy()
        expect(
          exactOutMultiRoute.worstExecutionPrice(new Percent(5, 100)).equalTo(new Price(token0, token2, 163, 100))
        ).toBeTruthy()
        expect(
          exactOutMultiRoute.worstExecutionPrice(new Percent(200, 100)).equalTo(new Price(token0, token2, 468, 100))
        ).toBeTruthy()
      })
    })
  })

  describe('#priceImpact', () => {
    describe('tradeType = EXACT_INPUT', () => {
      const exactIn = Trade.createUncheckedTradeWithMultipleRoutes({
        routes: [
          {
            route: new Route([pool_0_1, pool_1_2], token0, token2),
            inputAmount: CurrencyAmount.fromRawAmount(token0, 100),
            outputAmount: CurrencyAmount.fromRawAmount(token2, 69)
          }
        ],
        tradeType: TradeType.EXACT_INPUT
      })
      const exactInMultipleRoutes = Trade.createUncheckedTradeWithMultipleRoutes({
        routes: [
          {
            route: new Route([pool_0_1, pool_1_2], token0, token2),
            inputAmount: CurrencyAmount.fromRawAmount(token0, 90),
            outputAmount: CurrencyAmount.fromRawAmount(token2, 62)
          },
          {
            route: new Route([pool_0_2], token0, token2),
            inputAmount: CurrencyAmount.fromRawAmount(token0, 10),
            outputAmount: CurrencyAmount.fromRawAmount(token2, 7)
          }
        ],
        tradeType: TradeType.EXACT_INPUT
      })
      it('is cached', () => {
        expect(exactIn.priceImpact === exactIn.priceImpact).toStrictEqual(true)
      })
      it('is correct', () => {
        expect(exactIn.priceImpact.toSignificant(3)).toEqual('17.2')
      })

      it('is cached with multiple routes', () => {
        expect(exactInMultipleRoutes.priceImpact === exactInMultipleRoutes.priceImpact).toStrictEqual(true)
      })
      it('is correct with multiple routes', async () => {
        expect(exactInMultipleRoutes.priceImpact.toSignificant(3)).toEqual('19.8')
      })
    })
    describe('tradeType = EXACT_OUTPUT', () => {
      const exactOut = Trade.createUncheckedTradeWithMultipleRoutes({
        routes: [
          {
            route: new Route([pool_0_1, pool_1_2], token0, token2),
            inputAmount: CurrencyAmount.fromRawAmount(token0, 156),
            outputAmount: CurrencyAmount.fromRawAmount(token2, 100)
          }
        ],
        tradeType: TradeType.EXACT_OUTPUT
      })
      const exactOutMultipleRoutes = Trade.createUncheckedTradeWithMultipleRoutes({
        routes: [
          {
            route: new Route([pool_0_1, pool_1_2], token0, token2),
            inputAmount: CurrencyAmount.fromRawAmount(token0, 140),
            outputAmount: CurrencyAmount.fromRawAmount(token2, 90)
          },
          {
            route: new Route([pool_0_2], token0, token2),
            inputAmount: CurrencyAmount.fromRawAmount(token0, 16),
            outputAmount: CurrencyAmount.fromRawAmount(token2, 10)
          }
        ],
        tradeType: TradeType.EXACT_OUTPUT
      })

      it('is cached', () => {
        expect(exactOut.priceImpact === exactOut.priceImpact).toStrictEqual(true)
      })
      it('is correct', () => {
        expect(exactOut.priceImpact.toSignificant(3)).toEqual('23.1')
      })

      it('is cached with multiple routes', () => {
        expect(exactOutMultipleRoutes.priceImpact === exactOutMultipleRoutes.priceImpact).toStrictEqual(true)
      })
      it('is correct with multiple routes', () => {
        expect(exactOutMultipleRoutes.priceImpact.toSignificant(3)).toEqual('25.5')
      })
    })
  })

  describe('#bestTradeExactIn', () => {
    it('throws with empty pools', async () => {
      await expect(
        Trade.bestTradeExactIn([], CurrencyAmount.fromRawAmount(token0, JSBI.BigInt(10000)), token2)
      ).rejects.toThrow('POOLS')
    })
    it('throws with max hops of 0', async () => {
      await expect(
        Trade.bestTradeExactIn([pool_0_2], CurrencyAmount.fromRawAmount(token0, JSBI.BigInt(10000)), token2, {
          maxHops: 0
        })
      ).rejects.toThrow('MAX_HOPS')
    })

    it('provides best route', async () => {
      const result = await Trade.bestTradeExactIn(
        [pool_0_1, pool_0_2, pool_1_2],
        CurrencyAmount.fromRawAmount(token0, 10000),
        token2
      )
      expect(result).toHaveLength(2)
      expect(result[0].swaps[0].route.pools).toHaveLength(1) // 0 -> 2 at 10:11
      expect(result[0].swaps[0].route.tokenPath).toEqual([token0, token2])
      expect(result[0].inputAmount.equalTo(CurrencyAmount.fromRawAmount(token0, JSBI.BigInt(10000)))).toBeTruthy()
      expect(result[0].outputAmount.equalTo(CurrencyAmount.fromRawAmount(token2, JSBI.BigInt(9971)))).toBeTruthy()
      expect(result[1].swaps[0].route.pools).toHaveLength(2) // 0 -> 1 -> 2 at 12:12:10
      expect(result[1].swaps[0].route.tokenPath).toEqual([token0, token1, token2])
      expect(result[1].inputAmount.equalTo(CurrencyAmount.fromRawAmount(token0, JSBI.BigInt(10000)))).toBeTruthy()
      expect(result[1].outputAmount.equalTo(CurrencyAmount.fromRawAmount(token2, JSBI.BigInt(7004)))).toBeTruthy()
    })

    it('respects maxHops', async () => {
      const result = await Trade.bestTradeExactIn(
        [pool_0_1, pool_0_2, pool_1_2],
        CurrencyAmount.fromRawAmount(token0, JSBI.BigInt(10)),
        token2,
        { maxHops: 1 }
      )
      expect(result).toHaveLength(1)
      expect(result[0].swaps[0].route.pools).toHaveLength(1) // 0 -> 2 at 10:11
      expect(result[0].swaps[0].route.tokenPath).toEqual([token0, token2])
    })

    it('insufficient input for one pool', async () => {
      const result = await Trade.bestTradeExactIn(
        [pool_0_1, pool_0_2, pool_1_2],
        CurrencyAmount.fromRawAmount(token0, 1),
        token2
      )
      expect(result).toHaveLength(2)
      expect(result[0].swaps[0].route.pools).toHaveLength(1) // 0 -> 2 at 10:11
      expect(result[0].swaps[0].route.tokenPath).toEqual([token0, token2])
      expect(result[0].outputAmount).toEqual(CurrencyAmount.fromRawAmount(token2, 0))
    })

    // it('respects n', async () => {
    //   const result = await Trade.bestTradeExactIn(
    //     [pool_0_1, pool_0_2, pool_1_2],
    //     CurrencyAmount.fromRawAmount(token0, JSBI.BigInt(10)),
    //     token2,
    //     { maxNumResults: 1 }
    //   )

    //   expect(result).toHaveLength(1)
    // })

    it('no path', async () => {
      const result = await Trade.bestTradeExactIn(
        [pool_0_1, pool_0_3, pool_1_3],
        CurrencyAmount.fromRawAmount(token0, JSBI.BigInt(10)),
        token2
      )
      expect(result).toHaveLength(0)
    })
  })

  describe('#maximumAmountIn', () => {
    describe('tradeType = EXACT_INPUT', () => {
      let exactIn: Trade<SuiCoin, SuiCoin, TradeType.EXACT_INPUT>
      beforeEach(async () => {
        exactIn = await Trade.fromRoute(
          new Route([pool_0_1, pool_1_2], token0, token2),
          CurrencyAmount.fromRawAmount(token0, JSBI.BigInt(100)),
          TradeType.EXACT_INPUT
        )
      })
      it('throws if less than 0', () => {
        expect(() => exactIn.maximumAmountIn(new Percent(JSBI.BigInt(-1), JSBI.BigInt(100)))).toThrow(
          'SLIPPAGE_TOLERANCE'
        )
      })
      it('returns exact if 0', () => {
        expect(exactIn.maximumAmountIn(new Percent(JSBI.BigInt(0), JSBI.BigInt(100)))).toEqual(exactIn.inputAmount)
      })
      it('returns exact if nonzero', () => {
        expect(
          exactIn
            .maximumAmountIn(new Percent(JSBI.BigInt(0), JSBI.BigInt(100)))
            .equalTo(CurrencyAmount.fromRawAmount(token0, JSBI.BigInt(100)))
        ).toBeTruthy()
        expect(
          exactIn
            .maximumAmountIn(new Percent(JSBI.BigInt(5), JSBI.BigInt(100)))
            .equalTo(CurrencyAmount.fromRawAmount(token0, JSBI.BigInt(100)))
        ).toBeTruthy()
        expect(
          exactIn
            .maximumAmountIn(new Percent(JSBI.BigInt(200), JSBI.BigInt(100)))
            .equalTo(CurrencyAmount.fromRawAmount(token0, JSBI.BigInt(100)))
        ).toBeTruthy()
      })
    })

    describe('tradeType = EXACT_OUTPUT', () => {
      let exactOut: Trade<SuiCoin, SuiCoin, TradeType.EXACT_OUTPUT>
      beforeEach(async () => {
        exactOut = await Trade.fromRoute(
          new Route([pool_0_1, pool_1_2], token0, token2),
          CurrencyAmount.fromRawAmount(token2, 10000),
          TradeType.EXACT_OUTPUT
        )
      })

      it('throws if less than 0', () => {
        expect(() => exactOut.maximumAmountIn(new Percent(JSBI.BigInt(-1), 10000))).toThrow('SLIPPAGE_TOLERANCE')
      })

      it('returns exact if 0', () => {
        expect(exactOut.maximumAmountIn(new Percent(JSBI.BigInt(0), 10000))).toEqual(exactOut.inputAmount)
      })

      it('returns slippage amount if nonzero', () => {
        expect(
          exactOut
            .maximumAmountIn(new Percent(JSBI.BigInt(0), 100))
            .equalTo(CurrencyAmount.fromRawAmount(token0, 15488))
        ).toBeTruthy()
        expect(
          exactOut
            .maximumAmountIn(new Percent(JSBI.BigInt(5), JSBI.BigInt(100)))
            .equalTo(CurrencyAmount.fromRawAmount(token0, 16262))
        ).toBeTruthy()
        expect(
          exactOut
            .maximumAmountIn(new Percent(JSBI.BigInt(200), JSBI.BigInt(100)))
            .equalTo(CurrencyAmount.fromRawAmount(token0, 46464))
        ).toBeTruthy()
      })
    })
  })

  describe('#minimumAmountOut', () => {
    describe('tradeType = EXACT_INPUT', () => {
      let exactIn: Trade<SuiCoin, SuiCoin, TradeType.EXACT_INPUT>
      beforeEach(
        async () =>
          (exactIn = await Trade.fromRoute(
            new Route([pool_0_1, pool_1_2], token0, token2),
            CurrencyAmount.fromRawAmount(token0, 10000),
            TradeType.EXACT_INPUT
          ))
      )

      it('throws if less than 0', () => {
        expect(() => exactIn.minimumAmountOut(new Percent(JSBI.BigInt(-1), 100))).toThrow('SLIPPAGE_TOLERANCE')
      })

      it('returns exact if 0', () => {
        expect(exactIn.minimumAmountOut(new Percent(JSBI.BigInt(0), 10000))).toEqual(exactIn.outputAmount)
      })

      it('returns exact if nonzero', () => {
        expect(exactIn.minimumAmountOut(new Percent(JSBI.BigInt(0), 100))).toEqual(
          CurrencyAmount.fromRawAmount(token2, 7004)
        )
        expect(exactIn.minimumAmountOut(new Percent(JSBI.BigInt(5), 100))).toEqual(
          CurrencyAmount.fromRawAmount(token2, 6670)
        )
        expect(exactIn.minimumAmountOut(new Percent(JSBI.BigInt(200), 100))).toEqual(
          CurrencyAmount.fromRawAmount(token2, 2334)
        )
      })
    })
    describe('tradeType = EXACT_OUTPUT', () => {
      let exactOut: Trade<SuiCoin, SuiCoin, TradeType.EXACT_OUTPUT>
      beforeEach(async () => {
        exactOut = await Trade.fromRoute(
          new Route([pool_0_1, pool_1_2], token0, token2),
          CurrencyAmount.fromRawAmount(token2, JSBI.BigInt(100)),
          TradeType.EXACT_OUTPUT
        )
      })

      it('throws if less than 0', () => {
        expect(() => exactOut.minimumAmountOut(new Percent(JSBI.BigInt(-1), JSBI.BigInt(100)))).toThrow(
          'SLIPPAGE_TOLERANCE'
        )
      })
      it('returns exact if 0', () => {
        expect(exactOut.minimumAmountOut(new Percent(JSBI.BigInt(0), JSBI.BigInt(100)))).toEqual(exactOut.outputAmount)
      })
      it('returns slippage amount if nonzero', () => {
        expect(
          exactOut
            .minimumAmountOut(new Percent(JSBI.BigInt(0), JSBI.BigInt(100)))
            .equalTo(CurrencyAmount.fromRawAmount(token2, JSBI.BigInt(100)))
        ).toBeTruthy()
        expect(
          exactOut
            .minimumAmountOut(new Percent(JSBI.BigInt(5), JSBI.BigInt(100)))
            .equalTo(CurrencyAmount.fromRawAmount(token2, JSBI.BigInt(100)))
        ).toBeTruthy()
        expect(
          exactOut
            .minimumAmountOut(new Percent(JSBI.BigInt(200), JSBI.BigInt(100)))
            .equalTo(CurrencyAmount.fromRawAmount(token2, JSBI.BigInt(100)))
        ).toBeTruthy()
      })
    })
  })

  describe('#bestTradeExactOut', () => {
    it('throws with empty pools', async () => {
      await expect(
        Trade.bestTradeExactOut([], token0, CurrencyAmount.fromRawAmount(token2, JSBI.BigInt(100)))
      ).rejects.toThrow('POOLS')
    })
    it('throws with max hops of 0', async () => {
      await expect(
        Trade.bestTradeExactOut([pool_0_2], token0, CurrencyAmount.fromRawAmount(token2, JSBI.BigInt(100)), {
          maxHops: 0
        })
      ).rejects.toThrow('MAX_HOPS')
    })

    it('provides best route', async () => {
      const result = await Trade.bestTradeExactOut(
        [pool_0_1, pool_0_2, pool_1_2],
        token0,
        CurrencyAmount.fromRawAmount(token2, 10000)
      )
      expect(result).toHaveLength(2)
      expect(result[0].swaps[0].route.pools).toHaveLength(1) // 0 -> 2 at 10:11
      expect(result[0].swaps[0].route.tokenPath).toEqual([token0, token2])
      expect(result[0].inputAmount.equalTo(CurrencyAmount.fromRawAmount(token0, 10032))).toBeTruthy()
      expect(result[0].outputAmount.equalTo(CurrencyAmount.fromRawAmount(token2, 10000))).toBeTruthy()
      expect(result[1].swaps[0].route.pools).toHaveLength(2) // 0 -> 1 -> 2 at 12:12:10
      expect(result[1].swaps[0].route.tokenPath).toEqual([token0, token1, token2])
      expect(result[1].inputAmount.equalTo(CurrencyAmount.fromRawAmount(token0, 15488))).toBeTruthy()
      expect(result[1].outputAmount.equalTo(CurrencyAmount.fromRawAmount(token2, 10000))).toBeTruthy()
    })

    it('respects maxHops', async () => {
      const result = await Trade.bestTradeExactOut(
        [pool_0_1, pool_0_2, pool_1_2],
        token0,
        CurrencyAmount.fromRawAmount(token2, JSBI.BigInt(10)),
        { maxHops: 1 }
      )
      expect(result).toHaveLength(1)
      expect(result[0].swaps[0].route.pools).toHaveLength(1) // 0 -> 2 at 10:11
      expect(result[0].swaps[0].route.tokenPath).toEqual([token0, token2])
    })

    it.skip('insufficient liquidity', () => {
      const result = Trade.bestTradeExactOut(
        [pool_0_1, pool_0_2, pool_1_2],
        token0,
        CurrencyAmount.fromRawAmount(token2, 1200)
      )
      expect(result).toHaveLength(0)
    })

    it.skip('insufficient liquidity in one pool but not the other', () => {
      const result = Trade.bestTradeExactOut(
        [pool_0_1, pool_0_2, pool_1_2],
        token0,
        CurrencyAmount.fromRawAmount(token2, JSBI.BigInt(1050))
      )
      expect(result).toHaveLength(1)
    })

    it('respects n', async () => {
      const result = await Trade.bestTradeExactOut(
        [pool_0_1, pool_0_2, pool_1_2],
        token0,
        CurrencyAmount.fromRawAmount(token2, JSBI.BigInt(10)),
        { maxNumResults: 1 }
      )

      expect(result).toHaveLength(1)
    })

    it('no path', async () => {
      const result = await Trade.bestTradeExactOut(
        [pool_0_1, pool_0_3, pool_1_3],
        token0,
        CurrencyAmount.fromRawAmount(token2, JSBI.BigInt(10))
      )
      expect(result).toHaveLength(0)
    })
  })
})
