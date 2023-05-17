import { ApiPromise } from "@polkadot/api";
import { TokenId } from "../../types/common";
import { pipe } from "fp-ts/lib/function";
import * as A from "fp-ts/lib/Array";

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
