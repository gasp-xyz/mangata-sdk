import { ApiPromise } from "@polkadot/api";

import { hexToString } from "@polkadot/util";
import { TokenId } from "../types/common";
import { TTokenInfo } from "../types/query";

export const getCompleteAssetsInfo = async (api: ApiPromise) => {
  const assets = await api.query.assetRegistry.metadata.entries();

  return assets.reduce((obj, [key, value]) => {
    const tokenId = (key.toHuman() as string[])[0].replace(/[, ]/g, "");
    const { name, decimals, symbol } = value.unwrap();
    const assetInfo = {
      id: tokenId,
      decimals: Number(decimals.toString()),
      name: hexToString(name.toString()),
      symbol: hexToString(symbol.toString())
    };

    obj[tokenId] = assetInfo;
    return obj;
  }, {} as { [id: TokenId]: TTokenInfo });
};
