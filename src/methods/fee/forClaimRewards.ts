import { ApiPromise } from "@polkadot/api";
import { BN } from "@polkadot/util";
import { Liquidity } from "../../types/xyk";
import { fromBN } from "../../utils/bnUtility";
import { Object } from "ts-toolbelt";

export type ClaimRewardsFee = Object.Omit<Liquidity, "txOptions">;

export const forClaimRewards = async (
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
