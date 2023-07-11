import { ApiPromise } from "@polkadot/api";

import { TokenId } from "../types/common";
import { TokenInfo } from "../types/query";

export const getCompleteAssetsInfo = async (api: ApiPromise) => {
  const assets = await api.query.assetRegistry.metadata.entries();

  return assets.reduce((obj, [key, value]) => {
    const [tokenId] = key.args;
    const { name, decimals, symbol } = value.unwrap();
    const assetInfo = {
      id: tokenId.toString(),
      decimals: decimals.toNumber(),
      name: name.toPrimitive() as string,
      symbol: symbol.toPrimitive() as string
    };

    obj[tokenId.toString()] = assetInfo;
    return obj;
  }, {} as { [id: TokenId]: TokenInfo });
};
