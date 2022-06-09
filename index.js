import { isHex, hexToBn, BN, BN_ZERO as BN_ZERO$1 } from '@polkadot/util';
export { BN } from '@polkadot/util';
import { ApiPromise, Keyring } from '@polkadot/api';
import { WsProvider } from '@polkadot/rpc-provider/ws';
import { options } from '@mangata-finance/types';
import { XoShiRo256Plus } from 'mangata-prng-xoshiro';
import Big from 'big.js';
import { v4 } from 'uuid';

class Rpc {
    static async getChain(api) {
        const chain = await api.rpc.system.chain();
        return chain.toHuman();
    }
    static async getNodeName(api) {
        const name = await api.rpc.system.name();
        return name.toHuman();
    }
    static async getNodeVersion(api) {
        const version = await api.rpc.system.version();
        return version.toHuman();
    }
    static async calculateRewardsAmount(api, address, liquidityTokenId) {
        const rewards = await api.rpc.xyk.calculate_rewards_amount(address, liquidityTokenId);
        const notYetClaimed = isHex(rewards.notYetClaimed.toString())
            ? hexToBn(rewards.notYetClaimed.toString())
            : new BN(rewards.notYetClaimed);
        const toBeClaimed = isHex(rewards.toBeClaimed.toString())
            ? hexToBn(rewards.toBeClaimed.toString())
            : new BN(rewards.toBeClaimed.toString());
        return {
            notYetClaimed,
            toBeClaimed,
        };
    }
    static async calculateBuyPrice(api, inputReserve, outputReserve, amount) {
        const result = await api.rpc.xyk.calculate_buy_price(inputReserve, outputReserve, amount);
        return new BN(result.price);
    }
    static async calculateSellPrice(api, inputReserve, outputReserve, amount) {
        const result = await api.rpc.xyk.calculate_sell_price(inputReserve, outputReserve, amount);
        return new BN(result.price);
    }
    // TODO: Need to figure out the return value from this method
    static async getBurnAmount(api, firstTokenId, secondTokenId, amount) {
        const result = await api.rpc.xyk.get_burn_amount(firstTokenId, secondTokenId, amount);
        const resultAsJson = JSON.parse(result.toString());
        return resultAsJson;
    }
    static async calculateSellPriceId(api, firstTokenId, secondTokenId, amount) {
        const result = await api.rpc.xyk.calculate_sell_price_id(firstTokenId, secondTokenId, amount);
        return new BN(result.price);
    }
    static async calculateBuyPriceId(api, firstTokenId, secondTokenId, amount) {
        const result = await api.rpc.xyk.calculate_buy_price_id(firstTokenId, secondTokenId, amount);
        return new BN(result.price);
    }
}

class InMemoryDatabase {
    static instance;
    db = {};
    constructor() {
        // empty constructor
    }
    static getInstance() {
        if (!InMemoryDatabase.instance) {
            InMemoryDatabase.instance = new InMemoryDatabase();
        }
        return InMemoryDatabase.instance;
    }
    hasAddressNonce = (address) => {
        return this.db[address] ? true : false;
    };
    setNonce = (address, nonce) => {
        this.db[address] = nonce;
    };
    getNonce = (address) => {
        return this.db[address];
    };
}
const instance = InMemoryDatabase.getInstance();

const getSymbol = (symbol, assets) => {
    return symbol
        .split("-")
        .map((item) => item.replace("TKN", ""))
        .map((tokenId) => tokenId.startsWith("0x") ? hexToBn(tokenId).toString() : tokenId)
        .reduce((acc, curr, idx, arr) => {
        const isSymbol = isNaN(+curr);
        return (acc +
            (isSymbol ? curr : assets[curr] ? assets[curr].symbol : "N/A") +
            (idx < arr.length - 1 ? (idx % 2 === 0 ? "-" : " / ") : ""));
    }, "");
};

const getCorrectSymbol = (symbol, assets) => {
    const retrivedSymbol = getSymbol(symbol, assets);
    return retrivedSymbol.includes("TKN")
        ? getSymbol(retrivedSymbol, assets)
        : retrivedSymbol;
};

const ETHaddress$1 = "0x0000000000000000000000000000000000000000";
const MGAaddress$1 = "0xc7e3bda797d2ceb740308ec40142ae235e08144a";
const getAssetsInfoMap = async (api) => {
    const assetsInfoResponse = await api.query.assetsInfo.assetsInfo.entries();
    const result = assetsInfoResponse.reduce((obj, [key, value]) => {
        const info = value.toHuman();
        const id = key.toHuman()[0].replace(/[, ]/g, "");
        const assetInfo = {
            id,
            chainId: 0,
            symbol: info.symbol,
            address: info.description,
            name: info.symbol.includes("TKN") ? "Liquidity Pool Token" : info.name,
            decimals: Number(info.decimals)
        };
        obj[id] = assetInfo;
        return obj;
    }, {});
    // from assets info we receive liquidity tokens in the format
    // TKN0x000003CD-TKN0x00000000
    // therefore we need to parse this to tokens ids
    // TKN0x000003CD-TKN0x00000000 -> 13-4 -> 'm12-MGA / mDOT'
    return Object.values(result).reduce((obj, item) => {
        const asset = {
            ...item,
            symbol: item.symbol.includes("TKN")
                ? getCorrectSymbol(item.symbol, result)
                : item.symbol,
            address: item.symbol === "MGA"
                ? MGAaddress$1
                : item.symbol === "ETH"
                    ? ETHaddress$1
                    : item.address
        };
        obj[item.id] = asset;
        return obj;
    }, {});
};

const liquidityAssetsMap = async (api) => {
    const liquidityAssetsResponse = await api.query.xyk.liquidityAssets.entries();
    return liquidityAssetsResponse.reduce((acc, [key, value]) => {
        const identificator = key.args.map((k) => k.toHuman())[0];
        const liquidityAssetId = value.toString().replace(/[, ]/g, '');
        acc[identificator] = liquidityAssetId;
        return acc;
    }, {});
};

const poolsBalanceMap = async (api, liquidityAssets) => {
    const poolsBalanceResponse = await api.query.xyk.pools.entries();
    return poolsBalanceResponse.reduce((acc, [key, value]) => {
        const identificator = key.args.map((k) => k.toHuman())[0];
        const balancesResponse = JSON.parse(JSON.stringify(value));
        const balances = balancesResponse.map((balance) => isHex(balance) ? hexToBn(balance) : new BN(balance));
        acc[liquidityAssets[identificator]] = balances;
        return acc;
    }, {});
};

const balancesMap = async (api) => {
    const balancesResponse = await api.query.tokens.totalIssuance.entries();
    return balancesResponse.reduce((acc, [key, value]) => {
        const id = key.toHuman()[0].replace(/[, ]/g, '');
        const balance = new BN(value.toString());
        acc[id] = balance;
        return acc;
    }, {});
};

const accountEntriesMap = async (api, address) => {
    const ownedAssetsResponse = await api.query.tokens.accounts.entries(address);
    return ownedAssetsResponse.reduce((acc, [key, value]) => {
        const free = JSON.parse(JSON.stringify(value)).free.toString();
        const frozen = JSON.parse(JSON.stringify(value)).frozen.toString();
        const reserved = JSON.parse(JSON.stringify(value)).reserved.toString();
        const freeBN = isHex(free) ? hexToBn(free) : new BN(free);
        const frozenBN = isHex(frozen) ? hexToBn(frozen) : new BN(frozen);
        const reservedBN = isHex(reserved) ? hexToBn(reserved) : new BN(reserved);
        const id = key.toHuman()[1].replace(/[, ]/g, "");
        const balance = {
            free: freeBN,
            frozen: frozenBN,
            reserved: reservedBN
        };
        acc[id] = balance;
        return acc;
    }, {});
};

const ETHaddress = "0x0000000000000000000000000000000000000000";
const MGAaddress = "0xc7e3bda797d2ceb740308ec40142ae235e08144a";
const getAssetsInfoMapWithIds = async (api) => {
    const assetsInfoResponse = await api.query.assetsInfo.assetsInfo.entries();
    return assetsInfoResponse.reduce((obj, [key, value]) => {
        const info = value.toHuman();
        const id = key.toHuman()[0].replace(/[, ]/g, "");
        const assetInfo = {
            id,
            chainId: 0,
            symbol: info.symbol.includes("TKN")
                ? info.symbol
                    .split("-")
                    .map((item) => item.replace("TKN", ""))
                    .map((tokenId) => tokenId.startsWith("0x") ? hexToBn(tokenId).toString() : tokenId)
                    .join("-")
                : info.symbol,
            address: info.symbol === "MGA"
                ? MGAaddress
                : info.symbol === "ETH"
                    ? ETHaddress
                    : info.description,
            name: info.symbol.includes("TKN") ? "Liquidity Pool Token" : info.name,
            decimals: Number(info.decimals)
        };
        obj[id] = assetInfo;
        return obj;
    }, {});
};

const BN_ZERO = new BN('0');
const BN_ONE = new BN('1');
const BN_TEN = new BN('10');
const BN_HUNDRED = new BN('100');
const BN_THOUSAND = new BN('1000');
const BN_TEN_THOUSAND = new BN('10000');
const BN_HUNDRED_THOUSAND = new BN('100000');
const BN_MILLION = new BN('1000000');
const BN_TEN_MILLIONS = new BN('10000000');
const BN_HUNDRED_MILLIONS = new BN('100000000');
const BN_BILLION = new BN('1000000000');
const BN_TEN_BILLIONS = new BN('10000000000');
const BN_HUNDRED_BILLIONS = new BN('100000000000');
const BN_TRILLION = new BN('1000000000000');
const BN_DIV_NUMERATOR_MULTIPLIER_DECIMALS = 18;
const BN_DIV_NUMERATOR_MULTIPLIER = new BN('10').pow(new BN(BN_DIV_NUMERATOR_MULTIPLIER_DECIMALS));

const calculateLiquidityShare = async (api, liquidityAssetId, userLiquidityTokenAmount) => {
    // userLiquidityTokenAmount is the amount of liquidity token the user has but FREE ..
    // when the pool is promoted and user will receive rewards those tokens are no longer free but RESERVED
    // TODO: from FREE to RESERVeD
    if (userLiquidityTokenAmount.isZero())
        return BN_ZERO;
    const tokenSupply = await api.query.tokens.totalIssuance(liquidityAssetId);
    const totalLiquidityAsset = new BN(tokenSupply.toString());
    const share = userLiquidityTokenAmount
        .mul(BN_DIV_NUMERATOR_MULTIPLIER)
        .div(totalLiquidityAsset);
    return share;
};

const getGcd = (a, b) => {
    return b.gt(BN_ZERO) ? getGcd(b, a.mod(b)) : a;
};
const calculateRatio = (numerator, denominator) => {
    const gcd = getGcd(numerator, denominator);
    if (gcd.isZero())
        return [BN_ZERO, BN_ZERO];
    const gcd1 = numerator.div(gcd);
    const gcd2 = denominator.div(gcd);
    return [gcd1, gcd2];
};
const getRatio = (left, right) => {
    const ratios = calculateRatio(left, right);
    const res = ratios[1].mul(BN_DIV_NUMERATOR_MULTIPLIER).div(ratios[0]);
    return res;
};

const liquidityPromotedTokenMap = async (api) => {
    try {
        const liquidityAssetsResponse = await api.query.issuance.promotedPoolsRewards.entries();
        return liquidityAssetsResponse.map(([key]) => key.args.map((k) => k.toHuman())[0]);
    }
    catch (error) {
        return [];
    }
};

class Query {
    static async getNonce(api, address) {
        const nonce = await api.rpc.system.accountNextIndex(address);
        return nonce.toBn();
    }
    static async getAmountOfTokenIdInPool(api, firstTokenId, secondTokenId) {
        const balance = await api.query.xyk.pools([firstTokenId, secondTokenId]);
        const tokenValue1 = balance[0].toString();
        const tokenValue2 = balance[1].toString();
        const token1 = isHex(tokenValue1)
            ? hexToBn(tokenValue1)
            : new BN(tokenValue1);
        const token2 = isHex(tokenValue2)
            ? hexToBn(tokenValue2)
            : new BN(tokenValue2);
        return [token1, token2];
    }
    static async getLiquidityTokenId(api, firstTokenId, secondTokenId) {
        const liquidityAssetId = await api.query.xyk.liquidityAssets([
            firstTokenId,
            secondTokenId
        ]);
        if (!liquidityAssetId.isSome)
            return BN_ZERO$1;
        return new BN(liquidityAssetId.toString());
    }
    static async getLiquidityPool(api, liquidityTokenId) {
        const liquidityPool = await api.query.xyk.liquidityPools(liquidityTokenId);
        if (!liquidityPool.isSome)
            return [new BN(-1), new BN(-1)];
        return liquidityPool.unwrap().map((num) => new BN(num));
    }
    static async getTotalIssuance(api, tokenId) {
        const tokenSupply = await api.query.tokens.totalIssuance(tokenId);
        return new BN(tokenSupply);
    }
    static async getTokenBalance(api, address, tokenId) {
        const balanceResponse = await api.query.tokens.accounts(address, tokenId);
        const balance = JSON.parse(JSON.stringify(balanceResponse));
        return {
            free: isHex(balance.free) ? hexToBn(balance.free) : new BN(balance.free),
            reserved: isHex(balance.reserved)
                ? hexToBn(balance.reserved)
                : new BN(balance.reserved),
            frozen: isHex(balance.frozen)
                ? hexToBn(balance.frozen)
                : new BN(balance.frozen)
        };
    }
    static async getNextTokenId(api) {
        const nextTokenId = await api.query.tokens.nextCurrencyId();
        return new BN(nextTokenId);
    }
    static async getTokenInfo(api, tokenId) {
        const assetsInfo = await getAssetsInfoMap(api);
        const asset = assetsInfo[tokenId];
        return asset.name.includes("LiquidityPoolToken")
            ? {
                ...asset,
                name: "Liquidity Pool Token",
                symbol: getCorrectSymbol(asset.symbol, assetsInfo)
            }
            : asset;
    }
    static async getLiquidityTokenIds(api) {
        const liquidityTokens = await api.query.xyk.liquidityAssets.entries();
        return liquidityTokens.map((liquidityToken) => liquidityToken[1].toString());
    }
    static async getLiquidityTokens(api) {
        const assetsInfo = await getAssetsInfoMap(api);
        return Object.values(assetsInfo)
            .reduce((acc, asset) => asset.name.includes("Liquidity Pool Token") ? acc.concat(asset) : acc, [])
            .reduce((acc, assetInfo) => {
            acc[assetInfo.id] = assetInfo;
            return acc;
        }, {});
    }
    static async getAssetsInfo(api) {
        return await getAssetsInfoMap(api);
    }
    static async getBlockNumber(api) {
        const block = await api.rpc.chain.getBlock();
        return block.block.header.number.toString();
    }
    static async getOwnedTokens(api, address) {
        if (!address) {
            return null;
        }
        const [assetsInfo, accountEntries] = await Promise.all([
            getAssetsInfoMap(api),
            accountEntriesMap(api, address)
        ]);
        return Object.values(assetsInfo)
            .filter((assetInfo) => accountEntries[assetInfo.id])
            .reduce((acc, assetInfo) => {
            const asset = {
                ...assetInfo,
                balance: accountEntries[assetInfo.id]
            };
            acc[asset.id] = asset;
            return acc;
        }, {});
    }
    static async getBalances(api) {
        return await balancesMap(api);
    }
    static async getInvestedPools(api, address) {
        const [assetsInfo, accountEntries, liquidityTokensPromoted] = await Promise.all([
            getAssetsInfoMapWithIds(api),
            accountEntriesMap(api, address),
            liquidityPromotedTokenMap(api)
        ]);
        return Object.values(assetsInfo)
            .reduce((acc, asset) => (accountEntries[asset.id] ? acc.concat(asset) : acc), [])
            .filter((asset) => asset.name.includes("Liquidity Pool Token"))
            .map(async (asset) => {
            const userLiquidityBalance = accountEntries[asset.id];
            const firstTokenId = asset.symbol.split("-")[0];
            const secondTokenId = asset.symbol.split("-")[1];
            const [firstTokenAmount, secondTokenAmount] = await this.getAmountOfTokenIdInPool(api, firstTokenId.toString(), secondTokenId.toString());
            const poolInfo = {
                firstTokenId,
                secondTokenId,
                firstTokenAmount,
                secondTokenAmount,
                liquidityTokenId: asset.id,
                isPromoted: liquidityTokensPromoted.includes(asset.id),
                share: await calculateLiquidityShare(api, asset.id, userLiquidityBalance.free.add(userLiquidityBalance.reserved)),
                firstTokenRatio: getRatio(firstTokenAmount, secondTokenAmount),
                secondTokenRatio: getRatio(secondTokenAmount, firstTokenAmount),
                activatedLPTokens: userLiquidityBalance.reserved,
                nonActivatedLPTokens: userLiquidityBalance.free
            };
            return poolInfo;
        });
    }
    static async getPool(api, liquidityTokenId) {
        const liquidityPool = await api.query.xyk.liquidityPools(liquidityTokenId);
        const liquidityPoolId = JSON.parse(JSON.stringify(liquidityPool));
        const liquidityTokensPromoted = await liquidityPromotedTokenMap(api);
        const [firstTokenId, secondTokenId] = liquidityPoolId;
        const [firstTokenAmount, secondTokenAmount] = await this.getAmountOfTokenIdInPool(api, firstTokenId.toString(), secondTokenId.toString());
        return {
            firstTokenId,
            secondTokenId,
            firstTokenAmount,
            secondTokenAmount,
            liquidityTokenId,
            isPromoted: liquidityTokensPromoted.includes(liquidityTokenId),
            firstTokenRatio: getRatio(firstTokenAmount, secondTokenAmount),
            secondTokenRatio: getRatio(secondTokenAmount, firstTokenAmount)
        };
    }
    static async getPools(api) {
        const [assetsInfo, liquidityAssets] = await Promise.all([
            getAssetsInfoMapWithIds(api),
            liquidityAssetsMap(api)
        ]);
        const poolBalances = await poolsBalanceMap(api, liquidityAssets);
        const liquidityTokensPromoted = await liquidityPromotedTokenMap(api);
        return Object.values(assetsInfo)
            .reduce((acc, asset) => Object.values(liquidityAssets).includes(asset.id)
            ? acc.concat(asset)
            : acc, [])
            .map((asset) => {
            const [firstTokenAmount, secondTokenAmount] = poolBalances[asset.id];
            return {
                firstTokenId: asset.symbol.split("-")[0],
                secondTokenId: asset.symbol.split("-")[1],
                firstTokenAmount,
                secondTokenAmount,
                liquidityTokenId: asset.id,
                firstTokenRatio: getRatio(firstTokenAmount, secondTokenAmount),
                secondTokenRatio: getRatio(secondTokenAmount, firstTokenAmount),
                isPromoted: liquidityTokensPromoted.includes(asset.id)
            };
        });
    }
}

const getTxNonce = async (api, address, txOptions) => {
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

function getXoshiroStates(seed) {
    const s0 = (BigInt(seed[0]) << BigInt(0)) |
        (BigInt(seed[1]) << BigInt(8)) |
        (BigInt(seed[2]) << BigInt(16)) |
        (BigInt(seed[3]) << BigInt(24)) |
        (BigInt(seed[4]) << BigInt(32)) |
        (BigInt(seed[5]) << BigInt(40)) |
        (BigInt(seed[6]) << BigInt(48)) |
        (BigInt(seed[7]) << BigInt(56));
    const s1 = (BigInt(seed[8]) << BigInt(0)) |
        (BigInt(seed[9]) << BigInt(8)) |
        (BigInt(seed[10]) << BigInt(16)) |
        (BigInt(seed[11]) << BigInt(24)) |
        (BigInt(seed[12]) << BigInt(32)) |
        (BigInt(seed[13]) << BigInt(40)) |
        (BigInt(seed[14]) << BigInt(48)) |
        (BigInt(seed[15]) << BigInt(56));
    const s2 = (BigInt(seed[16]) << BigInt(0)) |
        (BigInt(seed[17]) << BigInt(8)) |
        (BigInt(seed[18]) << BigInt(16)) |
        (BigInt(seed[19]) << BigInt(24)) |
        (BigInt(seed[20]) << BigInt(32)) |
        (BigInt(seed[21]) << BigInt(40)) |
        (BigInt(seed[22]) << BigInt(48)) |
        (BigInt(seed[23]) << BigInt(56));
    const s3 = (BigInt(seed[24]) << BigInt(0)) |
        (BigInt(seed[25]) << BigInt(8)) |
        (BigInt(seed[26]) << BigInt(16)) |
        (BigInt(seed[27]) << BigInt(24)) |
        (BigInt(seed[28]) << BigInt(32)) |
        (BigInt(seed[29]) << BigInt(40)) |
        (BigInt(seed[30]) << BigInt(48)) |
        (BigInt(seed[31]) << BigInt(56));
    return { s0, s1, s2, s3 };
}
function getXoshiro(seed) {
    const { s0, s1, s2, s3 } = getXoshiroStates(seed);
    return new XoShiRo256Plus(s0, s1, s2, s3);
}

class FisherYates {
    // TODO: make not any
    // xoshiro: XoShiRo256Plus;
    xoshiro;
    constructor(seed) {
        this.xoshiro = getXoshiro(seed);
    }
    next_u64() {
        // compute u64 same way as on the rust side
        const first = new BN(this.xoshiro.nextBigInt(BigInt(0xffffffff)).toString());
        const second = new BN(this.xoshiro.nextBigInt(BigInt(0xffffffff)).toString());
        return first.shln(32).or(second);
    }
    shuffle = (arr) => {
        // Start from the last element and swap
        // one by one. We don't need to run for
        // the first element that's why i > 0
        for (let i = arr.length - 1; i > 0; i--) {
            // The number 4294967295, equivalent to the hexadecimal value FFFFFFFF, is the
            // maximum value for a 32-bit unsigned integer in computing.
            const random = this.next_u64();
            const j = random.modn(i + 1);
            const tmp = arr[i];
            arr[i] = arr[j];
            arr[j] = tmp;
        }
    };
}

const recreateExtrinsicsOrder = (extrinsics, seedBytes) => {
    let result = [];
    const fy = new FisherYates(seedBytes);
    const map = new Map();
    extrinsics.forEach((info) => {
        const who = info[0];
        const tx = info[1];
        if (map.has(who)) {
            map.get(who).push(tx);
        }
        else {
            map.set(who, [tx]);
        }
    });
    while (map.size != 0) {
        const slots = [];
        const keys = [];
        for (const entry of map.entries()) {
            keys.push(entry[0]);
        }
        keys.sort();
        for (const key of keys) {
            const values = map.get(key);
            slots.push(values.shift());
            if (values.length == 0) {
                map.delete(key);
            }
        }
        fy.shuffle(slots);
        result = result.concat(slots);
    }
    return result;
};

const signTx = async (api, tx, account, txOptions) => {
    return new Promise(async (resolve, reject) => {
        let output = [];
        const extractedAccount = typeof account === "string" ? account : account.address;
        const nonce = await getTxNonce(api, extractedAccount, txOptions);
        let retries = 0;
        try {
            const unsub = await tx.signAndSend(account, {
                nonce,
                signer: txOptions?.signer
            }, async (result) => {
                console.info("Hash:[" + tx.hash + "] \n      Status-" + result.status);
                txOptions?.statusCallback?.(result);
                if (result.status.isFinalized) {
                    const unsubscribeNewHeads = await api.rpc.chain.subscribeNewHeads(async (lastHeader) => {
                        if (lastHeader.parentHash.toString() ===
                            result.status.asFinalized.toString()) {
                            unsubscribeNewHeads();
                            const currentBlock = await api.rpc.chain.getBlock(lastHeader.hash);
                            const currentBlockExtrinsics = currentBlock.block.extrinsics;
                            const currentBlockEvents = await api.query.system.events.at(lastHeader.hash);
                            const headerJsonResponse = JSON.parse(lastHeader.toString());
                            const buffer = Buffer.from(headerJsonResponse["seed"]["seed"].substring(2), "hex");
                            const countOfExtrinsicsFromThisBlock = headerJsonResponse["count"];
                            const currentBlockInherents = currentBlockExtrinsics
                                .slice(0, countOfExtrinsicsFromThisBlock)
                                .filter((tx) => {
                                return !tx.isSigned;
                            });
                            const previousBlockExtrinsics = currentBlockExtrinsics.slice(countOfExtrinsicsFromThisBlock, currentBlockExtrinsics.length);
                            const bothBlocksExtrinsics = currentBlockInherents.concat(previousBlockExtrinsics);
                            const unshuffledInherents = bothBlocksExtrinsics.filter((tx) => {
                                return !tx.isSigned;
                            });
                            const shuffledExtrinscs = recreateExtrinsicsOrder(bothBlocksExtrinsics
                                .filter((tx) => {
                                return tx.isSigned;
                            })
                                .map((tx) => {
                                const who = tx.isSigned ? tx.signer.toString() : "0000";
                                return [who, tx];
                            }), Uint8Array.from(buffer));
                            const executionOrder = unshuffledInherents.concat(shuffledExtrinscs);
                            const index = executionOrder.findIndex((shuffledExtrinsic) => {
                                return (shuffledExtrinsic?.isSigned &&
                                    shuffledExtrinsic?.signer.toString() ===
                                        extractedAccount &&
                                    shuffledExtrinsic?.nonce.toString() === nonce.toString());
                            });
                            if (index < 0) {
                                return;
                            }
                            const reqEvents = currentBlockEvents
                                .filter((currentBlockEvent) => {
                                return (currentBlockEvent.phase.isApplyExtrinsic &&
                                    currentBlockEvent.phase.asApplyExtrinsic.toNumber() ===
                                        index);
                            })
                                .map((eventRecord) => {
                                const { event, phase } = eventRecord;
                                const types = event.typeDef;
                                const eventData = event.data.map((d, i) => {
                                    return {
                                        lookupName: types[i].lookupName,
                                        data: d
                                    };
                                });
                                return {
                                    event,
                                    phase,
                                    section: event.section,
                                    method: event.method,
                                    metaDocumentation: event.meta.docs.toString(),
                                    eventData,
                                    error: getError(api, event.method, eventData)
                                };
                            });
                            output = output.concat(reqEvents);
                            txOptions?.extrinsicStatus?.(output);
                            resolve(output);
                            unsub();
                        }
                        else if (retries++ < 10) {
                            console.info("Retry [" +
                                retries +
                                "] \n      Hash:[" +
                                tx.hash +
                                "] \n      Status-" +
                                result.status +
                                " \n     Parent[" +
                                lastHeader.parentHash.toString() +
                                " \n     Finalized in:" +
                                result.status.asFinalized.toString());
                        }
                        else {
                            //Lets retry this for 10 times until we reject the promise.
                            unsubscribeNewHeads();
                            reject(`Transaction was not finalized: Last Header Parent hash: ${lastHeader.parentHash.toString()} and \n     Status finalized: ${result.status.asFinalized.toString()}`);
                            const currentNonce = await Query.getNonce(api, extractedAccount);
                            instance.setNonce(extractedAccount, currentNonce);
                            unsub();
                        }
                    });
                }
                else if (result.isError) {
                    reject(`${tx.hash} ` + "Transaction error");
                    const currentNonce = await Query.getNonce(api, extractedAccount);
                    instance.setNonce(extractedAccount, currentNonce);
                }
            });
        }
        catch (error) {
            const currentNonce = await Query.getNonce(api, extractedAccount);
            instance.setNonce(extractedAccount, currentNonce);
            reject({
                data: error.message ||
                    error.description ||
                    error.data?.toString() ||
                    error.toString()
            });
        }
    });
};
const getError = (api, method, eventData) => {
    const failedEvent = method === "ExtrinsicFailed";
    if (failedEvent) {
        const error = eventData.find((item) => item.lookupName.includes("DispatchError"));
        const errorData = error?.data?.toHuman?.();
        const errorIdx = errorData?.Module?.error;
        const moduleIdx = errorData?.Module?.index;
        if (errorIdx && moduleIdx) {
            try {
                const decode = api.registry.findMetaError({
                    error: new BN(errorIdx),
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
class Tx {
    static async activateLiquidity(api, account, liquditityTokenId, amount, txOptions) {
        return await signTx(api, api.tx.xyk.activateLiquidity(liquditityTokenId, amount), account, txOptions);
    }
    static async deactivateLiquidity(api, account, liquditityTokenId, amount, txOptions) {
        return await signTx(api, api.tx.xyk.deactivateLiquidity(liquditityTokenId, amount), account, txOptions);
    }
    static async claimRewards(api, account, liquidityTokenId, amount, txOptions) {
        return await signTx(api, api.tx.xyk.claimRewards(liquidityTokenId, amount), account, txOptions);
    }
    static async createPool(api, account, firstTokenId, firstTokenAmount, secondTokenId, secondTokenAmount, txOptions) {
        return await signTx(api, api.tx.xyk.createPool(firstTokenId, firstTokenAmount, secondTokenId, secondTokenAmount), account, txOptions);
    }
    static async sellAsset(api, account, soldTokenId, boughtTokenId, amount, minAmountOut, txOptions) {
        return await signTx(api, api.tx.xyk.sellAsset(soldTokenId, boughtTokenId, amount, minAmountOut), account, txOptions);
    }
    static async buyAsset(api, account, soldTokenId, boughtTokenId, amount, maxAmountIn, txOptions) {
        return await signTx(api, api.tx.xyk.buyAsset(soldTokenId, boughtTokenId, amount, maxAmountIn), account, txOptions);
    }
    static async mintLiquidity(api, account, firstTokenId, secondTokenId, firstTokenAmount, expectedSecondTokenAmount = new BN(Number.MAX_SAFE_INTEGER), txOptions) {
        return await signTx(api, api.tx.xyk.mintLiquidity(firstTokenId, secondTokenId, firstTokenAmount, expectedSecondTokenAmount), account, txOptions);
    }
    static async burnLiquidity(api, account, firstTokenId, secondTokenId, liquidityTokenAmount, txOptions) {
        return await signTx(api, api.tx.xyk.burnLiquidity(firstTokenId, secondTokenId, liquidityTokenAmount), account, txOptions);
    }
    static async transferToken(api, account, tokenId, address, amount, txOptions) {
        const result = await signTx(api, api.tx.tokens.transfer(address, tokenId, amount), account, txOptions);
        return result;
    }
    static async transferAllToken(api, account, tokenId, address, txOptions) {
        return await signTx(api, api.tx.tokens.transferAll(address, tokenId, true), account, txOptions);
    }
}

const BIG_ZERO = Big('0');
const BIG_ONE = Big('1');
const BIG_TEN = Big('10');
const BIG_HUNDRED = Big('100');
const BIG_THOUSAND = Big('1000');
const BIG_TEN_THOUSAND = Big('10000');
const BIG_HUNDRED_THOUSAND = Big('100000');
const BIG_MILLION = Big('1000000');
const BIG_TEN_MILLIONS = Big('10000000');
const BIG_HUNDRED_MILLIONS = Big('100000000');
const BIG_BILLION = Big('1000000000');
const BIG_TEN_BILLIONS = Big('10000000000');
const BIG_HUNDRED_BILLIONS = Big('100000000000');
const BIG_TRILLION = Big('1000000000000');

Big.PE = 256; // The positive exponent value at and above which toString returns exponential notation.
Big.NE = -256; // The negative exponent value at and below which toString returns exponential notation.
Big.DP = 40; // The maximum number of decimal places of the results of operations involving division.
Big.RM = Big.roundUp; // Rounding mode
const DEFAULT_TOKEN_DECIMALS = 18;
const DEFAULT_DECIMAL_MULTIPLIER = BIG_TEN.pow(DEFAULT_TOKEN_DECIMALS);
const toBN = (value, exponent) => {
    if (!value)
        return BN_ZERO;
    try {
        const inputNumber = Big(value);
        const decimalMultiplier = !exponent || exponent === DEFAULT_TOKEN_DECIMALS
            ? DEFAULT_DECIMAL_MULTIPLIER
            : BIG_TEN.pow(exponent);
        const res = inputNumber.mul(decimalMultiplier);
        const resStr = res.toString();
        if (/\D/gm.test(resStr))
            return BN_ZERO;
        return new BN(resStr);
    }
    catch (err) {
        return BN_ZERO;
    }
};
const fromBN = (value, exponent) => {
    if (!value)
        return "0";
    try {
        const inputNumber = Big(value.toString());
        const decimalMultiplier = !exponent || exponent === DEFAULT_TOKEN_DECIMALS
            ? DEFAULT_DECIMAL_MULTIPLIER
            : BIG_TEN.pow(exponent);
        const res = inputNumber.div(decimalMultiplier);
        const resStr = res.toString();
        return resStr;
    }
    catch (err) {
        return "0";
    }
};

class Fee {
    static async activateLiquidity(api, account, liquditityTokenId, amount) {
        const dispatchInfo = await api.tx.xyk
            .activateLiquidity(liquditityTokenId, amount)
            .paymentInfo(account);
        return fromBN(new BN(dispatchInfo.partialFee.toString()));
    }
    static async deactivateLiquidity(api, account, liquditityTokenId, amount) {
        const dispatchInfo = await api.tx.xyk
            .deactivateLiquidity(liquditityTokenId, amount)
            .paymentInfo(account);
        return fromBN(new BN(dispatchInfo.partialFee.toString()));
    }
    static async claimRewardsFee(api, account, liquidityTokenId, amount) {
        const dispatchInfo = await api.tx.xyk
            .claimRewards(liquidityTokenId, amount)
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

const toPlainString = (num) => {
    // BN.js Throws from 1e+21 and above so using this make shift function
    return ("" + num).replace(/(-?)(\d*)\.?(\d+)e([+-]\d+)/, function (a, b, c, d, e) {
        return e < 0
            ? b + "0." + Array(1 - e - c.length).join("0") + c + d
            : b + c + d + Array(e - d.length + 1).join("0");
    });
};
const calculateWork = (asymptote, time, lastCheckpoint, cummulativeWorkInLastCheckpoint, missingAtLastCheckpoint) => {
    const timePassed = time.sub(lastCheckpoint);
    const cummulativeWorkNewMaxPossible = new BN(asymptote).mul(timePassed);
    const base = new BN(missingAtLastCheckpoint).mul(new BN(106)).div(new BN(6));
    const precision = Big(10000);
    const qPow = Big(1.06).pow(timePassed.toNumber()).mul(precision).round(0, 0);
    const qPowCorrect = toPlainString(qPow.toString());
    const cummulativeMissingNew = new BN(base).sub(new BN(base).mul(new BN(precision.toString())).div(new BN(qPowCorrect)));
    const cummulativeWorkNew = new BN(cummulativeWorkNewMaxPossible).sub(cummulativeMissingNew);
    const workTotal = new BN(cummulativeWorkInLastCheckpoint).add(cummulativeWorkNew);
    return workTotal;
};
const getLiquidityMintingUser = async (address, liquditityTokenId, currentTime, api) => {
    const [lastCheckpoint, cummulativeWorkInLastCheckpoint, missingAtLastCheckpoint] = await api.query.xyk.liquidityMiningUser([address, liquditityTokenId]);
    if (new BN(lastCheckpoint.toString()).eq(new BN(0)) &&
        new BN(cummulativeWorkInLastCheckpoint.toString()).eq(new BN(0)) &&
        new BN(missingAtLastCheckpoint.toString()).eq(new BN(0))) {
        return {
            lastCheckpoint: currentTime,
            cummulativeWorkInLastCheckpoint: Big(0),
            missingAtLastCheckpoint: Big(0)
        };
    }
    else {
        return {
            lastCheckpoint: Big(lastCheckpoint.toString()),
            cummulativeWorkInLastCheckpoint: Big(cummulativeWorkInLastCheckpoint.toString()),
            missingAtLastCheckpoint: Big(missingAtLastCheckpoint.toString())
        };
    }
};
const getLiquidityMintingPool = async (liquditityTokenId, currentTime, api) => {
    const [lastCheckpoint, cummulativeWorkInLastCheckpoint, missingAtLastCheckpoint] = await api.query.xyk.liquidityMiningPool(liquditityTokenId);
    if (new BN(lastCheckpoint.toString()).eq(new BN(0)) &&
        new BN(cummulativeWorkInLastCheckpoint.toString()).eq(new BN(0)) &&
        new BN(missingAtLastCheckpoint.toString()).eq(new BN(0))) {
        return {
            lastCheckpoint: currentTime,
            cummulativeWorkInLastCheckpoint: new BN(0),
            missingAtLastCheckpoint: new BN(0)
        };
    }
    else {
        return {
            lastCheckpoint: new BN(lastCheckpoint.toString()),
            cummulativeWorkInLastCheckpoint: new BN(cummulativeWorkInLastCheckpoint.toString()),
            missingAtLastCheckpoint: new BN(missingAtLastCheckpoint.toString())
        };
    }
};
const calculateWorkUser = async (address, liquidityAssetsAmount, liquditityTokenId, currentTime, api) => {
    const { lastCheckpoint, cummulativeWorkInLastCheckpoint, missingAtLastCheckpoint } = await getLiquidityMintingUser(address, liquditityTokenId, currentTime, api);
    return calculateWork(liquidityAssetsAmount, currentTime, new BN(lastCheckpoint.toString()), new BN(cummulativeWorkInLastCheckpoint.toString()), new BN(missingAtLastCheckpoint.toString()));
};
const calculateWorkPool = async (liquidityAssetsAmount, liquidityTokenId, currentTime, api) => {
    const { lastCheckpoint, cummulativeWorkInLastCheckpoint, missingAtLastCheckpoint } = await getLiquidityMintingPool(liquidityTokenId, currentTime, api);
    return calculateWork(liquidityAssetsAmount, currentTime, new BN(lastCheckpoint.toString()), new BN(cummulativeWorkInLastCheckpoint.toString()), new BN(missingAtLastCheckpoint.toString()));
};
const calculateFutureRewardsAmount = async (api, address, liquidityTokenId, futureTimeBlockNumber) => {
    const block = await api.rpc.chain.getBlock();
    const blockNumber = new BN(block.block.header.number.toString());
    const currentTime = blockNumber.div(new BN(10000));
    const futureBlockNumber = blockNumber.add(new BN(futureTimeBlockNumber));
    const futureTime = futureBlockNumber.div(new BN(10000));
    const liquidityAssetsAmountUser = await api.query.xyk.liquidityMiningActiveUser([address, liquidityTokenId]);
    const liquidityAssetsAmountPool = await api.query.xyk.liquidityMiningActivePool([address, liquidityTokenId]);
    const workUser = await calculateWorkUser(address, new BN(liquidityAssetsAmountUser.toString()), liquidityTokenId, futureTime, api);
    const workPool = await calculateWorkPool(new BN(liquidityAssetsAmountPool.toString()), liquidityTokenId, futureTime, api);
    const burnedNotClaimedRewards = await api.query.xyk.liquidityMiningUserToBeClaimed([
        address,
        liquidityTokenId
    ]);
    const currentAvailableRewardsForPool = await api.query.issuance.promotedPoolsRewards(liquidityTokenId);
    const currentAvailableRewardsForPoolBN = new BN(currentAvailableRewardsForPool.toString());
    const rewardsPerSession = new BN("136986000000000000000000");
    const sessionsToPass = futureTime.sub(currentTime).div(new BN(1200));
    const numberOfPromotedPools = await api.query.issuance.promotedPoolsRewards.entries();
    const futureAvailableRewardsForPool = currentAvailableRewardsForPoolBN.add(rewardsPerSession
        .mul(sessionsToPass)
        .div(new BN(numberOfPromotedPools.length)));
    let futureRewards = new BN(0);
    if (workUser.gt(new BN(0)) && workPool.gt(new BN(0))) {
        futureRewards = futureAvailableRewardsForPool.mul(workUser).div(workPool);
    }
    const totalAvailableRewardsFuture = futureRewards.add(new BN(burnedNotClaimedRewards.toString()));
    return totalAvailableRewardsFuture;
};

/**
 * @class Mangata
 * @author Mangata Finance
 * The Mangata class defines the `getInstance` method that lets clients access the unique singleton instance.
 */
class Mangata {
    api;
    uri;
    static instanceMap = new Map();
    /**
     * The Mangata's constructor is private to prevent direct
     * construction calls with the `new` operator.
     */
    constructor(uri) {
        this.api = null;
        this.uri = uri;
    }
    /**
     * Initialised via create method with proper types and rpc
     * for Mangata
     */
    async connectToNode(uri) {
        const provider = new WsProvider(uri);
        const api = await new ApiPromise(options({ provider, throwOnConnect: true, throwOnUnknown: true })).isReady;
        return api;
    }
    /**
     * The static method that controls the access to the Mangata instance.
     */
    static getInstance(uri) {
        if (!Mangata.instanceMap.has(uri)) {
            this.instanceMap.set(uri, new Mangata(uri));
            return this.instanceMap.get(uri);
        }
        else {
            return this.instanceMap.get(uri);
        }
    }
    /**
     * Api instance of the connected node
     */
    async getApi() {
        // Because we assign this.api synchronously, repeated calls to
        // method() are guaranteed to always reuse the same promise.
        if (!this.api) {
            this.api = this.connectToNode(this.uri);
        }
        return this.api;
    }
    /**
     * Uri of the connected node
     */
    getUri() {
        return this.uri;
    }
    /**
     * Wait for the new block
     */
    async waitForNewBlock(blockCount) {
        let count = 0;
        const api = await this.getApi();
        const numberOfBlocks = blockCount || 1;
        return new Promise(async (resolve) => {
            const unsubscribe = await api.rpc.chain.subscribeNewHeads(() => {
                if (++count === numberOfBlocks) {
                    unsubscribe();
                    resolve(true);
                }
            });
        });
    }
    /**
     * Chain name of the connected node
     */
    async getChain() {
        const api = await this.getApi();
        return Rpc.getChain(api);
    }
    /**
     * Node name of the connected node
     */
    async getNodeName() {
        const api = await this.getApi();
        return Rpc.getNodeName(api);
    }
    /**
     * Node version of the connected node
     */
    async getNodeVersion() {
        const api = await this.getApi();
        return Rpc.getNodeVersion(api);
    }
    /**
     * Get the current nonce of the account
     */
    async getNonce(address) {
        const api = await this.getApi();
        return Query.getNonce(api, address);
    }
    /**
     * Disconnect from the node
     */
    async disconnect() {
        const api = await this.getApi();
        await api.disconnect();
    }
    async activateLiquidity(account, liquditityTokenId, amount, txOptions) {
        const api = await this.getApi();
        return await Tx.activateLiquidity(api, account, liquditityTokenId, amount, txOptions);
    }
    async deactivateLiquidity(account, liquditityTokenId, amount, txOptions) {
        const api = await this.getApi();
        return await Tx.deactivateLiquidity(api, account, liquditityTokenId, amount, txOptions);
    }
    async calculateFutureRewardsAmount(address, liquidityTokenId, futureBlockNumber) {
        const api = await this.getApi();
        return await calculateFutureRewardsAmount(api, address, liquidityTokenId, futureBlockNumber);
    }
    async calculateRewardsAmount(address, liquidityTokenId) {
        const api = await this.getApi();
        return await Rpc.calculateRewardsAmount(api, address, liquidityTokenId);
    }
    async claimRewardsFee(account, liquditityTokenId, amount) {
        const api = await this.getApi();
        return await Fee.claimRewardsFee(api, account, liquditityTokenId, amount);
    }
    async claimRewards(account, liquditityTokenId, amount, txOptions) {
        const api = await this.getApi();
        return await Tx.claimRewards(api, account, liquditityTokenId, amount, txOptions);
    }
    async createPoolFee(account, firstTokenId, firstTokenAmount, secondTokenId, secondTokenAmount) {
        const api = await this.getApi();
        return await Fee.createPoolFee(api, account, firstTokenId, firstTokenAmount, secondTokenId, secondTokenAmount);
    }
    /**
     * Extrinsic to create pool
     * @param {string | Keyringpair} account
     * @param {string} firstTokenId
     * @param {BN} firstTokenAmount
     * @param {string} secondTokenId
     * @param {BN} secondTokenAmount
     * @param {TxOptions} [txOptions]
     *
     * @returns {(MangataGenericEvent|Array)}
     */
    async createPool(account, firstTokenId, firstTokenAmount, secondTokenId, secondTokenAmount, txOptions) {
        const api = await this.getApi();
        return await Tx.createPool(api, account, firstTokenId, firstTokenAmount, secondTokenId, secondTokenAmount, txOptions);
    }
    async sellAssetFee(account, soldAssetId, boughtAssetId, amount, minAmountOut) {
        const api = await this.getApi();
        return await Fee.sellAssetFee(api, account, soldAssetId, boughtAssetId, amount, minAmountOut);
    }
    /**
     * Extrinsic to sell/swap sold token id in sold token amount for bought token id,
     * while specifying min amount out: minimal expected bought token amount
     *
     * @param {string | Keyringpair} account
     * @param {string} soldAssetId
     * @param {string} boughtAssetId
     * @param {BN} amount
     * @param {BN} minAmountOut
     * @param {TxOptions} [txOptions]
     *
     * @returns {(MangataGenericEvent|Array)}
     */
    async sellAsset(account, soldAssetId, boughtAssetId, amount, minAmountOut, txOptions) {
        const api = await this.getApi();
        return await Tx.sellAsset(api, account, soldAssetId, boughtAssetId, amount, minAmountOut, txOptions);
    }
    async mintLiquidityFee(account, firstTokenId, secondTokenId, firstTokenAmount, expectedSecondTokenAmount) {
        const api = await this.getApi();
        return await Fee.mintLiquidityFee(api, account, firstTokenId, secondTokenId, firstTokenAmount, expectedSecondTokenAmount);
    }
    /**
     * Extrinsic to add liquidity to pool, while specifying first token id
     * and second token id and first token amount. Second token amount is calculated in block, * but cannot exceed expected second token amount
     *
     * @param {string | Keyringpair} account
     * @param {string} firstTokenId
     * @param {string} secondTokenId
     * @param {BN} firstTokenAmount
     * @param {BN} expectedSecondTokenAmount
     * @param {TxOptions} [txOptions]
     *
     * @returns {(MangataGenericEvent|Array)}
     */
    async mintLiquidity(account, firstTokenId, secondTokenId, firstTokenAmount, expectedSecondTokenAmount, txOptions) {
        const api = await this.getApi();
        return await Tx.mintLiquidity(api, account, firstTokenId, secondTokenId, firstTokenAmount, expectedSecondTokenAmount, txOptions);
    }
    async burnLiquidityFee(account, firstTokenId, secondTokenId, liquidityTokenAmount) {
        const api = await this.getApi();
        return await Fee.burnLiquidityFee(api, account, firstTokenId, secondTokenId, liquidityTokenAmount);
    }
    /**
     * Extrinsic to remove liquidity from liquidity pool, specifying first token id and
     * second token id of a pool and liquidity token amount you wish to burn
     *
     * @param {string | Keyringpair} account
     * @param {string} firstTokenId
     * @param {string} secondTokenId
     * @param {BN} liquidityTokenAmount
     * @param {TxOptions} [txOptions]
     *
     * @returns {(MangataGenericEvent|Array)}
     */
    async burnLiquidity(account, firstTokenId, secondTokenId, liquidityTokenAmount, txOptions) {
        const api = await this.getApi();
        return await Tx.burnLiquidity(api, account, firstTokenId, secondTokenId, liquidityTokenAmount, txOptions);
    }
    async buyAssetFee(account, soldAssetId, boughtAssetId, amount, maxAmountIn) {
        const api = await this.getApi();
        return await Fee.buyAssetFee(api, account, soldAssetId, boughtAssetId, amount, maxAmountIn);
    }
    /**
     * Extrinsic to buy/swap bought token id in bought token amount for sold token id, while
     * specifying max amount in: maximal amount you are willing to pay in sold token id to
     * purchase bought token id in bought token amount.
     *
     * @param {string | Keyringpair} account
     * @param {string} soldAssetId
     * @param {string} boughtAssetId
     * @param {BN} amount
     * @param {BN} maxAmountIn
     * @param {TxOptions} [txOptions]
     *
     * @returns {(MangataGenericEvent|Array)}
     */
    async buyAsset(account, soldAssetId, boughtAssetId, amount, maxAmountIn, txOptions) {
        const api = await this.getApi();
        return await Tx.buyAsset(api, account, soldAssetId, boughtAssetId, amount, maxAmountIn, txOptions);
    }
    /**
     * Returns sell amount you need to pay in sold token id for bought token id in buy
     * amount, while specifying input reserve – reserve of sold token id, and output reserve
     * – reserve of bought token id
     *
     * @param {BN} inputReserve
     * @param {BN} outputReserve
     * @param {BN} buyAmount
     *
     * @returns {BN}
     */
    async calculateBuyPrice(inputReserve, outputReserve, buyAmount) {
        const api = await this.getApi();
        return await Rpc.calculateBuyPrice(api, inputReserve, outputReserve, buyAmount);
    }
    /**
     * Returns bought token amount returned by selling sold token id for bought token id in
     * sell amount, while specifying input reserve – reserve of sold token id, and output
     * reserve – reserve of bought token id
     *
     * @param {BN} inputReserve
     * @param {BN} outputReserve
     * @param {BN} sellAmount
     *
     * @returns {BN}
     */
    async calculateSellPrice(inputReserve, outputReserve, sellAmount) {
        const api = await this.getApi();
        return await Rpc.calculateSellPrice(api, inputReserve, outputReserve, sellAmount);
    }
    /**
     * Returns bought token amount returned by selling sold token id for bought token id in
     * sell amount, while specifying input reserve – reserve of sold token id, and output
     * reserve – reserve of bought token id
     *
     * @param {BN} inputReserve
     * @param {BN} outputReserve
     * @param {BN} sellAmount
     *
     * @returns {BN}
     */
    async getBurnAmount(firstTokenId, secondTokenId, liquidityAssetAmount) {
        const api = await this.getApi();
        return await Rpc.getBurnAmount(api, firstTokenId, secondTokenId, liquidityAssetAmount);
    }
    /**
     * Returns bought asset amount returned by selling sold token id for bought token id in
     * sell amount
     *
     * @param {string} soldTokenId
     * @param {string} boughtTokenId
     * @param {BN} sellAmount
     *
     * @returns {BN}
     */
    async calculateSellPriceId(soldTokenId, boughtTokenId, sellAmount) {
        const api = await this.getApi();
        return await Rpc.calculateSellPriceId(api, soldTokenId, boughtTokenId, sellAmount);
    }
    /**
     * Returns sell amount you need to pay in sold token id for bought token id in buy amount
     *
     * @param {string} soldTokenId
     * @param {string} boughtTokenId
     * @param {BN} buyAmount
     *
     * @returns {BN}
     *
     */
    async calculateBuyPriceId(soldTokenId, boughtTokenId, buyAmount) {
        const api = await this.getApi();
        return await Rpc.calculateBuyPriceId(api, soldTokenId, boughtTokenId, buyAmount);
    }
    /**
     * Returns amount of token ids in pool.
     *
     * @param {string} firstTokenId
     * @param {string} secondTokenId
     *
     * @returns {BN | Array}
     */
    async getAmountOfTokenIdInPool(firstTokenId, secondTokenId) {
        const api = await this.getApi();
        return await Query.getAmountOfTokenIdInPool(api, firstTokenId, secondTokenId);
    }
    /**
     * Returns liquidity asset id while specifying first and second Token Id.
     * Returns same liquidity asset id when specifying other way
     * around – second and first Token Id
     *
     * @param {string} firstTokenId
     * @param {string} secondTokenId
     *
     * @returns {BN}
     */
    async getLiquidityTokenId(firstTokenId, secondTokenId) {
        const api = await this.getApi();
        return await Query.getLiquidityTokenId(api, firstTokenId, secondTokenId);
    }
    /**
     * Returns pool corresponding to specified liquidity asset ID
     * @param {string} liquidityAssetId
     *
     * @returns {BN | Array}
     */
    async getLiquidityPool(liquidityAssetId) {
        const api = await this.getApi();
        return await Query.getLiquidityPool(api, liquidityAssetId);
    }
    async transferTokenFee(account, tokenId, address, amount) {
        const api = await this.getApi();
        return await Fee.transferTokenFee(api, account, tokenId, address, amount);
    }
    /**
     * Extrinsic that transfers Token Id in value amount from origin to destination
     * @param {string | Keyringpair} account
     * @param {string} tokenId
     * @param {string} address
     * @param {BN} amount
     * @param {TxOptions} [txOptions]
     *
     * @returns {(MangataGenericEvent|Array)}
     */
    async transferToken(account, tokenId, address, amount, txOptions) {
        const api = await this.getApi();
        const result = await Tx.transferToken(api, account, tokenId, address, amount, txOptions);
        return result;
    }
    async transferTokenAllFee(account, tokenId, address) {
        const api = await this.getApi();
        return await Fee.transferAllTokenFee(api, account, tokenId, address);
    }
    /**
     * Extrinsic that transfers all token Id from origin to destination
     * @param {string | Keyringpair} account
     * @param {string} tokenId
     * @param {string} address
     * @param {TxOptions} [txOptions]
     *
     * @returns {(MangataGenericEvent|Array)}
     */
    async transferTokenAll(account, tokenId, address, txOptions) {
        const api = await this.getApi();
        return await Tx.transferAllToken(api, account, tokenId, address, txOptions);
    }
    /**
     * Returns total issuance of Token Id
     * @param {string} tokenId
     *
     * @returns {BN}
     */
    async getTotalIssuance(tokenId) {
        const api = await this.getApi();
        return await Query.getTotalIssuance(api, tokenId);
    }
    /**
     * Returns token balance for address
     * @param {string} tokenId
     * @param {string} address
     *
     * @returns {AccountData}
     */
    async getTokenBalance(tokenId, address) {
        const api = await this.getApi();
        return await Query.getTokenBalance(api, address, tokenId);
    }
    /**
     * Returns next CurencyId, CurrencyId that will be used for next created token
     */
    async getNextTokenId() {
        const api = await this.getApi();
        return await Query.getNextTokenId(api);
    }
    /**
     * Returns token info
     * @param {string} tokenId
     */
    async getTokenInfo(tokenId) {
        const api = await this.getApi();
        return await Query.getTokenInfo(api, tokenId);
    }
    async getBlockNumber() {
        const api = await this.getApi();
        return await Query.getBlockNumber(api);
    }
    async getOwnedTokens(address) {
        const api = await this.getApi();
        return await Query.getOwnedTokens(api, address);
    }
    /**
     * Returns liquditity token Ids
     * @returns {string | Array}
     */
    async getLiquidityTokenIds() {
        const api = await this.getApi();
        return await Query.getLiquidityTokenIds(api);
    }
    /**
     * Returns info about all assets
     */
    async getAssetsInfo() {
        const api = await this.getApi();
        return await Query.getAssetsInfo(api);
    }
    async getBalances() {
        const api = await this.getApi();
        return await Query.getBalances(api);
    }
    async getLiquidityTokens() {
        const api = await this.getApi();
        return await Query.getLiquidityTokens(api);
    }
    async getPool(liquditityTokenId) {
        const api = await this.getApi();
        return await Query.getPool(api, liquditityTokenId);
    }
    async getInvestedPools(address) {
        const api = await this.getApi();
        const investedPools = await Query.getInvestedPools(api, address);
        const investedPoolsFormatted = [];
        for (const pool of investedPools) {
            const awaitedPool = await pool;
            investedPoolsFormatted.push(awaitedPool);
        }
        return investedPoolsFormatted;
    }
    async getPools() {
        const api = await this.getApi();
        return await Query.getPools(api);
    }
}

// Replacement for the native `toFixed` function which solves the
// issue that the native one rounds the numbers by default.
const toFixed = (value, decimals) => {
    // This expression matches:
    // 1. Minus sign (optional)
    // 2. Any amount of digits
    // 3. A decimal separator and the desired amount of decimal digits (optional)
    const decimalsRegex = new RegExp(`^-?\\d+(?:\\.\\d{0,${decimals}})?`, "gm");
    const withDesiredDecimalPlaces = value.match(decimalsRegex);
    // However there can be some trailing zeroes
    // This expression matches:
    // 1. Everything except trailing zeroes
    // Source: https://www.reddit.com/r/regex/comments/dl2nug/comment/f4m8o9w/?utm_source=share&utm_medium=web2x&context=3
    const trailingZeroesRegex = /^0*(\d+(?:\.(?:(?!0+$)\d)+)?)/gm;
    const withoutTrailingZeroes = (withDesiredDecimalPlaces?.[0] || value).match(trailingZeroesRegex);
    return withoutTrailingZeroes?.[0] ?? value;
};

const isInputValid = (value) => {
    const valueNum = +value;
    return !(!value || isNaN(Number(value)) || isNaN(valueNum) || valueNum < 0);
};

/* eslint-disable no-console */
/**
 * @class MangataHelpers
 * @author Mangata Finance
 */
class MangataHelpers {
    static createKeyring(type) {
        return new Keyring({ type });
    }
    static createKeyPairFromName(keyring, name = "") {
        const userName = name ? name : "//testUser_" + v4();
        const account = keyring.createFromUri(userName);
        keyring.addPair(account);
        return account;
    }
    static getXoshiro(seed) {
        return getXoshiro(seed);
    }
    static getPriceImpact(poolBalance, poolDecimals, firstTokenAmount, secondTokenAmount) {
        if (!poolBalance ||
            !poolDecimals ||
            !isInputValid(firstTokenAmount) ||
            !isInputValid(secondTokenAmount)) {
            return;
        }
        const firstReserveBefore = poolBalance.firstTokenBalance;
        const secondReserveBefore = poolBalance.secondTokenBalance;
        const soldAmount = toBN(firstTokenAmount, poolDecimals.firstTokenDecimals);
        const boughtAmount = toBN(secondTokenAmount, poolDecimals.secondTokenDecimals);
        if (boughtAmount.gte(secondReserveBefore))
            return "";
        const numerator = firstReserveBefore
            .add(soldAmount)
            .mul(BN_TEN_THOUSAND)
            .mul(secondReserveBefore);
        const denominator = secondReserveBefore
            .sub(boughtAmount)
            .mul(firstReserveBefore);
        const res = numerator.div(denominator).sub(BN_TEN_THOUSAND);
        const resStr = res.toString();
        const resBig = Big(resStr);
        const resFormatted = toFixed(resBig.div(BIG_HUNDRED).toString(), 2);
        return resFormatted;
    }
}

export { BIG_BILLION, BIG_HUNDRED, BIG_HUNDRED_BILLIONS, BIG_HUNDRED_MILLIONS, BIG_HUNDRED_THOUSAND, BIG_MILLION, BIG_ONE, BIG_TEN, BIG_TEN_BILLIONS, BIG_TEN_MILLIONS, BIG_TEN_THOUSAND, BIG_THOUSAND, BIG_TRILLION, BIG_ZERO, BN_BILLION, BN_DIV_NUMERATOR_MULTIPLIER, BN_DIV_NUMERATOR_MULTIPLIER_DECIMALS, BN_HUNDRED, BN_HUNDRED_BILLIONS, BN_HUNDRED_MILLIONS, BN_HUNDRED_THOUSAND, BN_MILLION, BN_ONE, BN_TEN, BN_TEN_BILLIONS, BN_TEN_MILLIONS, BN_TEN_THOUSAND, BN_THOUSAND, BN_TRILLION, BN_ZERO, Mangata, MangataHelpers, fromBN, signTx, toBN, toFixed };
