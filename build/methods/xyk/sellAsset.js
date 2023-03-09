import { signTx } from "../../signTx";
export const sellAsset = async (instancePromise, args) => {
    const api = await instancePromise;
    const { account, txOptions, soldTokenId, boughtTokenId, amount, minAmountOut } = args;
    const tx = api.tx.xyk.sellAsset(soldTokenId, boughtTokenId, amount, minAmountOut);
    return await signTx(api, tx, account, txOptions);
};
