import { ApiPromise } from "@polkadot/api";
import { BN } from "@polkadot/util";
import { WithdrawKsmFee } from "../../types/xTokens";
import { fromBN } from "../../utils/bnUtility";

/**
 * @since 2.0.0
 */
export const getWithdrawKsmFee = async (
  instancePromise: Promise<ApiPromise>,
  args: WithdrawKsmFee
) => {
  const api = await instancePromise;
  const { account, kusamaAddress, amount } = args;
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

  const dispatchInfo = await api.tx.xTokens
    .transfer("4", amount, destination, destWeightLimit)
    .paymentInfo(account);

  return fromBN(new BN(dispatchInfo.partialFee.toString()));
};
