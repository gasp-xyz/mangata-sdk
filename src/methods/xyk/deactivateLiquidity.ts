import { ApiPromise } from "@polkadot/api";
import { SubmittableExtrinsic } from "@polkadot/api/types";
import { ISubmittableResult } from "@polkadot/types/types";
import { MangataGenericEvent } from "../../types/common";
import { signTx } from "../../utils/signTx";
import { Liquidity } from "../../types/xyk";
import { logger } from "../../utils/mangataLogger";

async function deactivateLiquidity(
  instancePromise: Promise<ApiPromise>,
  args: Liquidity,
  isForBatch: false
): Promise<MangataGenericEvent[]>;

async function deactivateLiquidity(
  instancePromise: Promise<ApiPromise>,
  args: Liquidity,
  isForBatch: true
): Promise<SubmittableExtrinsic<"promise">>;

/**
* @since 2.0.0
Deactivates liquidity for a given liquidity token ID and amount.
@param instancePromise A promise that resolves to an instance of the Polkadot API.
@param args An object containing account, liquidityTokenId, amount, and txOptions properties.
@param isForBatch A flag indicating whether the transaction is for a batch of transactions or a single transaction.
@returns If isForBatch is false, returns a promise that resolves to an array of MangataGenericEvent objects representing the result of the transaction. If isForBatch is true, returns a promise that resolves to a SubmittableExtrinsic object representing the transaction.
*/
async function deactivateLiquidity(
  instancePromise: Promise<ApiPromise>,
  args: Liquidity,
  isForBatch: boolean
) {
  logger.info("Deactivate Liquidity operation started ...");
  const api = await instancePromise;
  const { account, liquidityTokenId, amount, txOptions } = args;
  logger.info("deactivateLiquidity", {
    liquidityTokenId,
    amount: amount.toString(),
    isBatch: isForBatch
  });
  const tx = api.tx.proofOfStake.deactivateLiquidity(liquidityTokenId, amount);
  return isForBatch ? tx : await signTx(api, tx, account, txOptions);
}

export { deactivateLiquidity };
