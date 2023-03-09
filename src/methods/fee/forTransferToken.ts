import { ApiPromise } from "@polkadot/api";
import { BN } from "@polkadot/util";
import { Amount } from "../../types/common";
import { Transfer } from "../../types/tokens";
import { fromBN } from "../../utils/bnUtility";
import { Object } from "ts-toolbelt";

export type TransferTokenFee = Object.Merge<
  Object.Omit<Transfer, "txOptions">,
  { amount: Amount }
>;

export const forTransferToken = async (
  instancePromise: Promise<ApiPromise>,
  args: TransferTokenFee
): Promise<string> => {
  const api = await instancePromise;
  const { address, tokenId, amount, account } = args;
  const dispatchInfo = await api.tx.tokens
    .transfer(address, tokenId, amount)
    .paymentInfo(account);
  return fromBN(new BN(dispatchInfo.partialFee.toString()));
};
