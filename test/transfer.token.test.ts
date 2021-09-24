/* eslint-disable no-console */
import BN from 'bn.js'
import { KeyringPair } from '@polkadot/keyring/types'

import { mangataInstance, SUDO_USER_NAME } from './mangataInstanceCreation'
import { MangataHelpers } from '../src'
import { ExtrinsicResult } from '../src/types'
import { addAccountCurrencies, addMGAToken, getEventResultFromTxWait } from './utility'

let testUser: KeyringPair
let testUser1: KeyringPair
let testUser2: KeyringPair
let sudoUser: KeyringPair
let firstCurrency: string
let secondCurrency: string

beforeEach(async () => {
  await MangataHelpers.waitNewBlock(await mangataInstance.getApi())
  const keyring = MangataHelpers.createKeyring('sr25519')
  testUser = MangataHelpers.createKeyPairFromNameAndStoreAccountToKeyring(keyring)
  testUser1 = MangataHelpers.createKeyPairFromNameAndStoreAccountToKeyring(keyring)
  testUser2 = MangataHelpers.createKeyPairFromNameAndStoreAccountToKeyring(keyring)
  sudoUser = MangataHelpers.createKeyPairFromNameAndStoreAccountToKeyring(keyring, SUDO_USER_NAME)
  await MangataHelpers.waitNewBlock(await mangataInstance.getApi())
  const currencies = await addAccountCurrencies(mangataInstance, testUser, sudoUser, [
    new BN(500000),
    new BN(500000).add(new BN(1)),
  ])
  firstCurrency = currencies[0].toString()
  secondCurrency = currencies[1].toString()
  await addMGAToken(mangataInstance, sudoUser, testUser)
  await MangataHelpers.waitNewBlock(await mangataInstance.getApi())
})

describe('test transfer token', () => {
  it('should trasnfer tokens from testUser1 to testUser2', async () => {
    const result = await mangataInstance.transferToken(
      testUser,
      new BN(secondCurrency),
      testUser1.address,
      new BN(100)
    )

    const eventTransfer = getEventResultFromTxWait(result, [
      'tokens',
      'Transferred',
      testUser.address,
    ])
    expect(eventTransfer.state).toEqual(ExtrinsicResult.ExtrinsicSuccess)

    const resultTransferAll = await mangataInstance.transferTokenAll(
      testUser,
      new BN(firstCurrency),
      testUser1.address
    )

    const eventTransferAll = getEventResultFromTxWait(resultTransferAll, [
      'tokens',
      'Transferred',
      testUser.address,
    ])
    expect(eventTransferAll.state).toEqual(ExtrinsicResult.ExtrinsicSuccess)

    const issuance = await mangataInstance.getTotalIssuanceOfTokenId(new BN(firstCurrency))

    expect(issuance.toNumber()).toEqual(500000)

    const tokenBalance = await mangataInstance.getAssetBalanceForAddress(
      new BN(firstCurrency),
      testUser1.address
    )

    expect(tokenBalance.toNumber()).toEqual(500000)

    const lock = await mangataInstance.getLock(testUser.address, new BN(firstCurrency))

    expect(lock).toEqual([])
  })
})

afterAll(async () => {
  await mangataInstance.disconnect()
})
