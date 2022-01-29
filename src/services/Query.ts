/* eslint-disable no-console */
import { ApiPromise } from '@polkadot/api'
import { AccountData } from '@polkadot/types/interfaces/balances'
import { hexToBn, isHex } from '@polkadot/util'
import BN from 'bn.js'
import {
  TToken,
  TTokenInfo,
  TBalances,
  TMainTokens,
  TokenBalance,
  TPool,
  TTokenAddress,
  TBridgeTokens,
  TTokenId,
  TBridgeAddresses,
  TPoolWithRatio,
  TPoolWithShare,
} from '../types/AssetInfo'
import { getAssetsInfoMap } from '../utils/getAssetsInfoMap'
import { liquidityAssetsMap } from '../utils/liquidityAssetsMap'
import { poolsBalanceMap } from '../utils/poolsBalanceMap'
import { balancesMap } from '../utils/balancesMap'
import { accountEntriesMap } from '../utils/accountEntriesMap'
import { getCorrectSymbol } from '../utils/getCorrectSymbol'
import { getAssetsInfoMapWithIds } from '../utils/getAssetsInfoMapWithIds'
import { calculateLiquidityShare } from '../utils/calculateLiquidityShare'
import { getRatio } from '../utils/getRatio'
import { BN_ZERO } from '..'

const TREASURY_ADDRESS = process.env.TREASURY_ADDRESS ? process.env.TREASURY_ADDRESS : ''
const TREASURY_BURN_ADDRESS = process.env.TREASURY_BURN_ADDRESS
  ? process.env.TREASURY_BURN_ADDRESS
  : ''

class Query {
  static async getNonce(api: ApiPromise, address: TTokenAddress): Promise<BN> {
    const { nonce } = await api.query.system.account(address)
    return nonce.toBn()
  }

  static async getAmountOfTokenIdInPool(
    api: ApiPromise,
    firstTokenId: TTokenId,
    secondTokenId: TTokenId
  ): Promise<BN[]> {
    const balance = await api.query.xyk.pools([firstTokenId, secondTokenId])
    const tokenValue1 = JSON.parse(balance.toString())[0]
    const tokenValue2 = JSON.parse(balance.toString())[1]
    const token1: BN = hexToBn(tokenValue1)
    const token2: BN = hexToBn(tokenValue2)
    return [token1, token2]
  }

  static async getLiquidityTokenId(
    api: ApiPromise,
    firstTokenId: TTokenId,
    secondTokenId: TTokenId
  ): Promise<BN> {
    const liquidityAssetId = await api.query.xyk.liquidityAssets([firstTokenId, secondTokenId])
    return new BN(liquidityAssetId.toString())
  }

  static async getLiquidityPool(api: ApiPromise, liquidityTokenId: TTokenId): Promise<BN[]> {
    const liquidityPool = await api.query.xyk.liquidityPools(liquidityTokenId)
    const poolAssetIds = JSON.parse(JSON.stringify(liquidityPool))
    if (!poolAssetIds) {
      return [new BN(-1), new BN(-1)]
    }

    return poolAssetIds.map((num: any) => new BN(num.toString()))
  }

  static async getTreasury(api: ApiPromise, tokenId: TTokenId): Promise<AccountData> {
    const treasuryBalance = await api.query.tokens.accounts(TREASURY_ADDRESS, tokenId)
    const accountData = treasuryBalance as AccountData
    return accountData
  }

  static async getTreasuryBurn(api: ApiPromise, tokenId: TTokenId): Promise<AccountData> {
    const treasuryBalance = await api.query.tokens.accounts(TREASURY_BURN_ADDRESS, tokenId)
    const accountData = treasuryBalance as AccountData
    return accountData
  }

  static async getTotalIssuance(api: ApiPromise, tokenId: TTokenId): Promise<BN> {
    const tokenSupply = await api.query.tokens.totalIssuance(tokenId)
    return new BN(tokenSupply.toString())
  }

  // TODO: find the return type
  static async getLock(api: ApiPromise, address: TTokenAddress, tokenId: TTokenId) {
    const locksResponse = await api.query.tokens.locks(address, tokenId)
    return JSON.parse(JSON.stringify(locksResponse.toHuman()))
  }

  static async getTokenBalance(
    api: ApiPromise,
    address: TTokenAddress,
    tokenId: TTokenId
  ): Promise<TokenBalance> {
    const balanceResponse = await api.query.tokens.accounts(address, tokenId)
    const balance = JSON.parse(JSON.stringify(balanceResponse)) as {
      free: string
      reserved: string
      frozen: string
    }

    return {
      free: isHex(balance.free) ? hexToBn(balance.free) : new BN(balance.free),
      reserved: isHex(balance.reserved) ? hexToBn(balance.reserved) : new BN(balance.reserved),
      frozen: isHex(balance.frozen) ? hexToBn(balance.frozen) : new BN(balance.frozen),
    }
  }

  static async getNextTokenId(api: ApiPromise): Promise<BN> {
    const nextTokenId = await api.query.tokens.nextCurrencyId()
    return new BN(nextTokenId.toString())
  }

  static async getBridgeAddresses(api: ApiPromise): Promise<TBridgeAddresses> {
    const bridgedAssets = await api.query.bridgedAsset.bridgedAsset.entries()
    return bridgedAssets.reduce((obj, [key, exposure]) => {
      const id = (key.toHuman() as string[])[0].replace(/[, ]/g, '')
      const address = exposure.toString()
      obj[address] = id
      return obj
    }, {} as { [address: TTokenAddress]: TTokenId })
  }

  static async getBridgeIds(api: ApiPromise) {
    const bridgedAssets = await api.query.bridgedAsset.bridgedAsset.entries()

    return bridgedAssets.reduce((obj, [key, exposure]) => {
      const id = (key.toHuman() as string[])[0].replace(/[, ]/g, '')
      const address = exposure.toString()
      obj[id] = address
      return obj
    }, {} as { [id: TTokenId]: TTokenAddress })
  }

  static async getBridgedTokens(api: ApiPromise): Promise<TBridgeTokens> {
    const assetsInfo = await this.getAssetsInfo(api)
    const bridgedAssets = await this.getBridgeIds(api)

    const bridgedAssetsFormatted = Object.values(assetsInfo)
      .filter((item: TTokenInfo) => bridgedAssets[item.id])
      .map((item: TTokenInfo) => {
        return {
          ...item,
          description: bridgedAssets[item.id],
        }
      })

    const map = new Map<string, TTokenInfo>()
    bridgedAssetsFormatted.forEach((asset: TTokenInfo) => map.set(asset.id, asset))
    const result = Array.from(map).reduce((obj, [key, value]) => {
      obj[key] = value
      return obj
    }, {} as { [id: TTokenId]: TTokenInfo })

    return result
  }

  static async getTokenInfo(api: ApiPromise, tokenId: TTokenId): Promise<TTokenInfo> {
    const assetsInfo = await getAssetsInfoMap(api)

    const asset = assetsInfo[tokenId]
    return asset.name.includes('LiquidityPoolToken')
      ? {
          ...asset,
          name: 'Liquidity Pool Token',
          symbol: getCorrectSymbol(asset.symbol, assetsInfo),
        }
      : asset
  }

  static async getLiquidityTokenIds(api: ApiPromise): Promise<TTokenId[]> {
    const liquidityTokens = await api.query.xyk.liquidityAssets.entries()
    return liquidityTokens.map((liquidityToken) => liquidityToken[1].toString())
  }

  static async getLiquidityTokens(api: ApiPromise): Promise<TMainTokens> {
    const assetsInfo = await getAssetsInfoMap(api)

    return Object.values(assetsInfo)
      .reduce(
        (acc, asset) => (asset.name.includes('Liquidity Pool Token') ? acc.concat(asset) : acc),
        [] as TTokenInfo[]
      )
      .reduce((acc, assetInfo) => {
        acc[assetInfo.id] = assetInfo
        return acc
      }, {} as { [id: TTokenId]: TTokenInfo })
  }

  static async getAssetsInfo(api: ApiPromise): Promise<TMainTokens> {
    return await getAssetsInfoMap(api)
  }

  static async getBlockNumber(api: ApiPromise): Promise<string> {
    const block = await api.rpc.chain.getBlock()
    return block.block.header.number.toString()
  }

  static async getOwnedTokens(
    api: ApiPromise,
    address: string
  ): Promise<{ [id: TTokenId]: TToken } | null> {
    if (!address) {
      return null
    }

    const [assetsInfo, accountEntries] = await Promise.all([
      getAssetsInfoMap(api),
      accountEntriesMap(api, address),
    ])

    return Object.values(assetsInfo)
      .filter((asset) => accountEntries[asset.id] && accountEntries[asset.id].gt(BN_ZERO))
      .reduce((acc, assetInfo) => {
        const asset = {
          ...assetInfo,
          balance: accountEntries[assetInfo.id],
        }

        acc[asset.id] = asset
        return acc
      }, {} as { [id: TTokenId]: TToken })
  }

  static async getBalances(api: ApiPromise): Promise<TBalances> {
    return await balancesMap(api)
  }

  static async getInvestedPools(
    api: ApiPromise,
    address: TTokenAddress
  ): Promise<Promise<TPoolWithShare>[]> {
    const [assetsInfo, accountEntries] = await Promise.all([
      getAssetsInfoMapWithIds(api),
      accountEntriesMap(api, address),
    ])

    return Object.values(assetsInfo)
      .reduce(
        (acc, asset) => (accountEntries[asset.id] ? acc.concat(asset) : acc),
        [] as TTokenInfo[]
      )
      .filter(
        (asset: TTokenInfo) =>
          asset.name.includes('Liquidity Pool Token') && accountEntries[asset.id].gt(BN_ZERO)
      )
      .map(async (asset: TTokenInfo) => {
        const userLiquidityBalance = accountEntries[asset.id]
        const firstTokenId = asset.symbol.split('-')[0]
        const secondTokenId = asset.symbol.split('-')[1]
        const [firstTokenAmount, secondTokenAmount] = await this.getAmountOfTokenIdInPool(
          api,
          firstTokenId.toString(),
          secondTokenId.toString()
        )
        const poolInfo = {
          firstTokenId,
          secondTokenId,
          firstTokenAmount,
          secondTokenAmount,
          liquidityTokenId: asset.id,
          share: await calculateLiquidityShare(api, asset.id, userLiquidityBalance),
          firstTokenRatio: getRatio(firstTokenAmount, secondTokenAmount),
          secondTokenRatio: getRatio(secondTokenAmount, firstTokenAmount),
        } as TPool & { share: BN; firstTokenRatio: BN; secondTokenRatio: BN }

        return poolInfo
      })
  }

  static async getPool(api: ApiPromise, liquidityTokenId: TTokenId) {
    const liquidityPool = await api.query.xyk.liquidityPools(liquidityTokenId)
    const liquidityPoolId = JSON.parse(JSON.stringify(liquidityPool)) as [TTokenId, TTokenId]
    const [firstTokenId, secondTokenId] = liquidityPoolId
    const [firstTokenAmount, secondTokenAmount] = await this.getAmountOfTokenIdInPool(
      api,
      firstTokenId.toString(),
      secondTokenId.toString()
    )
    return {
      firstTokenId,
      secondTokenId,
      firstTokenAmount,
      secondTokenAmount,
      liquidityTokenId,
      firstTokenRatio: getRatio(firstTokenAmount, secondTokenAmount),
      secondTokenRatio: getRatio(secondTokenAmount, firstTokenAmount),
    } as TPool
  }

  static async getPools(api: ApiPromise): Promise<TPoolWithRatio[]> {
    const [assetsInfo, liquidityAssets] = await Promise.all([
      getAssetsInfoMapWithIds(api),
      liquidityAssetsMap(api),
    ])
    const poolBalances = await poolsBalanceMap(api, liquidityAssets)

    return Object.values(assetsInfo)
      .reduce(
        (acc, asset) =>
          Object.values(liquidityAssets).includes(asset.id) ? acc.concat(asset) : acc,
        [] as TTokenInfo[]
      )
      .map((asset: TTokenInfo) => {
        const [firstTokenAmount, secondTokenAmount] = poolBalances[asset.id]
        return {
          firstTokenId: asset.symbol.split('-')[0],
          secondTokenId: asset.symbol.split('-')[1],
          firstTokenAmount,
          secondTokenAmount,
          liquidityTokenId: asset.id,
          firstTokenRatio: getRatio(firstTokenAmount, secondTokenAmount),
          secondTokenRatio: getRatio(secondTokenAmount, firstTokenAmount),
        } as TPool & { firstTokenRatio: BN; secondTokenRatio: BN }
      })
  }
}

export default Query
