import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const BASE_SEPOLIA_RPC_URL = process.env.BASE_SEPOLIA_RPC_URL || "";
const CORE_TESTNET2_RPC = process.env.CORE_TESTNET2_RPC || "";
const ACCOUNT_PRIVATE_KEY = process.env.ACCOUNT_PRIVATE_KEY || "";

const BASESCAN_API_KEY = process.env.BASESCAN_API_KEY || "";
const CORESCAN_API_KEY = process.env.CORESCAN_API_KEY || "";

// Ensure API keys are loaded
if (!BASESCAN_API_KEY) {
  console.warn("Warning: BASESCAN_API_KEY not found in environment variables");
}

const config: HardhatUserConfig = {
  solidity: "0.8.26",
  networks: {
    base_sepolia: {
      url: BASE_SEPOLIA_RPC_URL,
      accounts: [ACCOUNT_PRIVATE_KEY],
      chainId: 84532,
      gasPrice: 1_000_000_000, // 1 gwei gas price
    },
    core_testnet2: {
      url: CORE_TESTNET2_RPC,
      accounts: [ACCOUNT_PRIVATE_KEY],
      chainId: 1114,
      gasPrice: 30_000_000_000, // 30 gwei - matching Core testnet requirements
    },
  },
  etherscan: {
    apiKey: {
      base_sepolia: BASESCAN_API_KEY,
      core_testnet2: CORESCAN_API_KEY,
    },
    customChains: [
      {
        network: "core_testnet2",
        chainId: 1114,
        urls: {
          apiURL: "https://api.scan.test2.btcs.network/api",
          browserURL: "https://scan.test2.btcs.network",
        },
      },
      {
        network: "base_sepolia",
        chainId: 84532,
        urls: {
          apiURL: "https://api-sepolia.basescan.org/api",
          browserURL: "https://sepolia.basescan.org",
        },
      },
    ],
  },
};

export default config;
