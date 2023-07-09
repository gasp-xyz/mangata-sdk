import { ApiPromise } from "@polkadot/api";
import { hexToBn } from "@polkadot/util";

import { TTokenInfo } from "../types/AssetInfo";
import { getCompleteAssetsInfo } from "./getCompleteAssetsInfo";

export const getAssetsInfoWithIds = async (api: ApiPromise) => {
  const completeAssetsInfo = await getCompleteAssetsInfo(api);
  // we need to filter out ETH and Dummy liquidity token
  // then we need to display symbol for liquidity token
  return Object.values(completeAssetsInfo)
    .filter((asset) => asset.name || asset.symbol)
    .filter((assetsInfo) => assetsInfo.id !== "1" && assetsInfo.id !== "3")
    .reduce((obj, item) => {
      const asset = {
        ...item,
        name: item.name.replace(/0x\w+/, "").replace(/[A-Z]/g, " $&").trim(),
        symbol: item.symbol.includes("TKN")
          ? item.symbol
              .split("-")
              .reduce((acc, curr) => {
                const currentValue = curr.replace("TKN", "");
                const tokenId = currentValue.startsWith("0x")
                  ? hexToBn(currentValue).toString()
                  : currentValue;
                acc.push(tokenId);
                return acc;
              }, [] as string[])
              .join("-")
          : item.symbol
      };
      obj[asset.id] = asset;
      return obj;
    }, {} as { [id: string]: TTokenInfo });
};
