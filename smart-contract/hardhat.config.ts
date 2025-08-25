import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.26",
  networks: {
    electroneum: {
      url: process.env.ELECTRONEUM_RPC_URL || `https://rpc.ankr.com/electroneum/${process.env.ANKR_API_KEY}`,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      timeout: 60000, // 60 seconds
    },
    'electroneum-testnet': {
      url: process.env.ELECTRONEUM_TESTNET_RPC_URL || 'https://rpc.ankr.com/electroneum_testnet',
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      timeout: 60000, // 60 seconds
    },
  },
  etherscan: {
    apiKey: {
      electroneum: process.env.ETHERSCAN_API_KEY || "empty",
    },
    customChains: [
      {
        network: "electroneum",
        chainId: 52014,
        urls: {
          apiURL: "https://blockexplorer.electroneum.com/api",
          browserURL: "https://blockexplorer.electroneum.com",
        },
      },
      {
        network: "electroneum-testnet",
        chainId: 5201420,
        urls: {
          apiURL: "https://testnet-blockexplorer.electroneum.com/api",
          browserURL: "https://testnet-blockexplorer.electroneum.com"
        }
      }
    ],
  },
};

export default config;

