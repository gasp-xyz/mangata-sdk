export default {
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
      ],
      type: 'RpcResult<Balance>',
    },
  },
}
