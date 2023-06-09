import { ApiPromise } from "@polkadot/api";
import { BN } from "@polkadot/util";
import { ClaimRewardsFee } from "../../types/xyk";
import { fromBN } from "../../utils/bnUtility";

/**
 * @since 2.0.0
 */
export const getClaimRewardsFee = async (
  instancePromise: Promise<ApiPromise>,
  args: ClaimRewardsFee
): Promise<string> => {
  const api = await instancePromise;
  const { liquidityTokenId, account } = args;
  const dispatchInfo = await api.tx.proofOfStake
    .claimRewardsAll(liquidityTokenId)
    .paymentInfo(account);
  return fromBN(new BN(dispatchInfo.partialFee.toString()));
};
