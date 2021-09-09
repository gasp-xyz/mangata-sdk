import { ApiPromise } from '@polkadot/api'
import BN from 'bn.js'

type Irpc = {
  getChain(api: ApiPromise): Promise<string>
  getNodeName(api: ApiPromise): Promise<string>
  getNodeVersion(api: ApiPromise): Promise<string>
  calculateBuyPrice(
    api: ApiPromise,
    inputReserve: BN,
    outputReserve: BN,
    buyAmount: BN
  ): Promise<BN>
  calculateSellPrice(
    api: ApiPromise,
    inputReserve: BN,
    outputReserve: BN,
    sellAmount: BN
  ): Promise<BN>
  getTokensRequiredForMinting(
    api: ApiPromise,
    liquidityAssetId: BN,
    liquidityAssetAmount: BN
  ): Promise<any>
  getBurnAmount(
    api: ApiPromise,
    firstAssetId: BN,
    secondAssetId: BN,
    liquidityAssetAmount: BN
  ): Promise<any>
  calculateSellPriceId(
    api: ApiPromise,
    soldTokenId: BN,
    boughtTokenId: BN,
    sellAmount: BN
  ): Promise<BN>
  calculateBuyPriceId(
    api: ApiPromise,
    soldTokenId: BN,
    boughtTokenId: BN,
    buyAmount: BN
  ): Promise<BN>
  getLiquidityAsset(api: ApiPromise, firstTokenId: BN, secondTokenId: BN): Promise<any>
}

const getChain = async (api: ApiPromise): Promise<string> => {
  const chain = await api.rpc.system.chain()
  return chain.toHuman()
}

const getNodeName = async (api: ApiPromise): Promise<string> => {
  const name = await api.rpc.system.name()
  return name.toHuman()
}

const getNodeVersion = async (api: ApiPromise): Promise<string> => {
  const version = await api.rpc.system.version()
  return version.toHuman()
}

const getTokensRequiredForMinting = async (
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

const calculateBuyPrice = async (
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

const calculateSellPrice = async (
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

const getBurnAmount = async (
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

const calculateSellPriceId = async (
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

const calculateBuyPriceId = async (
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

const getLiquidityAsset = async (
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
