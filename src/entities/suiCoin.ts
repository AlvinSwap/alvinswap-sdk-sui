import invariant from 'tiny-invariant'
/**
 * Represents an ERC20 token with a unique address and some metadata.
 */
export class SuiCoin {
  /**
   * The contract address on the chain on which this token lives
   */
  public readonly address: string

  /**
   * The decimals used in representing currency amounts
   */
   public readonly decimals: number
   /**
    * The symbol of the currency, i.e. a short textual non-unique identifier
    */
   public readonly symbol?: string
   /**
    * The name of the currency, i.e. a descriptive textual non-unique identifier
    */
   public readonly name?: string

  /**
   *
   * @param address The contract address on the chain on which this token lives
   * @param decimals {@link BaseCurrency#decimals}
   * @param symbol {@link BaseCurrency#symbol}
   * @param name {@link BaseCurrency#name}
   */
  public constructor(
    address: string,
    decimals: number,
    symbol?: string,
    name?: string
  ) {
    this.address = address.replace(' ', '')
    this.decimals = decimals
    this.symbol = symbol
    this.name = name
  }

  /**
   * Returns true if the two tokens are equivalent, i.e. have the same chainId and address.
   * @param other other token to compare
   */
  public equals(other: SuiCoin): boolean {
    return this.address === other.address
  }

  /**
   * Returns true if the address of this token sorts before the address of the other token
   * @param other other token to compare
   * @throws if the tokens have the same address
   * @throws if the tokens are on different chains
   */
  public sortsBefore(other: SuiCoin): boolean {
    invariant(this.address !== other.address, 'ADDRESSES')
    if (this.address.length < other.address.length) {
        return true
    } else if (this.address.length > other.address.length) {
        return false
    }
    return this.address < other.address
  }

  /**
   * Return this token, which does not need to be wrapped
   */
  public get wrapped(): SuiCoin {
    return this
  }
}