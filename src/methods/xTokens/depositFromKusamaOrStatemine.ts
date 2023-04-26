import { ApiPromise, WsProvider } from "@polkadot/api";
import { RelayDeposit } from "../../types/xTokens";

export const depositFromKusamaOrStatemine = async (args: RelayDeposit) => {
  const {
    url,
    destination,
    beneficiary,
    assets,
    feeAssetItem,
    weightLimit,
    txOptions,
    account
  } = args;

  const api = await new ApiPromise({
    provider: new WsProvider(url),
    noInitWarn: true
  }).isReady;

  await api.tx.polkadotXcm
    .limitedReserveTransferAssets(
      destination,
      beneficiary,
      assets,
      feeAssetItem,
      weightLimit
    )
    .signAndSend(account, {
      signer: txOptions?.signer,
      nonce: txOptions?.nonce
    });
};
