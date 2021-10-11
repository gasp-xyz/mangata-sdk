import { ApiPromise } from '@polkadot/api'
import BN from 'bn.js'

import { getChain as getChainEntity } from '../entities/rpc/chain'
import { getNodeName as getNodeNameEntity } from '../entities/rpc/name'
import { getNodeVersion as getNodeVersionEntity } from '../entities/rpc/version'
import { calculateBuyPrice as calculateBuyPriceEntity } from '../entities/rpc/calculate_buy_price'
import { calculateSellPrice as calculateSellPriceEntity } from '../entities/rpc/calculate_sell_price'
import { getBurnAmount as getBurnAmountEntity } from '../entities/rpc/get_burn_amount'
import { calculateSellPriceId as calculateSellPriceIdEntity } from '../entities/rpc/calculate_sell_price_id'
import { calculateBuyPriceId as calculateBuyPriceIdEntity } from '../entities/rpc/calculate_buy_price_id'

class Rpc {
  static async getChain(api: ApiPromise): Promise<string> {
    const chain = await getChainEntity(api)
    return chain.toHuman()
  }

  static async getNodeName(api: ApiPromise): Promise<string> {
    const name = await getNodeNameEntity(api)
    return name.toHuman()
  }
  static async getNodeVersion(api: ApiPromise): Promise<string> {
    const version = await getNodeVersionEntity(api)
    return version.toHuman()
  }

  // TODO: need to find out the return type
  static async calculateBuyPrice(
    api: ApiPromise,
    inputReserve: BN,
    outputReserve: BN,
    amount: BN
  ): Promise<BN> {
    const result = await calculateBuyPriceEntity(api, inputReserve, outputReserve, amount)
    return new BN(result.price)
  }

  // TODO: need to find out the return type
  static async calculateSellPrice(
    api: ApiPromise,
    inputReserve: BN,
    outputReserve: BN,
    amount: BN
  ): Promise<BN> {
    const result = await calculateSellPriceEntity(api, inputReserve, outputReserve, amount)
    return new BN(result.price)
  }

  // TODO: Need to figure out the return value from this method
  static async getBurnAmount(
    api: ApiPromise,
    firstTokenId: string,
    secondTokenId: string,
    amount: BN
  ) {
    const result = await getBurnAmountEntity(api, firstTokenId, secondTokenId, amount)
    return result.toHuman()
  }

  static async calculateSellPriceId(
    api: ApiPromise,
    firstTokenId: string,
    secondTokenId: string,
    amount: BN
  ): Promise<BN> {
    const result = await calculateSellPriceIdEntity(api, firstTokenId, secondTokenId, amount)
    return new BN(result.price)
  }

  static async calculateBuyPriceId(
    api: ApiPromise,
    firstTokenId: string,
    secondTokenId: string,
    amount: BN
  ): Promise<BN> {
    const result = await calculateBuyPriceIdEntity(api, firstTokenId, secondTokenId, amount)
    return new BN(result.price)
  }
}

export default Rpc
