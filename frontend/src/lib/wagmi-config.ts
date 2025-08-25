// lib/wagmi-config.ts
import { createConfig, http } from "wagmi";
import { metaMask, coinbaseWallet } from "@wagmi/connectors";

export const electroneumTestnet = {
  id: 5201420, // Electroneum Testnet chain ID
  name: "Electroneum Testnet",
  network: "electroneum-testnet",
  nativeCurrency: {
    name: "Electroneum",
    symbol: "ETN",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.ankr.com/electroneum_testnet"],
    },
    public: {
      http: ["https://rpc.ankr.com/electroneum_testnet"],
    },
  },
  blockExplorers: {
    default: {
      name: "Electroneum Testnet Explorer",
      url: "https://testnet-blockexplorer.electroneum.com",
    },
  },
  testnet: true,
};

export const config = createConfig({
  chains: [electroneumTestnet],
  connectors: [metaMask(), coinbaseWallet({ appName: "StrataForge" })],
  transports: {
    [electroneumTestnet.id]: http("https://rpc.ankr.com/electroneum_testnet"),
  },
});
