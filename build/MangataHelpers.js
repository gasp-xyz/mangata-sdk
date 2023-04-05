/* eslint-disable no-console */
import { Keyring } from "@polkadot/api";
import { v4 as uuidv4 } from "uuid";
import Big from "big.js";
import { toBN } from "./utils/BNutility";
import { toFixed } from "./utils/toFixed";
import { isInputValid } from "./utils/isInputValid";
import { BIG_HUNDRED } from "./utils/bigConstants";
import { BN_TEN_THOUSAND } from "./utils/bnConstants";
/**
 * @class MangataHelpers
 * @author Mangata Finance
 */
export class MangataHelpers {
    static createKeyring(type) {
        return new Keyring({ type });
    }
    static createKeyPairFromName(keyring, name = "") {
        const userName = name ? name : "//testUser_" + uuidv4();
        const account = keyring.createFromUri(userName);
        keyring.addPair(account);
        return account;
    }
    static getPriceImpact(poolBalance, poolDecimals, firstTokenAmount, secondTokenAmount) {
        if (!poolBalance ||
            !poolDecimals ||
            !isInputValid(firstTokenAmount) ||
            !isInputValid(secondTokenAmount)) {
            return;
        }
        const firstReserveBefore = poolBalance.firstTokenBalance;
        const secondReserveBefore = poolBalance.secondTokenBalance;
        const soldAmount = toBN(firstTokenAmount, poolDecimals.firstTokenDecimals);
        const boughtAmount = toBN(secondTokenAmount, poolDecimals.secondTokenDecimals);
        if (boughtAmount.gte(secondReserveBefore))
            return "";
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
    }
}
