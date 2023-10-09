import { ApiPromise } from "@polkadot/api";
import { BN } from "@polkadot/util";
import { signTx } from "../../utils/signTx";
import { MoonriverWithdraw } from "../../types/xTokens";
import { logger } from "../../utils/mangataLogger";

export const withdrawToMoonriver = async (
  instancePromise: Promise<ApiPromise>,
  args: MoonriverWithdraw
) => {
  logger.info("Withdraw To Moonriver started ...");
  const api = await instancePromise;
  const { account, tokenSymbol, moonriverAddress, amount, txOptions } = args;
  logger.info("withdrawToMoonriver", {
    tokenSymbol,
    moonriverAddress,
    amount: amount.toString()
  });

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
      proof_size: new BN("100000")
    }
  };

  await signTx(
    api,
    api.tx.xTokens.transfer(tokenId, amount, destination, destWeightLimit),
    account,
    txOptions
  );
};
