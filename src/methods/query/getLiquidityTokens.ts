import { ApiPromise } from "@polkadot/api";
import { TokenId } from "../../types/common";
import { TMainTokens, TTokenInfo } from "../../types/query";
import { getAssetsInfo } from "./getAssetsInfo";
import { pipe } from "fp-ts/es6/function";
import * as A from "fp-ts/es6/Array";

export const getLiquidityTokens = async (
  instancePromise: Promise<ApiPromise>
): Promise<TMainTokens> => {
  const assetsInfo = await getAssetsInfo(instancePromise);

  return pipe(
    Object.values(assetsInfo),
    A.filter((asset) => asset.name.includes("LiquidityPoolToken")),
    A.reduce({} as { [id: TokenId]: TTokenInfo }, (acc, curr) => {
      acc[curr.id] = curr;
      return acc;
    })
  );
};
