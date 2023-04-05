import { ApiPromise, WsProvider } from "@polkadot/api";
import { encodeAddress } from "@polkadot/util-crypto";
import { RelayDeposit } from "../../types/xTokens";

export const depositKsm = async (args: RelayDeposit) => {
  const { url, address, amount, account, txOptions } = args;
  const provider = new WsProvider(url);
  const kusamaApi = await new ApiPromise({ provider, noInitWarn: true })
    .isReady;
  const mangataFormatAddress = encodeAddress(address, 42);

  await kusamaApi.tx.xcmPallet
    .limitedReserveTransferAssets(
      {
        V3: {
          parents: 0,
          interior: {
            X1: { Parachain: 2110 }
          }
        }
      },
      {
        V3: {
          parents: 0,
          interior: {
            X1: {
              AccountId32: {
                id: kusamaApi
                  .createType("AccountId32", mangataFormatAddress)
                  .toHex()
              }
            }
          }
        }
      },
      {
        V3: [
          {
            id: { Concrete: { parents: 0, interior: "Here" } },
            fun: { Fungible: amount }
          }
        ]
      },
      0,
      "Unlimited"
    )
    .signAndSend(account, {
      signer: txOptions?.signer,
      nonce: txOptions?.nonce
    });
};
