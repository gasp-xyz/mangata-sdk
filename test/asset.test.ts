import { mangataInstance } from './mangataInstanceCreation'

describe('Asset', () => {
  it('should get available info for MGA token using ID', async () => {
    const api = await mangataInstance.getApi()
    if (api.isConnected) {
    }
  })
})

afterAll(async () => {
  await mangataInstance.disconnect()
})
