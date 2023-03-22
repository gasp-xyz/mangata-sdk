import { BN } from "@polkadot/util";
import Big from "big.js";

import { BIG_TEN } from "./bigConstants";
import { BN_ZERO } from "./bnConstants";

Big.PE = 256; // The positive exponent value at and above which toString returns exponential notation.
Big.NE = -256; // The negative exponent value at and below which toString returns exponential notation.
Big.DP = 40; // The maximum number of decimal places of the results of operations involving division.
Big.RM = Big.roundUp; // Rounding mode

const DEFAULT_TOKEN_DECIMALS = 18;
const DEFAULT_DECIMAL_MULTIPLIER = BIG_TEN.pow(DEFAULT_TOKEN_DECIMALS);

export const toBN = (value: string, exponent?: number): BN => {
  if (!value) return BN_ZERO;

  try {
    const inputNumber = Big(value);
    const decimalMultiplier =
      !exponent || exponent === DEFAULT_TOKEN_DECIMALS
        ? DEFAULT_DECIMAL_MULTIPLIER
        : BIG_TEN.pow(exponent);

    const res = inputNumber.mul(decimalMultiplier);
    const resStr = res.toString();

    if (/\D/gm.test(resStr)) return BN_ZERO;

    return new BN(resStr);
  } catch (err) {
    return BN_ZERO;
  }
};

export const fromBN = (value: BN, exponent?: number): string => {
  if (!value) return "0";

  try {
    const inputNumber = Big(value.toString());
    const decimalMultiplier =
      !exponent || exponent === DEFAULT_TOKEN_DECIMALS
        ? DEFAULT_DECIMAL_MULTIPLIER
        : BIG_TEN.pow(exponent);
    const res = inputNumber.div(decimalMultiplier);
    const resStr = res.toString();

    return resStr;
  } catch (err) {
    return "0";
  }
};
