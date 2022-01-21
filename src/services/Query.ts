/* eslint-disable no-console */
import { ApiPromise } from '@polkadot/api'
import { AccountData } from '@polkadot/types/interfaces/balances'
import { hexToBn } from '@polkadot/util'
import { Codec } from '@polkadot/types/types'
import BN from 'bn.js'
import { TAsset, TAssetInfo, TBalances, TMainAssets, TPool } from '../types/AssetInfo'
import { getSymbol } from '../utils/getSymbol'
import { getAssetsInfoMap } from '../utils/getAssetsInfoMap'
import { liquidityAssetsMap } from '../utils/liquidityAssetsMap'
import { poolsBalanceMap } from '../utils/poolsBalanceMap'
import { poolsMap } from '../utils/poolsMap'
import { balancesMap } from '../utils/balancesMap'
import { accountEntriesMap } from '../utils/accountEntriesMap'
import { ownedTokensMap } from '../utils/ownedTokensMap'
import { getCorrectSymbol } from '../utils/getCorrectSymbol'

const TREASURY_ADDRESS = process.env.TREASURY_ADDRESS ? process.env.TREASURY_ADDRESS : ''
const TREASURY_BURN_ADDRESS = process.env.TREASURY_BURN_ADDRESS
  ? process.env.TREASURY_BURN_ADDRESS
  : ''

class Query {
  static async getNonce(api: ApiPromise, address: string): Promise<BN> {
    const { nonce } = await api.query.system.account(address)
    return nonce.toBn()
  }

  static async getAmountOfTokenIdInPool(
    api: ApiPromise,
    firstTokenId: string,
    secondTokenId: string
  ): Promise<BN[]> {
    const balance = await api.query.xyk.pools([firstTokenId, secondTokenId])
    const tokenValue1 = JSON.parse(balance.toString())[0]
    const tokenValue2 = JSON.parse(balance.toString())[1]
    const token1: BN = hexToBn(tokenValue1)
    const token2: BN = hexToBn(tokenValue2)
    return [token1, token2]
  }

  static async getLiquidityAssetId(
    api: ApiPromise,
    firstTokenId: string,
    secondTokenId: string
  ): Promise<BN> {
    const liquidityAssetId = await api.query.xyk.liquidityAssets([firstTokenId, secondTokenId])
    return new BN(liquidityAssetId.toString())
  }

  static async getLiquidityPool(api: ApiPromise, liquidityAssetId: string): Promise<BN[]> {
    const liquidityPool = await api.query.xyk.liquidityPools(liquidityAssetId)
    const poolAssetIds = JSON.parse(JSON.stringify(liquidityPool))
    if (!poolAssetIds) {
      return [new BN(-1), new BN(-1)]
    }

    return poolAssetIds.map((num: any) => new BN(num.toString()))
  }

  static async getTreasury(api: ApiPromise, tokenId: string): Promise<AccountData> {
    const treasuryBalance = await api.query.tokens.accounts(TREASURY_ADDRESS, tokenId)
    const accountData = treasuryBalance as AccountData
    return accountData
  }

  static async getTreasuryBurn(api: ApiPromise, tokenId: string): Promise<AccountData> {
    const treasuryBalance = await api.query.tokens.accounts(TREASURY_BURN_ADDRESS, tokenId)
    const accountData = treasuryBalance as AccountData
    return accountData
  }

  static async getTotalIssuance(api: ApiPromise, tokenId: string): Promise<BN> {
    const tokenSupply = await api.query.tokens.totalIssuance(tokenId)
    return new BN(tokenSupply.toString())
  }

  // TODO: find the return type
  static async getLock(api: ApiPromise, address: string, tokenId: string) {
    const locksResponse = await api.query.tokens.locks(address, tokenId)
    return JSON.parse(JSON.stringify(locksResponse.toHuman()))
  }

  static async getTokenBalance(
    api: ApiPromise,
    address: string,
    tokenId: string
  ): Promise<AccountData> {
    const balance = await api.query.tokens.accounts(address, tokenId)
    const accountData = balance as AccountData
    return accountData
  }

  static async getNextTokenId(api: ApiPromise): Promise<BN> {
    const nextTokenId = await api.query.tokens.nextCurrencyId()
    return new BN(nextTokenId.toString())
  }

  static async getBridgeAddresses(api: ApiPromise) {
    const bridgedAssets = await api.query.bridgedAsset.bridgedAsset.entries()
    const map = new Map<string, string>()
    bridgedAssets.map(([key, exposure]) => {
      const id = (key.toHuman() as string[])[0].replace(/[, ]/g, '')
      const address = exposure.toString()
      map.set(address, id)
    })

    const result = Array.from(map).reduce((obj, [key, value]) => {
      obj[key] = value
      return obj
    }, {} as { [address: string]: string })

    return result
  }

  static async getBridgeIds(api: ApiPromise) {
    const bridgedAssets = await api.query.bridgedAsset.bridgedAsset.entries()
    const map = new Map<string, string>()
    bridgedAssets.map(([key, exposure]) => {
      const id = (key.toHuman() as string[])[0].replace(/[, ]/g, '')
      const address = exposure.toString()
      map.set(id, address)
    })

    const result = Array.from(map).reduce((obj, [key, value]) => {
      obj[key] = value
      return obj
    }, {} as { [id: string]: string })

    return result
  }

  static async getBridgedTokens(api: ApiPromise) {
    const assetsInfo = await this.getAssetsInfo(api)
    const bridgedAssets = await this.getBridgeIds(api)

    const bridgedAssetsFormatted = Object.values(assetsInfo)
      .filter((item: TAssetInfo) => bridgedAssets[item.id])
      .map((item: TAssetInfo) => {
        return {
          ...item,
          description: bridgedAssets[item.id],
        }
      })

    const map = new Map<string, TAssetInfo>()
    bridgedAssetsFormatted.forEach((asset: TAssetInfo) => map.set(asset.id, asset))
    const result = Array.from(map).reduce((obj, [key, value]) => {
      obj[key] = value
      return obj
    }, {} as { [id: string]: TAssetInfo })

    return result
  }

  static async getTokenInfo(api: ApiPromise, tokenId: string) {
    const assetsInfo = await getAssetsInfoMap(api)

    const asset = assetsInfo[tokenId]
    return asset.name.includes('LiquidityPoolToken')
      ? {
          ...asset,
          name: 'Liquidity Pool Token',
          symbol: getCorrectSymbol(asset.symbol, assetsInfo),
        }
      : assetsInfo[tokenId]
  }

  static async getLiquidityTokenIds(api: ApiPromise): Promise<string[]> {
    const liquidityTokens = await api.query.xyk.liquidityAssets.entries()
    return liquidityTokens.map((liquidityToken) => liquidityToken[1].toString())
  }

  static async getLiquidityTokens(api: ApiPromise) {
    const assetsInfo = await getAssetsInfoMap(api)
    const liquidityTokens = Object.values(assetsInfo)
      .filter((asset) => asset.name.includes('LiquidityPoolToken'))
      .map((asset) => {
        return {
          id: asset.id,
          chainId: asset.chainId,
          address: asset.address,
          name: 'Liquidity Pool Token',
          symbol: getCorrectSymbol(asset.symbol, assetsInfo),
          decimals: Number(asset.decimals),
        } as TAssetInfo
      })

    const map = new Map<string, TAssetInfo>()
    liquidityTokens.forEach((asset: TAssetInfo) => map.set(asset.id, asset))

    const result = Array.from(map).reduce((obj, [key, value]) => {
      obj[key] = value
      return obj
    }, {} as { [id: string]: TAssetInfo })

    return result
  }

  static async getAssetsInfo(api: ApiPromise): Promise<TMainAssets> {
    const assetsInfo = await getAssetsInfoMap(api)

    // from assets info we receive liquidity tokens in the format
    // TKN0x000003CD-TKN0x00000000
    // therefore we need to parse this to tokens ids
    // TKN0x000003CD-TKN0x00000000 -> 13-4 -> 'm12-MGA / mDOT'
    const map = new Map<string, TAssetInfo>()

    for (const [key, value] of Object.entries(assetsInfo)) {
      map.set(key, {
        id: key,
        chainId: value.chainId,
        address: value.address,
        name: value.symbol.includes('TKN') ? 'Liquidity Pool Token' : value.name,
        symbol: value.symbol.includes('TKN')
          ? getCorrectSymbol(value.symbol, assetsInfo)
          : value.symbol,
        decimals: Number(value.decimals),
      })
    }

    const result = Array.from(map).reduce((obj, [key, value]) => {
      obj[key] = value
      return obj
    }, {} as { [id: string]: TAssetInfo })

    return result
  }

  static async getBlockNumber(api: ApiPromise): Promise<string> {
    const block = await api.rpc.chain.getBlock()
    return block.block.header.number.toString()
  }

  static async getOwnedTokens(api: ApiPromise, address: string) {
    if (!address) {
      return null
    }

    const bridgeIds = await this.getBridgeIds(api)
    const assetsInfo = await this.getAssetsInfo(api)
    const accountEntries = await accountEntriesMap(api, address)

    const ownedTokens: TAsset[] = Object.values(assetsInfo)
      .filter((item) => accountEntries[item.id])
      .map((item) => {
        return {
          ...item,
          address: Object(bridgeIds).hasOwnProperty(item.id) ? bridgeIds[item.id] : item.address,
          balance: accountEntries[item.id],
        }
      })

    return ownedTokensMap(ownedTokens)
  }

  static async getBalances(api: ApiPromise): Promise<TBalances> {
    return await balancesMap(api)
  }

  static async getPools(api: ApiPromise) {
    const assetsInfo = await this.getAssetsInfo(api)
    const liquidityAssets = await liquidityAssetsMap(api)
    const poolBalances = await poolsBalanceMap(api, liquidityAssets)

    const result = Object.values(assetsInfo)
      .filter((assetInfo) => Object.values(liquidityAssets).includes(assetInfo.id))
      .map(
        (asset) =>
          ({
            firstToken: asset.symbol.includes('/')
              ? asset.symbol.split('/')[0]
              : asset.symbol.split('-')[0],
            secondToken: asset.symbol.includes('/')
              ? asset.symbol.split('/')[1]
              : asset.symbol.split('-')[1],
            firstTokenAmount: poolBalances[asset.id][0],
            secondTokenAmount: poolBalances[asset.id][1],
            liquidityTokenId: asset.id,
          } as TPool)
      )

    return poolsMap(result)
  }
}

export default Query
