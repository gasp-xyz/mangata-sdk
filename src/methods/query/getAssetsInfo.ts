import { ApiPromise } from "@polkadot/api";
import { hexToBn } from "@polkadot/util";
import { pipe, filter, reduce, replace, trim, split, join } from "rambda";
import { TMainTokens, TTokenInfo } from "../../types/query";
import { getCompleteAssetsInfo } from "../../utils/getCompleteAssetsInfo";

/**
 * @since 2.0.0
 */
export const getAssetsInfo = async (
  instancePromise: Promise<ApiPromise>
): Promise<TMainTokens> => {
  const api = await instancePromise;
  const completeAssetsInfo = await getCompleteAssetsInfo(api);
  // we need to filter out ETH and Dummy liquidity token
  // then we need to display symbol for liquidity token
  return pipe(
    filter(
      (assetsInfo: TTokenInfo) => !["1", "3"].includes(assetsInfo.id.toString())
    ),
    reduce((obj, item) => {
      const asset = {
        ...item,
        name: pipe(
          replace(/0x\w+/, ""),
          replace(/[A-Z]/g, "$&"),
          trim
        )(item.name),
        symbol: item.symbol.includes("TKN")
          ? pipe(
              split("-"),
              reduce((acc, curr: string) => {
                const currentValue = curr.replace("TKN", "");
                const tokenId = currentValue.startsWith("0x")
                  ? hexToBn(currentValue).toString()
                  : currentValue;
                const symbol = completeAssetsInfo[tokenId].symbol;
                acc.push(symbol);
                return acc;
              }, [] as string[]),
              join("-")
            )(item.symbol)
          : item.symbol
      };
      obj[asset.id] = asset;
      return obj;
    }, {} as TMainTokens)
  )(Object.values(completeAssetsInfo));
};
