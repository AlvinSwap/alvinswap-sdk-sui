/**
 * The default factory enabled fee amounts, denominated in hundredths of bips.
 */
export enum FeeAmount {
  LOWEST = 100,
  LOW = 500,
  MEDIUM = 3000,
  HIGH = 10000
}

/**
 * The default factory tick spacings by fee amount.
 */
export const TICK_SPACINGS: { [amount in FeeAmount]: number } = {
  [FeeAmount.LOWEST]: 1,
  [FeeAmount.LOW]: 10,
  [FeeAmount.MEDIUM]: 60,
  [FeeAmount.HIGH]: 200
}

var moduleAddress: string = "";

export function setModuleAddress(addr: string) {
  moduleAddress = addr;
}

export function getModuleAddress(): string {
  return moduleAddress
}

export function getFeeType(feeAmount: FeeAmount | number): string {
  if (feeAmount == FeeAmount.LOWEST) {
    return `::fee_spacing::Fee100`
  } else if (feeAmount == FeeAmount.LOW) {
    return `::fee_spacing::Fee500`
  } else if (feeAmount == FeeAmount.MEDIUM) {
    return `::fee_spacing::Fee3000`
  } else if (feeAmount == FeeAmount.HIGH) {
    return `::fee_spacing::Fee10000`
  }

  throw "invalid fee amount"
}

export function feeTypeToFeeAmount(feeType: string): FeeAmount {
  if (feeType.endsWith(getFeeType(FeeAmount.LOWEST))) {
    return FeeAmount.LOWEST
  }

  if (feeType.endsWith(getFeeType(FeeAmount.LOW))) {
    return FeeAmount.LOW
  }

  if (feeType.endsWith(getFeeType(FeeAmount.MEDIUM))) {
    return FeeAmount.MEDIUM
  }

  if (feeType.endsWith(getFeeType(FeeAmount.HIGH))) {
    return FeeAmount.HIGH
  }

  throw "invalid fee type"
}
