import { ApiPromise } from "@polkadot/api";
import { BN } from "@polkadot/util";
import { RelayWithdraw } from "../../types/xTokens";

/**
 * @since 2.0.0
 */
export const withdrawKsm = async (
  instancePromise: Promise<ApiPromise>,
  args: RelayWithdraw
) => {
  const api = await instancePromise;
  const { account, kusamaAddress, amount, txOptions } = args;
  const destination = {
    V3: {
      parents: 1,
      interior: {
        X1: {
          AccountId32: {
            id: api.createType("AccountId32", kusamaAddress).toHex()
          }
        }
      }
    }
  };

  const destWeightLimit = {
    Limited: {
      refTime: new BN("6000000000"),
      proofSize: 0
    }
  };

  await api.tx.xTokens
    .transfer("4", amount, destination, destWeightLimit)
    .signAndSend(account, {
      signer: txOptions?.signer,
      nonce: txOptions?.nonce
    });
};
