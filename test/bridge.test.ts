import { instance } from './instanceCreation'

describe('Bridge', () => {
  it('should get bridge tokens', async () => {
    const api = await instance.getApi()
    if (api.isConnected) {
      const tokens = await instance.getBridgeTokens()
      expect(tokens[0].name).toEqual('Mangata')
      expect(tokens[1].name).toEqual('Ether')

      const tokenInfo = await instance.getTokenInfo(tokens[0].id)
      expect(tokenInfo.name).toEqual('Mangata')
    }
  })
})

afterAll(async () => {
  await instance.disconnect()
})
