import { ApiPromise, WsProvider } from "@polkadot/api";
import { Deposit } from "../../types/xTokens";

export const depositFromParachain = async (args: Deposit): Promise<void> => {
  const { url, asset, destination, weightLimit, account, txOptions } = args;
  const api = await new ApiPromise({
    provider: new WsProvider(url),
    noInitWarn: true
  }).isReady;

  await api.tx.xTokens
    .transferMultiasset(asset, destination, weightLimit)
    .signAndSend(account, {
      signer: txOptions?.signer,
      nonce: txOptions?.nonce
    });
};
