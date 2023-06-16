import { ApiPromise } from "@polkadot/api";
import { signTx } from "../../utils/signTx";
import { Batch } from "../../types/utility";

export const batchAll = async (
  instancePromise: Promise<ApiPromise>,
  args: Batch
) => {
  const api = await instancePromise;
  const { account, txOptions, calls } = args;
  const tx = api.tx.utility.batchAll(calls);
  return await signTx(api, tx, account, txOptions);
};
