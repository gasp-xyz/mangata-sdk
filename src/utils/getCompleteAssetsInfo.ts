import { ApiPromise } from "@polkadot/api";

import { TTokenInfo, TTokenId } from "../types/AssetInfo";
import { hexToString } from "@polkadot/util";

const ETHaddress = "0x0000000000000000000000000000000000000000";
const MGAaddress = "0xc7e3bda797d2ceb740308ec40142ae235e08144a";

export const getCompleteAssetsInfo = async (api: ApiPromise) => {
  const assetsInfoResponse = await api.query.assetRegistry.metadata.entries();

  return assetsInfoResponse.reduce((obj, [key, value]) => {
    const tokenId = (key.toHuman() as string[])[0].replace(/[, ]/g, "");
    const v = value.toHuman() as {
      name: string;
      decimals: string;
      symbol: string;
    };
    const { name, decimals, symbol } = v;
    const assetInfo = {
      id: tokenId,
      chainId: 0,
      decimals: Number(decimals.toString()),
      name,
      symbol,
      address:
        hexToString(symbol.toString()) === "MGA"
          ? MGAaddress
          : hexToString(symbol.toString()) === "ETH"
          ? ETHaddress
          : ""
    };

    obj[tokenId] = assetInfo;
    return obj;
  }, {} as { [id: TTokenId]: TTokenInfo });
};
