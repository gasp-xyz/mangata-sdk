export const getLiquidityTokenIds = async (instancePromise) => {
    const api = await instancePromise;
    const liquidityTokens = await api.query.xyk.liquidityAssets.entries();
    return liquidityTokens.map((liquidityToken) => liquidityToken[1].toString());
};
