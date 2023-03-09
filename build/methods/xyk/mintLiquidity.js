import { signTx } from "../../signTx";
export const mintLiquidity = async (instancePromise, args) => {
    const api = await instancePromise;
    const { account, firstTokenId, secondTokenId, firstTokenAmount, expectedSecondTokenAmount, txOptions } = args;
    const tx = api.tx.xyk.mintLiquidity(firstTokenId, secondTokenId, firstTokenAmount, expectedSecondTokenAmount);
    return await signTx(api, tx, account, txOptions);
};
