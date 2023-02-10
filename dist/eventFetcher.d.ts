import { FeeAmount } from './constants';
import { BigintIsh } from '@uniswap/sdk-core';
import JSBI from 'jsbi';
export interface EventBase {
}
export declare enum EventType {
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
    token0Address: string;
    token1Address: string;
    feeAmount: FeeAmount;
    sqrtPriceX96: BigintIsh;
    tick: number;
    objectId: string;
}
export interface PoolUpdatedEvent extends EventBase {
    token0Address: string;
    token1Address: string;
    feeAmount: FeeAmount;
    isMint: boolean;
    isNew: boolean;
    creator: string;
    tick: number;
    tickLower: number;
    tickUpper: number;
    liquidity: BigintIsh;
    amount: BigintIsh;
    amount0: BigintIsh;
    amount1: BigintIsh;
    reserve0: BigintIsh;
    reserve1: BigintIsh;
    objectId: string;
    sqrtPriceX96: BigintIsh;
}
export interface TickUpdatedEvent extends EventBase {
    token0Address: string;
    token1Address: string;
    reserve0: string;
    reserve1: string;
    feeAmount: FeeAmount;
    liquidityGross: JSBI;
    liquidityNet: JSBI;
    tick: number;
}
export interface MintEvent extends EventBase {
    token0Address: string;
    token1Address: string;
    feeAmount: FeeAmount;
    owner: string;
    tickLower: number;
    tickUpper: number;
    amount: BigintIsh;
    amount0: BigintIsh;
    amount1: BigintIsh;
}
export interface CollectEvent extends EventBase {
    token0Address: string;
    token1Address: string;
    feeAmount: FeeAmount;
    owner: string;
    tickLower: number;
    tickUpper: number;
    amount0: BigintIsh;
    amount1: BigintIsh;
}
export interface CollectProtocolEvent extends EventBase {
    token0Address: string;
    token1Address: string;
    feeAmount: FeeAmount;
    owner: string;
    amount0: BigintIsh;
    amount1: BigintIsh;
}
export interface BurnEvent extends EventBase {
    token0Address: string;
    token1Address: string;
    feeAmount: FeeAmount;
    owner: string;
    amount: BigintIsh;
    amount0: BigintIsh;
    amount1: BigintIsh;
    tickLower: number;
    tickUpper: number;
}
export interface SwapEvent extends EventBase {
    token0Address: string;
    token1Address: string;
    reserve0: string;
    reserve1: string;
    feeAmount: FeeAmount;
    recipient: string;
    amount0: JSBI;
    amount1: JSBI;
    sqrtPriceX96: BigintIsh;
    liquidity: BigintIsh;
    tick: number;
}
export interface IncreaseObservationCardinalityNextEvent extends EventBase {
    token0Address: string;
    token1Address: string;
    feeAmount: FeeAmount;
    observationCardinalityNextOld: number;
    observationCardinalityNextNew: number;
}
export interface SetFeeProtocolEvent extends EventBase {
    token0Address: string;
    token1Address: string;
    feeAmount: FeeAmount;
    feeProtocol0Old: number;
    feeProtocol1Old: number;
    feeProtocol0New: number;
    feeProtocol1New: number;
}
/**
 * Represents the Uniswap V3 SwapRouter, and has static methods for helping execute trades.
 */
export declare class EventFetcher {
    static fetchPoolUpdatedEvent(packageObjectId: string, suiRPC: string, _startCursor?: {
        txDigest: string;
        eventSeq: number;
    }, _limit?: number): Promise<{
        poolUpdatedEvents: PoolUpdatedEvent[];
        lastCursor: any;
    }>;
    static fetchTickUpdatedEvent(packageObjectId: string, suiRPC: string, filter: {
        token0: string;
        token1: string;
        feeAmount: FeeAmount;
    } | undefined, _startCursor?: {
        txDigest: string;
        eventSeq: number;
    }, _limit?: number): Promise<{
        tickUpdatedEvents: TickUpdatedEvent[];
        lastCursor: any;
    }>;
    static fetchGlobalSwapEvents(packageObjectId: string, suiRPC: string, _startCursor?: {
        txDigest: string;
        eventSeq: number;
    }, _limit?: number): Promise<{
        swapEvents: SwapEvent[];
        lastCursor: any;
    }>;
}
