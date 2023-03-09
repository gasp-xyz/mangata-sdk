import { BN } from "@polkadot/util";
import { fromBN } from "../../utils/bnUtility";
export const forSellAsset = async (instancePromise, args) => {
    const api = await instancePromise;
    const { soldTokenId, boughtTokenId, amount, minAmountOut, account } = args;
    const dispatchInfo = await api.tx.xyk
        .sellAsset(soldTokenId, boughtTokenId, amount, minAmountOut)
        .paymentInfo(account);
    return fromBN(new BN(dispatchInfo.partialFee.toString()));
};
