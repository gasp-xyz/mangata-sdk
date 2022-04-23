import { ApiPromise } from "@polkadot/api";
import { TTokenInfo } from "../types";
import { hexToBn } from "@polkadot/util";

const ETHaddress = "0x0000000000000000000000000000000000000000";
const MGAaddress = "0xc7e3bda797d2ceb740308ec40142ae235e08144a";

export const getAssetsInfoMapWithIds = async (api: ApiPromise) => {
  const assetsInfoResponse = await api.query.assetsInfo.assetsInfo.entries();

  return assetsInfoResponse.reduce((obj, [key, value]) => {
    const info = value.toHuman() as {
      symbol: string;
      name: string;
      description: string;
      decimals: number;
    };
    const id = (key.toHuman() as string[])[0].replace(/[, ]/g, "");

    const assetInfo = {
      id,
      chainId: 0,
      symbol: info.symbol.includes("TKN")
        ? info.symbol
            .split("-")
            .map((item) => item.replace("TKN", ""))
            .map((tokenId) =>
              tokenId.startsWith("0x") ? hexToBn(tokenId).toString() : tokenId
            )
            .join("-")
        : info.symbol,
      address:
        info.symbol === "MGA"
          ? MGAaddress
          : info.symbol === "ETH"
          ? ETHaddress
          : info.description,
      name: info.symbol.includes("TKN") ? "Liquidity Pool Token" : info.name,
      decimals: Number(info.decimals)
    };

    obj[id] = assetInfo;
    return obj;
  }, {} as { [id: string]: TTokenInfo });
};
