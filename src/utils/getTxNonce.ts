import { ApiPromise } from "@polkadot/api";
import { BN } from "@polkadot/util";
import { getNonce } from "../methods/query/getNonce";
import { TxOptions } from "../types/common";

getNonce;
import { dbInstance } from "./inMemoryDatabase";

export const getTxNonce = async (
  api: ApiPromise,
  address: string,
  txOptions?: Partial<TxOptions>
): Promise<BN> => {
  let nonce: BN;
  if (txOptions && txOptions.nonce) {
    nonce = txOptions.nonce;
  } else {
    const onChainNonce = await api.rpc.system.accountNextIndex(address);

    if (dbInstance.hasAddressNonce(address)) {
      nonce = dbInstance.getNonce(address);
    } else {
      nonce = onChainNonce.toBn();
    }

    if (onChainNonce.toBn() && onChainNonce.toBn().gt(nonce)) {
      nonce = onChainNonce.toBn();
    }

    const nextNonce: BN = nonce.addn(1);
    dbInstance.setNonce(address, nextNonce);
  }

  return nonce;
};
