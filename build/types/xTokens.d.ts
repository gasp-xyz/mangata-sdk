/// <reference types="bn.js" />
import { BN } from "@polkadot/util";
import { Address, Amount, ExtrinsicCommon, TxOptions } from "./common";
import { MultiLocation } from "@polkadot/types/interfaces";
import { Object } from "ts-toolbelt";
export declare type XcmWeightLimit = BN | {
    Limited: BN;
};
export declare type XcmTxOptions = Partial<Omit<TxOptions, "statusCallback" | "extrinsicStatus">>;
export declare type XcmAssetId = {
    Concrete: MultiLocation;
};
export declare type XcmAssetFungibility = {
    Fungible: Amount;
};
export declare type XcmAsset = {
    V1: {
        id: XcmAssetId;
        fun: XcmAssetFungibility;
    };
};
export declare type XcmInterior = {
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
export declare type XcmDestination = {
    V1: {
        parents: 1;
        interior: XcmInterior;
    };
};
export declare type Deposit = Object.Merge<ExtrinsicCommon, {
    url: string;
    asset: XcmAsset;
    destination: XcmDestination;
    weight: string;
}>;
export declare type Withdraw = Object.Merge<ExtrinsicCommon, {
    tokenSymbol: string;
    withWeight: string;
    parachainId: number;
    destinationAddress: Address;
    amount: Amount;
}>;
export declare type RelayDeposit = Object.Merge<ExtrinsicCommon, {
    url: string;
    address: Address;
    amount: Amount;
    parachainId: number;
}>;
export declare type RelayWithdraw = Object.Merge<ExtrinsicCommon, {
    kusamaAddress: Address;
    amount: Amount;
}>;
//# sourceMappingURL=xTokens.d.ts.map