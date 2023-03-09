import { ApiPromise } from "@polkadot/api";
import { signTx } from "../../signTx";
import { CreatePool } from "../../types/xyk";

export const createPool = async (
  instancePromise: Promise<ApiPromise>,
  args: CreatePool
) => {
  const api = await instancePromise;
  const {
    account,
    txOptions,
    firstTokenId,
    firstTokenAmount,
    secondTokenId,
    secondTokenAmount
  } = args;
  const tx = api.tx.xyk.createPool(
    firstTokenId,
    firstTokenAmount,
    secondTokenId,
    secondTokenAmount
  );
  return await signTx(api, tx, account, txOptions);
};
