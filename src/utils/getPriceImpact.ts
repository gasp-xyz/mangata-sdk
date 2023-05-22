import Big from "big.js";
import { BN } from "@polkadot/util";
import { BIG_HUNDRED } from "./bigConstants";
import { BN_TEN_THOUSAND } from "./bnConstants";
import { toBN } from "./bnUtility";
import { isInputValid } from "./isInputValid";
import { toFixed } from "./toFixed";
import { PriceImpact } from "../types/utility";

export const getPriceImpact = (args: PriceImpact) => {
  const { poolBalance, poolDecimals, firstTokenAmount, secondTokenAmount } =
    args;
  if (
    !poolBalance ||
    !poolDecimals ||
    !isInputValid(firstTokenAmount) ||
    !isInputValid(secondTokenAmount)
  ) {
    return;
  }

  const firstReserveBefore = poolBalance.firstTokenBalance;
  const secondReserveBefore = poolBalance.secondTokenBalance;

  const soldAmount = toBN(firstTokenAmount, poolDecimals.firstTokenDecimals);
  const boughtAmount = toBN(
    secondTokenAmount,
    poolDecimals.secondTokenDecimals
  );

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
