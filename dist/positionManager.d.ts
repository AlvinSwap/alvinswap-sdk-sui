import { BigintIsh, CurrencyAmount, Currency, NativeCurrency } from '@uniswap/sdk-core';
import { Position } from './entities/position';
import { FeeAmount } from './constants';
import { SuiCoin } from './entities';
import { SlippageParams } from './utils';
import { UnserializedSignableTransaction } from '@mysten/sui.js';
export interface MintSpecificOptions {
    /**
     * The account that should receive the minted NFT.
     */
    recipient: string;
    /**
     * Creates pool if not initialized before mint.
     */
    createPool?: boolean;
}
export interface IncreaseSpecificOptions {
    /**
     * Indicates the ID of the position to increase liquidity for.
     */
    tokenId: BigintIsh;
}
/**
 * Options for producing the calldata to add liquidity.
 */
export interface CommonAddLiquidityOptions {
    /**
     * How much the pool price is allowed to move.
     */
    slippageTolerance: SlippageParams;
    /**
     * When the transaction expires, in epoch seconds.
     */
    deadline: BigintIsh;
    /**
     * Whether to spend ether. If true, one of the pool tokens must be WETH, by default false
     */
    useNative?: NativeCurrency;
}
export declare type MintOptions = CommonAddLiquidityOptions & MintSpecificOptions;
export declare type IncreaseOptions = CommonAddLiquidityOptions & IncreaseSpecificOptions;
export declare type AddLiquidityOptions = MintOptions | IncreaseOptions;
export interface SafeTransferOptions {
    /**
     * The account sending the NFT.
     */
    sender: string;
    /**
     * The account that should receive the NFT.
     */
    recipient: string;
    /**
     * The id of the token being sent.
     */
    tokenId: BigintIsh;
    /**
     * The optional parameter that passes data to the `onERC721Received` call for the staker
     */
    data?: string;
}
export interface CollectOptions {
    /**
     * Indicates the ID of the position to collect for.
     */
    tokenId: BigintIsh;
    /**
     * Expected value of tokensOwed0, including as-of-yet-unaccounted-for fees/liquidity value to be burned
     */
    expectedCurrencyOwed0: CurrencyAmount<Currency>;
    /**
     * Expected value of tokensOwed1, including as-of-yet-unaccounted-for fees/liquidity value to be burned
     */
    expectedCurrencyOwed1: CurrencyAmount<Currency>;
    /**
     * The account that should receive the tokens.
     */
    recipient: string;
}
export interface NFTPermitOptions {
    v: 0 | 1 | 27 | 28;
    r: string;
    s: string;
    deadline: BigintIsh;
    spender: string;
}
/**
 * Options for producing the calldata to exit a position.
 */
export interface RemoveLiquidityOptions {
    /**
     * The ID of the token to exit
     */
    tokenId: BigintIsh;
    /**
     * The percentage of position liquidity to exit.
     */
    liquidityPercentage: SlippageParams;
    /**
     * How much the pool price is allowed to move.
     */
    slippageTolerance: SlippageParams;
    /**
     * When the transaction expires, in epoch seconds.
     */
    deadline: BigintIsh;
    /**
     * Whether the NFT should be burned if the entire position is being exited, by default false.
     */
    burnToken?: boolean;
    /**
     * The optional permit of the token ID being exited, in case the exit transaction is being sent by an account that does not own the NFT
     */
    permit?: NFTPermitOptions;
    /**
     * Parameters to be passed on to collect
     */
    collectOptions: Omit<CollectOptions, 'tokenId'>;
}
export declare class PositionManager {
    moduleAddress: string;
    poolConfig: string;
    poolIdsList: string;
    sharedPositionOwnership: string;
    /**
     * Cannot be constructed.
     */
    constructor(moduleId: string, poolConfig: string, poolIdsList: string, sharedPositionOwnership: string);
    getModuleAddress(): string;
    makeCreatePoolTxWithAmounts(token0: string, token1: string, coin0s: string[], coin1s: string[], amount0: BigintIsh, amount1: BigintIsh, useFullPrecision: boolean, feeAmount: FeeAmount, sqrtPricex96: string, sqrtMinPricex96: string, sqrtMaxPricex96: string, deadline: number, recipient: string, suiRPC: string, gasBudget: number): Promise<UnserializedSignableTransaction>;
    createPosition(coin0: SuiCoin, coin1: SuiCoin, amount0: BigintIsh, amount1: BigintIsh, useFullPrecision: boolean, feeAmount: FeeAmount, sqrtPricex96: string, sqrtMinPricex96: string, sqrtMaxPricex96: string): Position;
    makeCreatePoolTx(coin0s: string[], coin1s: string[], position: Position, deadline: number, recipient: string, gasBudget: number): Promise<UnserializedSignableTransaction>;
    makeMintTx(coin0s: string[], coin1s: string[], position: Position, slippageTolerance: SlippageParams, recipient: string, deadline: number, gasBudget: number): Promise<UnserializedSignableTransaction>;
    makeIncreaseLiquidityTx(coin0s: string[], coin1s: string[], position: Position, positionObjectId: string, slippage: SlippageParams, deadline: number, gasBudget: number): Promise<UnserializedSignableTransaction>;
    makeRemoveLiquidityTx(position: Position, positionObjectId: string, slippage: SlippageParams, deadline: number, collectCoin: boolean, gasBudget: number): Promise<UnserializedSignableTransaction>;
}
