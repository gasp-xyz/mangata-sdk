import { ApiOptions } from '@polkadot/api/types'
import mangataRpc from './mangata-rpc'
import mangataTypes from './mangata-types'

export const defaultOptions: ApiOptions = {
  types: mangataTypes,
  rpc: mangataRpc,
}

export const options = ({
  types = {},
  rpc = {},
  ...otherOptions
}: ApiOptions = {}): ApiOptions => ({
  types: {
    ...mangataTypes,
    ...types,
  },
  rpc: {
    ...mangataRpc,
    ...rpc,
  },
  ...otherOptions,
})
