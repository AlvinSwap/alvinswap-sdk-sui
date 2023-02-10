// import { BigintIsh, Currency, CurrencyAmount, Percent, TradeType } from '@uniswap/sdk-core'
// import invariant from 'tiny-invariant'
// import { Trade } from './entities/trade'
// import { toHex } from './utils/calldata'
// import { FeeOptions } from './payments'
// import { Pool } from './entities'
import { FeeAmount, feeTypeToFeeAmount } from './constants'

import { BigintIsh } from '@uniswap/sdk-core'
import JSBI from 'jsbi'
import { i128ToBigInt, i256ToBigInt, i64ToNumber, tryCallWithTrial, typeInfoToQualifiedName } from './utils/cl'
import { JsonRpcProvider } from '@mysten/sui.js'
import { TickMath } from './utils'
// import { JsonRpcProvider } from '@mysten/sui.js';

export interface EventBase {}

export enum EventType {
  MINT = 100,
  COLLECT = 101,
  COLLECT_PROTOCOL = 102,
  BURN = 103,
  SWAP = 104,
  INCREASE_OBSERVATION_CARDINALITY_NEXT = 105,
  SET_FEE_PROTOCOL_EVENT = 106,
  TICK_UPDATED_EVENT = 107
} 

export interface PoolCreatedEvent extends EventBase {
  token0Address: string
  token1Address: string
  feeAmount: FeeAmount
  sqrtPriceX96: BigintIsh
  tick: number
  objectId: string
}

export interface PoolUpdatedEvent extends EventBase {
  token0Address: string
  token1Address: string
  feeAmount: FeeAmount
  isMint: boolean
  isNew: boolean
  creator: string
  tick: number
  tickLower: number
  tickUpper: number
  liquidity: BigintIsh
  amount: BigintIsh
  amount0: BigintIsh
  amount1: BigintIsh
  reserve0: BigintIsh
  reserve1: BigintIsh
  objectId: string
  sqrtPriceX96: BigintIsh
}

export interface TickUpdatedEvent extends EventBase {
  token0Address: string
  token1Address: string
  reserve0: string
  reserve1: string
  feeAmount: FeeAmount
  liquidityGross: JSBI
  liquidityNet: JSBI  
  tick: number
}

export interface MintEvent extends EventBase {
  token0Address: string
  token1Address: string
  feeAmount: FeeAmount
  owner: string
  tickLower: number
  tickUpper: number
  amount: BigintIsh
  amount0: BigintIsh
  amount1: BigintIsh
}

export interface CollectEvent extends EventBase {
  token0Address: string
  token1Address: string
  feeAmount: FeeAmount
  owner: string
  tickLower: number
  tickUpper: number
  amount0: BigintIsh
  amount1: BigintIsh
}

export interface CollectProtocolEvent extends EventBase {
  token0Address: string
  token1Address: string
  feeAmount: FeeAmount
  owner: string
  amount0: BigintIsh
  amount1: BigintIsh
}

export interface BurnEvent extends EventBase {
  token0Address: string
  token1Address: string
  feeAmount: FeeAmount
  owner: string
  amount: BigintIsh
  amount0: BigintIsh
  amount1: BigintIsh
  tickLower: number
  tickUpper: number
}

export interface SwapEvent extends EventBase {
  token0Address: string
  token1Address: string
  reserve0: string
  reserve1: string
  feeAmount: FeeAmount
  recipient: string
  amount0: JSBI
  amount1: JSBI
  sqrtPriceX96: BigintIsh
  liquidity: BigintIsh
  tick: number
}

export interface IncreaseObservationCardinalityNextEvent extends EventBase {
  token0Address: string
  token1Address: string
  feeAmount: FeeAmount
  observationCardinalityNextOld: number
  observationCardinalityNextNew: number
}

export interface SetFeeProtocolEvent extends EventBase {
  token0Address: string
  token1Address: string
  feeAmount: FeeAmount
  feeProtocol0Old: number
  feeProtocol1Old: number
  feeProtocol0New: number
  feeProtocol1New: number
}

/**
 * Represents the Uniswap V3 SwapRouter, and has static methods for helping execute trades.
 */
export class EventFetcher {
  public static async fetchPoolUpdatedEvent(packageObjectId: string, suiRPC: string, _startCursor?: { txDigest: string, eventSeq: number }, _limit?: number): Promise<{poolUpdatedEvents: PoolUpdatedEvent[], lastCursor: any}> {
    const provider = new JsonRpcProvider(suiRPC)
    
    let start = _startCursor ? _startCursor : null
    let limit = typeof _limit !== 'undefined' ? _limit : 10000

    const poolUpdatedEvents = await tryCallWithTrial(async function(): Promise<any[]> {
      const events = await provider.getEvents({
        MoveEvent: `${packageObjectId}::pool::PoolUpdatedEvent`
      }, start, limit, 'ascending')
      if (!events || events.data.length == 0) {
        return []
      }
      return events.data
    })
    const ret: PoolUpdatedEvent[] = []
    limit = poolUpdatedEvents ? poolUpdatedEvents.length : 0
    let lastCursor = null
    if (poolUpdatedEvents && Array.isArray(poolUpdatedEvents) && poolUpdatedEvents.length > 0) {
      poolUpdatedEvents.forEach(d => {
        const e = d.event.moveEvent.fields
        ret.push({
          token0Address: typeInfoToQualifiedName(e.t0),
          token1Address: typeInfoToQualifiedName(e.t1),
          feeAmount: feeTypeToFeeAmount(typeInfoToQualifiedName(e.f)),
          isMint: e.is_mint,
          isNew: e.is_new,
          creator: e.creator,
          tick: i64ToNumber(e.tick.fields),
          tickLower: i64ToNumber(e.tick_lower.fields),
          tickUpper: i64ToNumber(e.tick_upper.fields),
          amount: e.amount,
          amount0: e.amount0,
          amount1: e.amount1,
          reserve0: e.reserve_0,
          reserve1: e.reserve_1,
          objectId: e.pool_address,
          liquidity: e.liquidity,
          sqrtPriceX96: TickMath.getSqrtRatioAtTick(i64ToNumber(e.tick.fields))
        })
      })
      lastCursor = poolUpdatedEvents[poolUpdatedEvents.length - 1].id
    }
    return { poolUpdatedEvents: ret, lastCursor}
  }

  public static async fetchTickUpdatedEvent(packageObjectId: string, suiRPC: string, filter: { token0: string, token1: string, feeAmount: FeeAmount } | undefined, _startCursor?: { txDigest: string, eventSeq: number }, _limit?: number): Promise<{tickUpdatedEvents: TickUpdatedEvent[], lastCursor: any}> {
    const provider = new JsonRpcProvider(suiRPC)
    let start = _startCursor ? _startCursor : null
    let limit = typeof _limit !== 'undefined' ? _limit : 10000

    const tickUpdatedEvents = await tryCallWithTrial(async function(): Promise<any[]> {
      const events = await provider.getEvents({
        MoveEvent: `${packageObjectId}::pool::TickUpdatedEvent`
      }, start, limit, 'ascending')
      if (!events || events.data.length == 0) {
        return []
      }
      return events.data
    })

    const ret: TickUpdatedEvent[] = []
    limit = tickUpdatedEvents ? tickUpdatedEvents.length : 0
    let lastCursor = null
    if (tickUpdatedEvents && Array.isArray(tickUpdatedEvents) && tickUpdatedEvents.length > 0) {
      tickUpdatedEvents.forEach(d => {
        const e = d.event.moveEvent.fields
        const [token0, token1, feeAmount] = [typeInfoToQualifiedName(e.t0), typeInfoToQualifiedName(e.t1), feeTypeToFeeAmount(typeInfoToQualifiedName(e.f))]
        if (filter != undefined) {
          if (filter.token0 != token0 || filter.token1 != token1 || filter.feeAmount != feeAmount) {
            return
          }
        }
        ret.push({
          token0Address: token0,
          token1Address: token1,
          feeAmount: feeAmount,
          liquidityGross: e.liquidity_gross,
          liquidityNet: i128ToBigInt(e.liquidity_net.fields),
          tick: i64ToNumber(e.tick.fields),
          reserve0: e.reserve_0,
          reserve1: e.reserve_1
        })
      })
      lastCursor = tickUpdatedEvents[tickUpdatedEvents.length - 1].id
    }
    return { tickUpdatedEvents: ret, lastCursor}
  }

  public static async fetchGlobalSwapEvents(packageObjectId: string, suiRPC: string, _startCursor?: { txDigest: string, eventSeq: number }, _limit?: number): Promise<{swapEvents: SwapEvent[], lastCursor: any}> {
    const provider = new JsonRpcProvider(suiRPC)
    let start = _startCursor ? _startCursor : null
    let limit = typeof _limit !== 'undefined' ? _limit : 10000

    const swapEvents = await tryCallWithTrial(async function(): Promise<any[]> {
      const events = await provider.getEvents({
        MoveEvent: `${packageObjectId}::pool::GlobalSwapEvent`
      }, start, limit, 'ascending')
      if (!events || events.data.length == 0) {
        return []
      }
      return events.data
    })

    const ret: SwapEvent[] = []
    limit = swapEvents ? swapEvents.length : 0
    let lastCursor = null
    if (swapEvents && Array.isArray(swapEvents) && swapEvents.length > 0) {
      swapEvents.forEach(d => {
        const e = d.event.moveEvent.fields

        ret.push({
          token0Address: typeInfoToQualifiedName(e.t0),
          token1Address: typeInfoToQualifiedName(e.t1),
          feeAmount: feeTypeToFeeAmount(typeInfoToQualifiedName(e.f)),
          recipient: e.recipient,
          amount0: i256ToBigInt(e.amount0.fields),
          amount1: i256ToBigInt(e.amount1.fields),
          sqrtPriceX96: e.sqrt_price_x96,
          liquidity: e.liquidity,
          tick: i64ToNumber(e.tick.fields),
          reserve0: e.reserve_0,
          reserve1: e.reserve_1
        })
      })
      lastCursor = swapEvents[swapEvents.length - 1].id
    }
    return { swapEvents: ret, lastCursor}
  }

//   public static makeEventFromInstance(t: EventType, pool: Pool, e: any): EventBase {
//     if (t == EventType.MINT) {
//       return {
//         token0Address: pool.token0.address,
//         token1Address: pool.token1.address,
//         feeAmount: pool.fee,
//         owner: e.owner,
//         tickLower: i64ToNumber(e.tick_lower),
//         tickUpper: i64ToNumber(e.tick_upper),
//         amount: e.amount,
//         amount0: e.amount0,
//         amount1: e.amount1
//       } as MintEvent
//     }

//     if (t == EventType.COLLECT) {
//       return {
//         token0Address: pool.token0.address,
//         token1Address: pool.token1.address,
//         feeAmount: pool.fee,
//         owner: e.owner,
//         tickLower: i64ToNumber(e.tick_lower),
//         tickUpper: i64ToNumber(e.tick_upper),
//         amount0: e.amount0,
//         amount1: e.amount1
//       } as CollectEvent
//     }

//     if (t == EventType.COLLECT_PROTOCOL) {
//       return {
//         token0Address: pool.token0.address,
//         token1Address: pool.token1.address,
//         feeAmount: pool.fee,
//         owner: e.owner,
//         amount0: e.amount0,
//         amount1: e.amount1
//       } as CollectProtocolEvent
//     }

//     if (t == EventType.BURN) {
//       return {
//         token0Address: pool.token0.address,
//         token1Address: pool.token1.address,
//         feeAmount: pool.fee,
//         owner: e.owner,
//         amount: e.amount,
//         amount0: e.amount0,
//         amount1: e.amount1,
//         tickLower: i64ToNumber(e.tick_lower),
//         tickUpper: i64ToNumber(e.tick_upper),
//       } as BurnEvent
//     }

//     if (t == EventType.SWAP) {
//       return {
//         token0Address: pool.token0.address,
//         token1Address: pool.token1.address,
//         feeAmount: pool.fee,
//         recipient: e.recipient,
//         amount0: i256ToBigInt(e.amount0),
//         amount1: i256ToBigInt(e.amount1),
//         sqrtPriceX96: bnToBigInt(e.sqrt_price_x96),
//         liquidity: e.liquidity,
//         tick: i64ToNumber(e.tick)
//       } as SwapEvent
//     }

//     if (t == EventType.INCREASE_OBSERVATION_CARDINALITY_NEXT) {
//       return {
//         token0Address: pool.token0.address,
//         token1Address: pool.token1.address,
//         feeAmount: pool.fee,
//         owner: e.owner,
//         observationCardinalityNextOld: e.observation_cardinality_next_old,
//         observationCardinalityNextNew: e.observation_cardinality_next_new
//       } as IncreaseObservationCardinalityNextEvent
//     }

//     if (t == EventType.SET_FEE_PROTOCOL_EVENT) {
//       return {
//         token0Address: pool.token0.address,
//         token1Address: pool.token1.address,
//         feeAmount: pool.fee,
//         feeProtocol0Old: e.fee_protocol0_old,
//         feeProtocol1Old: e.fee_protocol0_new,
//         feeProtocol0New: e.fee_protocol1_old,
//         feeProtocol1New: e.fee_protocol1_new
//       } as SetFeeProtocolEvent
//     }
//     throw new Error('Unsupported event type')
//   }

//   public static getEventHandle(t: EventType): string {
//     if (t == EventType.MINT) {
//       return 'mint_handle'
//     }

//     if (t == EventType.COLLECT) {
//       return 'collect_handle'
//     }

//     if (t == EventType.COLLECT_PROTOCOL) {
//       return 'collect_protocol_handle'
//     }

//     if (t == EventType.BURN) {
//       return 'burn_handle'
//     }

//     if (t == EventType.SWAP) {
//       return 'swap_handle'
//     }

//     if (t == EventType.INCREASE_OBSERVATION_CARDINALITY_NEXT) {
//       return 'increase_observation_cardinality_next_handle'
//     }

//     if (t == EventType.SET_FEE_PROTOCOL_EVENT) {
//       return 'set_fee_protocol_handle'
//     }
//     throw new Error('Unsupported event type')
//   }

//   public static async fetchEvents(pool: Pool, moduleAddress: string, eventType: EventType, aptosRPC: string, _start?: number, _limit?: number): Promise<{events: EventBase[], lastRead: number}> {
//     const aptosClient = new AptosClient(aptosRPC)
//     const resourceAccountAddress = getResourceAddress(moduleAddress)
//     const poolStruct = `${moduleAddress}::pool::EventsStore<${pool.token0.address}, ${pool.token1.address}, ${moduleAddress}${getFeeType(pool.fee)}>`
//     const handle = EventFetcher.getEventHandle(eventType)
    
//     let start = typeof _start !== 'undefined' ? _start : 0
//     let limit = typeof _limit !== 'undefined' ? _limit : Number.MAX_VALUE

//     const eventResults = await tryCallWithTrial(async function(): Promise<any[]> {
//       return await aptosClient.getEventsByEventHandle(resourceAccountAddress, poolStruct, handle, { start, limit })
//     })
//     const ret: EventBase[] = []
//     limit = eventResults ? eventResults.length : 0
//     if (eventResults && Array.isArray(eventResults)) {
//       eventResults.forEach(d => {
//         const e = d.data
//         ret.push(EventFetcher.makeEventFromInstance(eventType, pool, e))
//       })
//     }
//     return { events: ret, lastRead: start + limit}
//   }
}
