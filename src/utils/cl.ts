import { BigintIsh } from '@uniswap/sdk-core'
import JSBI from 'jsbi'
import invariant from 'tiny-invariant'

export function toUTF8Array(str: string): any {
  var utf8 = []
  for (var i = 0; i < str.length; i++) {
    var charcode = str.charCodeAt(i)
    if (charcode < 0x80) utf8.push(charcode)
    else if (charcode < 0x800) {
      utf8.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f))
    } else if (charcode < 0xd800 || charcode >= 0xe000) {
      utf8.push(0xe0 | (charcode >> 12), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f))
    }
    // surrogate pair
    else {
      i++
      // UTF-16 encodes 0x10000-0x10FFFF by
      // subtracting 0x10000 and splitting the
      // 20 bits of 0x0-0xFFFFF into two halves
      charcode = 0x10000 + (((charcode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff))
      utf8.push(
        0xf0 | (charcode >> 18),
        0x80 | ((charcode >> 12) & 0x3f),
        0x80 | ((charcode >> 6) & 0x3f),
        0x80 | (charcode & 0x3f)
      )
    }
  }
  return utf8
}

export function hexToBN(hex: string): string {
  return hex.replace('0x', '')
}

export function validateAndParseAddress(address: string): string {
  let result = ''
  try {
    if (address.match(/^(0x)?[0-9a-fA-F]{64}$/)) {
      if (address.substring(0, 2) !== '0x') {
        result = '0x' + address
      } else {
        result = address
      }
    }
  } catch (error) {
    throw new Error(`${address} is not a valid address.`)
  }

  return result
}

export function toHex(bigintIsh: BigintIsh) {
  const bigInt = JSBI.BigInt(bigintIsh)
  let hex = bigInt.toString(16)
  if (hex.length % 2 !== 0) {
    hex = `0${hex}`
  }
  return `0x${hex}`
}

export function bnToBigInt(sqrtPricex96: string): BigintIsh {
  return JSBI.BigInt(sqrtPricex96)
}

export function i64ToNumber(v: { bits: string }): number {
  const b = JSBI.bitwiseAnd(JSBI.BigInt(v.bits), JSBI.BigInt('9223372036854775808'))
  if (JSBI.equal(b, JSBI.BigInt(0))) {
    return parseInt(v.bits)
  }
  return -JSBI.toNumber(JSBI.subtract(JSBI.BigInt('18446744073709551616'), JSBI.BigInt(v.bits)))
}

export function i128ToBigInt(v: { bits: string }): JSBI {
  const u128WithFirstBitSet = JSBI.leftShift(JSBI.BigInt(1), JSBI.BigInt(127))
  const maxU128Plus1 = JSBI.leftShift(JSBI.BigInt(1), JSBI.BigInt(128))
  if (JSBI.greaterThan(JSBI.BigInt(v.bits), u128WithFirstBitSet)) {
    // negative
    const abs = JSBI.subtract(maxU128Plus1, JSBI.BigInt(v.bits)).toString()
    return JSBI.BigInt(`-${abs}`)
  }
  return JSBI.BigInt(v.bits)
}

export function i256ToBigInt(v: { bits: string }): JSBI {
  const u256WithFirstBitSet = JSBI.leftShift(JSBI.BigInt(1), JSBI.BigInt(255))
  const bi = bnToBigInt(v.bits)
  const maxU256Plus1 = JSBI.leftShift(JSBI.BigInt(1), JSBI.BigInt(256))
  if (JSBI.greaterThan(JSBI.BigInt(bi), u256WithFirstBitSet)) {
    // negative
    const abs = JSBI.subtract(maxU256Plus1, JSBI.BigInt(bi)).toString()
    return JSBI.BigInt(`-${abs}`)
  }
  return JSBI.BigInt(bi)
}


export function decimalToHexString(n: number): string {
  let ret = ''
  if (n < 0) {
    ret = (n >>> 0).toString(16)
    while (ret.length < 16) {
      ret = `F${ret}`
    }
  } else {
    ret = n.toString(16)
    while (ret.length < 16) {
      ret = `0${ret}`
    }
  }
  return ret
}

export async function sleep(time: number): Promise<any> {
  return new Promise(resolve => setTimeout(resolve, time))
}
export async function tryCallWithTrial<T>(func: () => Promise<T | undefined>, trial = 10, waitTime = 2000): Promise<T | undefined> {
  let initial = trial
  while (trial > 0) {
    try {
      let ret = await func()
      return ret
    } catch (e) {
      console.warn((e as any).toString())
      await sleep(waitTime)
    }
    trial--
    if (initial - trial > 5) {
      await sleep(waitTime)
    }
  }
  return undefined
}

export function typeInfoToQualifiedName(tInfo: any): string {
  let moduleName = Buffer.from(tInfo).toString("utf8")
  return `0x${moduleName}`
}

export function sortTypes(a: string, b: string): { token0: string; token1: string } {
  if (sortBefore(a, b)) {
    return { token0: a, token1: b }
  } else {
    return { token0: b, token1: a }
  }
}

export function sortBefore(a: string, b: string): boolean {
  invariant(a !== b, 'ADDRESSES')
  if (a.includes('::')) {
    a = toFullyQualifiedName(a)
  }
  if (b.includes('::')) {
    b = toFullyQualifiedName(b)
  }
  if (a.length < b.length) {
    return true
  } else if (a.length > b.length) {
    return false
  }
  return a < b
}

export function toFullyQualifiedName(ct: string): string {
  return ct
}
export interface SlippageParams {
  numerator: string
  denominator: string
}

const VECTOR_REGEX = /^vector<(.+)>$/;
const STRUCT_REGEX = /^([^:]+)::([^:]+)::(.+)/;
const STRUCT_TYPE_TAG_REGEX = /^[^<]+<(.+)>$/;

export type StructTag = {
  address: string;
  module: string;
  name: string;
  typeParams: TypeTag[];
};

/**
 * Sui TypeTag object. A decoupled `0x...::module::Type<???>` parameter.
 */
export type TypeTag =
  | { bool: null }
  | { u8: null }
  | { u64: null }
  | { u128: null }
  | { address: null }
  | { signer: null }
  | { vector: TypeTag }
  | { struct: StructTag }
  | { u16: null }
  | { u32: null }
  | { u256: null };

export class TypeTagSerializer {
  parseFromStr(str: string): TypeTag {
    if (str === 'address') {
      return { address: null };
    } else if (str === 'bool') {
      return { bool: null };
    } else if (str === 'u8') {
      return { u8: null };
    } else if (str === 'u16') {
      return { u16: null };
    } else if (str === 'u32') {
      return { u32: null };
    } else if (str === 'u64') {
      return { u64: null };
    } else if (str === 'u128') {
      return { u128: null };
    } else if (str === 'u256') {
      return { u256: null };
    } else if (str === 'signer') {
      return { signer: null };
    }
    const vectorMatch = str.match(VECTOR_REGEX);
    if (vectorMatch) {
      return { vector: this.parseFromStr(vectorMatch[1]) };
    }

    const structMatch = str.match(STRUCT_REGEX);
    if (structMatch) {
      try {
        return {
          struct: {
            address: structMatch[1],
            module: structMatch[2],
            name: structMatch[3].match(/^([^<]+)/)![1],
            typeParams: this.parseStructTypeTag(structMatch[3]),
          },
        };
      } catch (e) {
        throw new Error(`Encounter error parsing type args for ${str}`);
      }
    }

    throw new Error(
      `Encounter unexpected token when parsing type args for ${str}`
    );
  }

  parseStructTypeTag(str: string): TypeTag[] {
    const typeTagsMatch = str.match(STRUCT_TYPE_TAG_REGEX);
    if (!typeTagsMatch) {
      return [];
    }
    // TODO: This will fail if the struct has nested type args with commas. Need
    // to implement proper parsing for this case
    const typeTags = typeTagsMatch[1].split(',');
    return typeTags.map((tag) => this.parseFromStr(tag));
  }
}

export function parseTypeFromStr(t: string): TypeTag {
  return new TypeTagSerializer().parseFromStr(t)
}

export function structTagToString(st_: TypeTag): string {
  if (Object.keys(st_).includes('struct')) {
    const st = (st_ as any).struct as StructTag
    let ret = `${st.address}::${st.module}::${st.name}`
    if (st.typeParams.length > 0) {
      const joined = st.typeParams.join(',')
      ret = `${ret}<${joined}>`
    }
    return ret
  }
  return ''
}