import JSBI from 'jsbi';
export declare abstract class PositionLibrary {
    /**
     * Cannot be constructed.
     */
    private constructor();
    static getTokensOwed(feeGrowthInside0LastX128: JSBI, feeGrowthInside1LastX128: JSBI, liquidity: JSBI, feeGrowthInside0X128: JSBI, feeGrowthInside1X128: JSBI): JSBI[];
    static getTokensOwed2(feeGrowthInside0LastX128: string, feeGrowthInside1LastX128: string, liquidity: string, feeGrowthInside0X128: string, feeGrowthInside1X128: string): JSBI[];
}
