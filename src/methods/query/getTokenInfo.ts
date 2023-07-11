import { ApiPromise } from "@polkadot/api";
import { TokenId } from "../../types/common";
import { TokenInfo } from "../../types/query";
import { getAssetsInfo } from "./getAssetsInfo";

/**
 * @since 2.0.0
 */
export const getTokenInfo = async (
  instancePromise: Promise<ApiPromise>,
  tokenId: TokenId
): Promise<TokenInfo> => {
  const assetsInfo = await getAssetsInfo(instancePromise);
  return assetsInfo[tokenId];
};
