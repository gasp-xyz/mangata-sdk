import { signTx } from "../../signTx";
export const transferTokens = async (instancePromise, args) => {
    const api = await instancePromise;
    const { account, tokenId, address, txOptions, amount } = args;
    const tx = api.tx.tokens.transfer(address, tokenId, amount);
    return await signTx(api, tx, account, txOptions);
};
