import type { DefinitionRpc, DefinitionRpcSub } from '@polkadot/types/types'

const rpcOptions: Record<string, Record<string, DefinitionRpc | DefinitionRpcSub>> = {
  xyk: {
    calculate_buy_price: {
      description: '',
      params: [
        {
          name: 'input_reserve',
          type: 'Balance',
        },
        {
          name: 'output_reserve',
          type: 'Balance',
        },
        {
          name: 'sell_amount',
          type: 'Balance',
        },
        {
          name: 'at',
          type: 'Option<BlockHash>',
        },
      ],
      type: 'RpcResult<Balance>',
    },
    calculate_sell_price: {
      description: '',
      params: [
        {
          name: 'input_reserve',
          type: 'Balance',
        },
        {
          name: 'output_reserve',
          type: 'Balance',
        },
        {
          name: 'sell_amount',
          type: 'Balance',
        },
        {
          name: 'at',
          type: 'Option<BlockHash>',
        },
      ],
      type: 'RpcResult<Balance>',
    },
    get_burn_amount: {
      description: '',
      params: [
        {
          name: 'first_asset_id',
          type: 'TokenId',
        },
        {
          name: 'second_asset_id',
          type: 'TokenId',
        },
        {
          name: 'liquidity_asset_amount',
          type: 'Balance',
        },
        {
          name: 'at',
          type: 'Option<BlockHash>',
        },
      ],
      type: 'RPCAmountsResult<Balance>',
    },
    calculate_sell_price_id: {
      description: '',
      params: [
        {
          name: 'sold_token_id',
          type: 'TokenId',
        },
        {
          name: 'bought_token_id',
          type: 'TokenId',
        },
        {
          name: 'sell_amount',
          type: 'Balance',
        },
        {
          name: 'at',
          type: 'Option<BlockHash>',
        },
      ],
      type: 'RpcResult<Balance>',
    },
    calculate_buy_price_id: {
      description: '',
      params: [
        {
          name: 'sold_token_id',
          type: 'TokenId',
        },
        {
          name: 'bought_token_id',
          type: 'TokenId',
        },
        {
          name: 'buy_amount',
          type: 'Balance',
        },
        {
          name: 'at',
          type: 'Option<BlockHash>',
        },
      ],
      type: 'RpcResult<Balance>',
    },
  },
}

export default rpcOptions
