import { ApiPromise } from "@polkadot/api";
import { BN } from "@polkadot/util";
import { BurnLiquidityFee } from "../../types/xyk";
import { fromBN } from "../../utils/bnUtility";

/**
 * @since 2.0.0
 */
export const getBurnLiquidityFee = async (
  instancePromise: Promise<ApiPromise>,
  args: BurnLiquidityFee
): Promise<string> => {
  const api = await instancePromise;
  const { amount, firstTokenId, secondTokenId, account } = args;
  const dispatchInfo = await api.tx.xyk
    .burnLiquidity(firstTokenId, secondTokenId, amount)
    .paymentInfo(account);
  return fromBN(new BN(dispatchInfo.partialFee.toString()));
};
