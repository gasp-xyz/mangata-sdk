import { ApiPromise } from '@polkadot/api'
import { when } from 'jest-when'
import { RPC } from '../src/services/Rpc'

describe('RPC service', () => {
  let apiPromise: ApiPromise
  RPC.getChain = jest.fn()
  RPC.getNodeName = jest.fn()
  RPC.getNodeVersion = jest.fn()

  it('should retrive chain name when calling getChain method from RPC', async () => {
    const chainName: Promise<string> = Promise.resolve('Mangata')
    when(RPC.getChain).calledWith(apiPromise).mockReturnValue(chainName)
    expect(RPC.getChain(apiPromise)).toEqual(chainName)
  })

  it('should retrive node name when calling getNodeName method from RPC', async () => {
    const nodeName: Promise<string> = Promise.resolve('Mangata Node Name')
    when(RPC.getNodeName).calledWith(apiPromise).mockReturnValue(nodeName)
    expect(RPC.getNodeName(apiPromise)).toEqual(nodeName)
  })

  it('should retrive version node when calling getNodeVersion method from RPC', async () => {
    const nodeVersion: Promise<string> = Promise.resolve('0.9.6')
    when(RPC.getNodeVersion).calledWith(apiPromise).mockReturnValue(nodeVersion)
    expect(RPC.getNodeVersion(apiPromise)).toEqual(nodeVersion)
  })
})
