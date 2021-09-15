import { ApiPromise } from '@polkadot/api'
import BN from 'bn.js'

import {
  BurnAmountType,
  CalculateBuyPriceType,
  CalculateSellPriceType,
  CalculateSellPriceIdType,
  ChainType,
  Irpc,
  LiquidityAssetType,
  NodeNameType,
  NodeVersionType,
  TokensRequiredForMintingType,
} from '../types'

const getChain: ChainType = async (api: ApiPromise): Promise<string> => {
  const chain = await api.rpc.system.chain()
  return chain.toHuman()
}

const getNodeName: NodeNameType = async (api: ApiPromise): Promise<string> => {
  const name = await api.rpc.system.name()
  return name.toHuman()
}

const getNodeVersion: NodeVersionType = async (api: ApiPromise): Promise<string> => {
  const version = await api.rpc.system.version()
  return version.toHuman()
}

// TODO: need to figure out what is the return  value from this method
const getTokensRequiredForMinting: TokensRequiredForMintingType = async (
  api: ApiPromise,
  liquidityAssetId: BN,
  liquidityAssetAmount: BN
): Promise<any> => {
  const result = await (api.rpc as any).get_tokens_required_for_minting(
    liquidityAssetId,
    liquidityAssetAmount
  )
  return result.toHuman()
}

const calculateBuyPrice: CalculateBuyPriceType = async (
  api: ApiPromise,
  inputReserve: BN,
  outputReserve: BN,
  buyAmount: BN
): Promise<BN> => {
  const result = await (api.rpc as any).xyk.calculate_buy_price(
    inputReserve,
    outputReserve,
    buyAmount
  )
  return new BN(result.price)
}

const calculateSellPrice: CalculateSellPriceType = async (
  api: ApiPromise,
  inputReserve: BN,
  outputReserve: BN,
  sellAmount: BN
): Promise<BN> => {
  const result = await (api.rpc as any).xyk.calculate_sell_price(
    inputReserve,
    outputReserve,
    sellAmount
  )
  return new BN(result.price)
}

// TODO: Need to figure out the return value from this method
const getBurnAmount: BurnAmountType = async (
  api: ApiPromise,
  firstAssetId: BN,
  secondAssetId: BN,
  liquidityAssetAmount: BN
) => {
  const result = await (api.rpc as any).xyk.get_burn_amount(
    firstAssetId,
    secondAssetId,
    liquidityAssetAmount
  )
  return result.toHuman()
}

const calculateSellPriceId: CalculateSellPriceIdType = async (
  api: ApiPromise,
  soldTokenId: BN,
  boughtTokenId: BN,
  sellAmount: BN
): Promise<BN> => {
  const result = await (api.rpc as any).xyk.calculate_sell_price_id(
    soldTokenId,
    boughtTokenId,
    sellAmount
  )
  return new BN(result.price)
}

const calculateBuyPriceId: CalculateSellPriceIdType = async (
  api: ApiPromise,
  soldTokenId: BN,
  boughtTokenId: BN,
  buyAmount: BN
): Promise<BN> => {
  const result = await (api.rpc as any).xyk.calculate_buy_price_id(
    soldTokenId,
    boughtTokenId,
    buyAmount
  )
  return new BN(result.price)
}

// TODO: Need to figure out what is the return value from this method
const getLiquidityAsset: LiquidityAssetType = async (
  api: ApiPromise,
  firstTokenId: BN,
  secondTokenId: BN
): Promise<any> => {
  const result = await (api.rpc as any).xyk.get_liquidity_asset(firstTokenId, secondTokenId)
  return result
}

export const RPC: Irpc = {
  getChain,
  getNodeName,
  getNodeVersion,
  calculateBuyPrice,
  calculateSellPrice,
  calculateSellPriceId,
  calculateBuyPriceId,
  getLiquidityAsset,
  getTokensRequiredForMinting,
  getBurnAmount,
}
