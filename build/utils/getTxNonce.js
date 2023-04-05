import { Query } from "../services/Query";
import { instance } from "../utils/MemoryDatabase";
export const getTxNonce = async (api, address, txOptions) => {
    let nonce;
    if (txOptions && txOptions.nonce) {
        nonce = txOptions.nonce;
    }
    else {
        const onChainNonce = await Query.getNonce(api, address);
        if (instance.hasAddressNonce(address)) {
            nonce = instance.getNonce(address);
        }
        else {
            nonce = onChainNonce;
        }
        if (onChainNonce && onChainNonce.gt(nonce)) {
            nonce = onChainNonce;
        }
        const nextNonce = nonce.addn(1);
        instance.setNonce(address, nextNonce);
    }
    return nonce;
};
