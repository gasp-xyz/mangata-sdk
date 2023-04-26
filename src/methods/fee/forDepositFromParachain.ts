import { ApiPromise, WsProvider } from "@polkadot/api";
import { BN } from "@polkadot/util";
import { Except } from "type-fest";
import { Deposit } from "../../types/xTokens";
import { fromBN } from "../../utils/bnUtility";

export type DepositFromParachainFee = Except<Deposit, "txOptions">;

export const forDepositFromParachain = async (
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
