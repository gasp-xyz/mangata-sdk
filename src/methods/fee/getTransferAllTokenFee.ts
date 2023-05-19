import { ApiPromise } from "@polkadot/api";
import { BN } from "@polkadot/util";
import { TransferAllFee } from "../../types/tokens";
import { fromBN } from "../../utils/bnUtility";

/**
 * @since 2.0.0
 */
export const getTransferAllTokenFee = async (
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
