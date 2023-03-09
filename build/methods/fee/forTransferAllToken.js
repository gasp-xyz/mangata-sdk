import { BN } from "@polkadot/util";
import { fromBN } from "../../utils/bnUtility";
export const forTransferAllToken = async (instancePromise, args) => {
    const api = await instancePromise;
    const { account, address, tokenId } = args;
    const dispatchInfo = await api.tx.tokens
        .transferAll(address, tokenId, true)
        .paymentInfo(account);
    return fromBN(new BN(dispatchInfo.partialFee.toString()));
};
