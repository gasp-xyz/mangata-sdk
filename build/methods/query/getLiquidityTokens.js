import { getAssetsInfo } from "./getAssetsInfo";
export const getLiquidityTokens = async (instancePromise) => {
    const assetsInfo = await getAssetsInfo(instancePromise);
    return Object.values(assetsInfo).reduce((acc, curr) => {
        if (curr.name.includes("Liquidity Pool Token")) {
            acc[curr.id] = curr;
        }
        return acc;
    }, {});
};
