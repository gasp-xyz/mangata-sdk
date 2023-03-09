import { BN } from "@polkadot/util";
import { fromBN } from "../../utils/bnUtility";
export const forTransferToken = async (instancePromise, args) => {
    const api = await instancePromise;
    const { address, tokenId, amount, account } = args;
    const dispatchInfo = await api.tx.tokens
        .transfer(address, tokenId, amount)
        .paymentInfo(account);
    return fromBN(new BN(dispatchInfo.partialFee.toString()));
};
