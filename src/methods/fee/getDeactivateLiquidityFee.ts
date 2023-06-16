import { ApiPromise } from "@polkadot/api";
import { BN } from "@polkadot/util";
import { DeactivateLiquidityFee } from "../../types/xyk";
import { fromBN } from "../../utils/bnUtility";

/**
 * @since 2.0.0
 */
export const getDeactivateLiquidityFee = async (
  instancePromise: Promise<ApiPromise>,
  args: DeactivateLiquidityFee
): Promise<string> => {
  const api = await instancePromise;
  const { liquidityTokenId, amount, account } = args;
  const dispatchInfo = await api.tx.proofOfStake
    .deactivateLiquidity(liquidityTokenId, amount)
    .paymentInfo(account);
  return fromBN(new BN(dispatchInfo.partialFee.toString()));
};
