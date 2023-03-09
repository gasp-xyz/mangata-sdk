import { ApiPromise } from "@polkadot/api";
import { signTx } from "../../signTx";
import { Liquidity } from "../../types/xyk";

export const deactivateLiquidity = async (
  instancePromise: Promise<ApiPromise>,
  args: Liquidity
) => {
  const api = await instancePromise;
  const { account, liquidityTokenId, amount, txOptions } = args;
  const tx = api.tx.xyk.deactivateLiquidityV2(liquidityTokenId, amount);
  return await signTx(api, tx, account, txOptions);
};
