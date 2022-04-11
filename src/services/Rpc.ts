import { ApiPromise } from '@polkadot/api'
import { BN, isHex, hexToBn } from '@polkadot/util'
import { fromBN } from '../utils/toBn'

class Rpc {
  static async getChain(api: ApiPromise): Promise<string> {
    const chain = await api.rpc.system.chain()
    return chain.toHuman()
  }

  static async getNodeName(api: ApiPromise): Promise<string> {
    const name = await api.rpc.system.name()
    return name.toHuman()
  }
  static async getNodeVersion(api: ApiPromise): Promise<string> {
    const version = await api.rpc.system.version()
    return version.toHuman()
  }

  static async calculateRewardsAmount(api: ApiPromise, address: string, liquidityTokenId: string) {
    const rewards = await (api.rpc as any).xyk.calculate_rewards_amount(address, liquidityTokenId)

    const notYetClaimed = isHex(rewards.notYetClaimed.toString())
      ? hexToBn(rewards.notYetClaimed.toString())
      : new BN(rewards.notYetClaimed)
    const toBeClaimed = isHex(rewards.toBeClaimed.toString())
      ? hexToBn(rewards.toBeClaimed.toString())
      : new BN(rewards.toBeClaimed.toString())

    return {
      notYetClaimed,
      toBeClaimed,
    }
  }

  static async calculateBuyPrice(
    api: ApiPromise,
    inputReserve: BN,
    outputReserve: BN,
    amount: BN
  ): Promise<BN> {
    const result = await (api.rpc as any).xyk.calculate_buy_price(
      inputReserve,
      outputReserve,
      amount
    )
    return new BN(result.price)
  }

  static async calculateSellPrice(
    api: ApiPromise,
    inputReserve: BN,
    outputReserve: BN,
    amount: BN
  ): Promise<BN> {
    const result = await (api.rpc as any).xyk.calculate_sell_price(
      inputReserve,
      outputReserve,
      amount
    )
    return new BN(result.price)
  }

  // TODO: Need to figure out the return value from this method
  static async getBurnAmount(
    api: ApiPromise,
    firstTokenId: string,
    secondTokenId: string,
    amount: BN
  ) {
    const result = await (api.rpc as any).xyk.get_burn_amount(firstTokenId, secondTokenId, amount)
    const resultAsJson = JSON.parse(result.toString())
    return resultAsJson
  }

  static async calculateSellPriceId(
    api: ApiPromise,
    firstTokenId: string,
    secondTokenId: string,
    amount: BN
  ): Promise<BN> {
    const result = await (api.rpc as any).xyk.calculate_sell_price_id(
      firstTokenId,
      secondTokenId,
      amount
    )
    return new BN(result.price)
  }

  static async calculateBuyPriceId(
    api: ApiPromise,
    firstTokenId: string,
    secondTokenId: string,
    amount: BN
  ): Promise<BN> {
    const result = await (api.rpc as any).xyk.calculate_buy_price_id(
      firstTokenId,
      secondTokenId,
      amount
    )
    return new BN(result.price)
  }
}

export default Rpc
