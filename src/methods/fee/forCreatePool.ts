import { ApiPromise } from "@polkadot/api";
import { BN } from "@polkadot/util";
import { CreatePool } from "../../types/xyk";
import { fromBN } from "../../utils/bnUtility";
import { Object } from "ts-toolbelt";

export type CreatePoolFee = Object.Omit<CreatePool, "txOptions">;

export const forCreatePool = async (
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
