import { ApiPromise } from '@polkadot/api'

type Irpc = {
  getChain(api: ApiPromise): Promise<string>
  getNodeName(api: ApiPromise): Promise<string>
  getNodeVersion(api: ApiPromise): Promise<string>
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

export const RPC: Irpc = {
  getChain,
  getNodeName,
  getNodeVersion,
}
