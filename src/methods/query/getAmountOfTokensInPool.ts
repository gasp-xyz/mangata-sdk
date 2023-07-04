import { ApiPromise } from "@polkadot/api";
import { BN } from "@polkadot/util";
import { TokenId } from "../../types/common";

/**
 * @since 2.0.0
 */
export const getAmountOfTokensInPool = async (
  instancePromise: Promise<ApiPromise>,
  firstTokenId: TokenId,
  secondTokenId: TokenId
): Promise<BN[]> => {
  const api = await instancePromise;
  const balance = await api.query.xyk.pools([firstTokenId, secondTokenId]);
  return [new BN(balance[0]), new BN(balance[1])];
};
