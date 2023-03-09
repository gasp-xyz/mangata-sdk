import { signTx } from "../../signTx";
export const buyAsset = async (instancePromise, args) => {
    const api = await instancePromise;
    const { account, txOptions, soldTokenId, boughtTokenId, amount, maxAmountIn } = args;
    const tx = api.tx.xyk.buyAsset(soldTokenId, boughtTokenId, amount, maxAmountIn);
    return await signTx(api, tx, account, txOptions);
};
