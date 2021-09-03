/* eslint-disable no-console */
import BN from 'bn.js'

import { mangataInstance, SUDO_USER_NAME } from './mangataInstanceCreation'
import { MangataHelpers } from '../src'
import { ExtrinsicResult } from '../src/services/types'
import { KeyringPair } from '@polkadot/keyring/types'

let testUser: KeyringPair
let sudoUser: KeyringPair
let firstCurrency: string
let secondCurrency: string

beforeEach(async () => {
  await MangataHelpers.waitNewBlock(await mangataInstance.getApi())
  const keyring = MangataHelpers.createKeyring('sr25519')
  testUser = MangataHelpers.createKeyPairFromNameAndStoreAccountToKeyring(keyring)
  sudoUser = MangataHelpers.createKeyPairFromNameAndStoreAccountToKeyring(keyring, SUDO_USER_NAME)
  await MangataHelpers.waitNewBlock(await mangataInstance.getApi())
  const currencies = await MangataHelpers.addAccountCurrencies(
    mangataInstance,
    testUser,
    sudoUser,
    [new BN(500000), new BN(500000).add(new BN(1))]
  )
  firstCurrency = currencies[0].toString()
  secondCurrency = currencies[1].toString()
  await MangataHelpers.addMGAToken(mangataInstance, sudoUser, testUser)
  await MangataHelpers.waitNewBlock(await mangataInstance.getApi())
})

describe('test create pool', () => {
  it('should create pool', async () => {
    const result = await mangataInstance.createPool(
      testUser,
      firstCurrency,
      new BN(50000),
      secondCurrency,
      new BN(50000)
    )
    const eventResult = MangataHelpers.getEventResultFromTxWait(result, [
      'xyk',
      'PoolCreated',
      testUser.address,
    ])
    expect(eventResult.state).toEqual(ExtrinsicResult.ExtrinsicSuccess)
  })
})

describe('test buy asset', () => {
  it('should buy asset', async () => {
    const pool = await mangataInstance.createPool(
      testUser,
      firstCurrency,
      new BN(50000),
      secondCurrency,
      new BN(25000)
    )
    console.log('POOL: ' + pool)
    await MangataHelpers.waitNewBlock(await mangataInstance.getApi())
    const result = await mangataInstance.buyAsset(
      testUser,
      firstCurrency,
      secondCurrency,
      new BN(1000),
      new BN(60000)
    )

    console.log('BUYASSET: ' + result)

    const eventResult = MangataHelpers.getEventResultFromTxWait(result, [
      'xyk',
      'AssetsSwapped',
      testUser.address,
    ])
    expect(eventResult.state).toEqual(ExtrinsicResult.ExtrinsicSuccess)
  })
})

describe('test sell asset', () => {
  it('should sell asset', async () => {
    console.log(secondCurrency)
    await mangataInstance.createPool(
      testUser,
      firstCurrency,
      new BN(50000),
      secondCurrency,
      new BN(25000)
    )
    await MangataHelpers.waitNewBlock(await mangataInstance.getApi())
    const result = await mangataInstance.sellAsset(
      testUser,
      firstCurrency,
      secondCurrency,
      new BN(10000),
      new BN(100)
    )
    console.log('SELLASSET: ' + result)
    const eventResult = MangataHelpers.getEventResultFromTxWait(result, [
      'xyk',
      'AssetsSwapped',
      testUser.address,
    ])
    expect(eventResult.state).toEqual(ExtrinsicResult.ExtrinsicSuccess)
  })
})

describe('test mint liquidity', () => {
  it('should mint liquidity', async () => {
    await mangataInstance.createPool(
      testUser,
      firstCurrency,
      new BN(50000),
      secondCurrency,
      new BN(25000)
    )
    await MangataHelpers.waitNewBlock(await mangataInstance.getApi())
    const result = await mangataInstance.mintLiquidity(
      testUser,
      firstCurrency,
      secondCurrency,
      new BN(10000),
      new BN(5001)
    )

    console.log('MINTLIQUIDITY: ' + result)

    const eventResult = MangataHelpers.getEventResultFromTxWait(result)
    expect(eventResult.state).toEqual(ExtrinsicResult.ExtrinsicSuccess)
  })
})

afterAll(async () => {
  await mangataInstance.disconnect()
})
