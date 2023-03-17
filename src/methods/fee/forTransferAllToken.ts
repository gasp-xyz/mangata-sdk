import { ApiPromise } from "@polkadot/api";
import { BN } from "@polkadot/util";
import { Transfer } from "../../types/tokens";
import { Except } from "type-fest";
import { fromBN } from "../../utils/bnUtility";

export type TransferAllFee = Except<Transfer, "txOptions">;

export const forTransferAllToken = async (
  instancePromise: Promise<ApiPromise>,
  args: TransferAllFee
): Promise<string> => {
  const api = await instancePromise;
  const { account, address, tokenId } = args;
  const dispatchInfo = await api.tx.tokens
    .transferAll(address, tokenId, true)
    .paymentInfo(account);
  return fromBN(new BN(dispatchInfo.partialFee.toString()));
};
