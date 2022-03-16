// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

import type { Compact, Struct, u32 } from '@polkadot/types-codec';
import type { Balance, BlockNumber, Digest, H256, H512, Hash } from '@polkadot/types/interfaces/runtime';

/** @name Header */
export interface Header extends Struct {
  readonly parentHash: Hash;
  readonly number: Compact<BlockNumber>;
  readonly stateRoot: Hash;
  readonly extrinsicsRoot: Hash;
  readonly digest: Digest;
  readonly seed: ShufflingSeed;
  readonly count: BlockNumber;
}

/** @name RPCAmountsResult */
export interface RPCAmountsResult extends Struct {
  readonly firstAssetAmount: Balance;
  readonly secondAssetAmount: Balance;
}

/** @name RpcResult */
export interface RpcResult extends Struct {
  readonly price: Balance;
}

/** @name ShufflingSeed */
export interface ShufflingSeed extends Struct {
  readonly seed: H256;
  readonly proof: H512;
}

/** @name TokenId */
export interface TokenId extends u32 {}

export type PHANTOM_DEFAULT = 'default';
