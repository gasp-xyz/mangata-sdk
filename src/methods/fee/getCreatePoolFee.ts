import { ApiPromise } from "@polkadot/api";
import { BN } from "@polkadot/util";
import { CreatePoolFee } from "../../types/xyk";
import { fromBN } from "../../utils/bnUtility";

/**
 * @since 2.0.0
 */
export const getCreatePoolFee = async (
  instancePromise: Promise<ApiPromise>,
  args: CreatePoolFee
): Promise<string> => {
  const api = await instancePromise;
  const {
    firstTokenId,
    firstTokenAmount,
    secondTokenId,
    secondTokenAmount,
    account
  } = args;
  const dispatchInfo = await api.tx.xyk
    .createPool(
      firstTokenId,
      firstTokenAmount,
      secondTokenId,
      secondTokenAmount
    )
    .paymentInfo(account);
  return fromBN(new BN(dispatchInfo.partialFee.toString()));
};
