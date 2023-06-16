import { ApiPromise } from "@polkadot/api";
import { SubmittableExtrinsic } from "@polkadot/api/types";
import { ISubmittableResult } from "@polkadot/types/types";
import { MangataGenericEvent } from "../../types/common";
import { Transfer } from "../../types/tokens";
import { signTx } from "../../utils/signTx";

async function transferAllTokens(
  instancePromise: Promise<ApiPromise>,
  args: Transfer,
  isForBatch: false
): Promise<MangataGenericEvent[]>;

async function transferAllTokens(
  instancePromise: Promise<ApiPromise>,
  args: Transfer,
  isForBatch: true
): Promise<SubmittableExtrinsic<"promise", ISubmittableResult>>;

/**
 * @since 2.0.0
 */
async function transferAllTokens(
  instancePromise: Promise<ApiPromise>,
  args: Transfer,
  isForBatch: boolean
) {
  const api = await instancePromise;
  const { account, tokenId, address, txOptions } = args;
  const tx = api.tx.tokens.transferAll(address, tokenId, true);
  return isForBatch ? tx : await signTx(api, tx, account, txOptions);
}

export { transferAllTokens };
