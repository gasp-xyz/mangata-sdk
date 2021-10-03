import { Amount } from './Amount'
import { TokenId } from './TokenId'

export type Pool = {
  firstTokenId: TokenId
  firstTokenAmount: Amount
  secondTokenId: TokenId
  secondTokenAmount: Amount
}
