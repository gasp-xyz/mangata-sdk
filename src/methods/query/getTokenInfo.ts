import { ApiPromise } from "@polkadot/api";
import { TokenId } from "../../types/common";
import { TokenInfo } from "../../types/query";
import { getAssetsInfo } from "./getAssetsInfo";
import { logger } from "../../utils/mangataLogger";

/**
 * @since 2.0.0
 */
export const getTokenInfo = async (
  instancePromise: Promise<ApiPromise>,
  tokenId: TokenId
): Promise<TokenInfo> => {
  logger.info("getTokenInfo", { tokenId });
  const assetsInfo = await getAssetsInfo(instancePromise);
  return assetsInfo[tokenId];
};
