import { ApiPromise, WsProvider } from "@polkadot/api";
import { Deposit } from "../../types/xTokens";
import { logger } from "../../utils/mangataLogger";

/**
 * @since 2.0.0
 */
export const depositFromParachain = async (args: Deposit): Promise<void> => {
  logger.info("Deposit From Parachain started ...");
  const { url, asset, destination, weightLimit, account, txOptions } = args;
  logger.info("depositFromParachain", {
    url,
    asset,
    destination,
    weightLimit
  });
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
