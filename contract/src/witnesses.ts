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
    const review = ps.pendingReviews.find((r: any) => r.commitment === commitmentHex);
    if (!review) throw new Error("Review not found for commitment: " + commitmentHex);
    return [
      context.privateState,
      {
        rating: BigInt(review.rating),
        salt: Uint8Array.from(Buffer.from(review.salt, 'hex')),
      }
    ];
  },
  sum_witness: (context: any) => [context.privateState, context.privateState.totalRatingSum],
  count_witness: (context: any) => [context.privateState, context.privateState.ratingCount],
  update_sum_witness: (context: any, new_sum: bigint) => [
    {
      ...context.privateState,
      totalRatingSum: new_sum,
    },
    []
  ],
  update_count_witness: (context: any, new_count: bigint) => [
    {
      ...context.privateState,
      ratingCount: new_count,
    },
    []
  ],
};
