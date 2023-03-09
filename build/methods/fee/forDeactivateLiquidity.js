import { BN } from "@polkadot/util";
import { fromBN } from "../../utils/bnUtility";
export const forDeactivateLiquidity = async (instancePromise, args) => {
    const api = await instancePromise;
    const { liquidityTokenId, amount, account } = args;
    const dispatchInfo = await api.tx.xyk
        .deactivateLiquidityV2(liquidityTokenId, amount)
        .paymentInfo(account);
    return fromBN(new BN(dispatchInfo.partialFee.toString()));
};
