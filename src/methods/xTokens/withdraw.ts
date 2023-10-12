import { encodeAddress } from "@polkadot/util-crypto";
import { BN } from "@polkadot/util";
import { ApiPromise } from "@polkadot/api";
import { signTx } from "../../utils/signTx";
import { Withdraw } from "../../types/xTokens";
import { logger } from "../../utils/mangataLogger";

/**
 * @since 2.0.0
 */
export const withdraw = async (
  instancePromise: Promise<ApiPromise>,
  args: Withdraw
) => {
  logger.info("Withdraw method started ...");
  const {
    tokenSymbol,
    withWeight,
    parachainId,
    account,
    destinationAddress,
    amount,
    txOptions
  } = args;
  logger.info("withdraw", {
    tokenSymbol,
    withWeight,
    parachainId,
    destinationAddress,
    amount: amount.toString()
  });
  const api = await instancePromise;
  const correctAddress = encodeAddress(destinationAddress, 42);

  const assetRegistryMetadata =
    await api.query.assetRegistry.metadata.entries();

  const assetMetadata = assetRegistryMetadata.find((metadata) => {
    const symbol = metadata[1].value.symbol.toPrimitive();
    return symbol === tokenSymbol;
  });

  if (assetMetadata && assetMetadata[1].value.location) {
    const tokenId = (assetMetadata[0].toHuman() as string[])[0].replace(
      /[, ]/g,
      ""
    );

    const destination = {
      V3: {
        parents: 1,
        interior: {
          X2: [
            {
              Parachain: parachainId
            },
            {
              AccountId32: {
                id: api.createType("AccountId32", correctAddress).toHex()
              }
            }
          ]
        }
      }
    };

    let destWeightLimit;
    if (withWeight === "Unlimited") {
      destWeightLimit = "Unlimited";
    } else {
      destWeightLimit = {
        Limited: {
          ref_time: new BN(withWeight),
          proof_size: new BN("100000")
        }
      };
    }

    await signTx(
      api,
      api.tx.xTokens.transfer(tokenId, amount, destination, destWeightLimit),
      account,
      txOptions
    );
  }
};
