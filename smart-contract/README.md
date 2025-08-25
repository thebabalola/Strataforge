# StrataForge No-Code Token Platform — Electroneum Smart Contracts

Transform your vision into digital assets—without writing code. StrataForge empowers creators, entrepreneurs, and businesses to mint NFTs and launch tokens in minutes, with zero technical knowledge required, now powered by the Electroneum blockchain.

## Project Overview

This repository contains the smart contracts and deployment scripts powering the StrataForge no-code platform on the Electroneum blockchain. Our unified solution enables users to deploy multiple token standards, manage campaigns, and handle whitelists—all without blockchain development expertise.

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
  Deployment scripts for Electroneum networks.

- `artifacts/`  
  Compiled contract artifacts.

- `typechain-types/`  
  TypeScript typings for contracts.

- `hardhat.config.ts`  
  Hardhat configuration, including Electroneum network settings.

## Supported Networks

- **Electroneum Mainnet (Chain ID: 52014)**
- **Electroneum Testnet (Chain ID: 5201420)** ✅ **DEPLOYED**
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
ELECTRONEUM_RPC_URL=your_electroneum_mainnet_rpc_url
ELECTRONEUM_TESTNET_RPC_URL=your_electroneum_testnet_rpc_url
PRIVATE_KEY=your_private_key
ANKR_API_KEY=your_ankr_api_key
ETHERSCAN_API_KEY=your_electroneum_blockexplorer_api_key
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

Deploy to Electroneum Testnet:

```sh
npx hardhat run scripts/deploy-strataforge.ts --network electroneum-testnet
```

Deploy to Electroneum Mainnet:

```sh
npx hardhat run scripts/deploy-strataforge.ts --network electroneum
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
- Gas optimization for Electroneum network compatibility.

## Deployed Contracts

### **Electroneum Testnet Deployment** ✅ **LIVE**

**Network**: Electroneum Testnet (Chain ID: 5201420)  
**Deployer**: `0x0eE1F2b663547dAa487F57C517C7563AdCf86da0`  
**Deployment Date**: August 25, 2025

#### Core Contracts:
- **StrataForgeAdmin**: `0xFb8B95b90C19990EBe64741e35EACDbE0Fd30bcf`
- **StrataForgeFactory**: `0xf28B02EDAe285B30FB9d7a9d78138ac982C5a08B`
- **StrataForgeAirdropFactory**: `0xD9bC090b10c0323E672e9e7F3A9E4394650ED472`
- **StrataForgeProxyFactory**: `0xFe9fDE126C4aE4Be8A6D4F1Da284611935726920`

#### Token Implementations:
- **StrataForgeERC20Implementation**: `0xaf23a66689e55f08B24271Ce2dB6c5522F666d05`
- **StrataForgeERC721Implementation**: `0xfaF064467DF1c72f93b48956C11D92359d5a3f99`
- **StrataForgeERC1155Implementation**: `0x036Cf39BA8CbcBfEa786C9d1d34009208ED57D74`
- **StrataForgeMemecoinImplementation**: `0x4eB7bba93734533350455B50056c33e93DD86493`
- **StrataForgeStablecoinImplementation**: `0x0b5870D52E5b0b2dDD75a66BC124DF350643C682`

### **Block Explorer Links**
- **Testnet Explorer**: [https://testnet-blockexplorer.electroneum.com](https://testnet-blockexplorer.electroneum.com)
- **Mainnet Explorer**: [https://blockexplorer.electroneum.com](https://blockexplorer.electroneum.com)

## Electroneum Integration

This project is specifically optimized for the Electroneum blockchain:

- **Gas Optimization**: Contracts are optimized for Electroneum's gas model
- **Network Compatibility**: Full compatibility with Electroneum's EVM implementation
- **RPC Integration**: Support for Electroneum's RPC endpoints
- **Block Explorer**: Integration with Electroneum's block explorer for contract verification

## License

- StrataForge 2025
