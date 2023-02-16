import { BigintIsh, TradeType } from '@uniswap/sdk-core';
import { Trade } from './entities/trade';
import { FeeOptions } from './payments';
import { SlippageParams } from './utils/cl';
import { SuiCoin, Pool } from './entities';
import { SimpleTickState } from './stateFetcher';
import { UnserializedSignableTransaction } from '@mysten/sui.js';
/**
 * Options for producing the arguments to send calls to the router.
 */
export interface SwapOptions {
    /**
     * How much the execution price is allowed to move unfavorably from the trade execution price.
     */
    slippageTolerance: SlippageParams;
    /**
     * The account that should receive the output.
     */
    recipient: string;
    /**
     * When the transaction expires, in epoch seconds.
     */
    deadline: BigintIsh;
    /**
     * The optional price limit for the trade.
     */
    sqrtPriceLimitX96?: BigintIsh;
    /**
     * Optional information for taking a fee on output.
     */
    fee?: FeeOptions;
}
export interface PoolWithTicks {
    pool: Pool;
    ticks: SimpleTickState[];
}
export interface Quote {
    trade: Trade<SuiCoin, SuiCoin, TradeType>;
    isBest: boolean;
}
/**
 * Represents the Uniswap V3 SwapRouter, and has static methods for helping execute trades.
 */
export declare class SwapRouter {
    moduleAddress: string;
    swapRouter: string;
    poolConfig: string;
    constructor(addr: string, swapRouter: string, poolConfig: string);
    getModuleAddress(): string;
    getSwapRouterAddress(): string;
    getQuotes(tokenIn: SuiCoin, tokenOut: SuiCoin, swapType: TradeType, amount: string, poolsWithTicks: PoolWithTicks[]): Promise<Quote[]>;
    /**
     * Produces the on-chain method name to call and the hex encoded parameters to pass as arguments for a given trade.
     * @param trade to produce call parameters for
     * @param options options for the call parameters
     */
    createSwapTx(coinStores: any, coinIns: string[], trade: Trade<SuiCoin, SuiCoin, TradeType>, options: SwapOptions, gasBudget: number): UnserializedSignableTransaction;
}
