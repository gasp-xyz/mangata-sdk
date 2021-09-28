import { ApiPromise } from '@polkadot/api'
import { AccountInfo } from '@polkadot/types/interfaces'
import { AccountData } from '@polkadot/types/interfaces/balances'
import BN from 'bn.js'

import {
  AmountOfTokenIdInPoolType,
  BalanceAssetType,
  Iquery,
  LiquidityAssetIdType,
  LiquidityPoolType,
  LockType,
  NextAssetIdType,
  NonceType,
  TotalIssuanceOfTokenIdType,
  TreasuryBurnType,
  TreasuryType,
} from '../types'

const getNonce: NonceType = async (api: ApiPromise, address: string): Promise<BN> => {
  const accountInfo: AccountInfo = await api.query.system.account(address)
  return accountInfo.nonce.toBn()
}

const getAmountOfTokenIdInPool: AmountOfTokenIdInPoolType = async (
  api: ApiPromise,
  firstTokenId: BN,
  secondTokenId: BN
): Promise<BN> => {
  const balance = await api.query.xyk.pools([firstTokenId, secondTokenId])
  return new BN(balance.toString())
}

const getLiquidityAssetId: LiquidityAssetIdType = async (
  api: ApiPromise,
  firstTokenId: BN,
  secondTokenId: BN
): Promise<BN> => {
  const liquidityAssetId = await api.query.xyk.liquidityAssets([firstTokenId, secondTokenId])
  return new BN(liquidityAssetId.toString())
}

const getLiquidityPool: LiquidityPoolType = async (
  api: ApiPromise,
  liquidityAssetId: BN
): Promise<BN[]> => {
  const liquidityPool = await api.query.xyk.liquidityPools(liquidityAssetId)
  const poolAssetIds = liquidityPool.toHuman() as Number[]
  if (!poolAssetIds) return [new BN(-1), new BN(-1)]

  return poolAssetIds.map((num) => new BN(num.toString()))
}

const getTreasury: TreasuryType = async (api: ApiPromise, currencyId: BN): Promise<BN> => {
  const treasuryBalance = await api.query.xyk.treasury(currencyId)
  return new BN(treasuryBalance.toString())
}

const getTreasuryBurn: TreasuryBurnType = async (api: ApiPromise, currencyId: BN): Promise<BN> => {
  const treasuryBalance = await api.query.xyk.treasuryBurn(currencyId)
  return new BN(treasuryBalance.toString())
}

const getTotalIssuanceOfTokenId: TotalIssuanceOfTokenIdType = async (
  api: ApiPromise,
  currencyId: BN
): Promise<BN> => {
  const tokenSupply = await api.query.tokens.totalIssuance(currencyId.toString())
  return new BN(tokenSupply.toString())
}

// TODO: Find out the return type for this method
const getLock: LockType = async (api: ApiPromise, address: string, tokenId: BN) => {
  const locksResponse = await api.query.tokens.locks(address, tokenId)!
  const decodedlocks = JSON.parse(JSON.stringify(locksResponse.toHuman()))
  return decodedlocks
}

const getAssetBalanceForAddress: BalanceAssetType = async (
  api: ApiPromise,
  assetId: BN,
  accountAddress: string
): Promise<BN> => {
  const balance = await api.query.tokens.accounts(accountAddress, assetId)
  const accountData = balance as AccountData
  return new BN(accountData.free.toBigInt().toString())
}

const getNextAssetId: NextAssetIdType = async (api: ApiPromise): Promise<BN> => {
  const nextAssetId = await api.query.tokens.nextCurrencyId()
  return new BN(nextAssetId.toString())
}

export const Query: Iquery = {
  getNonce,
  getAmountOfTokenIdInPool,
  getLiquidityAssetId,
  getLiquidityPool,
  getTreasury,
  getTreasuryBurn,
  getTotalIssuanceOfTokenId,
  getLock,
  getAssetBalanceForAddress,
  getNextAssetId,
}
