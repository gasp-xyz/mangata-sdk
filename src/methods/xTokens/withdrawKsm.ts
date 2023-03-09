import { ApiPromise } from "@polkadot/api";
import { BN } from "@polkadot/util";
import { RelayWithdraw } from "../../types/xTokens";
import { getWeightXTokens } from "../../utils/getWeightXTokens";

export const withdrawKsm = async (
  instancePromise: Promise<ApiPromise>,
  args: RelayWithdraw
) => {
  const api = await instancePromise;
  const { account, kusamaAddress, amount, txOptions } = args;
  const destination = {
    V1: {
      parents: 1,
      interior: {
        X1: {
          AccountId32: {
            network: "Any",
            id: api.createType("AccountId32", kusamaAddress).toHex()
          }
        }
      }
    }
  };

  const destWeightLimit = getWeightXTokens(
    new BN("6000000000"),
    api.tx.xTokens.transfer
  );

  await api.tx.xTokens
    .transfer("4", amount, destination, destWeightLimit)
    .signAndSend(account, {
      signer: txOptions?.signer,
      nonce: txOptions?.nonce
    });
};
