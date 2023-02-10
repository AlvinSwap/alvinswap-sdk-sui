import { Percent } from '@uniswap/sdk-core'
import { toHex } from './utils/cl'

export interface FeeOptions {
  /**
   * The percent of the output that will be taken as a fee.
   */
  fee: Percent

  /**
   * The recipient of the fee.
   */
  recipient: string
}

export abstract class Payments {
  /**
   * Cannot be constructed.
   */
  private constructor() {}

  public static encodeFeeBips(fee: Percent): string {
    return toHex(fee.multiply(10_000).quotient)
  }
}
