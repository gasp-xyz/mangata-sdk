import { ApiPromise } from "@polkadot/api";
import { BN } from "@polkadot/util";
import { TokenAmount } from "../../types/common";
import { TBalances } from "../../types/query";
import { pipe, reduce } from "rambda";

export const getTotalIssuanceOfTokens = async (
  instancePromise: Promise<ApiPromise>
): Promise<TBalances> => {
  const api = await instancePromise;
  const balancesResponse = await api.query.tokens.totalIssuance.entries();

  return pipe(
    reduce((acc, [key, value]) => {
      const id = (key.toHuman() as string[])[0].replace(/[, ]/g, "");
      const balance = new BN(value.toString());
      acc[id] = balance;
      return acc;
    }, {} as { [id: string]: TokenAmount })
  )(balancesResponse);
};
