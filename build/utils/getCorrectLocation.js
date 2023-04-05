export const getCorrectLocation = (tokenSymbol, location) => {
    if (tokenSymbol === "BNC") {
        return {
            parents: "0",
            interior: {
                x1: { generalKey: "0x0001" }
            }
        };
    }
    else if (tokenSymbol === "vBNC") {
        return {
            parents: "0",
            interior: {
                x1: { generalKey: "0x0101" }
            }
        };
    }
    else if (tokenSymbol === "ZLK") {
        return {
            parents: "0",
            interior: {
                x1: { generalKey: "0x0207" }
            }
        };
    }
    else if (tokenSymbol === "vsKSM") {
        return {
            parents: "0",
            interior: {
                x1: { generalKey: "0x0404" }
            }
        };
    }
    else if (tokenSymbol === "vKSM") {
        return {
            parents: "0",
            interior: {
                x1: { generalKey: "0x0104" }
            }
        };
    }
    else if (tokenSymbol === "USDT") {
        return {
            parents: "0",
            interior: {
                x2: [{ PalletInstance: 50 }, { GeneralIndex: 1984 }]
            }
        };
    }
    else if (tokenSymbol === "RMRK") {
        return {
            parents: "0",
            interior: {
                x2: [{ PalletInstance: 50 }, { GeneralIndex: 8 }]
            }
        };
    }
    else {
        return {
            parents: "1",
            interior: location.v1.interior
        };
    }
};
