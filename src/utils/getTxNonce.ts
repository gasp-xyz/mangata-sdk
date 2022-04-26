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
  } else {
    const onChainNonce = await Query.getNonce(api, address);
    if (instance.hasAddressNonce(address)) {
      nonce = instance.getNonce(address);
    } else {
      nonce = onChainNonce;
    }

    if (onChainNonce && onChainNonce.gt(nonce)) {
      nonce = onChainNonce;
    }

    const nextNonce: BN = nonce.addn(1);
    instance.setNonce(address, nextNonce);
  }

  return nonce;
};
