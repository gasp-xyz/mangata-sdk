import { ApiPromise, WsProvider } from "@polkadot/api";
import { encodeAddress } from "@polkadot/util-crypto";
import { RelayDeposit } from "../../types/xTokens";

export const depositKsm = async (args: RelayDeposit) => {
  const { url, parachainId, address, amount, account, txOptions } = args;
  const provider = new WsProvider(url);
  const kusamaApi = await new ApiPromise({ provider, noInitWarn: true })
    .isReady;
  const mangataFormatAddress = encodeAddress(address, 42);

  const destination = {
    V1: {
      interior: {
        X1: {
          ParaChain: parachainId
        }
      },
      parents: 0
    }
  };

  const beneficiary = {
    V1: {
      interior: {
        X1: {
          AccountId32: {
            id: kusamaApi
              .createType("AccountId32", mangataFormatAddress)
              .toHex(),
            network: "Any"
          }
        }
      },
      parents: 0
    }
  };

  const assets = {
    V1: [
      {
        fun: {
          Fungible: amount
        },
        id: {
          Concrete: {
            interior: "Here",
            parents: 0
          }
        }
      }
    ]
  };

  await kusamaApi.tx.xcmPallet
    .reserveTransferAssets(destination, beneficiary, assets, 0)
    .signAndSend(account, {
      signer: txOptions?.signer,
      nonce: txOptions?.nonce
    });
};
