import { mangataInstance } from './mangataInstanceCreation'

describe('test create pool', () => {
  it('should create pool', async () => {
    const tokens = await mangataInstance.getBridgeTokens()
    const token1 = await tokens[0]
    const token2 = await tokens[1]
    expect(token1.info.name).toEqual('Mangata')
    expect(token2.info.name).toEqual('Ether')

    const tokenInfo = await mangataInstance.getTokenInfo(token1.assetId)
    const tokenObject = tokenInfo.toHuman() as {
      name: string
      symbol: string
      decimals: number
      description: string
    }
    expect(tokenObject.description).toEqual('Mangata Asset')
  })
})

afterAll(async () => {
  await mangataInstance.disconnect()
})
