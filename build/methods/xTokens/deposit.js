import { ApiPromise, WsProvider } from "@polkadot/api";
import { BN } from "@polkadot/util";
import { getWeightXTokens } from "../../utils/getWeightXTokens";
export const deposit = async (args) => {
    const { url, asset, destination, weight, account, txOptions } = args;
    const provider = new WsProvider(url);
    const api = await new ApiPromise({ provider, noInitWarn: true }).isReady;
    const destWeightLimit = getWeightXTokens(new BN(weight), api.tx.xTokens.transferMultiasset);
    const tx = api.tx.xTokens.transferMultiasset(asset, destination, destWeightLimit);
    await tx.signAndSend(account, {
        signer: txOptions?.signer,
        nonce: txOptions?.nonce
    });
};
