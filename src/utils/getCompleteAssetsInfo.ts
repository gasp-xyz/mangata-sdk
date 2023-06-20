import { ApiPromise } from "@polkadot/api";

import { hexToString, isHex } from "@polkadot/util";
import { TokenId } from "../types/common";
import { TTokenInfo } from "../types/query";

export const getCompleteAssetsInfo = async (api: ApiPromise) => {
  const assets = await api.query.assetRegistry.metadata.entries();

  return assets.reduce((obj, [key, value]) => {
    const tokenId = (key.toHuman() as string[])[0].replace(/[, ]/g, "");
    const v = value.toHuman() as {
      name: string;
      decimals: string;
      symbol: string;
    };
    const { name, decimals, symbol } = v;
    const assetInfo = {
      id: tokenId,
      decimals: Number(decimals.toString()),
      name: isHex(name) ? hexToString(name.toString()) : name,
      symbol: isHex(symbol) ? hexToString(symbol.toString()) : symbol
    };

    obj[tokenId] = assetInfo;
    return obj;
  }, {} as { [id: TokenId]: TTokenInfo });
};
