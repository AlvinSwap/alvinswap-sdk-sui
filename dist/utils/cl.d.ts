import { BigintIsh } from '@uniswap/sdk-core';
import JSBI from 'jsbi';
export declare function toUTF8Array(str: string): any;
export declare function hexToBN(hex: string): string;
export declare function validateAndParseAddress(address: string): string;
export declare function toHex(bigintIsh: BigintIsh): string;
export declare function bnToBigInt(sqrtPricex96: string): BigintIsh;
export declare function i64ToNumber(v: {
    bits: string;
}): number;
export declare function i128ToBigInt(v: {
    bits: string;
}): JSBI;
export declare function i256ToBigInt(v: {
    bits: string;
}): JSBI;
export declare function decimalToHexString(n: number): string;
export declare function sleep(time: number): Promise<any>;
export declare function tryCallWithTrial<T>(func: () => Promise<T | undefined>, trial?: number, waitTime?: number): Promise<T | undefined>;
export declare function typeInfoToQualifiedName(tInfo: any): string;
export declare function sortTypes(a: string, b: string): {
    token0: string;
    token1: string;
};
export declare function sortBefore(a: string, b: string): boolean;
export declare function toFullyQualifiedName(ct: string): string;
export interface SlippageParams {
    numerator: string;
    denominator: string;
}
export declare type StructTag = {
    address: string;
    module: string;
    name: string;
    typeParams: TypeTag[];
};
/**
 * Sui TypeTag object. A decoupled `0x...::module::Type<???>` parameter.
 */
export declare type TypeTag = {
    bool: null;
} | {
    u8: null;
} | {
    u64: null;
} | {
    u128: null;
} | {
    address: null;
} | {
    signer: null;
} | {
    vector: TypeTag;
} | {
    struct: StructTag;
} | {
    u16: null;
} | {
    u32: null;
} | {
    u256: null;
};
export declare class TypeTagSerializer {
    parseFromStr(str: string): TypeTag;
    parseStructTypeTag(str: string): TypeTag[];
}
export declare function parseTypeFromStr(t: string): TypeTag;
export declare function structTagToString(st_: TypeTag): string;
