import { ApiPromise } from "@polkadot/api";
import { TokenId } from "../../types/common";
import { TToken } from "../../types/query";
import { getAccountBalances } from "../../utils/getAccountBalances";
import { getAssetsInfo } from "./getAssetsInfo";

export const getOwnedTokens = async (
  instancePromise: Promise<ApiPromise>,
  address: string
): Promise<{ [id: TokenId]: TToken } | null> => {
  if (!address) return null;
  const api = await instancePromise;
  const [assetsInfo, accountBalances] = await Promise.all([
    getAssetsInfo(instancePromise),
    getAccountBalances(api, address)
  ]);

  return Object.values(assetsInfo).reduce((acc, assetInfo) => {
    if (Object.keys(accountBalances).includes(assetInfo.id)) {
      acc[assetInfo.id] = {
        ...assetInfo,
        balance: accountBalances[assetInfo.id]
      };
    }
    return acc;
  }, {} as { [id: TokenId]: TToken });
};
