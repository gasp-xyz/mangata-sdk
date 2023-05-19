import { ApiPromise } from "@polkadot/api";
import { TokenId } from "../../types/common";
import { BN } from "@polkadot/util";

/**
 * @since 2.0.0
 */
export const getTotalIssuance = async (
  instancePromise: Promise<ApiPromise>,
  tokenId: TokenId
): Promise<BN> => {
  const api = await instancePromise;
  const tokenSupply = await api.query.tokens.totalIssuance(tokenId);
  return new BN(tokenSupply);
};
