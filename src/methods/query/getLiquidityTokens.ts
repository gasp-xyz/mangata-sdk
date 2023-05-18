import { ApiPromise } from "@polkadot/api";
import { TokenId } from "../../types/common";
import { TMainTokens, TTokenInfo } from "../../types/query";
import { getAssetsInfo } from "./getAssetsInfo";

export const getLiquidityTokens = async (
  instancePromise: Promise<ApiPromise>
): Promise<TMainTokens> => {
  const assetsInfo = await getAssetsInfo(instancePromise);

  return Object.values(assetsInfo)
    .filter((asset: TTokenInfo) => asset.name.includes("LiquidityPoolToken"))
    .reduce((acc, curr: TTokenInfo) => {
      acc[curr.id] = curr;
      return acc;
    }, {} as { [id: TokenId]: TTokenInfo });
};
