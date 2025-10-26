import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.26",
        settings: {
          optimizer: {
            enabled: false, // Try with optimizer disabled
          },
          evmVersion: "paris",
        },
      },
    ],
  },
  defaultNetwork: "baseSepolia",
  networks: {
    hardhat: {
      forking: {
        url: process.env.ALCHEMY_API_KEY ? `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}` : "https://eth-mainnet.alchemyapi.io/v2/oKxs-03sij-U_N0iOlrSsZFr29-IqbuF",
        enabled: process.env.MAINNET_FORKING_ENABLED === "true",
      },
    },
    baseSepolia: {
      url: "https://sepolia.base.org",
      accounts: process.env.ACCOUNT_PRIVATE_KEY ? [process.env.ACCOUNT_PRIVATE_KEY] : [],
      chainId: 84532,
    },
    base: {
      url: "https://mainnet.base.org",
      accounts: process.env.ACCOUNT_PRIVATE_KEY ? [process.env.ACCOUNT_PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: {
      baseSepolia: process.env.BASESCAN_API_KEY,
      base: process.env.BASESCAN_API_KEY,
    },
    customChains: [
      {
        network: "baseSepolia",
        chainId: 84532,
        urls: {
          apiURL: "https://api-sepolia.basescan.org/api",
          browserURL: "https://sepolia.basescan.org"
        }
      },
      {
        network: "base",
        chainId: 8453,
        urls: {
          apiURL: "https://api.basescan.org/api",
          browserURL: "https://basescan.org"
        }
      }
    ],
  },
};

export default config;

