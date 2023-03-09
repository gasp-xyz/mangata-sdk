import { ApiPromise } from "@polkadot/api";
import { BN } from "@polkadot/util";
import { Address } from "../../types/common";

export const getNonce = async (
  instancePromise: Promise<ApiPromise>,
  address: Address
): Promise<BN> => {
  const api = await instancePromise;
  const nonce = await api.rpc.system.accountNextIndex(address);
  return nonce.toBn();
};
