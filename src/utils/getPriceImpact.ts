import Big from "big.js";
import { BN } from "@polkadot/util";
import { BIG_HUNDRED } from "./bigConstants";
import { BN_TEN_THOUSAND } from "./bnConstants";
import { toBN } from "./bnUtility";
import { isInputValid } from "./isInputValid";
import { toFixed } from "./toFixed";
import { PriceImpact } from "../types/utility";

export const getPriceImpact = (args: PriceImpact) => {
  const { poolReserves, decimals, tokenAmounts } = args;
  if (
    !poolReserves ||
    !decimals ||
    !isInputValid(tokenAmounts[0]) ||
    !isInputValid(tokenAmounts[1])
  ) {
    return;
  }

  const firstReserveBefore = poolReserves[0];
  const secondReserveBefore = poolReserves[1];

  const soldAmount = toBN(tokenAmounts[0].toString(), decimals[0]);
  const boughtAmount = toBN(tokenAmounts[1].toString(), decimals[1]);

  if (boughtAmount.gte(secondReserveBefore)) return "";

  const numerator = firstReserveBefore
    .add(soldAmount)
    .mul(BN_TEN_THOUSAND)
    .mul(secondReserveBefore);
  const denominator = secondReserveBefore
    .sub(boughtAmount)
    .mul(firstReserveBefore);

  const res = numerator.div(denominator).sub(BN_TEN_THOUSAND);

  const resStr = res.toString();
  const resBig = Big(resStr);
  const resFormatted = toFixed(resBig.div(BIG_HUNDRED).toString(), 2);

  return resFormatted;
};
