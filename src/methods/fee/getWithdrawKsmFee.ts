import { ApiPromise } from "@polkadot/api";
import { BN } from "@polkadot/util";
import { WithdrawKsmFee } from "../../types/xTokens";
import { getWeightXTokens } from "../../utils/getWeightXTokens";
import { fromBN } from "../../utils/bnUtility";

export const getWithdrawKsmFee = async (
  instancePromise: Promise<ApiPromise>,
  args: WithdrawKsmFee
) => {
  const api = await instancePromise;
  const { account, kusamaAddress, amount } = args;
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
    api.tx.xTokens.transferMultiasset
  );

  const dispatchInfo = await api.tx.xTokens
    .transfer("4", amount, destination, destWeightLimit)
    .paymentInfo(account);

  return fromBN(new BN(dispatchInfo.partialFee.toString()));
};
