import { BN } from "@polkadot/util";
import { fromBN } from "../../utils/bnUtility";
export const forMintLiquidity = async (instancePromise, args) => {
    const api = await instancePromise;
    const { firstTokenId, secondTokenId, firstTokenAmount, expectedSecondTokenAmount, account } = args;
    const dispatchInfo = await api.tx.xyk
        .mintLiquidity(firstTokenId, secondTokenId, firstTokenAmount, expectedSecondTokenAmount)
        .paymentInfo(account);
    return fromBN(new BN(dispatchInfo.partialFee.toString()));
};
