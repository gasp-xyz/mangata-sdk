import { ApiPromise } from "@polkadot/api";
import { signTx } from "../../signTx";
import { Liquidity } from "../../types/xyk";

export const activateLiquidity = async (
  instancePromise: Promise<ApiPromise>,
  args: Liquidity
) => {
  const api = await instancePromise;
  const { account, liquidityTokenId, amount, txOptions } = args;
  const tx = api.tx.xyk.activateLiquidityV2(liquidityTokenId, amount, null);
  return await signTx(api, tx, account, txOptions);
};
