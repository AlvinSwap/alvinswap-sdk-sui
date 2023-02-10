import { SuiCoin } from './suiCoin';
import { Pool } from './pool';
import { Price } from './price';
/**
 * Represents a list of pools through which a swap can occur
 * @template TInput The input token
 * @template TOutput The output token
 */
export declare class Route<TInput extends SuiCoin, TOutput extends SuiCoin> {
    readonly pools: Pool[];
    readonly tokenPath: SuiCoin[];
    readonly input: TInput;
    readonly output: TOutput;
    private _midPrice;
    /**
     * Creates an instance of route.
     * @param pools An array of `Pool` objects, ordered by the route the swap will take
     * @param input The input token
     * @param output The output token
     */
    constructor(pools: Pool[], input: TInput, output: TOutput);
    /**
     * Returns the mid price of the route
     */
    get midPrice(): Price<TInput, TOutput>;
}
