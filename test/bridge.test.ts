import { mangataInstance } from './mangataInstanceCreation'

describe('Bridge', () => {
  it('should get bridge tokens', async () => {
    const api = await mangataInstance.getApi()
    if (api.isConnected) {
      const tokens = await mangataInstance.getBridgeTokens()
      expect(tokens[0].info.name).toEqual('Mangata')
      expect(tokens[1].info.name).toEqual('Ether')

      const tokenInfo = await mangataInstance.getTokenInfo(tokens[0].assetId)
      const tokenObject = tokenInfo.toHuman() as {
        name: string
        symbol: string
        decimals: number
        description: string
      }
      expect(tokenObject.description).toEqual('Mangata Asset')
    }
  })
})

afterAll(async () => {
  await mangataInstance.disconnect()
})
