/* eslint-disable no-console */
import { ApiPromise } from '@polkadot/api'
import { AccountData } from '@polkadot/types/interfaces/balances'
import { hexToBn } from '@polkadot/util'
import { Codec } from '@polkadot/types/types'
import BN from 'bn.js'
import { TAsset, TAssetInfo, TAssetMainInfo, TBalance } from '../types/AssetInfo'

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

  static async getBridgedTokens(api: ApiPromise): Promise<
    Promise<{
      assetId: string
      info: {
        name: string
        symbol: string
        decimals: number
        description: string
      }
      ethereumAddress: string
    }>[]
  > {
    const bridgedAssets = await api.query.bridgedAsset.bridgedAsset.entries<'Vec<u8>'>()
    return bridgedAssets.map(async (bridgedAsset) => {
      const tokenId = bridgedAsset[0].args[0].toString()
      const info = await api.query.assetsInfo.assetsInfo(tokenId)
      const infoHuman = info.toHuman() as {
        name: string
        symbol: string
        decimals: string
        description: string
      }
      const ethAddress = bridgedAsset[1].toString()
      return {
        assetId: tokenId,
        info: {
          name: infoHuman.name,
          symbol: infoHuman.symbol,
          decimals: Number(infoHuman.decimals),
          description: infoHuman.description,
        },
        ethereumAddress: ethAddress,
      }
    })
  }

  static async getTokenInfo(api: ApiPromise, tokenId: string): Promise<Codec> {
    return await api.query.assetsInfo.assetsInfo(tokenId)
  }

  static async getLiquidityTokenIds(api: ApiPromise): Promise<string[]> {
    const liquidityTokens = await api.query.xyk.liquidityAssets.entries()
    return liquidityTokens.map((liquidityToken) => liquidityToken[1].toString())
  }

  static async getAssetsInfo(api: ApiPromise): Promise<Promise<TAssetInfo>[]> {
    const result = await api.query.assetsInfo.assetsInfo.entries()

    return result.map(async ([key, exposure]) => {
      const exposureFormatted = exposure.toHuman() as TAssetMainInfo

      return {
        id: (key.toHuman() as string[])[0].replace(/[, ]/g, ''),
        name: exposureFormatted.symbol.includes('TKN')
          ? 'Liquidity Pool Token'
          : exposureFormatted.name,
        symbol: exposureFormatted.symbol.includes('TKN')
          ? exposureFormatted.symbol
              .split('-')
              .map((item) => item.replace('TKN', ''))
              .map((tokenId) => (tokenId.startsWith('0x') ? hexToBn(tokenId).toString() : tokenId))
              .join('-')
          : exposureFormatted.symbol,
        decimals: Number(exposureFormatted.decimals),
        description: exposureFormatted.description,
      }
    })
  }

  static async getBlockNumber(api: ApiPromise): Promise<string> {
    const block = await api.rpc.chain.getBlock()
    return block.block.header.number.toString()
  }

  static async getOwnedTokens(api: ApiPromise, address: string): Promise<Promise<TAsset>[] | null> {
    if (!address) {
      return null
    }

    const ownedAssets = await api.query.tokens.accounts.entries(address)

    return ownedAssets.map(async ([key, exposure]) => {
      const tokenId = (key.toHuman() as string[])[1].replace(/[, ]/g, '')
      const tokenInfo = await api.query.assetsInfo.assetsInfo(tokenId)
      const balance = JSON.parse(JSON.stringify(exposure)).free

      const tokenInfoFormatted = tokenInfo.toHuman() as TAssetMainInfo

      return {
        id: tokenId,
        name: tokenInfoFormatted.symbol.includes('TKN')
          ? 'Liquidity Pool Token'
          : tokenInfoFormatted.name,
        symbol: tokenInfoFormatted.symbol.includes('TKN')
          ? tokenInfoFormatted.symbol
              .split('-')
              .map((item) => item.replace('TKN', ''))
              .map((tokenId) => (tokenId.startsWith('0x') ? hexToBn(tokenId).toString() : tokenId))
              .join('-')
          : tokenInfoFormatted.symbol,
        decimals: Number(tokenInfoFormatted.decimals),
        description: tokenInfoFormatted.description,
        balance: new BN(BigInt(balance).toString()),
      }
    })
  }

  static async getBalances(api: ApiPromise): Promise<TBalance> {
    const balances = await api.query.tokens.totalIssuance.entries()
    let map = new Map<string, BN>()
    balances.forEach(([key, exposure]) => {
      const id = (key.toHuman() as string[])[0].replace(/[, ]/g, '')
      const balance = new BN(exposure.toString())
      map.set(id, balance)
    })

    const result = Array.from(map).reduce((obj, [key, value]) => {
      obj[key] = value
      return obj
    }, {} as { [id: string]: BN })

    return result
  }
}

export default Query
