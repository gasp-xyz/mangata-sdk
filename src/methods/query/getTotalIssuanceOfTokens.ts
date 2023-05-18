import { ApiPromise } from "@polkadot/api";
import { BN } from "@polkadot/util";
import { TokenAmount } from "../../types/common";
import { TBalances } from "../../types/query";
import { pipe } from "fp-ts/es6/function.js";
import * as A from "fp-ts/es6/Array.js";

export const getTotalIssuanceOfTokens = async (
  instancePromise: Promise<ApiPromise>
): Promise<TBalances> => {
  const api = await instancePromise;
  const balancesResponse = await api.query.tokens.totalIssuance.entries();

  return pipe(
    balancesResponse,
    A.reduce({} as { [id: string]: TokenAmount }, (acc, [key, value]) => {
      const id = (key.toHuman() as string[])[0].replace(/[, ]/g, "");
      const balance = new BN(value.toString());
      acc[id] = balance;
      return acc;
    })
  );
};
