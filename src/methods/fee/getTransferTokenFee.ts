import { ApiPromise } from "@polkadot/api";
import { BN } from "@polkadot/util";
import { TransferTokenFee } from "../../types/tokens";
import { fromBN } from "../../utils/bnUtility";

/**
 * @since 2.0.0
 */
export const getTransferTokenFee = async (
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
