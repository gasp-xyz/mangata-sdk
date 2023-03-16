import { ApiPromise } from "@polkadot/api";
import { SubmittableExtrinsic } from "@polkadot/api/types";
import { ISubmittableResult } from "@polkadot/types/types";
import { MangataGenericEvent } from "../../types/common";
import { signTx } from "../../signTx";
import { Liquidity } from "../../types/xyk";

async function claimRewards(
  instancePromise: Promise<ApiPromise>,
  args: Liquidity,
  isForBatch: false
): Promise<MangataGenericEvent[]>;

async function claimRewards(
  instancePromise: Promise<ApiPromise>,
  args: Liquidity,
  isForBatch: true
): Promise<SubmittableExtrinsic<"promise", ISubmittableResult>>;

async function claimRewards(
  instancePromise: Promise<ApiPromise>,
  args: Liquidity,
  isForBatch: boolean
) {
  const api = await instancePromise;
  const { account, txOptions, liquidityTokenId, amount } = args;
  const tx = api.tx.xyk.claimRewardsV2(liquidityTokenId, amount);
  return isForBatch ? tx : await signTx(api, tx, account, txOptions);
}

export { claimRewards };
