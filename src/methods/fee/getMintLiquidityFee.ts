import { ApiPromise } from "@polkadot/api";
import { BN } from "@polkadot/util";
import { MintLiquidityFee } from "../../types/xyk";
import { fromBN } from "../../utils/bnUtility";

/**
 * @since 2.0.0
 */
export const getMintLiquidityFee = async (
  instancePromise: Promise<ApiPromise>,
  args: MintLiquidityFee
): Promise<string> => {
  const api = await instancePromise;
  const {
    firstTokenId,
    secondTokenId,
    firstTokenAmount,
    expectedSecondTokenAmount,
    account
  } = args;
  const dispatchInfo = await api.tx.xyk
    .mintLiquidity(
      firstTokenId,
      secondTokenId,
      firstTokenAmount,
      expectedSecondTokenAmount
    )
    .paymentInfo(account);
  return fromBN(new BN(dispatchInfo.partialFee.toString()));
};
