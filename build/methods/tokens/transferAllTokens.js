import { signTx } from "../../signTx";
export const transferAllTokens = async (instancePromise, args) => {
    const api = await instancePromise;
    const { account, tokenId, address, txOptions } = args;
    const tx = api.tx.tokens.transferAll(address, tokenId, true);
    return await signTx(api, tx, account, txOptions);
};
