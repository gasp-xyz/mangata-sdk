import { BN } from "@polkadot/util";
export const getTotalIssuanceOfTokens = async (instancePromise) => {
    const api = await instancePromise;
    const balancesResponse = await api.query.tokens.totalIssuance.entries();
    return balancesResponse.reduce((acc, [key, value]) => {
        const id = key.toHuman()[0].replace(/[, ]/g, "");
        const balance = new BN(value.toString());
        acc[id] = balance;
        return acc;
    }, {});
};
