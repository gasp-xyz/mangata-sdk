import { ApiPromise } from "@polkadot/api"
import { SubmittableExtrinsic } from "@polkadot/api/types";
import { ISubmittableResult } from "@polkadot/types/types";
import { KeyringPair } from "@polkadot/keyring/types";
import { BN } from "@polkadot/util";
import { calculateRewardsAmount } from "../rpc/calculateRewardsAmount";
import { Account, MangataGenericEvent, MangataSubmittableExtrinsic } from "../../types/common";
import { signTx } from "../../utils/signTx";
import { ExtrinsicCommon } from "../../types/common";
import { logger } from "../../utils/mangataLogger";
import { Liquidity, Rewards } from "src/types/xyk";
import { claimRewards } from "./claimRewards";
import { batchAll } from "../utility/batchAll";
import { Batch } from "src/types/utility";

async function claimRewardsAll(
  instancePromise: Promise<ApiPromise>,
  args: ExtrinsicCommon,
  isForBatch: false
): Promise<MangataGenericEvent[]>;

async function claimRewardsAll(
  instancePromise: Promise<ApiPromise>,
  args: ExtrinsicCommon,
  isForBatch: true
): Promise<SubmittableExtrinsic<"promise", ISubmittableResult>>;

/**
 *@since 2.0.0
 * Claims rewards for liquidity providers from all pools that user participated.
 * @param instancePromise A Promise that resolves to an ApiPromise object from the Polkadot JS API.
 * @param args An object of type ExtrinsicCommon, note that you need to provide your keyring and not address
 * if you want to use blocking api (when isForBatch == false)
 * @param isForBatch A boolean value indicating whether or not the function is being called as part of a batch transaction.
 * @returns If isForBatch is false, a Promise that resolves to an array of MangataGenericEvent objects. Otherwise, a Promise that resolves to a SubmittableExtrinsic object.
 */

const TOKENS_CLAIM_LIMIT = 10;

async function claimRewardsAll(
  instancePromise: Promise<ApiPromise>,
  args: ExtrinsicCommon,
  isForBatch: boolean
) {

  logger.info("Claim Rewards operation started ...");
  const api = await instancePromise;
  const { account, txOptions } = args;

  let rewardsAddr: string;
  if (typeof account === "string"){
    rewardsAddr = account;
  }else {
    rewardsAddr = (account as KeyringPair).address;
  }

  logger.info("claimRewardsAll", { isBatch: isForBatch });

  const promotedPools = await api.query.proofOfStake.promotedPoolRewards();

  const liquidityTokens = Object.entries(promotedPools.toHuman()).map(([token, _]) => {
    return Promise.all([
      Promise.resolve(token),
      calculateRewardsAmount(instancePromise, {
        address: rewardsAddr,
        liquidityTokenId: token
      })
    ])
  })

  const txs = (await Promise.all(liquidityTokens))
  .filter(([_, rewards])=> rewards.gtn(0))
  .map(([pool, rewards]) => {
    const claimRewardsArgs: Liquidity = {...args, ...{amount: rewards, liquidityTokenId: pool}};
    return claimRewards(instancePromise, claimRewardsArgs, true);
  });

  if (txs.length > TOKENS_CLAIM_LIMIT) {
    throw new Error(`Only up to ${TOKENS_CLAIM_LIMIT} can be claimed automatically, consider claiming rewards separately for each liquidity pool`);
  }
  const claimAllTx = api.tx.utility.batchAll(await Promise.all(txs));
  return isForBatch ? claimAllTx : await signTx(api, claimAllTx, account, txOptions);
}

export { claimRewardsAll };
