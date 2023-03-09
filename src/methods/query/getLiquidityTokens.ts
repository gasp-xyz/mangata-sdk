import { ApiPromise } from "@polkadot/api";
import { TokenId } from "../../types/common";
import { TMainTokens, TTokenInfo } from "../../types/query";
import { getAssetsInfo } from "./getAssetsInfo";

export const getLiquidityTokens = async (
  instancePromise: Promise<ApiPromise>
): Promise<TMainTokens> => {
  const assetsInfo = await getAssetsInfo(instancePromise);

  return Object.values(assetsInfo).reduce((acc, curr) => {
    if (curr.name.includes("Liquidity Pool Token")) {
      acc[curr.id] = curr;
    }
    return acc;
  }, {} as { [id: TokenId]: TTokenInfo });
};
