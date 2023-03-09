import { hexToBn, isHex, BN } from "@polkadot/util";
export const getTokenBalance = async (instancePromise, address, tokenId) => {
    const api = await instancePromise;
    const { free, reserved, frozen } = await api.query.tokens.accounts(address, tokenId);
    return {
        free: isHex(free.toString())
            ? hexToBn(free.toString())
            : new BN(free.toString()),
        reserved: isHex(reserved.toString())
            ? hexToBn(reserved.toString())
            : new BN(reserved.toString()),
        frozen: isHex(frozen.toString())
            ? hexToBn(frozen.toString())
            : new BN(frozen.toString())
    };
};
