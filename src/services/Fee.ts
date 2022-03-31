import { ApiPromise } from '@polkadot/api'
import { KeyringPair } from '@polkadot/keyring/types'
import { BN } from '@polkadot/util'
import { TxOptions } from '../types/TxOptions'
import { fromBN } from '../utils/toBn'

class Fee {
  static async createPoolFee(
    api: ApiPromise,
    account: string | KeyringPair,
    firstTokenId: string,
    firstTokenAmount: BN,
    secondTokenId: string,
    secondTokenAmount: BN,
    txOptions?: TxOptions
  ): Promise<string> {
    const dispatchInfo = await api.tx.xyk
      .createPool(firstTokenId, firstTokenAmount, secondTokenId, secondTokenAmount)
      .paymentInfo(account, { nonce: txOptions?.nonce, signer: txOptions?.signer })
    return fromBN(new BN(dispatchInfo.partialFee.toString()))
  }
}

export default Fee
