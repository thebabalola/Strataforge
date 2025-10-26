# StrataForge No-Code Token Platform — Base Sepolia Smart Contracts

Transform your vision into digital assets—without writing code. StrataForge empowers creators, entrepreneurs, and businesses to mint NFTs and launch tokens in minutes, with zero technical knowledge required, now powered by the Base blockchain.

## Project Overview

This repository contains the smart contracts and deployment scripts powering the StrataForge no-code platform on the Base blockchain. Our unified solution enables users to deploy multiple token standards, manage campaigns, and handle whitelists—all without blockchain development expertise.

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

- `scripts/`  
  Deployment scripts for Base networks.

- `artifacts/`  
  Compiled contract artifacts.

- `typechain-types/`  
  TypeScript typings for contracts.

- `hardhat.config.ts`  
  Hardhat configuration, including Base network settings.

## Supported Networks

- **Base Sepolia Testnet (Chain ID: 84532)** ✅ **DEPLOYED**
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
ACCOUNT_PRIVATE_KEY=your_private_key_here
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
BASESCAN_API_KEY=your_basescan_api_key_here
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

Deploy to Base Sepolia Testnet:

```sh
npx hardhat run scripts/deploy-strataforge.ts --network base-sepolia
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
- Gas optimization for Base network compatibility.

## Deployed Contracts

### **Base Sepolia Testnet Deployment** ✅ **LIVE**

**Network**: Base Sepolia Testnet (Chain ID: 84532)  
**Deployer**: `0x0eE1F2b663547dAa487F57C517C7563AdCf86da0`  
**Deployment Date**: October 26, 2025

#### Core Contracts:
- **StrataForgeAdmin**: `0xAf6AB6822A586Fece70ca4D2a7e9B34E968fE991`
- **StrataForgeFactory**: `0x85941e2Dd3f3198Ce038A301650f4249EB7aCbb7`
- **StrataForgeAirdropFactory**: `0x0dBc2Da0A46Ec616576b2C0f38DD911b1392EE0D`
- **StrataForgeProxyFactory**: `0x1439f896f771c69848b9DACcccDE7CCCf2b10AA1`

#### Token Implementations:
- **StrataForgeERC20Implementation**: `0xDF31A5a8Bfd8dDe160eB4EE2482a2cd20E15F567`
- **StrataForgeERC721Implementation**: `0x7E2337cffe34Db29896436ee3Df4fA3B0b1Cc10F`
- **StrataForgeERC1155Implementation**: `0xc9859c8181F74f493dF807B054e1923F7C7Df430`
- **StrataForgeMemecoinImplementation**: `0x2EbE7f6911C9945c8695938eBD2A2951B5888A23`
- **StrataForgeStablecoinImplementation**: `0x09Cc713bBB130C4e41a105C4BDD999bD88F477f8`

### **Block Explorer Links**
- **Base Sepolia Explorer**: [https://sepolia.basescan.org](https://sepolia.basescan.org)

## Base Integration

This project is specifically optimized for the Base blockchain:

- **Gas Optimization**: Contracts are optimized for Base's gas model
- **Network Compatibility**: Full compatibility with Base's EVM implementation
- **RPC Integration**: Support for Base's RPC endpoints
- **Block Explorer**: Integration with Base's block explorer for contract verification

## License

- StrataForge 2025
