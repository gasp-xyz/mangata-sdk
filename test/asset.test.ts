import { mangataInstance } from './mangataInstanceCreation'

describe('Test for assets', () => {
  it('should get available info for MGA token using ID', async () => {
    const assets = await mangataInstance.getAllAssetsInfo()
    console.log('AAAA', assets)
    const mgaInfo = assets.filter((asset) => asset.id === '0')
    console.log('BBBBBB', mgaInfo)
    const mgaName = mgaInfo[0].infoToken.name
    const mgaSymbol = mgaInfo[0].infoToken.symbol
    const mgaDecimals = mgaInfo[0].infoToken.decimals
    expect(mgaName).toBe('Mangata')
    expect(mgaSymbol).toBe('MGA')
    expect(mgaDecimals).toBe('18')
  })

  it('should get available info for MGA token using symbol', async () => {
    const assets = await mangataInstance.getAllAssetsInfo()
    const mgaInfo = assets.filter((asset) => asset.infoToken.symbol === 'MGA')
    const mgaName = mgaInfo[0].infoToken.name
    const mgaSymbol = mgaInfo[0].infoToken.symbol
    const mgaDecimals = mgaInfo[0].infoToken.decimals
    expect(mgaName).toBe('Mangata')
    expect(mgaSymbol).toBe('MGA')
    expect(mgaDecimals).toBe('18')
  })
})
