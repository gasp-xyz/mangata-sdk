import { ApiPromise } from "@polkadot/api";
import { SubmittableExtrinsic } from "@polkadot/api/types";
import { ISubmittableResult } from "@polkadot/types/types";
import { MangataGenericEvent } from "../../types/common";
import { signTx } from "../../utils/signTx";
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

/**
 * Claims rewards for liquidity providers.
 * @param instancePromise A Promise that resolves to an ApiPromise object from the Polkadot JS API.
 * @param args An object of type Liquidity containing the liquidity pool token ID, the amount of liquidity to claim rewards for, and the account to claim rewards for.
 * @param isForBatch A boolean value indicating whether or not the function is being called as part of a batch transaction.
 * @returns If isForBatch is false, a Promise that resolves to an array of MangataGenericEvent objects. Otherwise, a Promise that resolves to a SubmittableExtrinsic object.
 */

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
