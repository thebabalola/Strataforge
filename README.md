# StrataForge - Electroneum Token Creation Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Electroneum](https://img.shields.io/badge/Blockchain-Electroneum-blue.svg)](https://electroneum.com)
[![Next.js](https://img.shields.io/badge/Next.js-15.3.1-black.svg)](https://nextjs.org/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.26-orange.svg)](https://soliditylang.org/)

Transform your vision into digital assets—without writing code. StrataForge empowers creators, entrepreneurs, and businesses to mint NFTs and launch tokens in minutes, with zero technical knowledge required, now powered by the Electroneum blockchain.

## 🚀 Project Overview

StrataForge is a comprehensive no-code token creation platform that enables users to deploy multiple token standards, manage campaigns, and handle whitelists—all without blockchain development expertise. The platform is specifically optimized for the Electroneum blockchain.

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
Strataforge-electroneum/
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
   cd Strataforge-electroneum
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
   ELECTRONEUM_RPC_URL=your_electroneum_mainnet_rpc_url
   ELECTRONEUM_TESTNET_RPC_URL=your_electroneum_testnet_rpc_url
   PRIVATE_KEY=your_private_key
   ANKR_API_KEY=your_ankr_api_key
   ETHERSCAN_API_KEY=your_electroneum_blockexplorer_api_key
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

#### Deploy to Electroneum Testnet
```bash
cd smart-contract
npx hardhat run scripts/deploy-strataforge.ts --network electroneum-testnet
```

#### Deploy to Electroneum Mainnet
```bash
cd smart-contract
npx hardhat run scripts/deploy-strataforge.ts --network electroneum
```

## 🌐 Supported Networks

- **Electroneum Mainnet** (Chain ID: 52014)
- **Electroneum Testnet** (Chain ID: 5201420) ✅ **DEPLOYED**
- Local Hardhat Network

## 📋 Deployed Contracts

### Electroneum Testnet Deployment ✅ **LIVE**

**Network:** Electroneum Testnet (Chain ID: 5201420)  
**Deployer:** `0x0eE1F2b663547dAa487F57C517C7563AdCf86da0`  
**Deployment Date:** August 25, 2025

#### Core Contracts:
- **StrataForgeAdmin:** `0xFb8B95b90C19990EBe64741e35EACDbE0Fd30bcf`
- **StrataForgeFactory:** `0xf28B02EDAe285B30FB9d7a9d78138ac982C5a08B`
- **StrataForgeAirdropFactory:** `0xD9bC090b10c0323E672e9e7F3A9E4394650ED472`
- **StrataForgeProxyFactory:** `0xFe9fDE126C4aE4Be8A6D4F1Da284611935726920`

#### Token Implementations:
- **StrataForgeERC20Implementation:** `0xaf23a66689e55f08B24271Ce2dB6c5522F666d05`
- **StrataForgeERC721Implementation:** `0xfaF064467DF1c72f93b48956C11D92359d5a3f99`
- **StrataForgeERC1155Implementation:** `0x036Cf39BA8CbcBfEa786C9d1d34009208ED57D74`
- **StrataForgeMemecoinImplementation:** `0x4eB7bba93734533350455B50056c33e93DD86493`
- **StrataForgeStablecoinImplementation:** `0x0b5870D52E5b0b2dDD75a66BC124DF350643C682`

### Block Explorer Links
- **Testnet Explorer:** [https://testnet-blockexplorer.electroneum.com](https://testnet-blockexplorer.electroneum.com)
- **Mainnet Explorer:** [https://blockexplorer.electroneum.com](https://blockexplorer.electroneum.com)

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
- **Blockchain:** Electroneum
- **RPC Provider:** Ankr
- **Block Explorer:** Electroneum Block Explorer
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
- Gas optimization for Electroneum network compatibility

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Acknowledgments

- [Electroneum](https://electroneum.com) for blockchain infrastructure
- [OpenZeppelin](https://openzeppelin.com) for secure smart contract libraries
- [Next.js](https://nextjs.org) for the frontend framework
- [Wagmi](https://wagmi.sh) for Web3 React hooks
- [AppKit](https://appkit.com) for wallet connection

## 📞 Support

- **Documentation:** [Project Wiki](https://github.com/thebabalola/Strataforge/wiki)
- **Issues:** [GitHub Issues](https://github.com/thebabalola/Strataforge/issues)
- **Discussions:** [GitHub Discussions](https://github.com/thebabalola/Strataforge/discussions)

## 🔄 Version History

- **v1.0.0** - Initial release with Electroneum testnet deployment
- **v0.9.0** - Beta release with Core testnet support
- **v0.8.0** - Alpha release with basic token creation features

---

**StrataForge 2025** - Empowering creators on the Electroneum blockchain
