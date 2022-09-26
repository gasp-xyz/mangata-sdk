import { ApiPromise } from "@polkadot/api";
import { BN } from "@polkadot/util";

import { Query } from "../services/Query";
import { instance } from "../utils/MemoryDatabase";
import { TxOptions } from "../types/TxOptions";

export const getTxNonce = async (
  api: ApiPromise,
  address: string,
  txOptions?: TxOptions
): Promise<BN> => {
  let nonce: BN;
  if (txOptions && txOptions.nonce) {
    nonce = txOptions.nonce;
    console.info(`who:${address} nonce:${nonce.toString()} is set`);
  } else {
    const onChainNonce = await Query.getNonce(api, address);
    if (instance.hasAddressNonce(address)) {
      nonce = instance.getNonce(address);
      console.info(`who:${address} nonce:${nonce.toString()} read from db`);
    } else {
      nonce = onChainNonce;
      console.info(`who:${address} nonce:${nonce.toString()} read from rpc call`);
    }

    if (onChainNonce && onChainNonce.gt(nonce)) {
      console.info(`who:${address} nonce:${nonce.toString()} aligned with rpc nonce`);
      nonce = onChainNonce;
    }

    const nextNonce: BN = nonce.addn(1);
    instance.setNonce(address, nextNonce);
  }

  return nonce;
};
