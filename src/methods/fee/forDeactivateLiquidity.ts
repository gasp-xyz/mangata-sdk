import { ApiPromise } from "@polkadot/api";
import { BN } from "@polkadot/util";
import { Liquidity } from "../../types/xyk";
import { fromBN } from "../../utils/bnUtility";
import { Except } from "type-fest";

export type DeactivateLiquidityFee = Except<Liquidity, "txOptions">;

export const forDeactivateLiquidity = async (
  instancePromise: Promise<ApiPromise>,
  args: DeactivateLiquidityFee
): Promise<string> => {
  const api = await instancePromise;
  const { liquidityTokenId, amount, account } = args;
  const dispatchInfo = await api.tx.xyk
    .deactivateLiquidityV2(liquidityTokenId, amount)
    .paymentInfo(account);
  return fromBN(new BN(dispatchInfo.partialFee.toString()));
};
