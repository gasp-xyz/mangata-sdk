import { ApiPromise } from "@polkadot/api";
import { BN } from "@polkadot/util";
import { TokenId } from "../../types/common";

/**
 * @since 2.0.0
 */
export const getTotalIssuanceOfTokens = async (
  instancePromise: Promise<ApiPromise>
): Promise<Record<TokenId, BN>> => {
  const api = await instancePromise;
  const balancesResponse = await api.query.tokens.totalIssuance.entries();
  return balancesResponse.reduce((acc, [key, value]) => {
    const [id] = key.args;
    acc[id.toString()] = new BN(value);
    return acc;
  }, {} as Record<TokenId, BN>);
};
