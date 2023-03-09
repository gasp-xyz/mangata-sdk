import { BN } from "@polkadot/util";
import { fromBN } from "../../utils/bnUtility";
export const forActivateLiquidity = async (instancePromise, args) => {
    const api = await instancePromise;
    const { liquidityTokenId, amount, account } = args;
    const dispatchInfo = await api.tx.xyk
        .activateLiquidityV2(liquidityTokenId, amount, null)
        .paymentInfo(account);
    return fromBN(new BN(dispatchInfo.partialFee.toString()));
};
