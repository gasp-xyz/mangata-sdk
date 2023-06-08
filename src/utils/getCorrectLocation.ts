export const getCorrectLocation = (tokenSymbol: string, location: any) => {
  if (tokenSymbol === "BNC") {
    return {
      parents: "0",
      interior: {
        x1: {
          generalKey: {
            length: 2,
            data: "0x0001000000000000000000000000000000000000000000000000000000000000"
          }
        }
      }
    };
  } else if (tokenSymbol === "vBNC") {
    return {
      parents: "0",
      interior: {
        x1: {
          generalKey: {
            length: 2,
            data: "0x0101000000000000000000000000000000000000000000000000000000000000"
          }
        }
      }
    };
  } else if (tokenSymbol === "ZLK") {
    return {
      parents: "0",
      interior: {
        x1: {
          generalKey: {
            length: 2,
            data: "0x0207000000000000000000000000000000000000000000000000000000000000"
          }
        }
      }
    };
  } else if (tokenSymbol === "vsKSM") {
    return {
      parents: "0",
      interior: {
        x1: {
          generalKey: {
            length: 2,
            data: "0x0404000000000000000000000000000000000000000000000000000000000000"
          }
        }
      }
    };
  } else if (tokenSymbol === "vKSM") {
    return {
      parents: "0",
      interior: {
        x1: {
          generalKey: {
            length: 2,
            data: "0x0104000000000000000000000000000000000000000000000000000000000000"
          }
        }
      }
    };
  } else if (tokenSymbol === "USDT") {
    return {
      parents: "0",
      interior: {
        x2: [{ PalletInstance: 50 }, { GeneralIndex: 1984 }]
      }
    };
  } else if (tokenSymbol === "RMRK") {
    return {
      parents: "0",
      interior: {
        x2: [{ PalletInstance: 50 }, { GeneralIndex: 8 }]
      }
    };
  } else {
    return {
      interior: location.v3.interior
    };
  }
};
