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
- **StrataForgeAdmin**: `0x87a25cC6F42B194061f02382fee342001cBF9767`
- **StrataForgeFactory**: `0x65B7E0961160Abe5d49500CE834324B76b755762`
- **StrataForgeAirdropFactory**: `0xAfA316A63DB6f9EE4F7fE975e110343a0c4c8205`
- **StrataForgeProxyFactory**: `0x96ae871091EBA6B8287f38A3FAA8B53BC5a9AC76`

#### Token Implementations:
- **StrataForgeERC20Implementation**: `0x092495997E0060E2b811A80d0b6c1c69aBCA7B3C`
- **StrataForgeERC721Implementation**: `0x264f64E0F7eAad68447c6536fFa816e802B4c26d`
- **StrataForgeERC1155Implementation**: `0x1EEaC20cd0C01bb7D85D4FB2AAE0bd502b03a5dA`
- **StrataForgeMemecoinImplementation**: `0xc4745695430aAc3ac2095375d37aD6D82EE8056A`
- **StrataForgeStablecoinImplementation**: `0x12746721fA858D3Bb0F81823Ee3B41c54C9b949b`

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
