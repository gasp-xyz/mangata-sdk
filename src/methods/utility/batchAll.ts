import { ApiPromise } from "@polkadot/api";
import { signTx } from "../../utils/signTx";
import { Batch } from "../../types/utility";
import { logger } from "../../utils/mangataLogger";

export const batchAll = async (
  instancePromise: Promise<ApiPromise>,
  args: Batch
) => {
  logger.info("BatchAll operation started ...");
  const api = await instancePromise;
  const { account, txOptions, calls } = args;
  logger.info("batchAll", {
    nonce: txOptions?.nonce?.toString(),
    numberOfTxs: calls.length
  });
  const tx = api.tx.utility.batchAll(calls);
  return await signTx(api, tx, account, txOptions);
};
