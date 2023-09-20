import { ApiPromise } from "@polkadot/api";
import { SubmittableExtrinsic } from "@polkadot/api/types";
import { ISubmittableResult } from "@polkadot/types/types";
import { MangataGenericEvent } from "../../types/common";
import { signTx } from "../../utils/signTx";
import { BurnLiquidity } from "../../types/xyk";
import { logger } from "../../utils/mangataLogger";

async function burnLiquidity(
  instancePromise: Promise<ApiPromise>,
  args: BurnLiquidity,
  isForBatch: false
): Promise<MangataGenericEvent[]>;

async function burnLiquidity(
  instancePromise: Promise<ApiPromise>,
  args: BurnLiquidity,
  isForBatch: true
): Promise<SubmittableExtrinsic<"promise">>;

/**
 * @since 2.0.0
 * Burn liquidity tokens and receive back the underlying assets.
 *
 *
 * @param instancePromise - A promise that resolves to an instance of `ApiPromise`.
 * @param args - An object containing the arguments for the transaction.
 * @param args.account - The account that will sign and submit the transaction.
 * @param args.firstTokenId - The ID of the first token.
 * @param args.secondTokenId - The ID of the second token.
 * @param args.amount - The amount of liquidity tokens to burn.
 * @param args.txOptions - Optional transaction options.
 * @param isForBatch - A flag indicating whether the transaction is for a batch call.
 * @returns If `isForBatch` is `true`, returns a `SubmittableExtrinsic`. Otherwise, signs and submits the transaction
 * and returns an array of `MangataGenericEvent` objects.
 */

async function burnLiquidity(
  instancePromise: Promise<ApiPromise>,
  args: BurnLiquidity,
  isForBatch: boolean
) {
  logger.info("Burn Liquidity operation started ...");
  const api = await instancePromise;
  const { account, firstTokenId, secondTokenId, amount, txOptions } = args;
  logger.info("burnLiquidity", {
    firstTokenId,
    secondTokenId,
    amount: amount.toString(),
    isBatch: isForBatch
  });
  const tx = api.tx.xyk.burnLiquidity(firstTokenId, secondTokenId, amount);
  return isForBatch ? tx : await signTx(api, tx, account, txOptions);
}

export { burnLiquidity };
