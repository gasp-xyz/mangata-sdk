export const getLiquidityAssets = async (api) => {
    const liquidityAssetsResponse = await api.query.xyk.liquidityAssets.entries();
    return liquidityAssetsResponse.reduce((acc, [key, value]) => {
        const identificator = key.args.map((k) => k.toHuman())[0];
        const liquidityAssetId = value.toString().replace(/[, ]/g, "");
        acc[identificator] = liquidityAssetId;
        return acc;
    }, {});
};
