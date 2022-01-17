import { mangataInstance } from './mangataInstanceCreation'

describe('Asset', () => {
  it('should get available info for MGA token using ID', async () => {
    const api = await mangataInstance.getApi()
    if (api.isConnected) {
      const assets = await mangataInstance.getAssetsInfo()
      const mgaInfo = assets['']
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
      const assets = await mangataInstance.getAssetsInfo()
      const mgaInfo = assets['0']
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
