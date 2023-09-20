import { ApiPromise } from "@polkadot/api";
import { signTx } from "../../utils/signTx";
import { Batch } from "../../types/utility";
import { logger } from "../../utils/mangataLogger";

export const batch = async (
  instancePromise: Promise<ApiPromise>,
  args: Batch
) => {
  logger.info("Batch operation started ...");
  const api = await instancePromise;
  const { account, txOptions, calls } = args;
  const tx = api.tx.utility.batch(calls);
  logger.info("batch", {
    nonce: txOptions?.nonce?.toString(),
    numberOfTxs: calls.length
  });
  return await signTx(api, tx, account, txOptions);
};
