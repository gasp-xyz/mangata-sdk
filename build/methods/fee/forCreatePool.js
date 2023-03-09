import { BN } from "@polkadot/util";
import { fromBN } from "../../utils/bnUtility";
export const forCreatePool = async (instancePromise, args) => {
    const api = await instancePromise;
    const { firstTokenId, firstTokenAmount, secondTokenId, secondTokenAmount, account } = args;
    const dispatchInfo = await api.tx.xyk
        .createPool(firstTokenId, firstTokenAmount, secondTokenId, secondTokenAmount)
        .paymentInfo(account);
    return fromBN(new BN(dispatchInfo.partialFee.toString()));
};
