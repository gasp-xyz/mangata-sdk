import { mangataInstance } from './mangataInstanceCreation'

describe('Asset', () => {
  it('should get available info for MGA token using ID', async () => {
    const api = await mangataInstance.getApi()
    if (api.isConnected) {
      const asset = await mangataInstance.getTokenInfo('0')
      expect(asset.name).toBe('Mangata')
      expect(asset.symbol).toBe('MGA')
      expect(asset.decimals).toBe(18)
    }
  })
})

afterAll(async () => {
  await mangataInstance.disconnect()
})
