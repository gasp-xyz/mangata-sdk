/* eslint-disable no-console */
import BN from 'bn.js'
import { KeyringPair } from '@polkadot/keyring/types'
import { hexToBn } from '@polkadot/util'

import { mangataInstance, SUDO_USER_NAME } from './mangataInstanceCreation'
import { MangataHelpers } from '../src'
import { addAccountCurrencies, addMGAToken, getEventResultFromTxWait } from './utility'
import ExtrinsicResult from '../src/enums/ExtrinsicResult'

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
  const currencies = await addAccountCurrencies(mangataInstance, testUser, sudoUser, [
    new BN(500000),
    new BN(500000).add(new BN(1)),
  ])
  firstCurrency = currencies[0].toString()
  secondCurrency = currencies[1].toString()
  await addMGAToken(mangataInstance, sudoUser, testUser)
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
    const eventResult = getEventResultFromTxWait(result, ['xyk', 'PoolCreated', testUser.address])
    expect(eventResult.state).toEqual(ExtrinsicResult.ExtrinsicSuccess)
  })
})

describe('test amount of token in pool', () => {
  it('should test the balance', async () => {
    await mangataInstance.createPool(
      testUser,
      firstCurrency,
      new BN(50000),
      secondCurrency,
      new BN(60000)
    )

    const balance1 = await mangataInstance.getAmountOfTokenIdInPool(firstCurrency, secondCurrency)
    const balance2 = await mangataInstance.getAmountOfTokenIdInPool(secondCurrency, firstCurrency)

    expect(balance1[0].toNumber()).toEqual(50000)
    expect(balance1[1].toNumber()).toEqual(60000)
    expect(balance2[0].toNumber()).toEqual(0)
    expect(balance2[1].toNumber()).toEqual(0)
  })
})

describe('test buy asset', () => {
  it('should buy asset', async () => {
    await mangataInstance.createPool(
      testUser,
      firstCurrency,
      new BN(50000),
      secondCurrency,
      new BN(25000)
    )
    await MangataHelpers.waitNewBlock(await mangataInstance.getApi())
    const result = await mangataInstance.buyAsset(
      testUser,
      firstCurrency,
      secondCurrency,
      new BN(1000),
      new BN(60000)
    )

    const eventResult = getEventResultFromTxWait(result, ['xyk', 'AssetsSwapped', testUser.address])
    expect(eventResult.state).toEqual(ExtrinsicResult.ExtrinsicSuccess)
  })
})

describe('test sell asset', () => {
  it('should sell asset', async () => {
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
    const eventResult = getEventResultFromTxWait(result, ['xyk', 'AssetsSwapped', testUser.address])
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

    const eventResult = getEventResultFromTxWait(result)
    expect(eventResult.state).toEqual(ExtrinsicResult.ExtrinsicSuccess)
  })
})

describe('test burn liquidity', () => {
  it('should burn liquidity', async () => {
    await mangataInstance.createPool(
      testUser,
      firstCurrency,
      new BN(50000),
      secondCurrency,
      new BN(25000)
    )
    await MangataHelpers.waitNewBlock(await mangataInstance.getApi())
    const result = await mangataInstance.burnLiquidity(
      testUser,
      firstCurrency,
      secondCurrency,
      new BN(10000)
    )

    const eventResult = getEventResultFromTxWait(result)
    expect(eventResult.state).toEqual(ExtrinsicResult.ExtrinsicSuccess)
  })
})

describe('test create token', () => {
  it('should create token', async () => {
    const result = await mangataInstance.createToken(
      testUser.address,
      sudoUser,
      new BN(firstCurrency)
    )
    const eventResult = getEventResultFromTxWait(result, ['tokens', 'Issued', testUser.address])
    expect(eventResult.data).not.toBeNull()
  })
})

afterAll(async () => {
  await mangataInstance.disconnect()
})
