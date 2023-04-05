import { ApiPromise } from "@polkadot/api";
import { BN } from "@polkadot/util";
import { WsProvider } from "@polkadot/rpc-provider/ws";
import { encodeAddress } from "@polkadot/util-crypto";
import { fromBN } from "../utils/BNutility";
import { getWeightXTokens } from "../utils/getWeightXTokens";
export class Fee {
    static async sendTokenFromParachainToMangataFee(...args) {
        const [mangataApi, url, tokenSymbol, destWeight, account, mangataAddress, amount] = args;
        const provider = new WsProvider(url);
        const api = await new ApiPromise({ provider }).isReady;
        const correctMangataAddress = encodeAddress(mangataAddress, 42);
        const assetRegistryMetadata = await mangataApi.query.assetRegistry.metadata.entries();
        const assetMetadata = assetRegistryMetadata.find((metadata) => {
            const symbol = metadata[1].value.symbol.toPrimitive();
            return symbol === tokenSymbol;
        });
        if (assetMetadata && assetMetadata[1].value.location) {
            const { location, decimals } = assetMetadata[1].unwrap();
            const decodedLocation = JSON.parse(location.toString());
            const decodedDecimals = JSON.parse(decimals.toString());
            const asset = {
                V1: {
                    id: {
                        Concrete: {
                            parents: "1",
                            interior: decodedLocation.v1.interior
                        }
                    },
                    fun: {
                        Fungible: amount
                    }
                }
            };
            const destination = {
                V1: {
                    parents: 1,
                    interior: {
                        X2: [
                            {
                                Parachain: 2110
                            },
                            {
                                AccountId32: {
                                    network: "Any",
                                    id: api
                                        .createType("AccountId32", correctMangataAddress)
                                        .toHex()
                                }
                            }
                        ]
                    }
                }
            };
            const destWeightLimit = getWeightXTokens(new BN(destWeight), api.tx.xTokens.transferMultiasset);
            const dispatchInfo = await api.tx.xTokens
                .transferMultiasset(asset, destination, destWeightLimit)
                .paymentInfo(account);
            return fromBN(new BN(dispatchInfo.partialFee.toString()), Number(decodedDecimals));
        }
        else {
            return "0";
        }
    }
    static async sendTokenFromMangataToParachainFee(...args) {
        const [api, tokenSymbol, withWeight, parachainId, account, destinationAddress, amount] = args;
        const correctAddress = encodeAddress(destinationAddress, 42);
        const assetRegistryMetadata = await api.query.assetRegistry.metadata.entries();
        const assetMetadata = assetRegistryMetadata.find((metadata) => {
            const symbol = metadata[1].value.symbol.toPrimitive();
            return symbol === tokenSymbol;
        });
        if (assetMetadata && assetMetadata[1].value.location) {
            const tokenId = assetMetadata[0].toHuman()[0].replace(/[, ]/g, "");
            const destination = {
                V1: {
                    parents: 1,
                    interior: {
                        X2: [
                            {
                                Parachain: parachainId
                            },
                            {
                                AccountId32: {
                                    network: "Any",
                                    id: api.createType("AccountId32", correctAddress).toHex()
                                }
                            }
                        ]
                    }
                }
            };
            const destWeightLimit = getWeightXTokens(new BN(withWeight), api.tx.xTokens.transfer);
            const dispatchInfo = await api.tx.xTokens
                .transfer(tokenId, amount, destination, destWeightLimit)
                .paymentInfo(account);
            return fromBN(new BN(dispatchInfo.partialFee.toString()));
        }
        else {
            return "0";
        }
    }
    /**
     * @deprecated
     */
    static async sendTurTokenFromTuringToMangataFee(api, turingUrl, account, mangataAddress, amount) {
        const provider = new WsProvider(turingUrl);
        const turingApi = await new ApiPromise({ provider }).isReady;
        const correctAddress = encodeAddress(mangataAddress, 42);
        const asset = {
            V1: {
                id: {
                    Concrete: {
                        parents: 1,
                        interior: {
                            X1: {
                                Parachain: 2114
                            }
                        }
                    }
                },
                fun: {
                    Fungible: amount
                }
            }
        };
        const destination = {
            V1: {
                parents: 1,
                interior: {
                    X2: [
                        {
                            Parachain: 2110
                        },
                        {
                            AccountId32: {
                                network: "Any",
                                id: api.createType("AccountId32", correctAddress).toHex()
                            }
                        }
                    ]
                }
            }
        };
        const destWeightLimit = getWeightXTokens(new BN("4000000000"), api.tx.xTokens.transferMultiasset);
        const dispatchInfo = await turingApi.tx.xTokens
            .transferMultiasset(asset, destination, destWeightLimit)
            .paymentInfo(account);
        return fromBN(new BN(dispatchInfo.partialFee.toString()), 10);
    }
    /**
     * @deprecated
     */
    static async sendTurTokenFromMangataToTuringFee(api, mangataAccount, destinationAddress, amount) {
        const correctAddress = encodeAddress(destinationAddress, 42);
        const destination = {
            V1: {
                parents: 1,
                interior: {
                    X2: [
                        {
                            Parachain: 2114
                        },
                        {
                            AccountId32: {
                                network: "Any",
                                id: api.createType("AccountId32", correctAddress).toHex()
                            }
                        }
                    ]
                }
            }
        };
        const dispatchInfo = await api.tx.xTokens
            .transfer("7", amount, destination, new BN("6000000000"))
            .paymentInfo(mangataAccount);
        return fromBN(new BN(dispatchInfo.partialFee.toString()));
    }
    static async sendKusamaTokenFromRelayToParachainFee(kusamaEndpointUrl, ksmAccount, destinationMangataAddress, amount, parachainId) {
        const provider = new WsProvider(kusamaEndpointUrl);
        const kusamaApi = await new ApiPromise({ provider }).isReady;
        const tx = kusamaApi.tx.xcmPallet.limitedReserveTransferAssets({
            V3: {
                parents: 0,
                interior: {
                    X1: { Parachain: parachainId }
                }
            }
        }, {
            V3: {
                parents: 0,
                interior: {
                    X1: {
                        AccountId32: {
                            id: kusamaApi
                                .createType("AccountId32", destinationMangataAddress)
                                .toHex()
                        }
                    }
                }
            }
        }, {
            V3: [
                {
                    id: { Concrete: { parents: 0, interior: "Here" } },
                    fun: { Fungible: amount }
                }
            ]
        }, 0, "Unlimited");
        const dispatchInfo = await tx.paymentInfo(ksmAccount);
        return fromBN(new BN(dispatchInfo.partialFee.toString()), 12);
    }
    static async sendKusamaTokenFromParachainToRelayFee(api, mangataAccount, destinationKusamaAddress, amount) {
        const destination = {
            V1: {
                parents: 1,
                interior: {
                    X1: {
                        AccountId32: {
                            network: "Any",
                            id: api
                                .createType("AccountId32", encodeAddress(destinationKusamaAddress, 2))
                                .toHex()
                        }
                    }
                }
            }
        };
        const destWeightLimit = getWeightXTokens(new BN("6000000000"), api.tx.xTokens.transferMultiasset);
        const dispatchInfo = await api.tx.xTokens
            .transfer("4", amount, destination, destWeightLimit)
            .paymentInfo(mangataAccount);
        return fromBN(new BN(dispatchInfo.partialFee.toString()));
    }
    static async activateLiquidity(api, account, liquditityTokenId, amount) {
        const dispatchInfo = await api.tx.xyk
            .activateLiquidityV2(liquditityTokenId, amount, null)
            .paymentInfo(account);
        return fromBN(new BN(dispatchInfo.partialFee.toString()));
    }
    static async deactivateLiquidity(api, account, liquditityTokenId, amount) {
        const dispatchInfo = await api.tx.xyk
            .deactivateLiquidityV2(liquditityTokenId, amount)
            .paymentInfo(account);
        return fromBN(new BN(dispatchInfo.partialFee.toString()));
    }
    static async claimRewardsFee(api, account, liquidityTokenId, amount) {
        const dispatchInfo = await api.tx.xyk
            .claimRewardsV2(liquidityTokenId, amount)
            .paymentInfo(account);
        return fromBN(new BN(dispatchInfo.partialFee.toString()));
    }
    static async createPoolFee(api, account, firstTokenId, firstTokenAmount, secondTokenId, secondTokenAmount) {
        const dispatchInfo = await api.tx.xyk
            .createPool(firstTokenId, firstTokenAmount, secondTokenId, secondTokenAmount)
            .paymentInfo(account);
        return fromBN(new BN(dispatchInfo.partialFee.toString()));
    }
    static async sellAssetFee(api, account, soldTokenId, boughtTokenId, amount, minAmountOut) {
        const dispatchInfo = await api.tx.xyk
            .sellAsset(soldTokenId, boughtTokenId, amount, minAmountOut)
            .paymentInfo(account);
        return fromBN(new BN(dispatchInfo.partialFee.toString()));
    }
    static async buyAssetFee(api, account, soldTokenId, boughtTokenId, amount, maxAmountIn) {
        const dispatchInfo = await api.tx.xyk
            .buyAsset(soldTokenId, boughtTokenId, amount, maxAmountIn)
            .paymentInfo(account);
        return fromBN(new BN(dispatchInfo.partialFee.toString()));
    }
    static async mintLiquidityFee(api, account, firstTokenId, secondTokenId, firstTokenAmount, expectedSecondTokenAmount = new BN(Number.MAX_SAFE_INTEGER)) {
        const dispatchInfo = await api.tx.xyk
            .mintLiquidity(firstTokenId, secondTokenId, firstTokenAmount, expectedSecondTokenAmount)
            .paymentInfo(account);
        return fromBN(new BN(dispatchInfo.partialFee.toString()));
    }
    static async burnLiquidityFee(api, account, firstTokenId, secondTokenId, liquidityTokenAmount) {
        const dispatchInfo = await api.tx.xyk
            .burnLiquidity(firstTokenId, secondTokenId, liquidityTokenAmount)
            .paymentInfo(account);
        return fromBN(new BN(dispatchInfo.partialFee.toString()));
    }
    static async transferTokenFee(api, account, tokenId, address, amount) {
        const dispatchInfo = await api.tx.tokens
            .transfer(address, tokenId, amount)
            .paymentInfo(account);
        return fromBN(new BN(dispatchInfo.partialFee.toString()));
    }
    static async transferAllTokenFee(api, account, tokenId, address) {
        const dispatchInfo = await api.tx.tokens
            .transferAll(address, tokenId, true)
            .paymentInfo(account);
        return fromBN(new BN(dispatchInfo.partialFee.toString()));
    }
}
