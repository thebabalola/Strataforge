# StrataForge No-Code Token Platform — Hardhat Smart Contracts

Transform your vision into digital assets—without writing code. StrataForge empowers creators, entrepreneurs, and businesses to mint NFTs and launch tokens in minutes, with zero technical knowledge required.

## Project Overview

This repository contains the smart contracts and deployment scripts powering the StrataForge no-code platform. Our unified solution enables users to deploy multiple token standards, manage campaigns, and handle whitelists—all without blockchain development expertise.

### Key Features

- **One-Click Token Deployment:**  
  Deploy ERC-20, ERC-721, and ERC-1155 tokens with just a few clicks. No coding required.

- **Campaign Management:**  
  Create, manage, and track airdrops and marketing campaigns with integrated tools.

- **Whitelist Management:**  
  Easily manage token distribution using CSV uploads, manual address addition, and wallet verification.

- **Specialized Token Templates:**  
  Ready-to-deploy memecoin and stablecoin contracts, featuring anti-whale mechanisms and collateralization.

- **Drag & Drop Simplicity:**  
  Build NFT collections and launch tokens with a visual editor. Upload art, set parameters, and go live in under 10 minutes.

- **Complete Web3 Ecosystem:**  
  Manage the entire token lifecycle—from creation to airdrops and campaigns—in one platform.

## Smart Contract Folder Structure

- `contracts/`  
  Contains Solidity smart contracts for token standards (ERC-20, ERC-721, ERC-1155), campaign management, whitelisting, and specialized templates (memecoin, stablecoin).

- `test/`  
  Automated tests for all contracts using Hardhat and Chai.

- `ignition/`  
  Hardhat Ignition modules for streamlined deployment.

- `artifacts/`  
  Compiled contract artifacts.

- `typechain-types/`  
  TypeScript typings for contracts.

- `hardhat.config.ts`  
  Hardhat configuration, including Core Blockchain Testnet settings.

## Supported Networks

- **Core Blockchain Testnet (ERC-1155 deployed)**
- Base Sepolia (configurable)
- Local Hardhat Network

## Getting Started

### Prerequisites

- Node.js v18+
- npm

### Installation

```sh
npm install
```

### Environment Setup

Create a `.env` file in the root directory:

```
CORE_TESTNET_RPC=your_core_testnet_rpc_url
ACCOUNT_PRIVATE_KEY=your_private_key
BASESCAN_API_KEY=your_basescan_api_key
CORESCAN_API_KEY=your_corescan_api_key
```

### Compile Contracts

```sh
npx hardhat compile
```

### Run Tests

```sh
npx hardhat test
```

### Deploy Contracts

Deploy to Core Blockchain Testnet (ERC-1155 example):

```sh
npx hardhat ignition deploy ./ignition/modules/Lock.ts --network coreTestnet
```

## Usage

- **Token Deployment:**  
  Use the platform UI or scripts to deploy ERC-20, ERC-721, ERC-1155, memecoin, or stablecoin contracts.

- **Campaigns & Airdrops:**  
  Manage campaigns and airdrops via smart contracts and integrated management tools.

- **Whitelist Management:**  
  Add addresses manually or via CSV for controlled token distribution.

## Security & Best Practices

- All contracts are tested and audited for security.
- Anti-whale and collateralization features are available for specialized tokens.
- Whitelist and campaign management ensure fair and transparent distribution.

## Deployed Contracts

 ** Deployment Summary **

Core Contracts:
StrataForgeAdmin: 0x4eB7bba93734533350455B50056c33e93DD86493
StrataForgeFactory: 0x0b5870D52E5b0b2dDD75a66BC124DF350643C682
StrataForgeAirdropFactory: 0xFe9fDE126C4aE4Be8A6D4F1Da284611935726920
StrataForgeProxyFactory: 0x036Cf39BA8CbcBfEa786C9d1d34009208ED57D74

Token Implementations:
StrataForgeERC20Implementation: 0x335cC8C654657bEd47e538974A202A8708c7C0d3
StrataForgeERC721Implementation: 0x293E6327c7e65aDe95675563Da0C2e49CCF43485
StrataForgeERC1155Implementation: 0x15b1a0818a0b475d889A3FF01EF53Ef8349fD3Ac
StrataForgeMemecoinImplementation: 0xaf23a66689e55f08B24271Ce2dB6c5522F666d05
StrataForgeStablecoinImplementation: 0xfaF064467DF1c72f93b48956C11D92359d5a3f99

## License

- STrataforge 2025
