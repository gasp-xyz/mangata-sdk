/* eslint-disable no-console */
import BN from 'bn.js'
import { mangataInstance } from './mangataInstanceCreation'

describe('Test for calculating buy and sell price', () => {
  it('should calculate buy price', async () => {
    const buyPrice = await mangataInstance.calculateBuyPrice(
      new BN(50000),
      new BN(25000),
      new BN(1000)
    )
    expect(buyPrice.toNumber()).toEqual(2090)
  })

  it('should calculate sell price', async () => {
    const buyPrice = await mangataInstance.calculateSellPrice(
      new BN(50000),
      new BN(25000),
      new BN(1000)
    )
    expect(buyPrice.toNumber()).toEqual(488)
  })
})

afterAll(async () => {
  await mangataInstance.disconnect()
})
