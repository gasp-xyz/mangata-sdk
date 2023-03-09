import { getNonce } from "../methods/query/getNonce";
getNonce;
import { dbInstance } from "./inMemoryDatabase";
export const getTxNonce = async (api, address, txOptions) => {
    let nonce;
    if (txOptions && txOptions.nonce) {
        nonce = txOptions.nonce;
    }
    else {
        const onChainNonce = await api.rpc.system.accountNextIndex(address);
        if (dbInstance.hasAddressNonce(address)) {
            nonce = dbInstance.getNonce(address);
        }
        else {
            nonce = onChainNonce.toBn();
        }
        if (onChainNonce.toBn() && onChainNonce.toBn().gt(nonce)) {
            nonce = onChainNonce.toBn();
        }
        const nextNonce = nonce.addn(1);
        dbInstance.setNonce(address, nextNonce);
    }
    return nonce;
};
