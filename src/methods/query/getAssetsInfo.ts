import { ApiPromise } from "@polkadot/api";
import { hexToBn } from "@polkadot/util";
import { MainTokens } from "../../types/query";
import { getCompleteAssetsInfo } from "../../utils/getCompleteAssetsInfo";

/**
 * @since 2.0.0
 */
export const getAssetsInfo = async (
  instancePromise: Promise<ApiPromise>
): Promise<MainTokens> => {
  const api = await instancePromise;
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
                const symbol = completeAssetsInfo[tokenId].symbol;
                acc.push(symbol);
                return acc;
              }, [] as string[])
              .join("-")
          : item.symbol
      };
      obj[asset.id] = asset;
      return obj;
    }, {} as MainTokens);
};
