import { BN } from "@polkadot/util";
export const getTotalIssuance = async (instancePromise, tokenId) => {
    const api = await instancePromise;
    const tokenSupply = await api.query.tokens.totalIssuance(tokenId);
    return new BN(tokenSupply);
};
