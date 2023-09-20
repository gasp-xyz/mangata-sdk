import { ApiPromise } from "@polkadot/api";
import { SubmittableExtrinsic } from "@polkadot/api/types";
import { ISubmittableResult } from "@polkadot/types/types";
import { MangataGenericEvent } from "../../types/common";
import { signTx } from "../../utils/signTx";
import { MintLiquidity } from "../../types/xyk";
import { logger } from "../../utils/mangataLogger";

async function mintLiquidity(
  instancePromise: Promise<ApiPromise>,
  args: MintLiquidity,
  isForBatch: false
): Promise<MangataGenericEvent[]>;

async function mintLiquidity(
  instancePromise: Promise<ApiPromise>,
  args: MintLiquidity,
  isForBatch: true
): Promise<SubmittableExtrinsic<"promise">>;

/**
 * Mint liquidity tokens by providing two assets
 * @since 2.0.0
 * @remarks
 * This function allows a user to mint liquidity tokens by providing two assets.
 * The user must provide an account to send the transaction from, as well as the
 * ID and amount of each asset they wish to provide. They must also provide the
 * expected amount of the second asset they will receive in exchange for the first.
 *
 * @param instancePromise - A promise that resolves to an `ApiPromise` instance.
 * @param args - An object containing the arguments for the transaction.
 * @param args.account - The account to send the transaction from.
 * @param args.firstTokenId - The ID of the first asset to provide.
 * @param args.secondTokenId - The ID of the second asset to provide.
 * @param args.firstTokenAmount - The amount of the first asset to provide.
 * @param args.expectedSecondTokenAmount - The expected amount of the second asset to receive.
 * @param args.txOptions - An optional object containing options for the transaction.
 * @param isForBatch - A boolean indicating whether the transaction is intended to be part of a batch.
 *
 * @returns If `isForBatch` is `true`, returns a `SubmittableExtrinsic` object that can be included in a batch.
 * Otherwise, returns a `Promise` that resolves to an array of `MangataGenericEvent` objects.
 */
async function mintLiquidity(
  instancePromise: Promise<ApiPromise>,
  args: MintLiquidity,
  isForBatch: boolean
) {
  logger.info("Mint Liquidity operation started ...");
  const api = await instancePromise;
  const {
    account,
    firstTokenId,
    secondTokenId,
    firstTokenAmount,
    expectedSecondTokenAmount,
    txOptions
  } = args;
  logger.info("mintLiquidity", {
    firstTokenId,
    secondTokenId,
    firstTokenAmount: firstTokenAmount.toString(),
    expectedSecondTokenAmount: expectedSecondTokenAmount.toString(),
    isBatch: isForBatch
  });
  const tx = api.tx.xyk.mintLiquidity(
    firstTokenId,
    secondTokenId,
    firstTokenAmount,
    expectedSecondTokenAmount
  );
  return isForBatch ? tx : await signTx(api, tx, account, txOptions);
}

export { mintLiquidity };
