import { ApiPromise } from "@polkadot/api";

import { TokenId } from "../../types/common";
import { Token } from "../../types/query";
import { getAccountBalances } from "../../utils/getAccountBalances";
import { getAssetsInfo } from "./getAssetsInfo";
import { logger } from "../../utils/mangataLogger";

/**
 * @since 2.0.0
 */
export const getOwnedTokens = async (
  instancePromise: Promise<ApiPromise>,
  address: string
): Promise<{ [id: TokenId]: Token }> => {
  logger.info("getOwnedTokens", { address });
  const api = await instancePromise;
  const [assetsInfo, accountBalances] = await Promise.all([
    getAssetsInfo(instancePromise),
    getAccountBalances(api, address)
  ]);

  const ownedTokens = Object.fromEntries(
    Object.entries(assetsInfo)
      .filter(([id]) => Object.keys(accountBalances).includes(id))
      .map(([id, assetInfo]) => [
        id,
        {
          ...assetInfo,
          balance: accountBalances[id]
        }
      ])
  );

  return ownedTokens as { [id: TokenId]: Token };
};
