import { ApiPromise } from '@polkadot/api'
import { BN } from '@polkadot/util'
import { BN_DIV_NUMERATOR_MULTIPLIER, BN_ZERO } from './bnConstants'

export const calculateLiquidityShare = async (
  api: ApiPromise,
  liquidityAssetId: string,
  userLiquidityTokenAmount: BN
) => {
  if (userLiquidityTokenAmount.isZero()) return BN_ZERO

  const tokenSupply = await api.query.tokens.totalIssuance(liquidityAssetId)

  const totalLiquidityAsset = new BN(tokenSupply.toString())
  const share = userLiquidityTokenAmount.mul(BN_DIV_NUMERATOR_MULTIPLIER).div(totalLiquidityAsset)

  return share
}
