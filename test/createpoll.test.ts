/* eslint-disable no-console */
import { Keyring } from '@polkadot/api'
import { Mangata } from '../src'
import { User } from './User'
import BN from 'bn.js'
import { addUserCurrencies, ExtrinsicResult, getEventResultFromTxWait } from './Assets'
import { sleep } from '../src/utils/MemoryDatabase'
require('dotenv').config()

const uri = process.env.API_URL ? process.env.API_URL : 'ws://127.0.0.1:9944'
let m: Mangata
beforeAll(() => {
  m = Mangata.getInstance(uri)
})

describe('test create pool', () => {
  const first_asset_amount = new BN(50000)
  const second_asset_amount = new BN(50000)
  const defaultCurrecyValue = new BN(250000)
  const sudoUserName = process.env.TEST_SUDO_NAME

  it('should retrive chain name when calling getChain method', async () => {
    await m.waitNewBlock()
    const keyring = new Keyring({ type: 'sr25519' })
    const testUser = new User(m, keyring)
    const sudoUser = new User(m, keyring, sudoUserName)
    keyring.addPair(testUser.keyRingPair)
    keyring.addPair(sudoUser.keyRingPair)

    const currencies = await addUserCurrencies(
      m,
      testUser,
      [defaultCurrecyValue, defaultCurrecyValue.add(new BN(1))],
      sudoUser
    )
    await testUser.addMGAToken(sudoUser, testUser)
    await m.waitNewBlock()
    const result = await m.createPool(
      testUser.keyRingPair,
      currencies[0].toString(),
      first_asset_amount,
      currencies[1].toString(),
      second_asset_amount
    )
    const eventResult = getEventResultFromTxWait(result, [
      'xyk',
      'PoolCreated',
      testUser.keyRingPair.address,
    ])
    expect(eventResult.state).toEqual(ExtrinsicResult.ExtrinsicSuccess)
  })
})

afterAll(async () => {
  await m.disconnect()
  sleep(10000)
})
