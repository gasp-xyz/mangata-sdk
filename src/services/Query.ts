/* eslint-disable no-console */
import { ApiPromise } from '@polkadot/api'
import { AccountData } from '@polkadot/types/interfaces/balances'
import BN from 'bn.js'

import { getNonce as getNonceEntity } from '../entities/query/nonce'
import { getAmountOfTokens as getAmountOfTokensEntity } from '../entities/query/pools'
import { getLiquidityAssets as getLiquidityAssetsEntity } from '../entities/query/liquidityAssets'
import { getLiquidityPool as getLiquidityPoolEntity } from '../entities/query/liquidityPools'
import { getTotalIssuance as getTotalIssuanceEntity } from '../entities/query/totalIssuance'
import { getLock as getLockEntity } from '../entities/query/locks'
import { getTokenBalance as getTokenBalanceEntity } from '../entities/query/accounts'
import { getNextToken as getNextTokenEntity } from '../entities/query/nextCurrencyId'
import { TokensId } from '../types/TokensId'
import { TokenId } from '../types/TokenId'
import { Address } from '../types/Address'

const TREASURY_ADDRESS = process.env.TREASURY_ADDRESS ? process.env.TREASURY_ADDRESS : ''
const TREASURY_BURN_ADDRESS = process.env.TREASURY_BURN_ADDRESS
  ? process.env.TREASURY_BURN_ADDRESS
  : ''

class Query {
  static async getNonce(api: ApiPromise, address: Address): Promise<BN> {
    const { nonce } = await getNonceEntity(api, address)
    return nonce.toBn()
  }

  static async getAmountOfTokenIdInPool(api: ApiPromise, tokens: TokensId): Promise<BN> {
    const balance = await getAmountOfTokensEntity(api, tokens)
    return new BN(balance.toString())
  }

  static async getLiquidityAssetId(api: ApiPromise, tokens: TokensId): Promise<BN> {
    const liquidityAssetId = await getLiquidityAssetsEntity(api, tokens)
    return new BN(liquidityAssetId.toString())
  }

  static async getLiquidityPool(api: ApiPromise, liquidityAssetId: TokenId): Promise<BN[]> {
    const liquidityPool = await getLiquidityPoolEntity(api, liquidityAssetId)
    const poolAssetIds = liquidityPool.toHuman() as Number[]
    if (!poolAssetIds) {
      return [new BN(-1), new BN(-1)]
    }

    return poolAssetIds.map((num) => new BN(num.toString()))
  }

  static async getTreasury(api: ApiPromise, tokenId: TokenId): Promise<AccountData> {
    const treasuryBalance = await getTokenBalanceEntity(api, TREASURY_ADDRESS, tokenId)
    const accountData = treasuryBalance as AccountData
    return accountData
  }

  static async getTreasuryBurn(api: ApiPromise, tokenId: TokenId): Promise<AccountData> {
    const treasuryBalance = await getTokenBalanceEntity(api, TREASURY_BURN_ADDRESS, tokenId)
    const accountData = treasuryBalance as AccountData
    return accountData
  }

  static async getTotalIssuance(api: ApiPromise, tokenId: TokenId): Promise<BN> {
    const tokenSupply = await getTotalIssuanceEntity(api, tokenId)
    return new BN(tokenSupply.toString())
  }

  // TODO: find the return type
  static async getLock(api: ApiPromise, address: Address, tokenId: TokenId) {
    const locksResponse = await getLockEntity(api, address, tokenId)
    return JSON.parse(JSON.stringify(locksResponse.toHuman()))
  }

  static async getTokenBalance(api: ApiPromise, address: Address, tokenId: TokenId): Promise<BN> {
    const balance = await getTokenBalanceEntity(api, address, tokenId)
    const accountData = balance as AccountData
    return new BN(accountData.free.toBigInt().toString())
  }

  static async getNextTokenId(api: ApiPromise): Promise<BN> {
    const nextTokenId = await getNextTokenEntity(api)
    return new BN(nextTokenId.toString())
  }
}

export default Query
