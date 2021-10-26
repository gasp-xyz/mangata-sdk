import BN from 'bn.js'
import Big from 'big.js'

const BIG_10 = Big('10')
const DEFAULT_ASSET_DECIMALS = 18
const DEFAULT_DECIMAL_MULTIPLIER = BIG_10.pow(DEFAULT_ASSET_DECIMALS)

export const toBN = (n: string, decimals?: number): BN => {
  if (!n) return new BN('0')

  try {
    const inputNumber = Big(n)
    const decimalMultiplier =
      !decimals || decimals === DEFAULT_ASSET_DECIMALS
        ? DEFAULT_DECIMAL_MULTIPLIER
        : BIG_10.pow(decimals)
    const res = inputNumber.mul(decimalMultiplier)
    const resStr = res.toString()

    return new BN(resStr)
  } catch (err) {
    console.error('Could not convert to BN:', err)

    return new BN('0')
  }
}
