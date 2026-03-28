import { Reputation, type ReputationPrivateState } from '@midnight-ntwrk/reputation-contract';
import type { MidnightProviders } from '@midnight-ntwrk/midnight-js-types';
import type { DeployedContract, FoundContract } from '@midnight-ntwrk/midnight-js-contracts';
import type { ImpureCircuitId } from '@midnight-ntwrk/compact-js';

export type ReputationCircuits = ImpureCircuitId<Reputation.Contract<ReputationPrivateState>>;

export const ReputationPrivateStateId = 'reputationPrivateState';

export type ReputationProviders = MidnightProviders<ReputationCircuits, typeof ReputationPrivateStateId, ReputationPrivateState>;

export type ReputationContract = Reputation.Contract<ReputationPrivateState>;

export type DeployedReputationContract = DeployedContract<ReputationContract> | FoundContract<ReputationContract>;
