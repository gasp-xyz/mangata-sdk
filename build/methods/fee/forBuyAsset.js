import { BN } from "@polkadot/util";
import { fromBN } from "../../utils/bnUtility";
export const forBuyAsset = async (instancePromise, args) => {
    const api = await instancePromise;
    const { soldTokenId, boughtTokenId, amount, maxAmountIn, account } = args;
    const dispatchInfo = await api.tx.xyk
        .buyAsset(soldTokenId, boughtTokenId, amount, maxAmountIn)
        .paymentInfo(account);
    return fromBN(new BN(dispatchInfo.partialFee.toString()));
};
