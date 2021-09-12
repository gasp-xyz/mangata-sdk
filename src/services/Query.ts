import { ApiPromise } from '@polkadot/api'
import { AccountInfo } from '@polkadot/types/interfaces'
import BN from 'bn.js'

type Iquery = {
  getNonce(api: ApiPromise, address: string): Promise<BN>
  getAmountOfTokenIdInPool(api: ApiPromise, firstTokenId: BN, secondTokenId: BN): Promise<BN>
  getLiquidityAssetId(api: ApiPromise, firstTokenId: BN, secondTokenId: BN): Promise<BN>
  getLiquidityPool(api: ApiPromise, liquidityAssetId: BN): Promise<BN[]>
  getTreasury(api: ApiPromise, currencyId: BN): Promise<BN>
  getTreasuryBurn(api: ApiPromise, currencyId: BN): Promise<BN>
  getTotalIssuanceOfTokenId(api: ApiPromise, tokenId: BN): Promise<BN>
  getLock(api: ApiPromise, address: string, tokenId: BN): any
}

const getNonce = async (api: ApiPromise, address: string): Promise<BN> => {
  const accountInfo: AccountInfo = await api.query.system.account(address)
  return accountInfo.nonce.toBn()
}

const getAmountOfTokenIdInPool = async (
  api: ApiPromise,
  firstTokenId: BN,
  secondTokenId: BN
): Promise<BN> => {
  const balance = await api.query.xyk.pools([firstTokenId, secondTokenId])
  return new BN(balance.toString())
}

const getLiquidityAssetId = async (
  api: ApiPromise,
  firstTokenId: BN,
  secondTokenId: BN
): Promise<BN> => {
  const liquidityAssetId = await api.query.xyk.liquidityAssets([firstTokenId, secondTokenId])
  return new BN(liquidityAssetId.toString())
}

const getLiquidityPool = async (api: ApiPromise, liquidityAssetId: BN): Promise<BN[]> => {
  const liquidityPool = await api.query.xyk.liquidityPools(liquidityAssetId)
  const poolAssetIds = liquidityPool.toHuman() as Number[]
  if (!poolAssetIds) return [new BN(-1), new BN(-1)]

  return poolAssetIds.map((num) => new BN(num.toString()))
}

const getTreasury = async (api: ApiPromise, currencyId: BN): Promise<BN> => {
  const treasuryBalance = await api.query.xyk.treasury(currencyId)
  return new BN(treasuryBalance.toString())
}

const getTreasuryBurn = async (api: ApiPromise, currencyId: BN): Promise<BN> => {
  const treasuryBalance = await api.query.xyk.treasuryBurn(currencyId)
  return new BN(treasuryBalance.toString())
}

const getTotalIssuanceOfTokenId = async (api: ApiPromise, tokenId: BN): Promise<BN> => {
  const tokenSupply = await api.query.tokens.totalIssuance(tokenId.toString())
  return new BN(tokenSupply.toString())
}

const getLock = async (api: ApiPromise, address: string, tokenId: BN) => {
  const locksResponse = await api.query.tokens.locks(address, tokenId)!
  const decodedlocks = JSON.parse(JSON.stringify(locksResponse.toHuman()))
  return decodedlocks
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
}
