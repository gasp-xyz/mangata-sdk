import { mangataInstance } from './mangataInstanceCreation'

describe('Bridge', () => {
  it('should get bridge tokens', async () => {
    const api = await mangataInstance.getApi()
    if (api.isConnected) {
      const tokens = await mangataInstance.getBridgeTokens()
      expect(tokens[0].name).toEqual('Mangata')
      expect(tokens[1].name).toEqual('Ether')
    }
  })
})

afterAll(async () => {
  await mangataInstance.disconnect()
})
