import { ApiPromise } from "@polkadot/api";
import { BN } from "@polkadot/util";
import { Liquidity } from "../../types/xyk";
import { fromBN } from "../../utils/bnUtility";
import { Object } from "ts-toolbelt";

export type ActivateLiquidityFee = Object.Omit<Liquidity, "txOptions">;

export const forActivateLiquidity = async (
  instancePromise: Promise<ApiPromise>,
  args: ActivateLiquidityFee
): Promise<string> => {
  const api = await instancePromise;
  const { liquidityTokenId, amount, account } = args;
  const dispatchInfo = await api.tx.xyk
    .activateLiquidityV2(liquidityTokenId, amount, null)
    .paymentInfo(account);
  return fromBN(new BN(dispatchInfo.partialFee.toString()));
};
