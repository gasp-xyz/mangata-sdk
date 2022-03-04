// Auto-generated via `yarn polkadot-types-from-chain`, do not edit
/* eslint-disable */

import type { ApiTypes } from '@polkadot/api-base/types';
import type { Bytes, Option, U8aFixed, Vec, u128, u16, u32, u64, u8 } from '@polkadot/types-codec';
import type { Codec } from '@polkadot/types-codec/types';
import type { AccountId32, Perbill, Permill } from '@polkadot/types/interfaces/runtime';
import type { FrameSupportPalletId, FrameSupportWeightsRuntimeDbWeight, FrameSupportWeightsWeightToFeeCoefficient, FrameSystemLimitsBlockLength, FrameSystemLimitsBlockWeights, SpVersionRuntimeVersion, XcmV1MultiLocation } from '@polkadot/types/lookup';

declare module '@polkadot/api-base/types/consts' {
  export interface AugmentedConsts<ApiType extends ApiTypes> {
    assetRegistry: {
      treasuryAddress: AccountId32 & AugmentedConst<ApiType>;
      /**
       * Generic const
       **/
      [key: string]: Codec;
    };
    authorship: {
      /**
       * The number of blocks back we should accept uncles.
       * This means that we will deal with uncle-parents that are
       * `UncleGenerations + 1` before `now`.
       **/
      uncleGenerations: u32 & AugmentedConst<ApiType>;
      /**
       * Generic const
       **/
      [key: string]: Codec;
    };
    crowdloan: {
      /**
       * Percentage to be payed at initialization
       **/
      initializationPayment: Perbill & AugmentedConst<ApiType>;
      maxInitContributors: u32 & AugmentedConst<ApiType>;
      /**
       * MGA token Id
       **/
      nativeTokenId: u32 & AugmentedConst<ApiType>;
      /**
       * A fraction representing the percentage of proofs
       * that need to be presented to change a reward address through the relay keys
       **/
      rewardAddressRelayVoteThreshold: Perbill & AugmentedConst<ApiType>;
      /**
       * Network Identifier to be appended into the signatures for reward address change/association
       * Prevents replay attacks from one network to the other
       **/
      signatureNetworkIdentifier: Bytes & AugmentedConst<ApiType>;
      /**
       * Generic const
       **/
      [key: string]: Codec;
    };
    elections: {
      /**
       * How much should be locked up in order to submit one's candidacy.
       **/
      candidacyBond: u128 & AugmentedConst<ApiType>;
      /**
       * Number of members to elect.
       **/
      desiredMembers: u32 & AugmentedConst<ApiType>;
      /**
       * Number of runners_up to keep.
       **/
      desiredRunnersUp: u32 & AugmentedConst<ApiType>;
      /**
       * Identifier for the elections-phragmen pallet's lock
       **/
      palletId: U8aFixed & AugmentedConst<ApiType>;
      /**
       * How long each seat is kept. This defines the next block number at which an election
       * round will happen. If set to zero, no elections are ever triggered and the module will
       * be in passive mode.
       **/
      termDuration: u32 & AugmentedConst<ApiType>;
      /**
       * Base deposit associated with voting.
       * 
       * This should be sensibly high to economically ensure the pallet cannot be attacked by
       * creating a gigantic number of votes.
       **/
      votingBondBase: u128 & AugmentedConst<ApiType>;
      /**
       * The amount of bond that need to be locked for each vote (32 bytes).
       **/
      votingBondFactor: u128 & AugmentedConst<ApiType>;
      /**
       * Generic const
       **/
      [key: string]: Codec;
    };
    issuance: {
      /**
       * Number of blocks per session/round
       **/
      blocksPerRound: u32 & AugmentedConst<ApiType>;
      /**
       * The account id that holds the liquidity mining issuance
       **/
      crowdloanIssuanceVault: AccountId32 & AugmentedConst<ApiType>;
      /**
       * Number of sessions to store issuance history for
       **/
      historyLimit: u32 & AugmentedConst<ApiType>;
      /**
       * The account id that holds the liquidity mining issuance
       **/
      liquidityMiningIssuanceVault: AccountId32 & AugmentedConst<ApiType>;
      /**
       * The account id that holds the liquidity mining issuance
       **/
      stakingIssuanceVault: AccountId32 & AugmentedConst<ApiType>;
      /**
       * Generic const
       **/
      [key: string]: Codec;
    };
    parachainStaking: {
      /**
       * Default number of blocks per round at genesis
       **/
      blocksPerRound: u32 & AugmentedConst<ApiType>;
      /**
       * Number of rounds that candidate requests to adjust self-bond must wait to be executable
       **/
      candidateBondDelay: u32 & AugmentedConst<ApiType>;
      /**
       * Default commission due to collators, is `CollatorCommission` storage value in genesis
       **/
      defaultCollatorCommission: Perbill & AugmentedConst<ApiType>;
      /**
       * Number of rounds that delegation {more, less} requests must wait before executable
       **/
      delegationBondDelay: u32 & AugmentedConst<ApiType>;
      /**
       * Number of rounds that candidates remain bonded before exit request is executable
       **/
      leaveCandidatesDelay: u32 & AugmentedConst<ApiType>;
      /**
       * Number of rounds that delegators remain bonded before exit request is executable
       **/
      leaveDelegatorsDelay: u32 & AugmentedConst<ApiType>;
      /**
       * Maximum delegations per delegator
       **/
      maxDelegationsPerDelegator: u32 & AugmentedConst<ApiType>;
      /**
       * Maximum delegators counted per candidate
       **/
      maxDelegatorsPerCandidate: u32 & AugmentedConst<ApiType>;
      /**
       * Minimum stake required for any account to be a collator candidate
       **/
      minCandidateStk: u128 & AugmentedConst<ApiType>;
      /**
       * Minimum stake required for any candidate to be in `SelectedCandidates` for the round
       **/
      minCollatorStk: u128 & AugmentedConst<ApiType>;
      /**
       * Minimum stake for any registered on-chain account to delegate
       **/
      minDelegation: u128 & AugmentedConst<ApiType>;
      /**
       * Minimum number of selected candidates every round
       **/
      minSelectedCandidates: u32 & AugmentedConst<ApiType>;
      /**
       * The native token used for payouts
       **/
      nativeTokenId: u32 & AugmentedConst<ApiType>;
      /**
       * Number of rounds that delegations remain bonded before revocation request is executable
       **/
      revokeDelegationDelay: u32 & AugmentedConst<ApiType>;
      /**
       * Number of rounds after which block authors are rewarded
       **/
      rewardPaymentDelay: u32 & AugmentedConst<ApiType>;
      /**
       * The account id that holds the liquidity mining issuance
       **/
      stakingIssuanceVault: AccountId32 & AugmentedConst<ApiType>;
      /**
       * Generic const
       **/
      [key: string]: Codec;
    };
    system: {
      /**
       * Maximum number of block number to block hash mappings to keep (oldest pruned first).
       **/
      blockHashCount: u32 & AugmentedConst<ApiType>;
      /**
       * The maximum length of a block (in bytes).
       **/
      blockLength: FrameSystemLimitsBlockLength & AugmentedConst<ApiType>;
      /**
       * Block & extrinsics weights: base values and limits.
       **/
      blockWeights: FrameSystemLimitsBlockWeights & AugmentedConst<ApiType>;
      /**
       * The weight of runtime database operations the runtime can invoke.
       **/
      dbWeight: FrameSupportWeightsRuntimeDbWeight & AugmentedConst<ApiType>;
      /**
       * The designated SS85 prefix of this chain.
       * 
       * This replaces the "ss58Format" property declared in the chain spec. Reason is
       * that the runtime should know about the prefix in order to make use of it as
       * an identifier of the chain.
       **/
      ss58Prefix: u16 & AugmentedConst<ApiType>;
      /**
       * Get the chain's current version.
       **/
      version: SpVersionRuntimeVersion & AugmentedConst<ApiType>;
      /**
       * Generic const
       **/
      [key: string]: Codec;
    };
    timestamp: {
      /**
       * The minimum period between blocks. Beware that this is different to the *expected*
       * period that the block production apparatus provides. Your chosen consensus system will
       * generally work with this to determine a sensible block time. e.g. For Aura, it will be
       * double this period on default settings.
       **/
      minimumPeriod: u64 & AugmentedConst<ApiType>;
      /**
       * Generic const
       **/
      [key: string]: Codec;
    };
    tokens: {
      maxLocks: u32 & AugmentedConst<ApiType>;
      /**
       * Generic const
       **/
      [key: string]: Codec;
    };
    transactionPayment: {
      /**
       * A fee mulitplier for `Operational` extrinsics to compute "virtual tip" to boost their
       * `priority`
       * 
       * This value is multipled by the `final_fee` to obtain a "virtual tip" that is later
       * added to a tip component in regular `priority` calculations.
       * It means that a `Normal` transaction can front-run a similarly-sized `Operational`
       * extrinsic (with no tip), by including a tip value greater than the virtual tip.
       * 
       * ```rust,ignore
       * // For `Normal`
       * let priority = priority_calc(tip);
       * 
       * // For `Operational`
       * let virtual_tip = (inclusion_fee + tip) * OperationalFeeMultiplier;
       * let priority = priority_calc(tip + virtual_tip);
       * ```
       * 
       * Note that since we use `final_fee` the multiplier applies also to the regular `tip`
       * sent with the transaction. So, not only does the transaction get a priority bump based
       * on the `inclusion_fee`, but we also amplify the impact of tips applied to `Operational`
       * transactions.
       **/
      operationalFeeMultiplier: u8 & AugmentedConst<ApiType>;
      /**
       * The fee to be paid for making a transaction; the per-byte portion.
       **/
      transactionByteFee: u128 & AugmentedConst<ApiType>;
      /**
       * The polynomial that is applied in order to derive fee from weight.
       **/
      weightToFee: Vec<FrameSupportWeightsWeightToFeeCoefficient> & AugmentedConst<ApiType>;
      /**
       * Generic const
       **/
      [key: string]: Codec;
    };
    treasury: {
      /**
       * Percentage of spare funds (if any) that are burnt per spend period.
       **/
      burn: Permill & AugmentedConst<ApiType>;
      /**
       * The maximum number of approvals that can wait in the spending queue.
       **/
      maxApprovals: u32 & AugmentedConst<ApiType>;
      /**
       * The treasury's pallet id, used for deriving its sovereign account ID.
       **/
      palletId: FrameSupportPalletId & AugmentedConst<ApiType>;
      /**
       * Fraction of a proposal's value that should be bonded in order to place the proposal.
       * An accepted proposal gets these back. A rejected proposal does not.
       **/
      proposalBond: Permill & AugmentedConst<ApiType>;
      /**
       * Maximum amount of funds that should be placed in a deposit for making a proposal.
       **/
      proposalBondMaximum: Option<u128> & AugmentedConst<ApiType>;
      /**
       * Minimum amount of funds that should be placed in a deposit for making a proposal.
       **/
      proposalBondMinimum: u128 & AugmentedConst<ApiType>;
      /**
       * Period between successive spends.
       **/
      spendPeriod: u32 & AugmentedConst<ApiType>;
      /**
       * Generic const
       **/
      [key: string]: Codec;
    };
    vesting: {
      maxVestingSchedules: u32 & AugmentedConst<ApiType>;
      /**
       * The minimum amount transferred to call `vested_transfer`.
       **/
      minVestedTransfer: u128 & AugmentedConst<ApiType>;
      /**
       * Generic const
       **/
      [key: string]: Codec;
    };
    xTokens: {
      /**
       * Base XCM weight.
       * 
       * The actually weight for an XCM message is `T::BaseXcmWeight +
       * T::Weigher::weight(&msg)`.
       **/
      baseXcmWeight: u64 & AugmentedConst<ApiType>;
      /**
       * Self chain location.
       **/
      selfLocation: XcmV1MultiLocation & AugmentedConst<ApiType>;
      /**
       * Generic const
       **/
      [key: string]: Codec;
    };
  } // AugmentedConsts
} // declare module
