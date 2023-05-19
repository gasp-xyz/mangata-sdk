import { ApiPromise } from "@polkadot/api";
import { BN } from "@polkadot/util";
import { RelayWithdraw } from "../../types/xTokens";
import { getWeightXTokens } from "../../utils/getWeightXTokens";

/**
 * @since 2.0.0
 */
export const withdrawKsm = async (
  instancePromise: Promise<ApiPromise>,
  args: RelayWithdraw
) => {
  const api = await instancePromise;
  const { account, kusamaAddress, amount, txOptions } = args;
  const tx = api.tx.xTokens.transfer;
  const accountId = api.createType("AccountId32", kusamaAddress).toHex();
  const defaultWeight = new BN("6000000000");
  const interior = {
    X1: {
      AccountId32: {
        network: "Any",
        id: accountId
      }
    }
  };
  const destination = {
    V1: {
      parents: 1,
      interior
    }
  };

  const destWeightLimit = getWeightXTokens(defaultWeight, tx);
  const options = {
    signer: txOptions?.signer,
    nonce: txOptions?.nonce
  };

  await api.tx.xTokens
    .transfer("4", amount, destination, destWeightLimit)
    .signAndSend(account, options);
};
