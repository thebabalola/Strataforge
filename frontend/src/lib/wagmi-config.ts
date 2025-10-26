// lib/wagmi-config.ts
import { createConfig, http } from "wagmi";
import { metaMask, coinbaseWallet } from "@wagmi/connectors";

export const baseSepolia = {
  id: 84532, // Base Sepolia chain ID
  name: "Base Sepolia",
  network: "base-sepolia",
  nativeCurrency: {
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://sepolia.base.org"],
    },
    public: {
      http: ["https://sepolia.base.org"],
    },
  },
  blockExplorers: {
    default: {
      name: "Base Sepolia Explorer",
      url: "https://sepolia.basescan.org",
    },
  },
  testnet: true,
};

export const config = createConfig({
  chains: [baseSepolia],
  connectors: [metaMask(), coinbaseWallet({ appName: "StrataForge" })],
  transports: {
    [baseSepolia.id]: http("https://sepolia.base.org"),
  },
});
