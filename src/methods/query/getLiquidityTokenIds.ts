import { ApiPromise } from "@polkadot/api";
import { TokenId } from "../../types/common";
import { pipe } from "fp-ts/es6/function";
import * as A from "fp-ts/es6/Array";

export const getLiquidityTokenIds = async (
  instancePromise: Promise<ApiPromise>
): Promise<TokenId[]> => {
  const api = await instancePromise;
  const liquidityTokens = await api.query.xyk.liquidityAssets.entries();
  return pipe(
    liquidityTokens,
    A.map((liquidityToken) => liquidityToken[1].toString())
  );
};
