import { signTx } from "../../signTx";
export const deactivateLiquidity = async (instancePromise, args) => {
    const api = await instancePromise;
    const { account, liquidityTokenId, amount, txOptions } = args;
    const tx = api.tx.xyk.deactivateLiquidityV2(liquidityTokenId, amount);
    return await signTx(api, tx, account, txOptions);
};
