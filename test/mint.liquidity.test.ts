/* eslint-disable no-console */
import BN from 'bn.js'

import { mangataInstance, SUDO_USER_NAME } from './mangataInstanceCreation'
import { MangataHelpers } from '../src'
import { ExtrinsicResult } from '../src/services/types'
require('dotenv').config()

describe('test buy asset', () => {
  const first_asset_amount = new BN(50000)
  const second_asset_amount = new BN(50000).div(new BN(2))
  const defaultCurrecyValue = new BN(500000)
  const sudoUserName = SUDO_USER_NAME
  it('should buy asset pool', async () => {
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
    await mangataInstance.createPool(
      testUser,
      currencies[0].toString(),
      first_asset_amount,
      currencies[1].toString(),
      second_asset_amount
    )
    await MangataHelpers.waitNewBlock(await mangataInstance.getApi())
    const result = await mangataInstance.mintLiquidity(
      testUser,
      currencies[0].toString(),
      currencies[1].toString(),
      new BN(10000),
      new BN(5001)
    )

    const eventResult = MangataHelpers.getEventResultFromTxWait(result)
    expect(eventResult.state).toEqual(ExtrinsicResult.ExtrinsicSuccess)
  })
})

afterAll(async () => {
  await mangataInstance.disconnect()
})
