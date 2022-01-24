/* eslint-disable no-console */
import { ApiPromise } from '@polkadot/api'
import { AccountData } from '@polkadot/types/interfaces/balances'
import { hexToBn, isHex } from '@polkadot/util'
import BN from 'bn.js'
import { TAsset, TAssetInfo, TBalances, TMainAssets, TokenBalance, TPool } from '../types/AssetInfo'
import { getAssetsInfoMap } from '../utils/getAssetsInfoMap'
import { liquidityAssetsMap } from '../utils/liquidityAssetsMap'
import { poolsBalanceMap } from '../utils/poolsBalanceMap'
import { balancesMap } from '../utils/balancesMap'
import { accountEntriesMap } from '../utils/accountEntriesMap'
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

  static async getBridgeAddresses(api: ApiPromise) {
    const bridgedAssets = await api.query.bridgedAsset.bridgedAsset.entries()
    return bridgedAssets.reduce((obj, [key, exposure]) => {
      const id = (key.toHuman() as string[])[0].replace(/[, ]/g, '')
      const address = exposure.toString()
      obj[address] = id
      return obj
    }, {} as { [address: string]: string })
  }

  static async getBridgeIds(api: ApiPromise) {
    const bridgedAssets = await api.query.bridgedAsset.bridgedAsset.entries()

    return bridgedAssets.reduce((obj, [key, exposure]) => {
      const id = (key.toHuman() as string[])[0].replace(/[, ]/g, '')
      const address = exposure.toString()
      obj[id] = address
      return obj
    }, {} as { [id: string]: string })
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

  static async getLiquidityTokens(api: ApiPromise): Promise<TMainAssets> {
    const assetsInfo = await getAssetsInfoMap(api)

    return Object.values(assetsInfo)
      .reduce(
        (acc, asset) => (asset.name.includes('Liquidity Pool Token') ? acc.concat(asset) : acc),
        [] as TAssetInfo[]
      )
      .reduce((acc, assetInfo) => {
        acc[assetInfo.id] = assetInfo
        return acc
      }, {} as { [id: string]: TAssetInfo })
  }

  static async getAssetsInfo(api: ApiPromise): Promise<TMainAssets> {
    return await getAssetsInfoMap(api)
  }

  static async getBlockNumber(api: ApiPromise): Promise<string> {
    const block = await api.rpc.chain.getBlock()
    return block.block.header.number.toString()
  }

  static async getOwnedTokens(api: ApiPromise, address: string) {
    if (!address) {
      return null
    }

    const [assetsInfo, accountEntries] = await Promise.all([
      getAssetsInfoMap(api),
      accountEntriesMap(api, address),
    ])

    return Object.values(assetsInfo)
      .reduce(
        (acc, asset) => (accountEntries[asset.id] ? acc.concat(asset) : acc),
        [] as TAssetInfo[]
      )
      .reduce((acc, assetInfo) => {
        const asset = {
          ...assetInfo,
          balance: accountEntries[assetInfo.id],
        }

        acc[asset.id] = asset
        return acc
      }, {} as { [id: string]: TAsset })
  }

  static async getBalances(api: ApiPromise): Promise<TBalances> {
    return await balancesMap(api)
  }

  static async getPools(api: ApiPromise) {
    const [assetsInfo, liquidityAssets] = await Promise.all([
      getAssetsInfoMap(api),
      liquidityAssetsMap(api),
    ])
    const poolBalances = await poolsBalanceMap(api, liquidityAssets)

    return Object.values(assetsInfo)
      .reduce(
        (acc, asset) =>
          Object.values(liquidityAssets).includes(asset.id) ? acc.concat(asset) : acc,
        [] as TAssetInfo[]
      )
      .reduce(
        (acc, asset) => {
          const poolInfo = {
            firstToken: asset.symbol.includes('/')
              ? asset.symbol.split('/')[0]
              : asset.symbol.split('-')[0],
            secondToken: asset.symbol.includes('/')
              ? asset.symbol.split('/')[1]
              : asset.symbol.split('-')[1],
            firstTokenAmount: poolBalances[asset.id][0],
            secondTokenAmount: poolBalances[asset.id][1],
            liquidityTokenId: asset.id,
          } as TPool
          acc[poolInfo.liquidityTokenId] = poolInfo
          return acc
        },
        {} as {
          [id: string]: TPool
        }
      )
  }
}

export default Query
