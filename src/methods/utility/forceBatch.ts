import { ApiPromise } from "@polkadot/api";
import { signTx } from "../../utils/signTx";
import { Batch } from "../../types/utility";
import { logger } from "../../utils/mangataLogger";

export const forceBatch = async (
  instancePromise: Promise<ApiPromise>,
  args: Batch
) => {
  logger.info("ForceBatch operation started ...");
  const api = await instancePromise;
  const { account, txOptions, calls } = args;
  logger.info("forceBatch", {
    nonce: txOptions?.nonce?.toString(),
    numberOfTxs: calls.length
  });
  const tx = api.tx.utility.forceBatch(calls);
  return await signTx(api, tx, account, txOptions);
};
