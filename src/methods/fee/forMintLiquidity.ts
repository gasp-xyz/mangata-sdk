import { ApiPromise } from "@polkadot/api";
import { BN } from "@polkadot/util";
import { Object } from "ts-toolbelt";
import { MintLiquidity } from "../../types/xyk";
import { fromBN } from "../../utils/bnUtility";

export type MintLiquidityFee = Object.Omit<MintLiquidity, "txOptions">;

export const forMintLiquidity = async (
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
