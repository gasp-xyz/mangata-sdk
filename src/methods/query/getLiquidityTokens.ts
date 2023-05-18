import { ApiPromise } from "@polkadot/api";
import { TokenId } from "../../types/common";
import { TMainTokens, TTokenInfo } from "../../types/query";
import { getAssetsInfo } from "./getAssetsInfo";
import { pipe, filter, reduce } from "rambda";

export const getLiquidityTokens = async (
  instancePromise: Promise<ApiPromise>
): Promise<TMainTokens> => {
  const assetsInfo = await getAssetsInfo(instancePromise);

  return pipe(
    filter((asset: TTokenInfo) => asset.name.includes("LiquidityPoolToken")),
    reduce((acc, curr) => {
      acc[curr.id] = curr;
      return acc;
    }, {} as TMainTokens)
  )(Object.values(assetsInfo));
};
