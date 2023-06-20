import { encodeAddress } from "@polkadot/util-crypto";
import { BN } from "@polkadot/util";
import { ApiPromise } from "@polkadot/api";
import { signTx } from "../../utils/signTx";
import { Withdraw } from "../../types/xTokens";

/**
 * @since 2.0.0
 */
export const withdraw = async (
  instancePromise: Promise<ApiPromise>,
  args: Withdraw
) => {
  const {
    tokenSymbol,
    withWeight,
    parachainId,
    account,
    destinationAddress,
    amount,
    txOptions
  } = args;
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
    const statemineTokens = ["RMRK", "USDT"];
    if (statemineTokens.includes(tokenSymbol)) {
      destWeightLimit = "Unlimited";
    } else {
      destWeightLimit = {
        Limited: {
          ref_time: new BN(withWeight),
          proof_size: 0
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
