import { ApiPromise } from "@polkadot/api";

export const getLiquidityAssets = async (api: ApiPromise) => {
  const liquidityAssetsResponse = await api.query.xyk.liquidityAssets.entries();

  return liquidityAssetsResponse.reduce((acc, [key, value]) => {
    const [identificator] = key.args;
    acc[identificator.toHex()] = value.unwrap().toString();
    return acc;
  }, {} as { [identificator: string]: string });
};
