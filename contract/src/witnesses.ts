import { Buffer } from 'buffer';

export type ReputationPrivateState = {
  totalRatingSum: bigint;
  ratingCount: bigint;
  pendingReviews: { rating: number; salt: string; commitment: string }[];
};

export const witnesses: any = {
  aggregate_review_witness: (context: any, commitment: Uint8Array) => {
    const ps = context.privateState;
    const commitmentHex = Buffer.from(commitment).toString('hex');

    console.log("aggregate_review_witness input commitment:", commitmentHex);

    const review = ps.pendingReviews.find(
      (r: any) => r.commitment === commitmentHex
    );

    if (!review) {
      throw new Error("Review not found for commitment: " + commitmentHex);
    }

    const result = {
      rating: BigInt(review.rating),
      salt: Uint8Array.from(Buffer.from(review.commitment, 'hex'))
    };

    console.log("aggregate_review_witness output:", result);

    return [
      context.privateState,
      result
    ];
  },

  sum_witness: (context: any) => {
    return [
      context.privateState,
      context.privateState.totalRatingSum
    ];
  },

  count_witness: (context: any) => {
    return [
      context.privateState,
      context.privateState.ratingCount
    ];
  },

  update_sum_witness: (context: any, new_sum: bigint) => {
    return [
      {
        ...context.privateState,
        totalRatingSum: new_sum
      },
      []
    ];
  },

  update_count_witness: (context: any, new_count: bigint) => {
    return [
      {
        ...context.privateState,
        ratingCount: new_count
      },
      []
    ];
  }
};