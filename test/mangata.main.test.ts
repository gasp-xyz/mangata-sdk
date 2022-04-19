/* eslint-disable no-console */
import { BN } from '@polkadot/util'
import { KeyringPair } from '@polkadot/keyring/types'

import { instance, SUDO_USER_NAME } from './instanceCreation'
import { MangataHelpers } from '../src'
import {
  addAccountCurrencies,
  addMGAToken,
  getEventResultFromTxWait,
  ExtrinsicResult,
} from './utility'
import { MangataGenericEvent } from '../src/types/MangataGenericEvent'

let testUser: KeyringPair
let sudoUser: KeyringPair
let firstCurrency: string
let secondCurrency: string

beforeEach(async () => {
  await instance.waitForNewBlock(2)
  const keyring = MangataHelpers.createKeyring('sr25519')
  testUser = MangataHelpers.createKeyPairFromNameAndStoreAccountToKeyring(keyring)
  sudoUser = MangataHelpers.createKeyPairFromNameAndStoreAccountToKeyring(keyring, SUDO_USER_NAME)
  await instance.waitForNewBlock(2)
  const currencies = await addAccountCurrencies(instance, testUser, sudoUser, [
    new BN(500000),
    new BN(500000).add(new BN(1)),
  ])
  firstCurrency = currencies[0].toString()
  secondCurrency = currencies[2].toString()
  await addMGAToken(instance, sudoUser, testUser)
  await instance.waitForNewBlock(2)
})

describe('test create pool', () => {
  it('should create pool', async () => {
    await instance.createPool(
      testUser,
      firstCurrency,
      new BN(50000),
      secondCurrency,
      new BN(50000),
      {
        extrinsicStatus: (result: MangataGenericEvent[]) => {
          const eventResult = getEventResultFromTxWait(result, [
            'xyk',
            'PoolCreated',
            testUser.address,
          ])
          expect(eventResult.state).toEqual(ExtrinsicResult.ExtrinsicSuccess)
        },
      }
    )
  })
})

describe('test amount of token in pool', () => {
  it('should test the balance', async () => {
    await instance.createPool(testUser, firstCurrency, new BN(50000), secondCurrency, new BN(60000))

    const balance1 = await instance.getAmountOfTokenIdInPool(firstCurrency, secondCurrency)
    const balance2 = await instance.getAmountOfTokenIdInPool(secondCurrency, firstCurrency)

    expect(balance1[0].toNumber()).toEqual(50000)
    expect(balance1[1].toNumber()).toEqual(60000)
    expect(balance2[0].toNumber()).toEqual(0)
    expect(balance2[1].toNumber()).toEqual(0)
  })
})

describe('test buy asset', () => {
  it('should buy asset', async () => {
    await instance.createPool(testUser, firstCurrency, new BN(50000), secondCurrency, new BN(25000))
    await instance.waitForNewBlock(2)
    await instance.buyAsset(testUser, firstCurrency, secondCurrency, new BN(1000), new BN(60000), {
      extrinsicStatus: (result) => {
        const eventResult = getEventResultFromTxWait(result, [
          'xyk',
          'AssetsSwapped',
          testUser.address,
        ])
        expect(eventResult.state).toEqual(ExtrinsicResult.ExtrinsicSuccess)
      },
    })
  })
})

describe('test sellasset four times at the same time', () => {
  it('should sell asset 4 times', async () => {
    await instance.createPool(
      testUser,
      firstCurrency,
      new BN(100000),
      secondCurrency,
      new BN(100000)
    )
    const userNonce = []
    userNonce.push(await instance.getNonce(testUser.address))
    const promises = []
    const maxFutureNonce = userNonce[0].toNumber() + 3
    for (let index = maxFutureNonce; index >= userNonce[0].toNumber(); index--) {
      promises.push(
        instance.sellAsset(
          testUser,
          firstCurrency,
          secondCurrency,
          new BN(1000 + index),
          new BN(0),
          {
            nonce: new BN(index),
          }
        )
      )
    }
    const promisesEvents = await Promise.all(promises)
    promisesEvents.forEach((events) => {
      const result = getEventResultFromTxWait(events)
      expect(result.state).toEqual(ExtrinsicResult.ExtrinsicSuccess)
    })
  })
})

describe('test sell asset', () => {
  it('should sell asset', async () => {
    await instance.createPool(testUser, firstCurrency, new BN(50000), secondCurrency, new BN(25000))
    await instance.waitForNewBlock(2)
    await instance.sellAsset(testUser, firstCurrency, secondCurrency, new BN(10000), new BN(100), {
      extrinsicStatus: (result) => {
        const eventResult = getEventResultFromTxWait(result, [
          'xyk',
          'AssetsSwapped',
          testUser.address,
        ])
        expect(eventResult.state).toEqual(ExtrinsicResult.ExtrinsicSuccess)
      },
    })
  })
})

describe('test mint liquidity', () => {
  it('should mint liquidity', async () => {
    await instance.createPool(testUser, firstCurrency, new BN(50000), secondCurrency, new BN(25000))
    await instance.waitForNewBlock(2)
    await instance.mintLiquidity(
      testUser,
      firstCurrency,
      secondCurrency,
      new BN(10000),
      new BN(5001),
      {
        extrinsicStatus: (result) => {
          const eventResult = getEventResultFromTxWait(result)
          expect(eventResult.state).toEqual(ExtrinsicResult.ExtrinsicSuccess)
        },
      }
    )
  })
})

describe('test burn liquidity', () => {
  it('should burn liquidity', async () => {
    await instance.createPool(testUser, firstCurrency, new BN(50000), secondCurrency, new BN(25000))
    await instance.waitForNewBlock(2)
    await instance.burnLiquidity(testUser, firstCurrency, secondCurrency, new BN(10000), {
      extrinsicStatus: (result) => {
        const eventResult = getEventResultFromTxWait(result)
        expect(eventResult.state).toEqual(ExtrinsicResult.ExtrinsicSuccess)
      },
    })
  })
})

describe('test create token', () => {
  it('should create token', async () => {
    await instance.createToken(testUser.address, sudoUser, new BN(firstCurrency), {
      extrinsicStatus: (result) => {
        const eventResult = getEventResultFromTxWait(result, ['tokens', 'Issued', testUser.address])
        expect(eventResult.data).not.toBeNull()
      },
    })
  })
})

afterAll(async () => {
  await instance.disconnect()
})
