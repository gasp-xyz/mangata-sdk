import { ApiPromise } from '@polkadot/api'
import { AccountInfo } from '@polkadot/types/interfaces'
import { AccountData } from '@polkadot/types/interfaces/balances'
import BN from 'bn.js'

import { getNonce as getNonceEntity } from '../entities/query/nonce'
import { getAmountOfTokens as getAmountOfTokensEntity } from '../entities/query/pools'
import { getLiquidityAssets as getLiquidityAssetsEntity } from '../entities/query/liquidityAssets'
import { getLiquidityPool as getLiquidityPoolEntity } from '../entities/query/liquidityPools'
import { getTreasury as getTreasuryEntity } from '../entities/query/treasury'
import { getTreasuryBurn as getTreasuryBurnEntity } from '../entities/query/treasuryBurn'
import { getTotalIssuance as getTotalIssuanceEntity } from '../entities/query/totalIssuance'
import { getLock as getLockEntity } from '../entities/query/locks'
import { getTokenBalance as getTokenBalanceEntity } from '../entities/query/accounts'
import { getNextToken as getNextTokenEntity } from '../entities/query/nextCurrencyId'
import TokensId from '../types/query/TokensId'
import { Token } from '../types/Token'

class Query {
  static async getNonce(api: ApiPromise, address: string): Promise<BN> {
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

  static async getLiquidityPool(api: ApiPromise, liquidityAssetId: string): Promise<BN[]> {
    const liquidityPool = await getLiquidityPoolEntity(api, liquidityAssetId)
    const poolAssetIds = liquidityPool.toHuman() as Number[]
    if (!poolAssetIds) {
      return [new BN(-1), new BN(-1)]
    }

    return poolAssetIds.map((num) => new BN(num.toString()))
  }

  static async getTreasury(api: ApiPromise, tokenId: Token): Promise<BN> {
    const treasuryBalance = await getTreasuryEntity(api, tokenId)
    return new BN(treasuryBalance.toString())
  }

  static async getTreasuryBurn(api: ApiPromise, tokenId: Token): Promise<BN> {
    const treasuryBalance = await getTreasuryBurnEntity(api, tokenId)
    return new BN(treasuryBalance.toString())
  }

  static async getTotalIssuance(api: ApiPromise, tokenId: Token): Promise<BN> {
    const tokenSupply = await getTotalIssuanceEntity(api, tokenId)
    return new BN(tokenSupply.toString())
  }

  // TODO: find the return type
  static async getLock(api: ApiPromise, address: string, tokenId: Token) {
    const locksResponse = await getLockEntity(api, address, tokenId)
    return JSON.parse(JSON.stringify(locksResponse.toHuman()))
  }

  static async getTokenBalance(api: ApiPromise, address: string, tokenId: Token): Promise<BN> {
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
