import { mangataInstance } from './mangataInstanceCreation'

describe('Asset', () => {
  it('should get available info for MGA token using ID', async () => {
    const api = await mangataInstance.getApi()
    if (api.isConnected) {
      const assets = await mangataInstance.getAllAssetsInfo()
      const mgaInfo = assets.filter((asset) => asset.id === '0')
      const mgaName = mgaInfo[0].infoToken.name
      const mgaSymbol = mgaInfo[0].infoToken.symbol
      const mgaDecimals = mgaInfo[0].infoToken.decimals
      expect(mgaName).toBe('Mangata')
      expect(mgaSymbol).toBe('MGA')
      expect(mgaDecimals).toBe('18')
    }
  })

  it('should get available info for MGA token using symbol', async () => {
    const api = await mangataInstance.getApi()
    if (api.isConnected) {
      const assets = await mangataInstance.getAllAssetsInfo()
      const mgaInfo = assets.filter((asset) => asset.infoToken.symbol === 'MGA')
      const mgaName = mgaInfo[0].infoToken.name
      const mgaSymbol = mgaInfo[0].infoToken.symbol
      const mgaDecimals = mgaInfo[0].infoToken.decimals
      expect(mgaName).toBe('Mangata')
      expect(mgaSymbol).toBe('MGA')
      expect(mgaDecimals).toBe('18')
    }
  })
})

afterAll(async () => {
  await mangataInstance.disconnect()
})
