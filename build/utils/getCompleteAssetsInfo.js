import { hexToString } from "@polkadot/util";
export const getCompleteAssetsInfo = async (api) => {
    const assetsInfoResponse = await api.query.assetRegistry.metadata.entries();
    return assetsInfoResponse.reduce((obj, [key, value]) => {
        const tokenId = key.toHuman()[0].replace(/[, ]/g, "");
        const { name, decimals, symbol } = value.unwrap();
        const assetInfo = {
            id: tokenId,
            decimals: Number(decimals.toString()),
            name: hexToString(name.toString()),
            symbol: hexToString(symbol.toString())
        };
        obj[tokenId] = assetInfo;
        return obj;
    }, {});
};
