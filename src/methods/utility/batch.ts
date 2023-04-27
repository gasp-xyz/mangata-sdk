import { ApiPromise } from "@polkadot/api";
import { signTx } from "../../utils/signTx";
import { Batch } from "../../types/utility";

export const batch = async (
  instancePromise: Promise<ApiPromise>,
  args: Batch
) => {
  const api = await instancePromise;
  const { account, txOptions, calls } = args;
  const tx = api.tx.utility.batch(calls);
  return await signTx(api, tx, account, txOptions);
};
