import { getAssetsInfo } from "./getAssetsInfo";
export const getTokenInfo = async (instancePromise, tokenId) => {
    const assetsInfo = await getAssetsInfo(instancePromise);
    return assetsInfo[tokenId];
};
