import { signTx } from "../../signTx";
export const activateLiquidity = async (instancePromise, args) => {
    const api = await instancePromise;
    const { account, liquidityTokenId, amount, txOptions } = args;
    const tx = api.tx.xyk.activateLiquidityV2(liquidityTokenId, amount, null);
    return await signTx(api, tx, account, txOptions);
};
