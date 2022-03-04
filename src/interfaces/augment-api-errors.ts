// Auto-generated via `yarn polkadot-types-from-chain`, do not edit
/* eslint-disable */

import type { ApiTypes } from '@polkadot/api-base/types';

declare module '@polkadot/api-base/types/errors' {
  export interface AugmentedErrors<ApiType extends ApiTypes> {
    assetRegistry: {
      /**
       * AssetId exists
       **/
      AssetIdExisted: AugmentedError<ApiType>;
      /**
       * AssetId not exists
       **/
      AssetIdNotExists: AugmentedError<ApiType>;
      /**
       * The given location could not be used (e.g. because it cannot be expressed in the
       * desired version of XCM).
       **/
      BadLocation: AugmentedError<ApiType>;
      /**
       * MultiLocation existed
       **/
      MultiLocationExisted: AugmentedError<ApiType>;
      /**
       * Creating a token for the foreign asset failed
       **/
      TokenCreationFailed: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    assetsInfo: {
      /**
       * Asset does not exist
       **/
      AssetNotExist: AugmentedError<ApiType>;
      /**
       * A decimals point value is out of range
       **/
      DecimalsOutOfRange: AugmentedError<ApiType>;
      /**
       * A description is too long.
       **/
      TooLongDescription: AugmentedError<ApiType>;
      /**
       * A name is too long.
       **/
      TooLongName: AugmentedError<ApiType>;
      /**
       * A symbol is too long.
       **/
      TooLongSymbol: AugmentedError<ApiType>;
      /**
       * A description is too short.
       **/
      TooShortDescription: AugmentedError<ApiType>;
      /**
       * A name is too short.
       **/
      TooShortName: AugmentedError<ApiType>;
      /**
       * A symbol is too short.
       **/
      TooShortSymbol: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    authorship: {
      /**
       * The uncle is genesis.
       **/
      GenesisUncle: AugmentedError<ApiType>;
      /**
       * The uncle parent not in the chain.
       **/
      InvalidUncleParent: AugmentedError<ApiType>;
      /**
       * The uncle isn't recent enough to be included.
       **/
      OldUncle: AugmentedError<ApiType>;
      /**
       * The uncle is too high in chain.
       **/
      TooHighUncle: AugmentedError<ApiType>;
      /**
       * Too many uncles.
       **/
      TooManyUncles: AugmentedError<ApiType>;
      /**
       * The uncle is already included.
       **/
      UncleAlreadyIncluded: AugmentedError<ApiType>;
      /**
       * Uncles already set in the block.
       **/
      UnclesAlreadySet: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    bridge: {
      /**
       * Target application not found.
       **/
      AppNotFound: AugmentedError<ApiType>;
      /**
       * Updated AppId is the same as current
       **/
      DifferentAppIdRequired: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    bridgedAsset: {
      /**
       * Free balance got underflowed after burning.
       **/
      FreeBurningUnderflow: AugmentedError<ApiType>;
      /**
       * Free balance got overflowed after minting.
       **/
      FreeMintingOverflow: AugmentedError<ApiType>;
      /**
       * Free balance got overflowed after transfer.
       **/
      FreeTransferOverflow: AugmentedError<ApiType>;
      InsufficientBalance: AugmentedError<ApiType>;
      /**
       * Total issuance got underflowed after burning.
       **/
      TotalBurningUnderflow: AugmentedError<ApiType>;
      /**
       * Total issuance got overflowed after minting.
       **/
      TotalMintingOverflow: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    council: {
      /**
       * Members are already initialized!
       **/
      AlreadyInitialized: AugmentedError<ApiType>;
      /**
       * Duplicate proposals not allowed
       **/
      DuplicateProposal: AugmentedError<ApiType>;
      /**
       * Duplicate vote ignored
       **/
      DuplicateVote: AugmentedError<ApiType>;
      /**
       * Account is not a member
       **/
      NotMember: AugmentedError<ApiType>;
      /**
       * Proposal must exist
       **/
      ProposalMissing: AugmentedError<ApiType>;
      /**
       * The close call was made too early, before the end of the voting.
       **/
      TooEarly: AugmentedError<ApiType>;
      /**
       * There can only be a maximum of `MaxProposals` active proposals.
       **/
      TooManyProposals: AugmentedError<ApiType>;
      /**
       * Mismatched index
       **/
      WrongIndex: AugmentedError<ApiType>;
      /**
       * The given length bound for the proposal was too low.
       **/
      WrongProposalLength: AugmentedError<ApiType>;
      /**
       * The given weight bound for the proposal was too low.
       **/
      WrongProposalWeight: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    crowdloan: {
      /**
       * User trying to associate a native identity with a relay chain identity for posterior
       * reward claiming provided an already associated relay chain identity
       **/
      AlreadyAssociated: AugmentedError<ApiType>;
      /**
       * Trying to introduce a batch that goes beyond the limits of the funds
       **/
      BatchBeyondFundPot: AugmentedError<ApiType>;
      /**
       * The mint operation during claim has resulted in err.
       * This is expected when claiming less than existential desposit on a non-existent account
       * Please consider waiting until the EndVestingBlock to attempt this
       **/
      ClaimingLessThanED: AugmentedError<ApiType>;
      /**
       * First claim already done
       **/
      FirstClaimAlreadyDone: AugmentedError<ApiType>;
      /**
       * User submitted an unsifficient number of proofs to change the reward address
       **/
      InsufficientNumberOfValidProofs: AugmentedError<ApiType>;
      /**
       * User trying to associate a native identity with a relay chain identity for posterior
       * reward claiming provided a wrong signature
       **/
      InvalidClaimSignature: AugmentedError<ApiType>;
      /**
       * User trying to claim the first free reward provided the wrong signature
       **/
      InvalidFreeClaimSignature: AugmentedError<ApiType>;
      /**
       * User trying to claim an award did not have an claim associated with it. This may mean
       * they did not contribute to the crowdloan, or they have not yet associated a native id
       * with their contribution
       **/
      NoAssociatedClaim: AugmentedError<ApiType>;
      /**
       * User provided a signature from a non-contributor relay account
       **/
      NonContributedAddressProvided: AugmentedError<ApiType>;
      /**
       * The contribution is not high enough to be eligible for rewards
       **/
      RewardNotHighEnough: AugmentedError<ApiType>;
      /**
       * User trying to claim rewards has already claimed all rewards associated with its
       * identity and contribution
       **/
      RewardsAlreadyClaimed: AugmentedError<ApiType>;
      /**
       * Rewards should match funds of the pallet
       **/
      RewardsDoNotMatchFund: AugmentedError<ApiType>;
      /**
       * Reward vec has already been initialized
       **/
      RewardVecAlreadyInitialized: AugmentedError<ApiType>;
      /**
       * Reward vec has not yet been fully initialized
       **/
      RewardVecNotFullyInitializedYet: AugmentedError<ApiType>;
      /**
       * Initialize_reward_vec received too many contributors
       **/
      TooManyContributors: AugmentedError<ApiType>;
      /**
       * Provided vesting period is not valid
       **/
      VestingPeriodNonValid: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    cumulusXcm: {
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    dmpQueue: {
      /**
       * The amount of weight given is possibly not enough for executing the message.
       **/
      OverLimit: AugmentedError<ApiType>;
      /**
       * The message index given is unknown.
       **/
      Unknown: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    elections: {
      /**
       * Duplicated candidate submission.
       **/
      DuplicatedCandidate: AugmentedError<ApiType>;
      /**
       * Candidate does not have enough funds.
       **/
      InsufficientCandidateFunds: AugmentedError<ApiType>;
      /**
       * The renouncing origin presented a wrong `Renouncing` parameter.
       **/
      InvalidRenouncing: AugmentedError<ApiType>;
      /**
       * Prediction regarding replacement after member removal is wrong.
       **/
      InvalidReplacement: AugmentedError<ApiType>;
      /**
       * The provided count of number of votes is incorrect.
       **/
      InvalidVoteCount: AugmentedError<ApiType>;
      /**
       * The provided count of number of candidates is incorrect.
       **/
      InvalidWitnessData: AugmentedError<ApiType>;
      /**
       * Cannot vote with stake less than minimum balance.
       **/
      LowBalance: AugmentedError<ApiType>;
      /**
       * Cannot vote more than maximum allowed.
       **/
      MaximumVotesExceeded: AugmentedError<ApiType>;
      /**
       * Member cannot re-submit candidacy.
       **/
      MemberSubmit: AugmentedError<ApiType>;
      /**
       * Must be a voter.
       **/
      MustBeVoter: AugmentedError<ApiType>;
      /**
       * Not a member.
       **/
      NotMember: AugmentedError<ApiType>;
      /**
       * Must vote for at least one candidate.
       **/
      NoVotes: AugmentedError<ApiType>;
      /**
       * Cannot report self.
       **/
      ReportSelf: AugmentedError<ApiType>;
      /**
       * Runner cannot re-submit candidacy.
       **/
      RunnerUpSubmit: AugmentedError<ApiType>;
      /**
       * Cannot vote more than candidates.
       **/
      TooManyVotes: AugmentedError<ApiType>;
      /**
       * Voter can not pay voting bond.
       **/
      UnableToPayBond: AugmentedError<ApiType>;
      /**
       * Cannot vote when no candidates or members exist.
       **/
      UnableToVote: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    erc20: {
      /**
       * Asset could not be burned
       **/
      BurnFailure: AugmentedError<ApiType>;
      /**
       * Asset ID is invalid.
       **/
      InvalidAssetId: AugmentedError<ApiType>;
      /**
       * The submitted payload could not be decoded.
       **/
      InvalidPayload: AugmentedError<ApiType>;
      /**
       * The recipient address is null/default value
       **/
      NullRecipient: AugmentedError<ApiType>;
      /**
       * Token creation failed
       **/
      TokenCreationFailed: AugmentedError<ApiType>;
      /**
       * Passed amount is too big
       **/
      TooBigAmount: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    eth: {
      /**
       * Asset could not be burned
       **/
      BurnFailure: AugmentedError<ApiType>;
      /**
       * The submitted payload could not be decoded.
       **/
      InvalidPayload: AugmentedError<ApiType>;
      /**
       * Token creation failed
       **/
      TokenCreationFailed: AugmentedError<ApiType>;
      /**
       * Passed amount is too big
       **/
      TooBigAmount: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    ormlXcm: {
      /**
       * The version of the `Versioned` value used is not able to be
       * interpreted.
       **/
      BadVersion: AugmentedError<ApiType>;
      /**
       * The message and destination was recognized as being reachable but
       * the operation could not be completed.
       **/
      SendFailure: AugmentedError<ApiType>;
      /**
       * The message and destination combination was not recognized as being
       * reachable.
       **/
      Unreachable: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    parachainStaking: {
      AlreadyActive: AugmentedError<ApiType>;
      AlreadyDelegatedCandidate: AugmentedError<ApiType>;
      AlreadyOffline: AugmentedError<ApiType>;
      CandidateAlreadyLeaving: AugmentedError<ApiType>;
      CandidateBondBelowMin: AugmentedError<ApiType>;
      CandidateCannotLeaveYet: AugmentedError<ApiType>;
      CandidateDNE: AugmentedError<ApiType>;
      CandidateExists: AugmentedError<ApiType>;
      CandidateNotLeaving: AugmentedError<ApiType>;
      CannotDelegateIfLeaving: AugmentedError<ApiType>;
      CannotGoOnlineIfLeaving: AugmentedError<ApiType>;
      CannotSetBelowMin: AugmentedError<ApiType>;
      DelegationBelowMin: AugmentedError<ApiType>;
      DelegationDNE: AugmentedError<ApiType>;
      DelegatorAlreadyLeaving: AugmentedError<ApiType>;
      DelegatorCannotLeaveYet: AugmentedError<ApiType>;
      DelegatorDNE: AugmentedError<ApiType>;
      DelegatorDNEInDelegatorSet: AugmentedError<ApiType>;
      DelegatorDNEinTopNorBottom: AugmentedError<ApiType>;
      DelegatorExists: AugmentedError<ApiType>;
      DelegatorNotLeaving: AugmentedError<ApiType>;
      ExceedMaxDelegationsPerDelegator: AugmentedError<ApiType>;
      InsufficientBalance: AugmentedError<ApiType>;
      InvalidSchedule: AugmentedError<ApiType>;
      NoWritingSameValue: AugmentedError<ApiType>;
      PendingCandidateRequestAlreadyExists: AugmentedError<ApiType>;
      PendingCandidateRequestNotDueYet: AugmentedError<ApiType>;
      PendingCandidateRequestsDNE: AugmentedError<ApiType>;
      PendingDelegationRequestAlreadyExists: AugmentedError<ApiType>;
      PendingDelegationRequestDNE: AugmentedError<ApiType>;
      PendingDelegationRequestNotDueYet: AugmentedError<ApiType>;
      StakingLiquidityTokenAlreadyListed: AugmentedError<ApiType>;
      StakingLiquidityTokenNotListed: AugmentedError<ApiType>;
      TooLowCandidateCountToLeaveCandidates: AugmentedError<ApiType>;
      TooLowCandidateCountWeightHintCancelLeaveCandidates: AugmentedError<ApiType>;
      TooLowCandidateCountWeightHintJoinCandidates: AugmentedError<ApiType>;
      TooLowCandidateDelegationCountToDelegate: AugmentedError<ApiType>;
      TooLowCurrentStakingLiquidityTokensCount: AugmentedError<ApiType>;
      TooLowDelegationCountToDelegate: AugmentedError<ApiType>;
      TooLowDelegationCountToLeaveDelegators: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    parachainSystem: {
      /**
       * The inherent which supplies the host configuration did not run this block
       **/
      HostConfigurationNotAvailable: AugmentedError<ApiType>;
      /**
       * No code upgrade has been authorized.
       **/
      NothingAuthorized: AugmentedError<ApiType>;
      /**
       * No validation function upgrade is currently scheduled.
       **/
      NotScheduled: AugmentedError<ApiType>;
      /**
       * Attempt to upgrade validation function while existing upgrade pending
       **/
      OverlappingUpgrades: AugmentedError<ApiType>;
      /**
       * Polkadot currently prohibits this parachain from upgrading its validation function
       **/
      ProhibitedByPolkadot: AugmentedError<ApiType>;
      /**
       * The supplied validation function has compiled into a blob larger than Polkadot is
       * willing to run
       **/
      TooBig: AugmentedError<ApiType>;
      /**
       * The given code upgrade has not been authorized.
       **/
      Unauthorized: AugmentedError<ApiType>;
      /**
       * The inherent which supplies the validation data did not run this block
       **/
      ValidationDataNotAvailable: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    polkadotXcm: {
      /**
       * The location is invalid since it already has a subscription from us.
       **/
      AlreadySubscribed: AugmentedError<ApiType>;
      /**
       * The given location could not be used (e.g. because it cannot be expressed in the
       * desired version of XCM).
       **/
      BadLocation: AugmentedError<ApiType>;
      /**
       * The version of the `Versioned` value used is not able to be interpreted.
       **/
      BadVersion: AugmentedError<ApiType>;
      /**
       * Could not re-anchor the assets to declare the fees for the destination chain.
       **/
      CannotReanchor: AugmentedError<ApiType>;
      /**
       * The destination `MultiLocation` provided cannot be inverted.
       **/
      DestinationNotInvertible: AugmentedError<ApiType>;
      /**
       * The assets to be sent are empty.
       **/
      Empty: AugmentedError<ApiType>;
      /**
       * The message execution fails the filter.
       **/
      Filtered: AugmentedError<ApiType>;
      /**
       * Origin is invalid for sending.
       **/
      InvalidOrigin: AugmentedError<ApiType>;
      /**
       * The referenced subscription could not be found.
       **/
      NoSubscription: AugmentedError<ApiType>;
      /**
       * There was some other issue (i.e. not to do with routing) in sending the message. Perhaps
       * a lack of space for buffering the message.
       **/
      SendFailure: AugmentedError<ApiType>;
      /**
       * Too many assets have been attempted for transfer.
       **/
      TooManyAssets: AugmentedError<ApiType>;
      /**
       * The desired destination was unreachable, generally because there is a no way of routing
       * to it.
       **/
      Unreachable: AugmentedError<ApiType>;
      /**
       * The message's weight could not be determined.
       **/
      UnweighableMessage: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    session: {
      /**
       * Registered duplicate key.
       **/
      DuplicatedKey: AugmentedError<ApiType>;
      /**
       * Invalid ownership proof.
       **/
      InvalidProof: AugmentedError<ApiType>;
      /**
       * Key setting account is not live, so it's impossible to associate keys.
       **/
      NoAccount: AugmentedError<ApiType>;
      /**
       * No associated validator ID for account.
       **/
      NoAssociatedValidatorId: AugmentedError<ApiType>;
      /**
       * No keys are associated with this account.
       **/
      NoKeys: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    sudo: {
      /**
       * Sender must be the Sudo account
       **/
      RequireSudo: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    sudoOrigin: {
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    system: {
      /**
       * The origin filter prevent the call to be dispatched.
       **/
      CallFiltered: AugmentedError<ApiType>;
      /**
       * Failed to extract the runtime version from the new runtime.
       * 
       * Either calling `Core_version` or decoding `RuntimeVersion` failed.
       **/
      FailedToExtractRuntimeVersion: AugmentedError<ApiType>;
      /**
       * The name of specification does not match between the current runtime
       * and the new runtime.
       **/
      InvalidSpecName: AugmentedError<ApiType>;
      /**
       * Suicide called when the account has non-default composite data.
       **/
      NonDefaultComposite: AugmentedError<ApiType>;
      /**
       * There is a non-zero reference count preventing the account from being purged.
       **/
      NonZeroRefCount: AugmentedError<ApiType>;
      /**
       * The specification version is not allowed to decrease between the current runtime
       * and the new runtime.
       **/
      SpecVersionNeedsToIncrease: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    tokens: {
      /**
       * Cannot convert Amount into Balance type
       **/
      AmountIntoBalanceFailed: AugmentedError<ApiType>;
      /**
       * The balance is too low
       **/
      BalanceTooLow: AugmentedError<ApiType>;
      /**
       * Beneficiary account must pre-exist
       **/
      DeadAccount: AugmentedError<ApiType>;
      /**
       * Value too low to create account due to existential deposit
       **/
      ExistentialDeposit: AugmentedError<ApiType>;
      /**
       * Transfer/payment would kill account
       **/
      KeepAlive: AugmentedError<ApiType>;
      /**
       * Failed because liquidity restrictions due to locking
       **/
      LiquidityRestrictions: AugmentedError<ApiType>;
      /**
       * Failed because the maximum locks was exceeded
       **/
      MaxLocksExceeded: AugmentedError<ApiType>;
      /**
       * Failed because token with given id does not exits
       **/
      TokenIdNotExists: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    treasury: {
      /**
       * Proposer's balance is too low.
       **/
      InsufficientProposersBalance: AugmentedError<ApiType>;
      /**
       * No proposal or bounty at that index.
       **/
      InvalidIndex: AugmentedError<ApiType>;
      /**
       * Too many approvals in the queue.
       **/
      TooManyApprovals: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    unknownTokens: {
      /**
       * The operation will cause balance to overflow.
       **/
      BalanceOverflow: AugmentedError<ApiType>;
      /**
       * The balance is too low.
       **/
      BalanceTooLow: AugmentedError<ApiType>;
      /**
       * Unhandled asset.
       **/
      UnhandledAsset: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    verifier: {
      /**
       * The message failed verification.
       **/
      Invalid: AugmentedError<ApiType>;
      /**
       * Verification scheme is not supported.
       **/
      NotSupported: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    vesting: {
      /**
       * Amount being transferred is too low to create a vesting schedule.
       **/
      AmountLow: AugmentedError<ApiType>;
      /**
       * The account already has `MaxVestingSchedules` count of schedules and thus
       * cannot add another one. Consider merging existing schedules in order to add another.
       **/
      AtMaxVestingSchedules: AugmentedError<ApiType>;
      /**
       * Failed to create a new schedule because some parameter was invalid.
       **/
      InvalidScheduleParams: AugmentedError<ApiType>;
      /**
       * The account given is not vesting.
       **/
      NotVesting: AugmentedError<ApiType>;
      /**
       * An index was out of bounds of the vesting schedules.
       **/
      ScheduleIndexOutOfBounds: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    xcmpQueue: {
      /**
       * Bad overweight index.
       **/
      BadOverweightIndex: AugmentedError<ApiType>;
      /**
       * Bad XCM data.
       **/
      BadXcm: AugmentedError<ApiType>;
      /**
       * Bad XCM origin.
       **/
      BadXcmOrigin: AugmentedError<ApiType>;
      /**
       * Failed to send XCM message.
       **/
      FailedToSend: AugmentedError<ApiType>;
      /**
       * Provided weight is possibly not enough to execute the message.
       **/
      WeightOverLimit: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    xTokens: {
      /**
       * Asset has no reserve location.
       **/
      AssetHasNoReserve: AugmentedError<ApiType>;
      /**
       * The specified index does not exist in a MultiAssets struct
       **/
      AssetIndexNonExistent: AugmentedError<ApiType>;
      /**
       * The version of the `Versioned` value used is not able to be
       * interpreted.
       **/
      BadVersion: AugmentedError<ApiType>;
      /**
       * Could not re-anchor the assets to declare the fees for the
       * destination chain.
       **/
      CannotReanchor: AugmentedError<ApiType>;
      /**
       * The destination `MultiLocation` provided cannot be inverted.
       **/
      DestinationNotInvertible: AugmentedError<ApiType>;
      /**
       * We tried sending distinct asset and fee but they have different
       * reserve chains
       **/
      DistinctReserveForAssetAndFee: AugmentedError<ApiType>;
      /**
       * The fee amount was zero when the fee specification extrinsic is
       * being used.
       **/
      FeeCannotBeZero: AugmentedError<ApiType>;
      /**
       * Could not get ancestry of asset reserve location.
       **/
      InvalidAncestry: AugmentedError<ApiType>;
      /**
       * Invalid transfer destination.
       **/
      InvalidDest: AugmentedError<ApiType>;
      /**
       * Not cross-chain transfer.
       **/
      NotCrossChainTransfer: AugmentedError<ApiType>;
      /**
       * Currency is not cross-chain transferable.
       **/
      NotCrossChainTransferableCurrency: AugmentedError<ApiType>;
      /**
       * Not fungible asset.
       **/
      NotFungible: AugmentedError<ApiType>;
      /**
       * The number of assets to be sent is over the maximum
       **/
      TooManyAssetsBeingSent: AugmentedError<ApiType>;
      /**
       * The message's weight could not be determined.
       **/
      UnweighableMessage: AugmentedError<ApiType>;
      /**
       * XCM execution failed.
       **/
      XcmExecutionFailed: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    xyk: {
      /**
       * Asset already exists
       **/
      AssetAlreadyExists: AugmentedError<ApiType>;
      /**
       * Asset does not exists
       **/
      AssetDoesNotExists: AugmentedError<ApiType>;
      /**
       * Division by zero
       **/
      DivisionByZero: AugmentedError<ApiType>;
      /**
       * Insufficient input amount
       **/
      InsufficientInputAmount: AugmentedError<ApiType>;
      /**
       * Insufficient output amount
       **/
      InsufficientOutputAmount: AugmentedError<ApiType>;
      /**
       * Liquidity token cretion failed
       **/
      LiquidityTokenCreationFailed: AugmentedError<ApiType>;
      /**
       * Math overflow
       **/
      MathOverflow: AugmentedError<ApiType>;
      /**
       * No such liquidity asset exists
       **/
      NoSuchLiquidityAsset: AugmentedError<ApiType>;
      /**
       * No such pool exists
       **/
      NoSuchPool: AugmentedError<ApiType>;
      /**
       * Not enought assets
       **/
      NotEnoughAssets: AugmentedError<ApiType>;
      /**
       * Not enought reserve
       **/
      NotEnoughReserve: AugmentedError<ApiType>;
      NotEnoughtRewardsEarned: AugmentedError<ApiType>;
      /**
       * Unexpected failure
       **/
      NotMangataLiquidityAsset: AugmentedError<ApiType>;
      /**
       * Pool already Exists
       **/
      PoolAlreadyExists: AugmentedError<ApiType>;
      /**
       * Asset ids cannot be the same
       **/
      SameAsset: AugmentedError<ApiType>;
      /**
       * Second asset amount exceeded expectations
       **/
      SecondAssetAmountExceededExpectations: AugmentedError<ApiType>;
      /**
       * Unexpected failure
       **/
      UnexpectedFailure: AugmentedError<ApiType>;
      /**
       * Zero amount is not supported
       **/
      ZeroAmount: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
  } // AugmentedErrors
} // declare module
