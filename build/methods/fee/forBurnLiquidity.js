import { BN } from "@polkadot/util";
import { fromBN } from "../../utils/bnUtility";
export const forBurnLiquidity = async (instancePromise, args) => {
    const api = await instancePromise;
    const { amount, firstTokenId, secondTokenId, account } = args;
    const dispatchInfo = await api.tx.xyk
        .burnLiquidity(firstTokenId, secondTokenId, amount)
        .paymentInfo(account);
    return fromBN(new BN(dispatchInfo.partialFee.toString()));
};
