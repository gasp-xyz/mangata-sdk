import { ApiPromise } from "@polkadot/api";
import { BN } from "@polkadot/util";
import { TokenId } from "../../types/common";

/**
 * @since 2.0.0
 */
export const isSellAssetLockFree = async (
  instancePromise: Promise<ApiPromise>,
  tokenIds: TokenId[],
  amount: BN
) => {
  const api = await instancePromise;
  const result = await (api.rpc as any).xyk.is_sell_asset_lock_free(
    tokenIds,
    amount
  );
  return result.toPrimitive() as Boolean;
};