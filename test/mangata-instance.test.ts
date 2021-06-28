import { Mangata } from '../src'

describe('test singleton instance', () => {
  const m = Mangata.getInstance('ws://127.0.0.1:9944')
  jest.spyOn(m, 'getChain')
  jest.spyOn(m, 'getNodeName')
  jest.spyOn(m, 'getNodeVersion')
  const getChain = (Mangata.prototype.getChain = jest.fn())
  const getNodeName = (Mangata.prototype.getNodeName = jest.fn())
  const getNodeVersion = (Mangata.prototype.getNodeVersion = jest.fn())

  it('should be always the same instance', async () => {
    const m1 = Mangata.getInstance('ws://127.0.0.1:9944')
    expect(m1).toEqual(m)
  })

  it('should retrive chain name when calling getChain method', async () => {
    getChain.mockResolvedValue('Mangata')
    expect(await getChain()).toEqual('Mangata')
    expect(getChain.mock.calls.length).toBe(1)
    getChain.mockReset()
  })

  it('should retrive chain name always when calling getChain method', async () => {
    getChain.mockResolvedValue('Mangata')
    expect(await getChain()).toEqual('Mangata')
    expect(await getChain()).toEqual('Mangata')
    expect(await getChain()).toEqual('Mangata')
    expect(getChain.mock.calls.length).toBe(3)
    getChain.mockReset()
  })

  it('should retrive node name when calling getNodeName method', async () => {
    getNodeName.mockResolvedValue('Mangata Node Name')
    expect(await getNodeName()).toEqual('Mangata Node Name')
    expect(getNodeName.mock.calls.length).toBe(1)
    getNodeName.mockReset()
  })

  it('should retrive node name always when calling getNodeName method', async () => {
    getNodeName.mockResolvedValue('Mangata Node Name')
    expect(await getNodeName()).toEqual('Mangata Node Name')
    expect(await getNodeName()).toEqual('Mangata Node Name')
    expect(await getNodeName()).toEqual('Mangata Node Name')
    expect(getNodeName.mock.calls.length).toBe(3)
    getNodeName.mockReset()
  })

  it('should retrive node version when calling getNodeVersion method', async () => {
    getNodeVersion.mockResolvedValue('0.9.6')
    expect(await getNodeVersion()).toEqual('0.9.6')
    expect(getNodeVersion.mock.calls.length).toBe(1)
    getNodeVersion.mockReset()
  })

  it('should retrive node version always when calling getNodeVersion method', async () => {
    getNodeVersion.mockResolvedValue('0.9.6')
    expect(await getNodeVersion()).toEqual('0.9.6')
    expect(await getNodeVersion()).toEqual('0.9.6')
    expect(await getNodeVersion()).toEqual('0.9.6')
    expect(getNodeVersion.mock.calls.length).toBe(3)
    getNodeVersion.mockReset()
  })
})
