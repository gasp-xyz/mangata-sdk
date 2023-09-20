import { ApiPromise } from "@polkadot/api";
import { BN } from "@polkadot/util";
import { TokenId } from "../../types/common";
import { logger } from "../../utils/mangataLogger";

/**
 * @since 2.0.0
 */
export const getAmountOfTokensInPool = async (
  instancePromise: Promise<ApiPromise>,
  firstTokenId: TokenId,
  secondTokenId: TokenId
): Promise<BN[]> => {
  logger.info("getAmountOfTokensInPool", { firstTokenId, secondTokenId });
  const api = await instancePromise;
  const balance = await api.query.xyk.pools([firstTokenId, secondTokenId]);

  if (balance[0].eq(0) && balance[1].eq(0)) {
    const balance = await api.query.xyk.pools([secondTokenId, firstTokenId]);
    return [new BN(balance[1]), new BN(balance[0])];
  }

  return [new BN(balance[0]), new BN(balance[1])];
};
