import { BN } from "@polkadot/util";

import { BN_DIV_NUMERATOR_MULTIPLIER, BN_ZERO } from "./bnConstants";

const getGcd = (a: BN, b: BN): BN => {
  return b.gt(BN_ZERO) ? getGcd(b, a.mod(b)) : a;
};

const calculateRatio = (numerator: BN, denominator: BN) => {
  const gcd = getGcd(numerator, denominator);

  if (gcd.isZero()) return [BN_ZERO, BN_ZERO];

  const gcd1 = numerator.div(gcd);
  const gcd2 = denominator.div(gcd);

  return [gcd1, gcd2];
};

export const getRatio = (left: BN, right: BN) => {
  if (left.isZero() && right.isZero()) return BN_ZERO;
  const ratios = calculateRatio(left, right);

  const res = ratios[1].mul(BN_DIV_NUMERATOR_MULTIPLIER).div(ratios[0]);

  return res;
};
