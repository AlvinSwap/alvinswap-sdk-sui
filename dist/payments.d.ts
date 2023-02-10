import { Percent } from '@uniswap/sdk-core';
export interface FeeOptions {
    /**
     * The percent of the output that will be taken as a fee.
     */
    fee: Percent;
    /**
     * The recipient of the fee.
     */
    recipient: string;
}
export declare abstract class Payments {
    /**
     * Cannot be constructed.
     */
    private constructor();
    static encodeFeeBips(fee: Percent): string;
}
