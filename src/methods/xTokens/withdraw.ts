import { encodeAddress } from "@polkadot/util-crypto";
import { BN } from "@polkadot/util";
import { ApiPromise } from "@polkadot/api";
import { getWeightXTokens } from "../../utils/getWeightXTokens";
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

    const accountId = api.createType("AccountId32", correctAddress).toHex();

    const destination = {
      V1: {
        parents: 1,
        interior: {
          X2: [
            {
              Parachain: parachainId
            },
            {
              AccountId32: {
                network: "Any",
                id: accountId
              }
            }
          ]
        }
      }
    };

    const destWeightLimit = getWeightXTokens(
      new BN(withWeight),
      api.tx.xTokens.transfer
    );

    await signTx(
      api,
      api.tx.xTokens.transfer(tokenId, amount, destination, destWeightLimit),
      account,
      txOptions
    );
  }
};
