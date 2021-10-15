/* eslint-disable no-console */
import { ApiPromise } from '@polkadot/api'
import { AccountData } from '@polkadot/types/interfaces/balances'
import { hexToBn } from '@polkadot/util'
import { Codec } from '@polkadot/types/types'
import BN from 'bn.js'

import { getNonce as getNonceEntity } from '../entities/query/nonce'
import { getAmountOfTokens as getAmountOfTokensEntity } from '../entities/query/pools'
import { getLiquidityAssets as getLiquidityAssetsEntity } from '../entities/query/liquidityAssets'
import { getLiquidityPool as getLiquidityPoolEntity } from '../entities/query/liquidityPools'
import { getTotalIssuance as getTotalIssuanceEntity } from '../entities/query/totalIssuance'
import { getLock as getLockEntity } from '../entities/query/locks'
import { getTokenBalance as getTokenBalanceEntity } from '../entities/query/accounts'
import { getNextToken as getNextTokenEntity } from '../entities/query/nextCurrencyId'
import { getBridgedTokens as getBridgedTokensEntity } from '../entities/query/bridgedAsset'
import { getTokenInfo as getTokenInfoEntity } from '../entities/query/assetInfo'

const TREASURY_ADDRESS = process.env.TREASURY_ADDRESS ? process.env.TREASURY_ADDRESS : ''
const TREASURY_BURN_ADDRESS = process.env.TREASURY_BURN_ADDRESS
  ? process.env.TREASURY_BURN_ADDRESS
  : ''

class Query {
  static async getNonce(api: ApiPromise, address: string): Promise<BN> {
    const { nonce } = await getNonceEntity(api, address)
    return nonce.toBn()
  }

  static async getAmountOfTokenIdInPool(
    api: ApiPromise,
    firstTokenId: string,
    secondTokenId: string
  ): Promise<BN[]> {
    const balance = await getAmountOfTokensEntity(api, firstTokenId, secondTokenId)
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
    const liquidityAssetId = await getLiquidityAssetsEntity(api, firstTokenId, secondTokenId)
    return new BN(liquidityAssetId.toString())
  }

  static async getLiquidityPool(api: ApiPromise, liquidityAssetId: string): Promise<BN[]> {
    const liquidityPool = await getLiquidityPoolEntity(api, liquidityAssetId)
    const poolAssetIds = liquidityPool.toHuman() as Number[]
    if (!poolAssetIds) {
      return [new BN(-1), new BN(-1)]
    }

    return poolAssetIds.map((num) => new BN(num.toString()))
  }

  static async getTreasury(api: ApiPromise, tokenId: string): Promise<AccountData> {
    const treasuryBalance = await getTokenBalanceEntity(api, TREASURY_ADDRESS, tokenId)
    const accountData = treasuryBalance as AccountData
    return accountData
  }

  static async getTreasuryBurn(api: ApiPromise, tokenId: string): Promise<AccountData> {
    const treasuryBalance = await getTokenBalanceEntity(api, TREASURY_BURN_ADDRESS, tokenId)
    const accountData = treasuryBalance as AccountData
    return accountData
  }

  static async getTotalIssuance(api: ApiPromise, tokenId: string): Promise<BN> {
    const tokenSupply = await getTotalIssuanceEntity(api, tokenId)
    return new BN(tokenSupply.toString())
  }

  // TODO: find the return type
  static async getLock(api: ApiPromise, address: string, tokenId: string) {
    const locksResponse = await getLockEntity(api, address, tokenId)
    return JSON.parse(JSON.stringify(locksResponse.toHuman()))
  }

  static async getTokenBalance(
    api: ApiPromise,
    address: string,
    tokenId: string
  ): Promise<AccountData> {
    const balance = await getTokenBalanceEntity(api, address, tokenId)
    const accountData = balance as AccountData
    return accountData
  }

  static async getNextTokenId(api: ApiPromise): Promise<BN> {
    const nextTokenId = await getNextTokenEntity(api)
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
    const bridgedAssets = await getBridgedTokensEntity(api)
    return bridgedAssets.map(async (bridgedAsset) => {
      const tokenId = bridgedAsset[0].args[0].toString()
      const info = await api.query.assetsInfo.assetsInfo(tokenId)
      const ethAddress = bridgedAsset[1].toString()
      return {
        assetId: tokenId,
        info: info.toHuman() as {
          name: string
          symbol: string
          decimals: number
          description: string
        },
        ethereumAddress: ethAddress,
      }
    })
  }

  static async getTokenInfo(api: ApiPromise, tokenId: string): Promise<Codec> {
    const tokenInfo = await getTokenInfoEntity(api, tokenId)
    return tokenInfo
  }

  static async getLiquidityTokenIds(api: ApiPromise): Promise<string[]> {
    const liquidityTokens = await api.query.xyk.liquidityAssets.entries()
    return liquidityTokens.map((liquidityToken) => liquidityToken[1].toString())
  }
}

export default Query
