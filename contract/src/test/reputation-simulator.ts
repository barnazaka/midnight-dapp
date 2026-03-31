import {
  type CircuitContext,
  sampleContractAddress,
  createConstructorContext,
  createCircuitContext
} from "@midnight-ntwrk/compact-runtime";
import {
  Contract,
  type Ledger,
  ledger
} from "../managed/reputation/contract/index.js";
import { type ReputationPrivateState, witnesses } from "../witnesses.js";

export class ReputationSimulator {
  readonly contract: Contract<ReputationPrivateState>;
  circuitContext: CircuitContext<ReputationPrivateState>;

  constructor() {
    this.contract = new Contract<ReputationPrivateState>(witnesses);
    const {
      currentPrivateState,
      currentContractState,
      currentZswapLocalState
    } = this.contract.initialState(
      createConstructorContext({
          totalRatingSum: 0n,
          ratingCount: 0n,
          pendingReviews: []
      }, "0".repeat(64))
    );
    this.circuitContext = createCircuitContext(
      sampleContractAddress(),
      currentZswapLocalState,
      currentContractState,
      currentPrivateState
    );
  }

  public getLedger(): Ledger {
    return ledger(this.circuitContext.currentQueryContext.state);
  }

  public getPrivateState(): ReputationPrivateState {
    return this.circuitContext.currentPrivateState;
  }

  public postReview(commitment: Uint8Array): Ledger {
    this.circuitContext = this.contract.impureCircuits.post_review(
      this.circuitContext,
      commitment
    ).context;
    return ledger(this.circuitContext.currentQueryContext.state);
  }

  public aggregateReview(commitment: Uint8Array): Ledger {
    this.circuitContext = this.contract.impureCircuits.aggregate_review(
      this.circuitContext,
      commitment
    ).context;
    return ledger(this.circuitContext.currentQueryContext.state);
  }

  public publishReputation(): Ledger {
    this.circuitContext = this.contract.impureCircuits.publish_reputation(
      this.circuitContext
    ).context;
    return ledger(this.circuitContext.currentQueryContext.state);
  }

  public initialize(): Ledger {
    this.circuitContext = this.contract.impureCircuits.initialize(
      this.circuitContext
    ).context;
    return ledger(this.circuitContext.currentQueryContext.state);
  }
}
