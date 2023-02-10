/**
 * The default factory enabled fee amounts, denominated in hundredths of bips.
 */
export declare enum FeeAmount {
    LOWEST = 100,
    LOW = 500,
    MEDIUM = 3000,
    HIGH = 10000
}
/**
 * The default factory tick spacings by fee amount.
 */
export declare const TICK_SPACINGS: {
    [amount in FeeAmount]: number;
};
export declare function setModuleAddress(addr: string): void;
export declare function getModuleAddress(): string;
export declare function getFeeType(feeAmount: FeeAmount | number): string;
export declare function feeTypeToFeeAmount(feeType: string): FeeAmount;
