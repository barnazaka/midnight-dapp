# Private Reputation System DApp

This project is built on the [Midnight Network](https://midnight.network/).

A privacy-preserving reputation system where users can submit feedback for developers without revealing individual ratings.

## Core Features

- **Private Feedback**: Users submit ratings as commitments.
- **Selective Disclosure**: Developers aggregate feedback privately and only publish the final average.
- **Zero-Knowledge Proofs**: Prove reputation scores without disclosing the underlying reviews.

## Project Structure

```
private-reputation-system/
├── contract/                          # Smart contract (Compact language)
│   ├── src/reputation.compact         # The reputation smart contract
│   └── src/test/                      # Contract unit tests
└── reputation-cli/                    # Command-line interface
    ├── src/                           # CLI implementation
    ├── proof-server.yml               # Proof server Docker config
    └── standalone.yml                 # Full local stack Docker config
```

## Prerequisites

- [Node.js v22.15+](https://nodejs.org/)
- [Docker](https://docs.google.com/get-docker/) with `docker compose`
- [Compact Developer Tools](https://docs.midnight.network/compact/tooling)

## Quick Start (Preprod)

### 1. Install dependencies

```bash
npm install
```

### 2. Build the smart contract

```bash
cd contract
npm run compact
npm run build
```

### 3. Run the DApp

```bash
cd reputation-cli
npm run preprod-ps
```

## Usage Flow

1.  **Create/Restore Wallet**: Set up your Midnight wallet.
2.  **Fund Wallet**: Get tNight from the [Preprod faucet](https://faucet.preprod.midnight.network).
3.  **Deploy Contract**: Deploy your personal reputation contract.
4.  **Submit Review**: Users submit a rating (0-255).
5.  **Aggregate Review**: Developer processes the pending reviews privately.
6.  **Publish Reputation**: Disclose the calculated average reputation to the public ledger.
7.  **Display Reputation**: View the current public score and review count.
