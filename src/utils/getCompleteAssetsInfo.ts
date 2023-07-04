import { ApiPromise } from "@polkadot/api";

import { hexToString, isHex } from "@polkadot/util";
import { TokenId } from "../types/common";
import { TTokenInfo } from "../types/query";
import { OrmlTraitsAssetRegistryAssetMetadata } from "@polkadot/types/lookup";

export const getCompleteAssetsInfo = async (api: ApiPromise) => {
  const assets = await api.query.assetRegistry.metadata.entries();

  return assets.reduce((obj, [key, value]) => {
    const [tokenId] = key.args;
    const { name, decimals, symbol } = value.unwrap();
    const assetInfo = {
      id: tokenId.toNumber(),
      decimals: decimals.toNumber(),
      name: name.toPrimitive() as string,
      symbol: symbol.toPrimitive() as string
    };

    obj[tokenId.toString()] = assetInfo;
    return obj;
  }, {} as { [id: string]: TTokenInfo });
};
