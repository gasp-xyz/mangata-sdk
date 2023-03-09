import { BN, isHex, hexToU8a } from "@polkadot/util";
export const getError = (api, method, eventData) => {
    const failedEvent = method === "ExtrinsicFailed";
    if (failedEvent) {
        const error = eventData.find((item) => item.lookupName.includes("DispatchError"));
        const errorData = error?.data?.toHuman?.();
        const errorIdx = errorData?.Module?.error;
        const moduleIdx = errorData?.Module?.index;
        if (errorIdx && moduleIdx) {
            try {
                const decode = api.registry.findMetaError({
                    error: isHex(errorIdx) ? hexToU8a(errorIdx) : new BN(errorIdx),
                    index: new BN(moduleIdx)
                });
                return {
                    documentation: decode.docs,
                    name: decode.name
                };
            }
            catch (error) {
                return {
                    documentation: ["Unknown error"],
                    name: "UnknownError"
                };
            }
        }
        else {
            return {
                documentation: ["Unknown error"],
                name: "UnknownError"
            };
        }
    }
    return null;
};
