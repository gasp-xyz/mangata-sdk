import { ApiPromise } from "@polkadot/api";

import { MainTokens } from "../../types/query";
import { getAssetsInfo } from "./getAssetsInfo";

/**
 * @since 2.0.0
 */
export const getLiquidityTokens = async (
  instancePromise: Promise<ApiPromise>
): Promise<MainTokens> => {
  const assetsInfo = await getAssetsInfo(instancePromise);

  return Object.values(assetsInfo)
    .filter((asset) => asset.name.includes("Liquidity Pool Token"))
    .reduce((acc, curr) => {
      acc[curr.id] = curr;
      return acc;
    }, {} as MainTokens);
};
