import { signTx } from "../../signTx";
export const createPool = async (instancePromise, args) => {
    const api = await instancePromise;
    const { account, txOptions, firstTokenId, firstTokenAmount, secondTokenId, secondTokenAmount } = args;
    const tx = api.tx.xyk.createPool(firstTokenId, firstTokenAmount, secondTokenId, secondTokenAmount);
    return await signTx(api, tx, account, txOptions);
};
