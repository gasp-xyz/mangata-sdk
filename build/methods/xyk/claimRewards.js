import { signTx } from "../../signTx";
export const claimRewards = async (instancePromise, args) => {
    const api = await instancePromise;
    const { account, txOptions, liquidityTokenId, amount } = args;
    const tx = api.tx.xyk.claimRewardsV2(liquidityTokenId, amount);
    return await signTx(api, tx, account, txOptions);
};
