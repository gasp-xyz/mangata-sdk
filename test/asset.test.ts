import { instance } from './instanceCreation'

describe('Asset', () => {
  it('should get available info for MGA token using ID', async () => {
    const api = await instance.getApi()
    if (api.isConnected) {
    }
  })
})

afterAll(async () => {
  await instance.disconnect()
})
