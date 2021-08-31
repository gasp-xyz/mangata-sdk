/* eslint-disable no-console */
import BN from 'bn.js'

import { mangataInstance } from './mangataInstanceCreation'
import { MangataHelpers } from '../src'
import { ExtrinsicResult } from '../src/services/types'
require('dotenv').config()

describe('test create pool', () => {
  const first_asset_amount = new BN(50000)
  const second_asset_amount = new BN(50000)
  const defaultCurrecyValue = new BN(500000)
  const sudoUserName = process.env.TEST_SUDO_NAME
  it('should create pool', async () => {
    await MangataHelpers.waitNewBlock(await mangataInstance.getApi())
    const keyring = MangataHelpers.createKeyring('sr25519')
    const testUser = MangataHelpers.createKeyPairFromNameAndStoreAccountToKeyring(keyring)
    const sudoUser = MangataHelpers.createKeyPairFromNameAndStoreAccountToKeyring(
      keyring,
      sudoUserName
    )
    const currencies = await MangataHelpers.addAccountCurrencies(
      mangataInstance,
      testUser,
      sudoUser,
      [defaultCurrecyValue, defaultCurrecyValue.add(new BN(1))]
    )
    await MangataHelpers.addMGAToken(mangataInstance, sudoUser, testUser)
    await MangataHelpers.waitNewBlock(await mangataInstance.getApi())
    const result = await mangataInstance.createPool(
      testUser,
      currencies[0].toString(),
      first_asset_amount,
      currencies[1].toString(),
      second_asset_amount
    )
    const eventResult = MangataHelpers.getEventResultFromTxWait(result, [
      'xyk',
      'PoolCreated',
      testUser.address,
    ])
    expect(eventResult.state).toEqual(ExtrinsicResult.ExtrinsicSuccess)
  })
})

afterAll(async () => {
  await mangataInstance.disconnect()
})
