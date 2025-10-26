# StrataForge - Base Token Creation Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Base](https://img.shields.io/badge/Blockchain-Base-blue.svg)](https://base.org)
[![Next.js](https://img.shields.io/badge/Next.js-15.3.1-black.svg)](https://nextjs.org/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.26-orange.svg)](https://soliditylang.org/)

Transform your vision into digital assets—without writing code. StrataForge empowers creators, entrepreneurs, and businesses to mint NFTs and launch tokens in minutes, with zero technical knowledge required, now powered by the Base blockchain.

## 🚀 Project Overview

StrataForge is a comprehensive no-code token creation platform that enables users to deploy multiple token standards, manage campaigns, and handle whitelists—all without blockchain development expertise. The platform is specifically optimized for the Base blockchain.

### Key Features

- **🎯 One-Click Token Deployment:** Deploy ERC-20, ERC-721, and ERC-1155 tokens with just a few clicks
- **📊 Campaign Management:** Create, manage, and track airdrops and marketing campaigns
- **👥 Whitelist Management:** Easily manage token distribution using CSV uploads and manual address addition
- **🎨 Specialized Token Templates:** Ready-to-deploy memecoin and stablecoin contracts
- **🖱️ Drag & Drop Simplicity:** Build NFT collections and launch tokens with a visual editor
- **🌐 Complete Web3 Ecosystem:** Manage the entire token lifecycle in one platform

## 🏗️ Architecture

### Frontend (Next.js 15.3.1)
- **Framework:** Next.js with TypeScript
- **Styling:** Tailwind CSS
- **Web3 Integration:** Wagmi + AppKit
- **State Management:** React Context + TanStack Query
- **UI Components:** Custom components with shadcn/ui

### Smart Contracts (Solidity 0.8.26)
- **Framework:** Hardhat
- **Language:** Solidity
- **Testing:** Chai + Mocha
- **Deployment:** Ignition modules

## 📁 Project Structure

```
Strataforge-base/
├── frontend/                    # Next.js frontend application
│   ├── src/
│   │   ├── app/                # Next.js app router pages
│   │   │   ├── dashboard/      # Dashboard pages (admin, token-creator, token-trader)
│   │   │   └── components/     # Reusable UI components
│   │   ├── contexts/           # React contexts (Wallet, Admin, etc.)
│   │   ├── lib/                # Utilities and configurations
│   │   └── hooks/              # Custom React hooks
│   ├── public/                 # Static assets
│   └── package.json
├── smart-contract/             # Hardhat smart contract project
│   ├── contracts/              # Solidity smart contracts
│   ├── scripts/                # Deployment scripts
│   ├── test/                   # Contract tests
│   └── hardhat.config.ts
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/thebabalola/Strataforge.git
   cd Strataforge-base
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install smart contract dependencies**
   ```bash
   cd ../smart-contract
   npm install
   ```

4. **Set up environment variables**
   
   Create a `.env` file in the `smart-contract` directory:
   ```env
   ACCOUNT_PRIVATE_KEY=your_private_key_here
   BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
   BASESCAN_API_KEY=your_basescan_api_key_here
   ```

   Create a `.env.local` file in the `frontend` directory:
   ```env
   NEXT_PUBLIC_PROJECT_ID=your_appkit_project_id
   ```

### Development

#### Frontend Development
```bash
cd frontend
npm run dev
```
The frontend will be available at `http://localhost:3000`

#### Smart Contract Development
```bash
cd smart-contract
npx hardhat compile
npx hardhat test
```

### Deployment

#### Deploy to Base Sepolia Testnet
```bash
cd smart-contract
npx hardhat run scripts/deploy-strataforge.ts --network base-sepolia
```

## 🌐 Supported Networks

- **Base Sepolia Testnet** (Chain ID: 84532) ✅ **DEPLOYED**
- Local Hardhat Network

## 📋 Deployed Contracts

### Base Sepolia Testnet Deployment ✅ **LIVE**

**Network:** Base Sepolia Testnet (Chain ID: 84532)  
**Deployer:** `0x0eE1F2b663547dAa487F57C517C7563AdCf86da0`  
**Deployment Date:** October 26, 2025

#### Core Contracts:
- **StrataForgeAdmin:** `0xAf6AB6822A586Fece70ca4D2a7e9B34E968fE991`
- **StrataForgeFactory:** `0x85941e2Dd3f3198Ce038A301650f4249EB7aCbb7`
- **StrataForgeAirdropFactory:** `0x0dBc2Da0A46Ec616576b2C0f38DD911b1392EE0D`
- **StrataForgeProxyFactory:** `0x1439f896f771c69848b9DACcccDE7CCCf2b10AA1`

#### Token Implementations:
- **StrataForgeERC20Implementation:** `0xDF31A5a8Bfd8dDe160eB4EE2482a2cd20E15F567`
- **StrataForgeERC721Implementation:** `0x7E2337cffe34Db29896436ee3Df4fA3B0b1Cc10F`
- **StrataForgeERC1155Implementation:** `0xc9859c8181F74f493dF807B054e1923F7C7Df430`
- **StrataForgeMemecoinImplementation:** `0x2EbE7f6911C9945c8695938eBD2A2951B5888A23`
- **StrataForgeStablecoinImplementation:** `0x09Cc713bBB130C4e41a105C4BDD999bD88F477f8`

### Block Explorer Links
- **Base Sepolia Explorer:** [https://sepolia.basescan.org](https://sepolia.basescan.org)

## 🎯 Platform Features

### For Token Creators
- **Token Creation:** Deploy ERC-20, ERC-721, ERC-1155, memecoin, and stablecoin tokens
- **Token Management:** Update token metadata, manage supply, and configure settings
- **Airdrop Campaigns:** Create and manage token distribution campaigns
- **Analytics:** Track token performance and user engagement

### For Token Traders
- **Token Discovery:** Browse and discover new tokens on the platform
- **Airdrop Claims:** Participate in token airdrops and claim rewards
- **Portfolio Management:** Track your token holdings and transactions

### For Administrators
- **Platform Management:** Configure fees, manage admins, and control platform settings
- **Contract Controls:** Pause/unpause contracts and manage factory addresses
- **Analytics Dashboard:** Monitor platform usage and revenue
- **Withdrawal Management:** Handle platform fee withdrawals

## 🔧 Technical Stack

### Frontend
- **Framework:** Next.js 15.3.1
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Web3:** Wagmi + AppKit
- **State Management:** React Context + TanStack Query
- **UI Components:** Custom components with shadcn/ui

### Smart Contracts
- **Framework:** Hardhat
- **Language:** Solidity 0.8.26
- **Libraries:** OpenZeppelin Contracts
- **Testing:** Chai + Mocha
- **Deployment:** Ignition modules

### Infrastructure
- **Blockchain:** Base
- **RPC Provider:** Base Sepolia RPC
- **Block Explorer:** Base Sepolia Explorer
- **Deployment:** Manual deployment with Hardhat

## 🧪 Testing

### Smart Contract Tests
```bash
cd smart-contract
npx hardhat test
```

### Frontend Tests
```bash
cd frontend
npm run test
```

## 📦 Build

### Frontend Build
```bash
cd frontend
npm run build
```

### Smart Contract Build
```bash
cd smart-contract
npx hardhat compile
```

## 🔒 Security

- All contracts are tested and audited for security
- Anti-whale and collateralization features available
- Whitelist and campaign management ensure fair distribution
- Gas optimization for Base network compatibility

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Acknowledgments

- [Base](https://base.org) for blockchain infrastructure
- [OpenZeppelin](https://openzeppelin.com) for secure smart contract libraries
- [Next.js](https://nextjs.org) for the frontend framework
- [Wagmi](https://wagmi.sh) for Web3 React hooks
- [AppKit](https://appkit.com) for wallet connection

## 📞 Support

- **Documentation:** [Project Wiki](https://github.com/thebabalola/Strataforge/wiki)
- **Issues:** [GitHub Issues](https://github.com/thebabalola/Strataforge/issues)
- **Discussions:** [GitHub Discussions](https://github.com/thebabalola/Strataforge/discussions)

## 🔄 Version History

- **v1.1.0** - Base Sepolia testnet deployment
- **v1.0.0** - Initial release with Electroneum testnet deployment
- **v0.9.0** - Beta release with Electroneum testnet support
- **v0.8.0** - Alpha release with basic token creation features

---

**StrataForge 2025** - Empowering creators on the Base blockchain
