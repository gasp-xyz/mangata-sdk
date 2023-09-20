import { ApiPromise } from "@polkadot/api";
import { BN } from "@polkadot/util";
import { Account, TxOptions } from "../../types/common";
import { signTx } from "src/utils/signTx";
import { MoonriverWithdraw } from "../../types/xTokens";
import { fromBN } from "src/utils/bnUtility";

export const getWithdrawFromMoonriverFee = async (
  instancePromise: Promise<ApiPromise>,
  args: MoonriverWithdraw
) => {
  const api = await instancePromise;
  const { account, tokenSymbol, moonriverAddress, amount, txOptions } = args;

  const assetRegistryMetadata =
    await api.query.assetRegistry.metadata.entries();

  const assetFiltered = assetRegistryMetadata.filter((metadata) => {
    const symbol = metadata[1].value.symbol.toPrimitive();
    return symbol === tokenSymbol;
  })[0];

  const tokenId = (assetFiltered[0].toHuman() as string[])[0].replace(
    /[, ]/g,
    ""
  );

  const destination = {
    V3: {
      parents: 1,
      interior: {
        X2: [
          {
            Parachain: 2023
          },
          {
            AccountKey20: {
              key: api.createType("AccountId20", moonriverAddress).toHex()
            }
          }
        ]
      }
    }
  };

  const destWeightLimit = {
    Limited: {
      ref_time: new BN("1000000000"),
      proof_size: 0
    }
  };

  const dispatchInfo = await api.tx.xTokens
    .transfer(tokenId, amount, destination, destWeightLimit)
    .paymentInfo(account);

  return fromBN(new BN(dispatchInfo.partialFee.toString()));
};
