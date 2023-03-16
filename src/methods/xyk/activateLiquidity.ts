import { ApiPromise } from "@polkadot/api";
import { SubmittableExtrinsic } from "@polkadot/api/types";
import { ISubmittableResult } from "@polkadot/types/types";
import { MangataGenericEvent } from "../../types/common";
import { signTx } from "../../signTx";
import { Liquidity } from "../../types/xyk";

async function activateLiquidity(
  instancePromise: Promise<ApiPromise>,
  args: Liquidity,
  isForBatch: false
): Promise<MangataGenericEvent[]>;

async function activateLiquidity(
  instancePromise: Promise<ApiPromise>,
  args: Liquidity,
  isForBatch: true
): Promise<SubmittableExtrinsic<"promise", ISubmittableResult>>;

async function activateLiquidity(
  instancePromise: Promise<ApiPromise>,
  args: Liquidity,
  isForBatch: boolean
) {
  const api = await instancePromise;
  const { account, liquidityTokenId, amount, txOptions } = args;
  const tx = api.tx.xyk.activateLiquidityV2(liquidityTokenId, amount, null);
  return isForBatch ? tx : await signTx(api, tx, account, txOptions);
}

export { activateLiquidity };
