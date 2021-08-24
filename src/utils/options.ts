import { ApiOptions } from '@polkadot/api/types'
import rpcOptions from './mangata-rpc'
import typesOptions from './mangata-types'

export const defaultOptions: ApiOptions = {
  types: typesOptions,
  rpc: rpcOptions,
}

export const options = ({
  types = {},
  rpc = {},
  ...otherOptions
}: ApiOptions = {}): ApiOptions => ({
  types: {
    ...typesOptions,
    ...types,
  },
  rpc: {
    ...rpcOptions,
    ...rpc,
  },
  ...otherOptions,
})
