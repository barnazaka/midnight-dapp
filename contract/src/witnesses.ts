import { Buffer } from 'buffer';

export type ReputationPrivateState = {
  totalRatingSum: bigint;
  ratingCount: bigint;
  // This is for the developer to store the ratings and salts they have received
  // to be able to aggregate them later.
  pendingReviews: { rating: number; salt: string; commitment: string }[];
};

export const witnesses: any = {
  aggregate_review_witness: (context: any, commitment: Uint8Array) => {
    const ps = context.privateState;
    const commitmentHex = Buffer.from(commitment).toString('hex');
    console.log(`[Witness] aggregate_review_witness for: ${commitmentHex}`);

    const review = ps.pendingReviews.find((r: any) => r.commitment === commitmentHex);
    if (!review) {
        throw new Error("Review not found for commitment: " + commitmentHex);
    }

    const result = {
      rating: BigInt(review.rating),
      salt: Uint8Array.from(Buffer.from(review.salt, 'hex')),
    };

    return [context.privateState, result];
  },
  sum_witness: (context: any) => {
    console.log(`[Witness] sum_witness: ${context.privateState.totalRatingSum}`);
    return [context.privateState, context.privateState.totalRatingSum];
  },
  count_witness: (context: any) => {
    console.log(`[Witness] count_witness: ${context.privateState.ratingCount}`);
    return [context.privateState, context.privateState.ratingCount];
  },
  update_sum_witness: (context: any, new_sum: bigint) => {
    console.log(`[Witness] update_sum_witness: ${new_sum}`);
    return [
      {
        ...context.privateState,
        totalRatingSum: new_sum,
      },
      []
    ];
  },
  update_count_witness: (context: any, new_count: bigint) => {
    console.log(`[Witness] update_count_witness: ${new_count}`);
    return [
      {
        ...context.privateState,
        ratingCount: new_count,
      },
      []
    ];
  },
};
