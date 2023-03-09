import { signTx } from "../../signTx";
export const burnLiquidity = async (instancePromise, args) => {
    const api = await instancePromise;
    const { account, firstTokenId, secondTokenId, amount, txOptions } = args;
    const tx = api.tx.xyk.burnLiquidity(firstTokenId, secondTokenId, amount);
    return await signTx(api, tx, account, txOptions);
};
