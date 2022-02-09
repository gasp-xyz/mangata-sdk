/* eslint-disable no-console */
import BN from 'bn.js'
import { KeyringPair } from '@polkadot/keyring/types'

import { mangataInstance, SUDO_USER_NAME } from './mangataInstanceCreation'
import { MangataHelpers } from '../src'
import { addAccountCurrencies, addMGAToken, getEventResultFromTxWait } from './utility'
import ExtrinsicResult from '../src/enums/ExtrinsicResult'

let testUser: KeyringPair
let testUser1: KeyringPair
let sudoUser: KeyringPair
let firstCurrency: string
let secondCurrency: string

beforeEach(async () => {
  await mangataInstance.waitForNewBlock(2)
  const keyring = MangataHelpers.createKeyring('sr25519')
  testUser = MangataHelpers.createKeyPairFromNameAndStoreAccountToKeyring(keyring)
  testUser1 = MangataHelpers.createKeyPairFromNameAndStoreAccountToKeyring(keyring)
  sudoUser = MangataHelpers.createKeyPairFromNameAndStoreAccountToKeyring(keyring, SUDO_USER_NAME)
  await mangataInstance.waitForNewBlock(2)
  const currencies = await addAccountCurrencies(mangataInstance, testUser, sudoUser, [
    new BN(500000),
    new BN(500000).add(new BN(1)),
  ])
  firstCurrency = currencies[0].toString()
  secondCurrency = currencies[1].toString()
  await addMGAToken(mangataInstance, sudoUser, testUser)
  await mangataInstance.waitForNewBlock(2)
})

describe('Testing additional methods', () => {
  it('should trasnfer tokens from testUser1 to testUser2', async () => {
    await mangataInstance.transferToken(testUser, secondCurrency, testUser1.address, new BN(100), {
      extrinsicStatus: (result) => {
        const eventTransfer = getEventResultFromTxWait(result, [
          'tokens',
          'Transferred',
          testUser.address,
        ])
        expect(eventTransfer.state).toEqual(ExtrinsicResult.ExtrinsicSuccess)
      },
    })

    await mangataInstance.transferTokenAll(testUser, firstCurrency, testUser1.address, {
      extrinsicStatus: (resultTransferAll) => {
        const eventTransferAll = getEventResultFromTxWait(resultTransferAll, [
          'tokens',
          'Transferred',
          testUser.address,
        ])
        expect(eventTransferAll.state).toEqual(ExtrinsicResult.ExtrinsicSuccess)
      },
    })

    const issuance = await mangataInstance.getTotalIssuance(firstCurrency)

    expect(issuance.toNumber()).toEqual(500000)

    const tokenBalance = await mangataInstance.getTokenBalance(firstCurrency, testUser1.address)

    expect(tokenBalance.free.toNumber()).toEqual(500000)

    const lock = await mangataInstance.getLock(testUser.address, firstCurrency)

    expect(lock).toEqual([])
  })
})

it('should get next token id', async () => {
  await mangataInstance.createPool(
    testUser,
    firstCurrency,
    new BN(50000),
    secondCurrency,
    new BN(25000)
  )
  await mangataInstance.waitForNewBlock(2)
  const liquidityAssetId = await mangataInstance.getLiquidityTokenId(firstCurrency, secondCurrency)
  expect(liquidityAssetId.toNumber()).toBeGreaterThanOrEqual(0)
})

it('should get next token id', async () => {
  const tokenId = await mangataInstance.getNextTokenId()
  expect(tokenId.toNumber()).toBeGreaterThanOrEqual(0)
})

it('should get treasury', async () => {
  const accountData = await mangataInstance.getTreasury(firstCurrency)
  expect(accountData.free.toBn().toNumber()).toBeGreaterThanOrEqual(0)
})

it('should get treasury burn', async () => {
  const accountData = await mangataInstance.getTreasuryBurn(firstCurrency)
  expect(accountData.free.toBn().toNumber()).toBeGreaterThanOrEqual(0)
})

afterAll(async () => {
  await mangataInstance.disconnect()
})
