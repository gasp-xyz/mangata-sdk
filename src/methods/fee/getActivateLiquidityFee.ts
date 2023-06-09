import { ApiPromise } from "@polkadot/api";
import { BN } from "@polkadot/util";
import { ActivateLiquidityFee } from "../../types/xyk";
import { fromBN } from "../../utils/bnUtility";

/**
 * @since 2.0.0
 */
export const getActivateLiquidityFee = async (
  instancePromise: Promise<ApiPromise>,
  args: ActivateLiquidityFee
): Promise<string> => {
  const api = await instancePromise;
  const { liquidityTokenId, amount, account } = args;
  const dispatchInfo = await api.tx.proofOfStake
    .activateLiquidity(liquidityTokenId, amount, null)
    .paymentInfo(account);
  return fromBN(new BN(dispatchInfo.partialFee.toString()));
};
