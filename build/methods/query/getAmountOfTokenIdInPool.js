import { BN, isHex, hexToBn } from "@polkadot/util";
export const getAmountOfTokenIdInPool = async (instancePromise, firstTokenId, secondTokenId) => {
    const api = await instancePromise;
    const balance = await api.query.xyk.pools([firstTokenId, secondTokenId]);
    const tokenValue1 = balance[0].toString();
    const tokenValue2 = balance[1].toString();
    const token1 = isHex(tokenValue1)
        ? hexToBn(tokenValue1)
        : new BN(tokenValue1);
    const token2 = isHex(tokenValue2)
        ? hexToBn(tokenValue2)
        : new BN(tokenValue2);
    return [token1, token2];
};
