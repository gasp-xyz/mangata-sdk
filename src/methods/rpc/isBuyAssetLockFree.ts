import { ApiPromise } from "@polkadot/api";
import { BN } from "@polkadot/util";

/**
 * @since 2.0.0
 */
export const isBuyAssetLockFree = async (
  instancePromise: Promise<ApiPromise>,
  tokenIds: number[],
  amount: BN
) => {
  const api = await instancePromise;
  const result = await (api.rpc as any).xyk.is_buy_asset_lock_free(
    tokenIds,
    amount
  );
  return result.toPrimitive() as Boolean;
};
