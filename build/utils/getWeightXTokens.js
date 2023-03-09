export const getWeightXTokens = (weight, extrinsicCall) => {
    return extrinsicCall?.meta.args.at(-1)?.type.eq("XcmV2WeightLimit")
        ? {
            Limited: weight
        }
        : weight;
};
