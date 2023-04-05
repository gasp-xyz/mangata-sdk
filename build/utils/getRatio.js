import { BN_DIV_NUMERATOR_MULTIPLIER, BN_ZERO } from "./bnConstants";
const getGcd = (a, b) => {
    return b.gt(BN_ZERO) ? getGcd(b, a.mod(b)) : a;
};
const calculateRatio = (numerator, denominator) => {
    const gcd = getGcd(numerator, denominator);
    if (gcd.isZero())
        return [BN_ZERO, BN_ZERO];
    const gcd1 = numerator.div(gcd);
    const gcd2 = denominator.div(gcd);
    return [gcd1, gcd2];
};
export const getRatio = (left, right) => {
    const ratios = calculateRatio(left, right);
    const res = ratios[1].mul(BN_DIV_NUMERATOR_MULTIPLIER).div(ratios[0]);
    return res;
};
