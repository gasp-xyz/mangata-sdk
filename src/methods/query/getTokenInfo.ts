import { ApiPromise } from "@polkadot/api";
import { TokenId } from "../../types/common";
import { TTokenInfo } from "../../types/query";
import { getAssetsInfo } from "./getAssetsInfo";

export const getTokenInfo = async (
  instancePromise: Promise<ApiPromise>,
  tokenId: TokenId
): Promise<TTokenInfo> => {
  const assetsInfo = await getAssetsInfo(instancePromise);
  return assetsInfo[tokenId];
};
