import { ReputationSimulator } from "./reputation-simulator.js";
import { setNetworkId } from "@midnight-ntwrk/midnight-js-network-id";
import { describe, it, expect } from "vitest";

setNetworkId("undeployed");

describe("Reputation smart contract", () => {
  it("generates initial ledger state deterministically", () => {
    const simulator0 = new ReputationSimulator();
    const simulator1 = new ReputationSimulator();
    expect(simulator0.getLedger().public_average).toEqual(simulator1.getLedger().public_average);
  });

  it("properly initializes ledger state and private state", () => {
    const simulator = new ReputationSimulator();
    const initialLedgerState = simulator.getLedger();
    expect(initialLedgerState.public_average).toEqual(0n);
    expect(initialLedgerState.review_count).toEqual(0n);
    const initialPrivateState = simulator.getPrivateState();
    expect(initialPrivateState.totalRatingSum).toEqual(0n);
    expect(initialPrivateState.ratingCount).toEqual(0n);
  });

  it("posts and aggregates a review correctly", () => {
    const simulator = new ReputationSimulator();
    const rating = 5;
    const saltHex = "00".repeat(31) + "01";
    const saltBytes = Uint8Array.from(Buffer.from(saltHex, 'hex'));
    const commitment = saltBytes;

    simulator.getPrivateState().pendingReviews.push({
        rating: rating,
        salt: saltHex,
        commitment: saltHex
    });

    simulator.postReview(commitment);
    expect(simulator.getLedger().review_commitments.lookup(commitment)).toBe(true);

    simulator.aggregateReview(commitment);
    expect(simulator.getLedger().review_commitments.lookup(commitment)).toBe(false);
    expect(simulator.getPrivateState().ratingCount).toEqual(1n);
    expect(simulator.getPrivateState().totalRatingSum).toEqual(BigInt(rating));

    simulator.publishReputation();
    expect(simulator.getLedger().public_average).toEqual(BigInt(rating));
    expect(simulator.getLedger().review_count).toEqual(1n);
  });

  it("prevents double aggregation", () => {
    const simulator = new ReputationSimulator();
    const rating = 5;
    const saltHex = "00".repeat(31) + "02";
    const saltBytes = Uint8Array.from(Buffer.from(saltHex, 'hex'));
    const commitment = saltBytes;

    simulator.getPrivateState().pendingReviews.push({
        rating: rating,
        salt: saltHex,
        commitment: saltHex
    });

    simulator.postReview(commitment);
    simulator.aggregateReview(commitment);
    expect(simulator.getPrivateState().ratingCount).toEqual(1n);

    // Second aggregation attempt for same commitment
    simulator.aggregateReview(commitment);
    expect(simulator.getPrivateState().ratingCount).toEqual(1n); // Should NOT have increased
  });
});
