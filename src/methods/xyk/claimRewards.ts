import { ApiPromise } from "@polkadot/api";
import { signTx } from "../../signTx";
import { Liquidity } from "../../types/xyk";

export const claimRewards = async (
  instancePromise: Promise<ApiPromise>,
  args: Liquidity
) => {
  const api = await instancePromise;
  const { account, txOptions, liquidityTokenId, amount } = args;
  const tx = api.tx.xyk.claimRewardsV2(liquidityTokenId, amount);
  return await signTx(api, tx, account, txOptions);
};
