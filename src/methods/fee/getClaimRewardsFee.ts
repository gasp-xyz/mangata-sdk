import { ApiPromise } from "@polkadot/api";
import { BN } from "@polkadot/util";
import { ClaimRewardsFee } from "../../types/xyk";
import { fromBN } from "../../utils/bnUtility";

export const getClaimRewardsFee = async (
  instancePromise: Promise<ApiPromise>,
  args: ClaimRewardsFee
): Promise<string> => {
  const api = await instancePromise;
  const { liquidityTokenId, amount, account } = args;
  const dispatchInfo = await api.tx.xyk
    .claimRewardsV2(liquidityTokenId, amount)
    .paymentInfo(account);
  return fromBN(new BN(dispatchInfo.partialFee.toString()));
};
