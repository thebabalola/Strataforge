import { ethers } from "hardhat";

// Retry function for network resilience
async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 2000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error: any) {
      if (i === maxRetries - 1) throw error;
      
      if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT' || error.message.includes('network')) {
        console.log(`Attempt ${i + 1} failed with network error: ${error.message}`);
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      } else {
        throw error; // Don't retry non-network errors
      }
    }
  }
  throw new Error('Max retries exceeded');
}

async function main() {
  const [deployer] = await ethers.getSigners();
  
  if (!deployer) {
    throw new Error("No deployer account found. Please check your private key configuration.");
  }

  console.log(
    "Deploying contracts to Base Sepolia with account:",
    deployer.address
  );
  
  // Check balance with retry
  const balance = await retryOperation(async () => {
    return await ethers.provider.getBalance(deployer.address);
  });
  
  console.log(
    "Account balance:",
    ethers.formatEther(balance),
    "ETH"
  );

  // Gas settings for Base Sepolia - let Hardhat estimate gas
  const gasSettings = {
    // Base Sepolia typically has lower gas prices
    gasPrice: ethers.parseUnits("0.1", "gwei"),
  };

  console.log("\n=== Deploying Token Implementations ===");

  // Deploy ERC20 Implementation
  console.log("Deploying StrataForgeERC20Implementation...");
  const StrataForgeERC20Implementation = await ethers.getContractFactory(
    "StrataForgeERC20Implementation"
  );
  const erc20Implementation = await retryOperation(async () => {
    const tx = await StrataForgeERC20Implementation.deploy(gasSettings);
    const receipt = await tx.waitForDeployment();
    return receipt;
  });
  const erc20Address = await erc20Implementation.getAddress();
  const erc20Tx = await erc20Implementation.deploymentTransaction();
  console.log("StrataForgeERC20Implementation deployed to:", erc20Address);
  console.log("Waiting for 5 block confirmations...");
  if (erc20Tx) {
    await erc20Tx.wait(5);
  }

  // Deploy ERC721 Implementation
  console.log("Deploying StrataForgeERC721Implementation...");
  const StrataForgeERC721Implementation = await ethers.getContractFactory(
    "StrataForgeERC721Implementation"
  );
  const erc721Implementation = await retryOperation(async () => {
    const tx = await StrataForgeERC721Implementation.deploy(gasSettings);
    const receipt = await tx.waitForDeployment();
    return receipt;
  });
  const erc721Address = await erc721Implementation.getAddress();
  const erc721Tx = await erc721Implementation.deploymentTransaction();
  console.log("StrataForgeERC721Implementation deployed to:", erc721Address);
  console.log("Waiting for 5 block confirmations...");
  if (erc721Tx) {
    await erc721Tx.wait(5);
  }

  // Deploy ERC1155 Implementation
  console.log("Deploying StrataForgeERC1155Implementation...");
  const StrataForgeERC1155Implementation = await ethers.getContractFactory(
    "StrataForgeERC1155Implementation"
  );
  const erc1155Implementation = await retryOperation(async () => {
    const tx = await StrataForgeERC1155Implementation.deploy(gasSettings);
    const receipt = await tx.waitForDeployment();
    return receipt;
  });
  const erc1155Address = await erc1155Implementation.getAddress();
  const erc1155Tx = await erc1155Implementation.deploymentTransaction();
  console.log("StrataForgeERC1155Implementation deployed to:", erc1155Address);
  console.log("Waiting for 5 block confirmations...");
  if (erc1155Tx) {
    await erc1155Tx.wait(5);
  }

  // Deploy Memecoin Implementation
  console.log("Deploying StrataForgeMemecoinImplementation...");
  const StrataForgeMemecoinImplementation = await ethers.getContractFactory(
    "StrataForgeMemecoinImplementation"
  );
  const memecoinImplementation = await retryOperation(async () => {
    const contract = await StrataForgeMemecoinImplementation.deploy(gasSettings);
    await contract.waitForDeployment();
    return contract;
  });
  const memecoinAddress = await memecoinImplementation.getAddress();
  console.log(
    "StrataForgeMemecoinImplementation deployed to:",
    memecoinAddress
  );

  // Deploy Stablecoin Implementation
  console.log("Deploying StrataForgeStablecoinImplementation...");
  const StrataForgeStablecoinImplementation = await ethers.getContractFactory(
    "StrataForgeStablecoinImplementation"
  );
  const stablecoinImplementation = await retryOperation(async () => {
    const contract = await StrataForgeStablecoinImplementation.deploy(gasSettings);
    await contract.waitForDeployment();
    return contract;
  });
  const stablecoinAddress = await stablecoinImplementation.getAddress();
  console.log(
    "StrataForgeStablecoinImplementation deployed to:",
    stablecoinAddress
  );

  console.log("\n=== Deploying Core Contracts ===");

  // Deploy Proxy Factory
  console.log("Deploying StrataForgeProxyFactory...");
  const StrataForgeProxyFactory = await ethers.getContractFactory(
    "StrataForgeProxyFactory"
  );
  const proxyFactory = await retryOperation(async () => {
    const contract = await StrataForgeProxyFactory.deploy(
      erc20Address,
      erc721Address,
      erc1155Address,
      memecoinAddress,
      stablecoinAddress,
      gasSettings
    );
    await contract.waitForDeployment();
    return contract;
  });
  const proxyFactoryAddress = await proxyFactory.getAddress();
  console.log("StrataForgeProxyFactory deployed to:", proxyFactoryAddress);

  // Deploy Admin Contract
  console.log("Deploying StrataForgeAdmin...");
  const StrataForgeAdmin = await ethers.getContractFactory("StrataForgeAdmin");
  const adminContract = await retryOperation(async () => {
    const contract = await StrataForgeAdmin.deploy(
      deployer.address, // Use the actual deployer address
      gasSettings
    );
    await contract.waitForDeployment();
    return contract;
  });
  const adminAddress = await adminContract.getAddress();
  console.log("StrataForgeAdmin deployed to:", adminAddress);

  // Wait for block confirmation
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Deploy Main Factory
  console.log("Deploying StrataForgeFactory...");
  const StrataForgeFactory = await ethers.getContractFactory(
    "StrataForgeFactory"
  );
  const factoryContract = await retryOperation(async () => {
    const contract = await StrataForgeFactory.deploy(
      adminAddress,
      proxyFactoryAddress,
      gasSettings
    );
    await contract.waitForDeployment();
    return contract;
  });
  const factoryAddress = await factoryContract.getAddress();
  console.log("StrataForgeFactory deployed to:", factoryAddress);

  // Wait for block confirmation
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Deploy Airdrop Factory
  console.log("Deploying StrataForgeAirdropFactory...");
  const StrataForgeAirdropFactory = await ethers.getContractFactory(
    "StrataForgeAirdropFactory"
  );
  const airdropFactory = await retryOperation(async () => {
    const contract = await StrataForgeAirdropFactory.deploy(
      adminAddress,
      gasSettings
    );
    await contract.waitForDeployment();
    return contract;
  });
  const airdropAddress = await airdropFactory.getAddress();
  console.log("StrataForgeAirdropFactory deployed to:", airdropAddress);

  console.log("\n=== Linking Contracts ===");

  // Link contracts in Admin
  console.log("Linking Factory contract in Admin...");
  await retryOperation(async () => {
    const setFactoryTx = await adminContract.setFactoryContract(
      factoryAddress,
      gasSettings
    );
    await setFactoryTx.wait();
  });
  console.log("Factory contract linked in Admin");

  console.log("Linking Airdrop contract in Admin...");
  await retryOperation(async () => {
    const setAirdropTx = await adminContract.setAirdropContract(
      airdropAddress,
      gasSettings
    );
    await setAirdropTx.wait();
  });
  console.log("Airdrop contract linked in Admin");

  console.log("\n=== Deployment Summary ===");
  console.log("Network: Base Sepolia (84532)");
  console.log("Deployer:", deployer.address);
  console.log("\nContract Addresses:");
  console.log("├── StrataForgeAdmin:", adminAddress);
  console.log("├── StrataForgeERC20Implementation:", erc20Address);
  console.log("├── StrataForgeERC721Implementation:", erc721Address);
  console.log("├── StrataForgeERC1155Implementation:", erc1155Address);
  console.log("├── StrataForgeMemecoinImplementation:", memecoinAddress);
  console.log("├── StrataForgeStablecoinImplementation:", stablecoinAddress);
  console.log("├── StrataForgeProxyFactory:", proxyFactoryAddress);
  console.log("├── StrataForgeFactory:", factoryAddress);
  console.log("└── StrataForgeAirdropFactory:", airdropAddress);

  console.log("\n✅ All contracts deployed successfully!");
  console.log("You can verify these contracts on Base Sepolia Explorer:");
  console.log("https://sepolia.basescan.org");

  // Save deployment addresses to a file
  const deploymentInfo = {
    network: "Base Sepolia",
    chainId: 84532,
    deployer: deployer.address,
    contracts: {
      StrataForgeAdmin: adminAddress,
      StrataForgeERC20Implementation: erc20Address,
      StrataForgeERC721Implementation: erc721Address,
      StrataForgeERC1155Implementation: erc1155Address,
      StrataForgeMemecoinImplementation: memecoinAddress,
      StrataForgeStablecoinImplementation: stablecoinAddress,
      StrataForgeProxyFactory: proxyFactoryAddress,
      StrataForgeFactory: factoryAddress,
      StrataForgeAirdropFactory: airdropAddress,
    },
    deploymentDate: new Date().toISOString(),
  };

  const fs = require("fs");
  fs.writeFileSync(
    "deployment-base-sepolia.json",
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("\n📄 Deployment info saved to: deployment-base-sepolia.json");
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
