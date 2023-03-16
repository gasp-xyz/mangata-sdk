import { ApiPromise } from "@polkadot/api";
import { SubmittableExtrinsic } from "@polkadot/api/types";
import { ISubmittableResult } from "@polkadot/types/types";
import { MangataGenericEvent } from "../../types/common";
import { signTx } from "../../signTx";
import { MintLiquidity } from "../../types/xyk";

async function mintLiquidity(
  instancePromise: Promise<ApiPromise>,
  args: MintLiquidity,
  isForBatch: false
): Promise<MangataGenericEvent[]>;

async function mintLiquidity(
  instancePromise: Promise<ApiPromise>,
  args: MintLiquidity,
  isForBatch: true
): Promise<SubmittableExtrinsic<"promise", ISubmittableResult>>;

async function mintLiquidity(
  instancePromise: Promise<ApiPromise>,
  args: MintLiquidity,
  isForBatch: boolean
) {
  const api = await instancePromise;
  const {
    account,
    firstTokenId,
    secondTokenId,
    firstTokenAmount,
    expectedSecondTokenAmount,
    txOptions
  } = args;
  const tx = api.tx.xyk.mintLiquidity(
    firstTokenId,
    secondTokenId,
    firstTokenAmount,
    expectedSecondTokenAmount
  );
  return isForBatch ? tx : await signTx(api, tx, account, txOptions);
}

export { mintLiquidity };
