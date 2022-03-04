// Auto-generated via `yarn polkadot-types-from-chain`, do not edit
/* eslint-disable */

import type { ApiTypes } from '@polkadot/api-base/types';
import type { Null, Option, Result, U256, U8aFixed, Vec, bool, u128, u32, u64, u8 } from '@polkadot/types-codec';
import type { ITuple } from '@polkadot/types-codec/types';
import type { AccountId32, H160, H256, Perbill } from '@polkadot/types/interfaces/runtime';
import type { ArtemisCoreApp, FrameSupportTokensMiscBalanceStatus, FrameSupportWeightsDispatchInfo, PalletAssetsInfoAssetInfo, ParachainStakingCandidateBondRequest, ParachainStakingDelegationRequest, ParachainStakingDelegatorAdded, SpRuntimeDispatchError, XcmV1MultiAsset, XcmV1MultiLocation, XcmV1MultiassetMultiAssets, XcmV2Response, XcmV2TraitsError, XcmV2TraitsOutcome, XcmV2Xcm, XcmVersionedMultiAssets, XcmVersionedMultiLocation } from '@polkadot/types/lookup';

declare module '@polkadot/api-base/types/events' {
  export interface AugmentedEvents<ApiType extends ApiTypes> {
    assetRegistry: {
      /**
       * The asset registered.
       **/
      AssetRegistered: AugmentedEvent<ApiType, [u32, XcmV1MultiLocation]>;
      /**
       * The asset updated.
       **/
      AssetUpdated: AugmentedEvent<ApiType, [u32, XcmV1MultiLocation]>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    assetsInfo: {
      /**
       * Asset info stored. [assetId, info]
       **/
      InfoStored: AugmentedEvent<ApiType, [u32, PalletAssetsInfoAssetInfo]>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    bridge: {
      /**
       * An AppRegistry entry has been updated
       **/
      AppUpdated: AugmentedEvent<ApiType, [ArtemisCoreApp, U8aFixed]>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    bridgedAsset: {
      Burned: AugmentedEvent<ApiType, [H160, AccountId32, U256]>;
      Minted: AugmentedEvent<ApiType, [H160, AccountId32, U256]>;
      Transferred: AugmentedEvent<ApiType, [H160, AccountId32, AccountId32, U256]>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    council: {
      /**
       * A motion was approved by the required threshold.
       **/
      Approved: AugmentedEvent<ApiType, [H256]>;
      /**
       * A proposal was closed because its threshold was reached or after its duration was up.
       **/
      Closed: AugmentedEvent<ApiType, [H256, u32, u32]>;
      /**
       * A motion was not approved by the required threshold.
       **/
      Disapproved: AugmentedEvent<ApiType, [H256]>;
      /**
       * A motion was executed; result will be `Ok` if it returned without error.
       **/
      Executed: AugmentedEvent<ApiType, [H256, Result<Null, SpRuntimeDispatchError>]>;
      /**
       * A single member did some action; result will be `Ok` if it returned without error.
       **/
      MemberExecuted: AugmentedEvent<ApiType, [H256, Result<Null, SpRuntimeDispatchError>]>;
      /**
       * A motion (given hash) has been proposed (by given account) with a threshold (given
       * `MemberCount`).
       **/
      Proposed: AugmentedEvent<ApiType, [AccountId32, u32, H256, u32]>;
      /**
       * A motion (given hash) has been voted on by given account, leaving
       * a tally (yes votes and no votes given respectively as `MemberCount`).
       **/
      Voted: AugmentedEvent<ApiType, [AccountId32, H256, bool, u32, u32]>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    crowdloan: {
      /**
       * When initializing the reward vec an already initialized account was found
       **/
      InitializedAccountWithNotEnoughContribution: AugmentedEvent<ApiType, [AccountId32, Option<AccountId32>, u128]>;
      /**
       * When initializing the reward vec an already initialized account was found
       **/
      InitializedAlreadyInitializedAccount: AugmentedEvent<ApiType, [AccountId32, Option<AccountId32>, u128]>;
      /**
       * The initial payment of InitializationPayment % was paid
       **/
      InitialPaymentMade: AugmentedEvent<ApiType, [AccountId32, u128]>;
      /**
       * Someone has proven they made a contribution and associated a native identity with it.
       * Data is the relay account,  native account and the total amount of _rewards_ that will be paid
       **/
      NativeIdentityAssociated: AugmentedEvent<ApiType, [AccountId32, AccountId32, u128]>;
      /**
       * A contributor has updated the reward address.
       **/
      RewardAddressUpdated: AugmentedEvent<ApiType, [AccountId32, AccountId32]>;
      /**
       * A contributor has claimed some rewards.
       * Data is the account getting paid and the amount of rewards paid.
       **/
      RewardsPaid: AugmentedEvent<ApiType, [AccountId32, u128]>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    cumulusXcm: {
      /**
       * Downward message executed with the given outcome.
       * \[ id, outcome \]
       **/
      ExecutedDownward: AugmentedEvent<ApiType, [U8aFixed, XcmV2TraitsOutcome]>;
      /**
       * Downward message is invalid XCM.
       * \[ id \]
       **/
      InvalidFormat: AugmentedEvent<ApiType, [U8aFixed]>;
      /**
       * Downward message is unsupported version of XCM.
       * \[ id \]
       **/
      UnsupportedVersion: AugmentedEvent<ApiType, [U8aFixed]>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    dmpQueue: {
      /**
       * Downward message executed with the given outcome.
       * \[ id, outcome \]
       **/
      ExecutedDownward: AugmentedEvent<ApiType, [U8aFixed, XcmV2TraitsOutcome]>;
      /**
       * Downward message is invalid XCM.
       * \[ id \]
       **/
      InvalidFormat: AugmentedEvent<ApiType, [U8aFixed]>;
      /**
       * Downward message is overweight and was placed in the overweight queue.
       * \[ id, index, required \]
       **/
      OverweightEnqueued: AugmentedEvent<ApiType, [U8aFixed, u64, u64]>;
      /**
       * Downward message from the overweight queue was executed.
       * \[ index, used \]
       **/
      OverweightServiced: AugmentedEvent<ApiType, [u64, u64]>;
      /**
       * Downward message is unsupported version of XCM.
       * \[ id \]
       **/
      UnsupportedVersion: AugmentedEvent<ApiType, [U8aFixed]>;
      /**
       * The weight limit for handling downward messages was reached.
       * \[ id, remaining, required \]
       **/
      WeightExhausted: AugmentedEvent<ApiType, [U8aFixed, u64, u64]>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    elections: {
      /**
       * A candidate was slashed by amount due to failing to obtain a seat as member or
       * runner-up.
       * 
       * Note that old members and runners-up are also candidates.
       **/
      CandidateSlashed: AugmentedEvent<ApiType, [AccountId32, u128]>;
      /**
       * Internal error happened while trying to perform election.
       **/
      ElectionError: AugmentedEvent<ApiType, []>;
      /**
       * No (or not enough) candidates existed for this round. This is different from
       * `NewTerm(\[\])`. See the description of `NewTerm`.
       **/
      EmptyTerm: AugmentedEvent<ApiType, []>;
      /**
       * A member has been removed. This should always be followed by either `NewTerm` or
       * `EmptyTerm`.
       **/
      MemberKicked: AugmentedEvent<ApiType, [AccountId32]>;
      /**
       * A new term with new_members. This indicates that enough candidates existed to run
       * the election, not that enough have has been elected. The inner value must be examined
       * for this purpose. A `NewTerm(\[\])` indicates that some candidates got their bond
       * slashed and none were elected, whilst `EmptyTerm` means that no candidates existed to
       * begin with.
       **/
      NewTerm: AugmentedEvent<ApiType, [Vec<ITuple<[AccountId32, u128]>>]>;
      /**
       * Someone has renounced their candidacy.
       **/
      Renounced: AugmentedEvent<ApiType, [AccountId32]>;
      /**
       * A seat holder was slashed by amount by being forcefully removed from the set.
       **/
      SeatHolderSlashed: AugmentedEvent<ApiType, [AccountId32, u128]>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    erc20: {
      /**
       * Signal a cross-chain transfer.
       **/
      Transfer: AugmentedEvent<ApiType, [H160, AccountId32, H160, U256]>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    eth: {
      /**
       * Signal a cross-chain transfer.
       **/
      Transfer: AugmentedEvent<ApiType, [AccountId32, H160, U256]>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    issuance: {
      /**
       * Issuance for upcoming session issued
       **/
      SessionIssuanceIssued: AugmentedEvent<ApiType, [u32, u128, u128]>;
      /**
       * Issuance for upcoming session calculated and recorded
       **/
      SessionIssuanceRecorded: AugmentedEvent<ApiType, [u32, u128, u128]>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    ormlXcm: {
      /**
       * XCM message sent. \[to, message\]
       **/
      Sent: AugmentedEvent<ApiType, [XcmV1MultiLocation, XcmV2Xcm]>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    parachainStaking: {
      /**
       * Candidate, Cancelled Request
       **/
      CancelledCandidateBondChange: AugmentedEvent<ApiType, [AccountId32, ParachainStakingCandidateBondRequest]>;
      /**
       * Candidate
       **/
      CancelledCandidateExit: AugmentedEvent<ApiType, [AccountId32]>;
      /**
       * Delegator, Cancelled Request
       **/
      CancelledDelegationRequest: AugmentedEvent<ApiType, [AccountId32, ParachainStakingDelegationRequest]>;
      /**
       * Round Online, Candidate
       **/
      CandidateBackOnline: AugmentedEvent<ApiType, [u32, AccountId32]>;
      /**
       * Candidate, Amount, New Bond
       **/
      CandidateBondedLess: AugmentedEvent<ApiType, [AccountId32, u128, u128]>;
      /**
       * Candidate, Amount, New Bond Total
       **/
      CandidateBondedMore: AugmentedEvent<ApiType, [AccountId32, u128, u128]>;
      /**
       * Candidate, Amount To Decrease, Round at which request can be executed by caller
       **/
      CandidateBondLessRequested: AugmentedEvent<ApiType, [AccountId32, u128, u32]>;
      /**
       * Candidate, Amount To Increase, Round at which request can be executed by caller
       **/
      CandidateBondMoreRequested: AugmentedEvent<ApiType, [AccountId32, u128, u32]>;
      /**
       * Ex-Candidate, Amount Unlocked, New Total Amt Locked
       **/
      CandidateLeft: AugmentedEvent<ApiType, [AccountId32, u128, u128]>;
      /**
       * Round At Which Exit Is Allowed, Candidate, Scheduled Exit
       **/
      CandidateScheduledExit: AugmentedEvent<ApiType, [u32, AccountId32, u32]>;
      /**
       * Round Offline, Candidate
       **/
      CandidateWentOffline: AugmentedEvent<ApiType, [u32, AccountId32]>;
      /**
       * Round, Collator Account, Total Exposed Amount (includes all delegations)
       **/
      CollatorChosen: AugmentedEvent<ApiType, [u32, AccountId32, u128]>;
      /**
       * Set collator commission to this value [old, new]
       **/
      CollatorCommissionSet: AugmentedEvent<ApiType, [Perbill, Perbill]>;
      /**
       * Delegator, Amount Locked, Candidate, Delegator Position with New Total Counted if in Top
       **/
      Delegation: AugmentedEvent<ApiType, [AccountId32, u128, AccountId32, ParachainStakingDelegatorAdded]>;
      DelegationDecreased: AugmentedEvent<ApiType, [AccountId32, AccountId32, u128, bool]>;
      /**
       * Delegator, Candidate, Amount to be decreased, Round at which can be executed
       **/
      DelegationDecreaseScheduled: AugmentedEvent<ApiType, [AccountId32, AccountId32, u128, u32]>;
      DelegationIncreased: AugmentedEvent<ApiType, [AccountId32, AccountId32, u128, bool]>;
      /**
       * Delegator, Candidate, Amount to be increased, Round at which can be executed
       **/
      DelegationIncreaseScheduled: AugmentedEvent<ApiType, [AccountId32, AccountId32, u128, u32]>;
      /**
       * Round, Delegator, Candidate, Scheduled Exit
       **/
      DelegationRevocationScheduled: AugmentedEvent<ApiType, [u32, AccountId32, AccountId32, u32]>;
      /**
       * Delegator, Candidate, Amount Unstaked
       **/
      DelegationRevoked: AugmentedEvent<ApiType, [AccountId32, AccountId32, u128]>;
      /**
       * Delegator, Collator, Due reward (as per counted delegation for collator)
       **/
      DelegatorDueReward: AugmentedEvent<ApiType, [AccountId32, AccountId32, u128]>;
      /**
       * Delegator
       **/
      DelegatorExitCancelled: AugmentedEvent<ApiType, [AccountId32]>;
      /**
       * Round, Delegator, Scheduled Exit
       **/
      DelegatorExitScheduled: AugmentedEvent<ApiType, [u32, AccountId32, u32]>;
      /**
       * Delegator, Amount Unstaked
       **/
      DelegatorLeft: AugmentedEvent<ApiType, [AccountId32, u128]>;
      /**
       * Delegator, Candidate, Amount Unstaked, New Total Amt Staked for Candidate
       **/
      DelegatorLeftCandidate: AugmentedEvent<ApiType, [AccountId32, AccountId32, u128, u128]>;
      /**
       * Account, Amount Locked, New Total Amt Locked
       **/
      JoinedCollatorCandidates: AugmentedEvent<ApiType, [AccountId32, u128, u128]>;
      /**
       * Starting Block, Round, Number of Collators Selected, Total Balance
       **/
      NewRound: AugmentedEvent<ApiType, [u32, u32, u32, u128]>;
      /**
       * Paid the account (delegator or collator) the balance as liquid rewards
       **/
      Rewarded: AugmentedEvent<ApiType, [AccountId32, u128]>;
      /**
       * Staking expectations set
       **/
      StakeExpectationsSet: AugmentedEvent<ApiType, [u128, u128, u128]>;
      /**
       * Set total selected candidates to this value [old, new]
       **/
      TotalSelectedSet: AugmentedEvent<ApiType, [u32, u32]>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    parachainSystem: {
      /**
       * Downward messages were processed using the given weight.
       * \[ weight_used, result_mqc_head \]
       **/
      DownwardMessagesProcessed: AugmentedEvent<ApiType, [u64, H256]>;
      /**
       * Some downward messages have been received and will be processed.
       * \[ count \]
       **/
      DownwardMessagesReceived: AugmentedEvent<ApiType, [u32]>;
      /**
       * An upgrade has been authorized.
       **/
      UpgradeAuthorized: AugmentedEvent<ApiType, [H256]>;
      /**
       * The validation function was applied as of the contained relay chain block number.
       **/
      ValidationFunctionApplied: AugmentedEvent<ApiType, [u32]>;
      /**
       * The relay-chain aborted the upgrade process.
       **/
      ValidationFunctionDiscarded: AugmentedEvent<ApiType, []>;
      /**
       * The validation function has been scheduled to apply.
       **/
      ValidationFunctionStored: AugmentedEvent<ApiType, []>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    polkadotXcm: {
      /**
       * Some assets have been placed in an asset trap.
       * 
       * \[ hash, origin, assets \]
       **/
      AssetsTrapped: AugmentedEvent<ApiType, [H256, XcmV1MultiLocation, XcmVersionedMultiAssets]>;
      /**
       * Execution of an XCM message was attempted.
       * 
       * \[ outcome \]
       **/
      Attempted: AugmentedEvent<ApiType, [XcmV2TraitsOutcome]>;
      /**
       * Expected query response has been received but the origin location of the response does
       * not match that expected. The query remains registered for a later, valid, response to
       * be received and acted upon.
       * 
       * \[ origin location, id, expected location \]
       **/
      InvalidResponder: AugmentedEvent<ApiType, [XcmV1MultiLocation, u64, Option<XcmV1MultiLocation>]>;
      /**
       * Expected query response has been received but the expected origin location placed in
       * storage by this runtime previously cannot be decoded. The query remains registered.
       * 
       * This is unexpected (since a location placed in storage in a previously executing
       * runtime should be readable prior to query timeout) and dangerous since the possibly
       * valid response will be dropped. Manual governance intervention is probably going to be
       * needed.
       * 
       * \[ origin location, id \]
       **/
      InvalidResponderVersion: AugmentedEvent<ApiType, [XcmV1MultiLocation, u64]>;
      /**
       * Query response has been received and query is removed. The registered notification has
       * been dispatched and executed successfully.
       * 
       * \[ id, pallet index, call index \]
       **/
      Notified: AugmentedEvent<ApiType, [u64, u8, u8]>;
      /**
       * Query response has been received and query is removed. The dispatch was unable to be
       * decoded into a `Call`; this might be due to dispatch function having a signature which
       * is not `(origin, QueryId, Response)`.
       * 
       * \[ id, pallet index, call index \]
       **/
      NotifyDecodeFailed: AugmentedEvent<ApiType, [u64, u8, u8]>;
      /**
       * Query response has been received and query is removed. There was a general error with
       * dispatching the notification call.
       * 
       * \[ id, pallet index, call index \]
       **/
      NotifyDispatchError: AugmentedEvent<ApiType, [u64, u8, u8]>;
      /**
       * Query response has been received and query is removed. The registered notification could
       * not be dispatched because the dispatch weight is greater than the maximum weight
       * originally budgeted by this runtime for the query result.
       * 
       * \[ id, pallet index, call index, actual weight, max budgeted weight \]
       **/
      NotifyOverweight: AugmentedEvent<ApiType, [u64, u8, u8, u64, u64]>;
      /**
       * A given location which had a version change subscription was dropped owing to an error
       * migrating the location to our new XCM format.
       * 
       * \[ location, query ID \]
       **/
      NotifyTargetMigrationFail: AugmentedEvent<ApiType, [XcmVersionedMultiLocation, u64]>;
      /**
       * A given location which had a version change subscription was dropped owing to an error
       * sending the notification to it.
       * 
       * \[ location, query ID, error \]
       **/
      NotifyTargetSendFail: AugmentedEvent<ApiType, [XcmV1MultiLocation, u64, XcmV2TraitsError]>;
      /**
       * Query response has been received and is ready for taking with `take_response`. There is
       * no registered notification call.
       * 
       * \[ id, response \]
       **/
      ResponseReady: AugmentedEvent<ApiType, [u64, XcmV2Response]>;
      /**
       * Received query response has been read and removed.
       * 
       * \[ id \]
       **/
      ResponseTaken: AugmentedEvent<ApiType, [u64]>;
      /**
       * A XCM message was sent.
       * 
       * \[ origin, destination, message \]
       **/
      Sent: AugmentedEvent<ApiType, [XcmV1MultiLocation, XcmV1MultiLocation, XcmV2Xcm]>;
      /**
       * The supported version of a location has been changed. This might be through an
       * automatic notification or a manual intervention.
       * 
       * \[ location, XCM version \]
       **/
      SupportedVersionChanged: AugmentedEvent<ApiType, [XcmV1MultiLocation, u32]>;
      /**
       * Query response received which does not match a registered query. This may be because a
       * matching query was never registered, it may be because it is a duplicate response, or
       * because the query timed out.
       * 
       * \[ origin location, id \]
       **/
      UnexpectedResponse: AugmentedEvent<ApiType, [XcmV1MultiLocation, u64]>;
      /**
       * An XCM version change notification message has been attempted to be sent.
       * 
       * \[ destination, result \]
       **/
      VersionChangeNotified: AugmentedEvent<ApiType, [XcmV1MultiLocation, u32]>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    session: {
      /**
       * New session has happened. Note that the argument is the session index, not the
       * block number as the type might suggest.
       **/
      NewSession: AugmentedEvent<ApiType, [u32]>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    sudo: {
      /**
       * The \[sudoer\] just switched identity; the old key is supplied if one existed.
       **/
      KeyChanged: AugmentedEvent<ApiType, [Option<AccountId32>]>;
      /**
       * A sudo just took place. \[result\]
       **/
      Sudid: AugmentedEvent<ApiType, [Result<Null, SpRuntimeDispatchError>]>;
      /**
       * A sudo just took place. \[result\]
       **/
      SudoAsDone: AugmentedEvent<ApiType, [Result<Null, SpRuntimeDispatchError>]>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    sudoOrigin: {
      /**
       * A sudo just took place. \[result\]
       **/
      SuOriginDid: AugmentedEvent<ApiType, [Result<Null, SpRuntimeDispatchError>]>;
      /**
       * A sudo just took place. \[result\]
       **/
      SuOriginDoAsDone: AugmentedEvent<ApiType, [Result<Null, SpRuntimeDispatchError>]>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    system: {
      /**
       * `:code` was updated.
       **/
      CodeUpdated: AugmentedEvent<ApiType, []>;
      /**
       * An extrinsic failed.
       **/
      ExtrinsicFailed: AugmentedEvent<ApiType, [SpRuntimeDispatchError, FrameSupportWeightsDispatchInfo]>;
      /**
       * An extrinsic completed successfully.
       **/
      ExtrinsicSuccess: AugmentedEvent<ApiType, [FrameSupportWeightsDispatchInfo]>;
      /**
       * An account was reaped.
       **/
      KilledAccount: AugmentedEvent<ApiType, [AccountId32]>;
      /**
       * A new account was created.
       **/
      NewAccount: AugmentedEvent<ApiType, [AccountId32]>;
      /**
       * On on-chain remark happened.
       **/
      Remarked: AugmentedEvent<ApiType, [AccountId32, H256]>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    tokens: {
      /**
       * A balance was set by root.
       **/
      BalanceSet: AugmentedEvent<ApiType, [u32, AccountId32, u128, u128]>;
      /**
       * An account was removed whose balance was non-zero but below
       * ExistentialDeposit, resulting in an outright loss.
       **/
      DustLost: AugmentedEvent<ApiType, [u32, AccountId32, u128]>;
      /**
       * An account was created with some free balance.
       **/
      Endowed: AugmentedEvent<ApiType, [u32, AccountId32, u128]>;
      /**
       * A token was issued.
       **/
      Issued: AugmentedEvent<ApiType, [u32, AccountId32, u128]>;
      /**
       * A token was minted.
       **/
      Minted: AugmentedEvent<ApiType, [u32, AccountId32, u128]>;
      /**
       * Some reserved balance was repatriated (moved from reserved to
       * another account).
       **/
      RepatriatedReserve: AugmentedEvent<ApiType, [u32, AccountId32, AccountId32, u128, FrameSupportTokensMiscBalanceStatus]>;
      /**
       * Some balance was reserved (moved from free to reserved).
       **/
      Reserved: AugmentedEvent<ApiType, [u32, AccountId32, u128]>;
      /**
       * Transfer succeeded.
       **/
      Transfer: AugmentedEvent<ApiType, [u32, AccountId32, AccountId32, u128]>;
      /**
       * Some balance was unreserved (moved from reserved to free).
       **/
      Unreserved: AugmentedEvent<ApiType, [u32, AccountId32, u128]>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    treasury: {
      /**
       * Some funds have been allocated.
       **/
      Awarded: AugmentedEvent<ApiType, [u32, u128, AccountId32]>;
      /**
       * Some of our funds have been burnt.
       **/
      Burnt: AugmentedEvent<ApiType, [u128]>;
      /**
       * Some funds have been deposited.
       **/
      Deposit: AugmentedEvent<ApiType, [u128]>;
      /**
       * New proposal.
       **/
      Proposed: AugmentedEvent<ApiType, [u32]>;
      /**
       * A proposal was rejected; funds were slashed.
       **/
      Rejected: AugmentedEvent<ApiType, [u32, u128]>;
      /**
       * Spending has finished; this is the amount that rolls over until next spend.
       **/
      Rollover: AugmentedEvent<ApiType, [u128]>;
      /**
       * We have ended a spend period and will now allocate funds.
       **/
      Spending: AugmentedEvent<ApiType, [u128]>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    unknownTokens: {
      /**
       * Deposit success.
       **/
      Deposited: AugmentedEvent<ApiType, [XcmV1MultiAsset, XcmV1MultiLocation]>;
      /**
       * Withdraw success.
       **/
      Withdrawn: AugmentedEvent<ApiType, [XcmV1MultiAsset, XcmV1MultiLocation]>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    verifier: {
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    vesting: {
      /**
       * An \[account\] has become fully vested.
       **/
      VestingCompleted: AugmentedEvent<ApiType, [AccountId32]>;
      /**
       * The amount vested has been updated. This could indicate a change in funds available.
       * The balance given is the amount which is left unvested (and thus locked).
       * \[account, unvested\]
       **/
      VestingUpdated: AugmentedEvent<ApiType, [AccountId32, u128]>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    xcmpQueue: {
      /**
       * Bad XCM format used.
       **/
      BadFormat: AugmentedEvent<ApiType, [Option<H256>]>;
      /**
       * Bad XCM version used.
       **/
      BadVersion: AugmentedEvent<ApiType, [Option<H256>]>;
      /**
       * Some XCM failed.
       **/
      Fail: AugmentedEvent<ApiType, [Option<H256>, XcmV2TraitsError]>;
      /**
       * An XCM exceeded the individual message weight budget.
       **/
      OverweightEnqueued: AugmentedEvent<ApiType, [u32, u32, u64, u64]>;
      /**
       * An XCM from the overweight queue was executed with the given actual weight used.
       **/
      OverweightServiced: AugmentedEvent<ApiType, [u64, u64]>;
      /**
       * Some XCM was executed ok.
       **/
      Success: AugmentedEvent<ApiType, [Option<H256>]>;
      /**
       * An upward message was sent to the relay chain.
       **/
      UpwardMessageSent: AugmentedEvent<ApiType, [Option<H256>]>;
      /**
       * An HRMP message was sent to a sibling parachain.
       **/
      XcmpMessageSent: AugmentedEvent<ApiType, [Option<H256>]>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    xTokens: {
      /**
       * Transferred.
       **/
      Transferred: AugmentedEvent<ApiType, [AccountId32, u32, u128, XcmV1MultiLocation]>;
      /**
       * Transferred `MultiAsset`.
       **/
      TransferredMultiAsset: AugmentedEvent<ApiType, [AccountId32, XcmV1MultiAsset, XcmV1MultiLocation]>;
      /**
       * Transferred `MultiAsset` with fee.
       **/
      TransferredMultiAssets: AugmentedEvent<ApiType, [AccountId32, XcmV1MultiassetMultiAssets, XcmV1MultiLocation]>;
      /**
       * Transferred `MultiAsset` with fee.
       **/
      TransferredMultiAssetWithFee: AugmentedEvent<ApiType, [AccountId32, XcmV1MultiAsset, XcmV1MultiAsset, XcmV1MultiLocation]>;
      /**
       * Transferred `MultiAsset` with fee.
       **/
      TransferredMultiCurrencies: AugmentedEvent<ApiType, [AccountId32, Vec<ITuple<[u32, u128]>>, XcmV1MultiLocation]>;
      /**
       * Transferred with fee.
       **/
      TransferredWithFee: AugmentedEvent<ApiType, [AccountId32, u32, u128, u128, XcmV1MultiLocation]>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    xyk: {
      AssetsSwapped: AugmentedEvent<ApiType, [AccountId32, u32, u128, u32, u128]>;
      LiquidityBurned: AugmentedEvent<ApiType, [AccountId32, u32, u128, u32, u128, u32, u128]>;
      LiquidityMinted: AugmentedEvent<ApiType, [AccountId32, u32, u128, u32, u128, u32, u128]>;
      PoolCreated: AugmentedEvent<ApiType, [AccountId32, u32, u128, u32, u128]>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
  } // AugmentedEvents
} // declare module
