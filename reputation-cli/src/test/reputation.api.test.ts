import { type WalletContext } from '../api.js';
import path from 'path';
import * as api from '../api.js';
import { type ReputationProviders } from '../common-types.js';
import { currentDir } from '../config.js';
import { createLogger } from '../logger-utils.js';
import { TestEnvironment } from './commons.js';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

const logDir = path.resolve(currentDir, '..', 'logs', 'tests', `${new Date().toISOString()}.log`);
const logger = await createLogger(logDir);

describe('API', () => {
  let testEnvironment: TestEnvironment;
  let walletCtx: WalletContext;
  let providers: ReputationProviders;

  beforeAll(
    async () => {
      api.setLogger(logger);
      testEnvironment = new TestEnvironment(logger);
      const testConfiguration = await testEnvironment.start();
      walletCtx = await testEnvironment.getWallet();
      providers = await api.configureProviders(walletCtx, testConfiguration.dappConfig);
    },
    1000 * 60 * 45,
  );

  afterAll(async () => {
    await testEnvironment.shutdown();
  });

  it('should deploy the contract and submit a review [@slow]', async () => {
    const reputationContract = await api.deploy(providers, {
        totalRatingSum: 0n,
        ratingCount: 0n,
        pendingReviews: []
    });
    expect(reputationContract).not.toBeNull();

    const state = await api.displayReputationValue(providers, reputationContract);
    expect(state.reputationState?.reviewCount).toEqual(BigInt(0));

    await new Promise((resolve) => setTimeout(resolve, 2000));
    const commitment = "0".repeat(64);
    const response = await api.postReview(reputationContract, commitment);
    expect(response.txHash).toMatch(/[0-9a-f]{64}/);
    expect(response.blockHeight).toBeGreaterThan(BigInt(0));
  });
});
