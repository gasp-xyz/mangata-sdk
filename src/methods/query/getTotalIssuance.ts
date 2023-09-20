import { ApiPromise } from "@polkadot/api";
import { TokenId } from "../../types/common";
import { BN } from "@polkadot/util";
import { logger } from "../../utils/mangataLogger";

/**
 * @since 2.0.0
 */
export const getTotalIssuance = async (
  instancePromise: Promise<ApiPromise>,
  tokenId: TokenId
): Promise<BN> => {
  logger.info("getTotalIssuance", { tokenId });
  const api = await instancePromise;
  const tokenSupply = await api.query.tokens.totalIssuance(tokenId);
  return new BN(tokenSupply);
};
