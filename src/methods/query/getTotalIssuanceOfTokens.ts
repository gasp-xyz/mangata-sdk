import { ApiPromise } from "@polkadot/api";
import { BN } from "@polkadot/util";
import { pipe } from "fp-ts/es6/function";
import * as A from "fp-ts/es6/Array";
import * as S from "fp-ts/es6/string";
import { TokenAmount } from "../../types/common";
import { TBalances } from "../../types/query";

export const getTotalIssuanceOfTokens = async (
  instancePromise: Promise<ApiPromise>
): Promise<TBalances> => {
  const api = await instancePromise;
  const balancesResponse = await api.query.tokens.totalIssuance.entries();

  return pipe(
    balancesResponse,
    A.reduce({} as { [id: string]: TokenAmount }, (acc, [key, value]) => {
      const id = pipe((key.toHuman() as string[])[0], S.replace(/[, ]/g, ""));
      const balance = new BN(value.toString());
      acc[id] = balance;
      return acc;
    })
  );
};
