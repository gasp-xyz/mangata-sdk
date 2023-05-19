import { ApiPromise, WsProvider } from "@polkadot/api";
import { BN } from "@polkadot/util";
import { DepositFromParachainFee } from "../../types/xTokens";
import { fromBN } from "../../utils/bnUtility";

/**
 * @since 2.0.0
 */
export const getDepositFromParachainFee = async (
  args: DepositFromParachainFee
) => {
  const { url, asset, destination, weightLimit, account } = args;
  const api = await new ApiPromise({
    provider: new WsProvider(url),
    noInitWarn: true
  }).isReady;

  const dispatchInfo = await api.tx.xTokens
    .transferMultiasset(asset, destination, weightLimit)
    .paymentInfo(account);

  return fromBN(new BN(dispatchInfo.partialFee.toString()));
};
