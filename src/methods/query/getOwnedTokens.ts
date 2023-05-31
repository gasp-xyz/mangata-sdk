import { ApiPromise } from "@polkadot/api";
import { TokenId } from "../../types/common";
import { Token } from "../../types/query";
import { getAccountBalances } from "../../utils/getAccountBalances";
import { getAssetsInfo } from "./getAssetsInfo";
import { pipe, filter, map } from "rambda";

/**
 * @since 2.0.0
 */
export const getOwnedTokens = async (
  instancePromise: Promise<ApiPromise>,
  address: string
): Promise<{ [id: TokenId]: Token }> => {
  const api = await instancePromise;
  const [assetsInfo, accountBalances] = await Promise.all([
    getAssetsInfo(instancePromise),
    getAccountBalances(api, address)
  ]);

  const ownedTokens = Object.fromEntries(
    pipe(
      Object.entries,
      filter(([id]) => Object.keys(accountBalances).includes(id)),
      map(([id, assetInfo]) => [
        id,
        {
          ...assetInfo,
          balance: accountBalances[id]
        }
      ])
    )(assetsInfo)
  );

  return ownedTokens as { [id: TokenId]: Token };
};