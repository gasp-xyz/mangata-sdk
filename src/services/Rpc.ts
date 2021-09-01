import { ApiPromise } from '@polkadot/api'
import BN from 'bn.js'

type Irpc = {
  getChain(api: ApiPromise): Promise<string>
  getNodeName(api: ApiPromise): Promise<string>
  getNodeVersion(api: ApiPromise): Promise<string>
  calculateBuyPrice(api: ApiPromise, soldTokenId: BN, boughtTokenId: BN, buyAmount: BN): Promise<BN>
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

const calculateBuyPrice = async (
  api: ApiPromise,
  soldTokenId: BN,
  boughtTokenId: BN,
  buyAmount: BN
): Promise<BN> => {
  const result = await (api.rpc as any).xyk.calculate_buy_price(
    soldTokenId,
    boughtTokenId,
    buyAmount
  )
  return new BN(result.price.toString())
}

export const RPC: Irpc = {
  getChain,
  getNodeName,
  getNodeVersion,
  calculateBuyPrice,
}
