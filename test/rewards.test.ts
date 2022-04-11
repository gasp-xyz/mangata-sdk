import { MangataHelpers, signTx } from '../src'
import { mangataInstance, SUDO_USER_NAME } from './mangataInstanceCreation'
import { BN } from '@polkadot/util'

describe('Rewards', () => {
  it('user should be able to claim rewards and check whether pool is promoted', async () => {
    const api = await mangataInstance.getApi()
    if (api.isConnected) {
      await mangataInstance.waitForNewBlock(2)
      const keyring = MangataHelpers.createKeyring('sr25519')
      const sudoUser = MangataHelpers.createKeyPairFromNameAndStoreAccountToKeyring(
        keyring,
        SUDO_USER_NAME
      )

      const sudoNonce1 = await mangataInstance.getNonce(sudoUser.address)

      await mangataInstance.mintAsset(
        sudoUser,
        '0',
        sudoUser.address,
        new BN(new BN(10).pow(new BN(18))),
        {
          nonce: sudoNonce1,
        }
      )
      await mangataInstance.waitForNewBlock(2)

      const sudoNonce2 = await mangataInstance.getNonce(sudoUser.address)
      await mangataInstance.mintAsset(
        sudoUser,
        '4',
        sudoUser.address,
        new BN(new BN(10).pow(new BN(18))),
        {
          nonce: sudoNonce2,
        }
      )
      await mangataInstance.waitForNewBlock(2)
      await mangataInstance.createPool(sudoUser, '0', new BN(25000), '4', new BN(50000))
      await mangataInstance.waitForNewBlock(2)

      await signTx(api, api.tx.sudo.sudo(api.tx.xyk.promotePool('5')), sudoUser)

      await mangataInstance.waitForNewBlock(10)

      await mangataInstance.claimRewards(sudoUser, '5', new BN(5000), {
        extrinsicStatus: (result) => {
          expect(result[0].method).toEqual('ExtrinsicSuccess')
        },
      })

      const pool = await mangataInstance.getPool('5')
      expect(pool.isPromoted).toBeTruthy()
    }
  })
})

afterAll(async () => {
  await mangataInstance.disconnect()
})
