import { ApiPromise } from "@polkadot/api";
import { hexToBn } from "@polkadot/util";
import { TokenInfo } from "../types/query";

import { getCompleteAssetsInfo } from "./getCompleteAssetsInfo";

export const getAssetsInfoWithIds = async (api: ApiPromise) => {
  const completeAssetsInfo = await getCompleteAssetsInfo(api);
  // we need to filter out ETH and Dummy liquidity token
  // then we need to display symbol for liquidity token
  return Object.values(completeAssetsInfo)
    .filter((asset) => asset.name || asset.symbol)
    .filter((assetsInfo) => !["1", "3"].includes(assetsInfo.id))
    .reduce((obj, item) => {
      const asset = {
        ...item,
        name: item.name
          .replace(/(LiquidityPoolToken)0x[a-fA-F0-9]+/, "$1")
          .replace(/([a-z])([A-Z])/g, "$1 $2"),
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
    }, {} as { [id: string]: TokenInfo });
};
