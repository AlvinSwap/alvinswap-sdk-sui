import { FeeAmount } from './constants';
import { Pool, SuiCoin, Tick } from './entities';
import JSBI from 'jsbi';
import { BigintIsh } from '@uniswap/sdk-core';
export interface PoolConfig {
    id: string;
    admin: string;
    daoAddress: string;
    emergency: boolean;
}
export interface PoolIdsList {
    id: string;
    poolIds: string[];
}
export interface ProtocolFees {
    token0: BigintIsh;
    token1: BigintIsh;
}
export interface ObservationState {
    tickCumulative: number;
    secondsPerLiquidityCumulativeX128: BigintIsh;
    initialized: boolean;
}
export interface TickState {
    liquidityGross: JSBI;
    liquidityNet: JSBI;
    feeGrowthOutside0X128: BigintIsh;
    feeGrowthOutside1X128: BigintIsh;
    tickCumulativeOutside: number;
    secondsPerLiquidityOutsideX128: BigintIsh;
    secondsOutside: number;
    initialized: boolean;
    index: number;
}
export interface SimpleTickState {
    liquidityGross: string;
    liquidityNet: string;
    index: number;
}
export interface Slot0State {
    sqrtPriceX96: JSBI;
    tick: number;
    observationIndex: number;
    observationCardinality: number;
    observationCardinalityNext: number;
    feeProtocol: number;
    unlocked: boolean;
}
export interface PoolState {
    reserve0: BigintIsh;
    reserve1: BigintIsh;
    fee: number;
    tickSpacing: number;
    maxLiquidityPerTick: BigintIsh;
    feeGrowthGlobal0X128: BigintIsh;
    feeGrowthGlobal1X128: BigintIsh;
    protocolFees: ProtocolFees;
    liquidity: BigintIsh;
    slot0: Slot0State;
    poolAddress: string;
    tickHandle: string;
    tickBitmapHandle: string;
    positionHandle: string;
    observationHandle: string;
    initializedTicks: number[];
}
export interface PositionState {
    liquidity: BigintIsh;
    feeGrowthInside0LastX128: JSBI;
    feeGrowthInside1LastX128: JSBI;
    tokensOwned0: BigintIsh;
    tokensOwned1: BigintIsh;
}
export interface NFTLiquidityPosition {
    token0: string;
    token1: string;
    fee: FeeAmount;
    id: string;
    tickLower: number;
    tickUpper: number;
    liquidity: BigintIsh;
    feeGrowthInside0LastX128: JSBI;
    feeGrowthInside1LastX128: JSBI;
    tokensOwned0: BigintIsh;
    tokensOwned1: BigintIsh;
}
/**
 * Represents the Uniswap V3 SwapRouter, and has static methods for helping execute trades.
 */
export declare class StateFetcher {
    static getPoolResourceType(moduleAddress: string, token0Address: string, token1Address: string, feeAmount: FeeAmount): string;
    /**
     * Produces the on-chain method name to call and the hex encoded parameters to pass as arguments for a given trade.
     * @param trade to produce call parameters for
     * @param options options for the call parameters
     */
    static fetchPool(token0Address: string, token1Address: string, feeAmount: FeeAmount, packageId: string, suiRPC: string): Promise<{
        pool: Pool;
        poolState: PoolState;
    }>;
    static fetchCoinInfo(coinType: string, suiRPC: string): Promise<SuiCoin>;
    static fetchPoolLiquidity(token0Address: string, token1Address: string, feeAmount: FeeAmount, packageId: string, suiRPC: string): Promise<string>;
    static fetchSimplePoolInfo(poolObjectId: string, suiRPC: string): Promise<{
        reserve0: string;
        reserve1: string;
        liquidity: string;
    }>;
    static fetchNFTPosition(objectId: string, suiRPC: string): Promise<NFTLiquidityPosition>;
    static fetchNFTPositions(owner: string, packageId: string, suiRPC: string): Promise<NFTLiquidityPosition[]>;
    static sortTicks(tickStates: TickState[]): TickState[];
    static sortSimpleTicks(tickStates: SimpleTickState[]): SimpleTickState[];
    static toTicks(tickStates: TickState[]): Tick[];
    static simpleStatetoTicks(tickStates: SimpleTickState[]): Tick[];
}
