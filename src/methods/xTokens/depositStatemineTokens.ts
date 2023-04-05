import { ApiPromise, WsProvider } from "@polkadot/api";
import { DepositStatemine } from "../../types/xTokens";

export const depositStatemineTokens = async (args: DepositStatemine) => {
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
  const provider = new WsProvider(url);
  const api = await new ApiPromise({ provider, noInitWarn: true }).isReady;

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
