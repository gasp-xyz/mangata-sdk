import { BN } from "@polkadot/util";
import {
  Address,
  TokenAmount,
  ExtrinsicCommon,
  TokenId,
  TxOptions
} from "./common";
import { MultiLocation } from "@polkadot/types/interfaces";
import { Merge } from "type-fest";

export type XcmWeightLimit = BN | { Limited: BN };

export type XcmTxOptions = Partial<
  Omit<TxOptions, "statusCallback" | "extrinsicStatus">
>;

export type XcmAssetId = {
  Concrete: MultiLocation;
};

export type XcmAssetFungibility = {
  Fungible: TokenAmount;
};

export type XcmAsset = {
  V1: {
    id: XcmAssetId;
    fun: XcmAssetFungibility;
  };
};

export type XcmInterior = {
  X2: [
    {
      Parachain: 2110;
    },
    {
      AccountId32: {
        network: "Any";
        id: `0x${string}`;
      };
    }
  ];
};

export type XcmDestination = {
  V1: {
    parents: 1;
    interior: XcmInterior;
  };
};

export type Deposit = Merge<
  ExtrinsicCommon,
  {
    url: string;
    asset: XcmAsset;
    destination: XcmDestination;
    weight: string;
  }
>;

export type Withdraw = Merge<
  ExtrinsicCommon,
  {
    tokenSymbol: string;
    withWeight: string;
    parachainId: number;
    destinationAddress: Address;
    amount: TokenAmount;
  }
>;

export type RelayDeposit = Merge<
  ExtrinsicCommon,
  {
    url: string;
    address: Address;
    amount: TokenAmount;
    parachainId: number;
  }
>;

export type RelayWithdraw = Merge<
  ExtrinsicCommon,
  {
    kusamaAddress: Address;
    amount: TokenAmount;
  }
>;
