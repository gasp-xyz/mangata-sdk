import { ApiPromise } from "@polkadot/api";
import { BN } from "@polkadot/util";
import { Amount } from "../../types/common";
import { TBalances } from "../../types/query";

export const getTotalIssuanceOfTokens = async (
  instancePromise: Promise<ApiPromise>
): Promise<TBalances> => {
  const api = await instancePromise;
  const balancesResponse = await api.query.tokens.totalIssuance.entries();

  return balancesResponse.reduce((acc, [key, value]) => {
    const id = (key.toHuman() as string[])[0].replace(/[, ]/g, "");
    const balance = new BN(value.toString());
    acc[id] = balance;
    return acc;
  }, {} as { [id: string]: Amount });
};
