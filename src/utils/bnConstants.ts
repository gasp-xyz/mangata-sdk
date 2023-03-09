import { BN } from "@polkadot/util";

export const BN_ZERO = new BN("0");
export const BN_ONE = new BN("1");
export const BN_TEN = new BN("10");
export const BN_HUNDRED = new BN("100");
export const BN_THOUSAND = new BN("1000");
export const BN_TEN_THOUSAND = new BN("10000");
export const BN_HUNDRED_THOUSAND = new BN("100000");
export const BN_MILLION = new BN("1000000");
export const BN_TEN_MILLIONS = new BN("10000000");
export const BN_HUNDRED_MILLIONS = new BN("100000000");
export const BN_BILLION = new BN("1000000000");
export const BN_TEN_BILLIONS = new BN("10000000000");
export const BN_HUNDRED_BILLIONS = new BN("100000000000");
export const BN_TRILLION = new BN("1000000000000");

export const BN_DIV_NUMERATOR_MULTIPLIER_DECIMALS = 18;
export const BN_DIV_NUMERATOR_MULTIPLIER = new BN("10").pow(
  new BN(BN_DIV_NUMERATOR_MULTIPLIER_DECIMALS)
);
