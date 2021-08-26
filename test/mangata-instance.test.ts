import { Mangata } from '../src'
require('dotenv').config()

const uri = process.env.API_URL ? process.env.API_URL : 'ws://127.0.0.1:9944'
const m = Mangata.getInstance(uri)

describe('test singleton instance', () => {
  it('should retrive chain name when calling getChain method', async () => {
    const chain = await m.getChain()
    expect(chain).toEqual('Development')
  })

  it('should match version 0.1.0 node version when calling getNodeVersion method', async () => {
    const version = '0.1.0'
    const nodeVersion = await m.getNodeVersion()
    expect(nodeVersion).toMatch(new RegExp(`^${version}?`))
  })

  it('should match name when calling getNodeName method', async () => {
    const name = 'Substrate'
    const nodeName = await m.getNodeName()
    expect(nodeName).toMatch(new RegExp(`^${name}?`))
  })
})

afterAll(async () => {
  await m.disconnect()
})
