import { ApiPromise } from "@polkadot/api";
import { SubmittableExtrinsic } from "@polkadot/api/types";
import { ISubmittableResult } from "@polkadot/types/types";
import { MangataGenericEvent } from "../../types/common";
import { TransferTokens } from "../../types/tokens";
import { signTx } from "../../utils/signTx";
import { logger } from "../../utils/mangataLogger";

async function transferTokens(
  instancePromise: Promise<ApiPromise>,
  args: TransferTokens,
  isForBatch: false
): Promise<MangataGenericEvent[]>;

async function transferTokens(
  instancePromise: Promise<ApiPromise>,
  args: TransferTokens,
  isForBatch: true
): Promise<SubmittableExtrinsic<"promise">>;

/**
 * @since 2.0.0
 */
async function transferTokens(
  instancePromise: Promise<ApiPromise>,
  args: TransferTokens,
  isForBatch: boolean
) {
  const api = await instancePromise;
  const { account, tokenId, address, txOptions, amount } = args;
  logger.info("transferTokens", {
    tokenId,
    address,
    isBatch: isForBatch
  });
  const tx = api.tx.tokens.transfer(address, tokenId, amount);
  return isForBatch ? tx : await signTx(api, tx, account, txOptions);
}

export { transferTokens };
