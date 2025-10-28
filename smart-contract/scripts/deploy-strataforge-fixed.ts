import { ethers } from "hardhat";
import fs from "fs";
import path from "path";

// Wait for transaction to be mined
async function waitForTransaction(tx: any, confirmations: number = 5) {
  await tx.wait(confirmations);
}

async function main() {
  const [deployer] = await ethers.getSigners();
  
  if (!deployer) {
    throw new Error("No deployer account found. Please check your private key configuration.");
  }

  console.log("Deploying contracts to Base Sepolia with account:", deployer.address);
  // console.log("Deploying contracts to Base Mainnet with account:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  const gasSettings = {
    gasPrice: ethers.parseUnits("0.1", "gwei"),
  };

  console.log("\n=== Deploying Token Implementations ===");

  // Deploy ERC20 Implementation
  console.log("Deploying StrataForgeERC20Implementation...");
  const StrataForgeERC20Implementation = await ethers.getContractFactory("StrataForgeERC20Implementation");
  const erc20Implementation = await StrataForgeERC20Implementation.deploy(gasSettings);
  const erc20Address = await erc20Implementation.getAddress();
  console.log("StrataForgeERC20Implementation deployed to:", erc20Address);
  const erc20Tx = await erc20Implementation.deploymentTransaction();
  if (erc20Tx) {
    console.log("Waiting for 2 block confirmations...");
    await waitForTransaction(erc20Tx, 2);
  }

  // Deploy ERC721 Implementation
  console.log("Deploying StrataForgeERC721Implementation...");
  const StrataForgeERC721Implementation = await ethers.getContractFactory("StrataForgeERC721Implementation");
  const erc721Implementation = await StrataForgeERC721Implementation.deploy(gasSettings);
  const erc721Address = await erc721Implementation.getAddress();
  console.log("StrataForgeERC721Implementation deployed to:", erc721Address);
  const erc721Tx = await erc721Implementation.deploymentTransaction();
  if (erc721Tx) {
    console.log("Waiting for 2 block confirmations...");
    await waitForTransaction(erc721Tx, 2);
  }

  // Deploy ERC1155 Implementation
  console.log("Deploying StrataForgeERC1155Implementation...");
  const StrataForgeERC1155Implementation = await ethers.getContractFactory("StrataForgeERC1155Implementation");
  const erc1155Implementation = await StrataForgeERC1155Implementation.deploy(gasSettings);
  const erc1155Address = await erc1155Implementation.getAddress();
  console.log("StrataForgeERC1155Implementation deployed to:", erc1155Address);
  const erc1155Tx = await erc1155Implementation.deploymentTransaction();
  if (erc1155Tx) {
    console.log("Waiting for 2 block confirmations...");
    await waitForTransaction(erc1155Tx, 2);
  }

  // Deploy Memecoin Implementation
  console.log("Deploying StrataForgeMemecoinImplementation...");
  const StrataForgeMemecoinImplementation = await ethers.getContractFactory("StrataForgeMemecoinImplementation");
  const memecoinImplementation = await StrataForgeMemecoinImplementation.deploy(gasSettings);
  const memecoinAddress = await memecoinImplementation.getAddress();
  console.log("StrataForgeMemecoinImplementation deployed to:", memecoinAddress);
  const memecoinTx = await memecoinImplementation.deploymentTransaction();
  if (memecoinTx) {
    console.log("Waiting for 2 block confirmations...");
    await waitForTransaction(memecoinTx, 2);
  }

  // Deploy Stablecoin Implementation
  console.log("Deploying StrataForgeStablecoinImplementation...");
  const StrataForgeStablecoinImplementation = await ethers.getContractFactory("StrataForgeStablecoinImplementation");
  const stablecoinImplementation = await StrataForgeStablecoinImplementation.deploy(gasSettings);
  const stablecoinAddress = await stablecoinImplementation.getAddress();
  console.log("StrataForgeStablecoinImplementation deployed to:", stablecoinAddress);
  const stablecoinTx = await stablecoinImplementation.deploymentTransaction();
  if (stablecoinTx) {
    console.log("Waiting for 2 block confirmations...");
    await waitForTransaction(stablecoinTx, 2);
  }

  console.log("\n=== Deploying Core Contracts ===");

  // Deploy Proxy Factory
  console.log("Deploying StrataForgeProxyFactory...");
  const StrataForgeProxyFactory = await ethers.getContractFactory("StrataForgeProxyFactory");
  const proxyFactory = await StrataForgeProxyFactory.deploy(
    erc20Address,
    erc721Address,
    erc1155Address,
    memecoinAddress,
    stablecoinAddress,
    gasSettings
  );
  const proxyFactoryAddress = await proxyFactory.getAddress();
  console.log("StrataForgeProxyFactory deployed to:", proxyFactoryAddress);
  const proxyFactoryTx = await proxyFactory.deploymentTransaction();
  if (proxyFactoryTx) {
    console.log("Waiting for 2 block confirmations...");
    await waitForTransaction(proxyFactoryTx, 2);
  }

  // Deploy Admin Contract
  console.log("Deploying StrataForgeAdmin...");
  const StrataForgeAdmin = await ethers.getContractFactory("StrataForgeAdmin");
  const adminContract = await StrataForgeAdmin.deploy(deployer.address, gasSettings);
  const adminAddress = await adminContract.getAddress();
  console.log("StrataForgeAdmin deployed to:", adminAddress);
  const adminTx = await adminContract.deploymentTransaction();
  if (adminTx) {
    console.log("Waiting for 2 block confirmations...");
    await waitForTransaction(adminTx, 2);
  }

  // Deploy Main Factory
  console.log("Deploying StrataForgeFactory...");
  const StrataForgeFactory = await ethers.getContractFactory("StrataForgeFactory");
  const factoryContract = await StrataForgeFactory.deploy(adminAddress, proxyFactoryAddress, gasSettings);
  const factoryAddress = await factoryContract.getAddress();
  console.log("StrataForgeFactory deployed to:", factoryAddress);
  const factoryTx = await factoryContract.deploymentTransaction();
  if (factoryTx) {
    console.log("Waiting for 2 block confirmations...");
    await waitForTransaction(factoryTx, 2);
  }

  // Deploy Airdrop Factory
  console.log("Deploying StrataForgeAirdropFactory...");
  const StrataForgeAirdropFactory = await ethers.getContractFactory("StrataForgeAirdropFactory");
  const airdropFactory = await StrataForgeAirdropFactory.deploy(adminAddress, gasSettings);
  const airdropAddress = await airdropFactory.getAddress();
  console.log("StrataForgeAirdropFactory deployed to:", airdropAddress);
  const airdropTx = await airdropFactory.deploymentTransaction();
  if (airdropTx) {
    console.log("Waiting for 2 block confirmations...");
    await waitForTransaction(airdropTx, 2);
  }

  // Link contracts in Admin
  console.log("\n=== Linking Contracts ===");
  console.log("Linking Factory contract in Admin...");
  const setFactoryTx = await adminContract.setFactoryContract(factoryAddress, gasSettings);
  await setFactoryTx.wait();
  console.log("Factory contract linked in Admin");

  console.log("Linking Airdrop contract in Admin...");
  const setAirdropTx = await adminContract.setAirdropContract(airdropAddress, gasSettings);
  await setAirdropTx.wait();
  console.log("Airdrop contract linked in Admin");

  // Save deployment info
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

  // const deploymentInfo = {
  //   network: "Base Mainnet",
  //   chainId: 8453,
  //   deployer: deployer.address,
  //   contracts: {
  //     StrataForgeAdmin: adminAddress,
  //     StrataForgeERC20Implementation: erc20Address,
  //     StrataForgeERC721Implementation: erc721Address,
  //     StrataForgeERC1155Implementation: erc1155Address,
  //     StrataForgeMemecoinImplementation: memecoinAddress,
  //     StrataForgeStablecoinImplementation: stablecoinAddress,
  //     StrataForgeProxyFactory: proxyFactoryAddress,
  //     StrataForgeFactory: factoryAddress,
  //     StrataForgeAirdropFactory: airdropAddress,
  //   },
  //   deploymentDate: new Date().toISOString(),
  // };

  const deploymentPath = path.join(__dirname, "../deployment-base-sepolia.json");
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log("\nDeployment info saved to:", deploymentPath);

  console.log("\n=== Deployment Summary ===");
  console.log("Network: Base Sepolia (84532)");
  // console.log("Network: Base Mainnet (8453)");
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

  // Save to temp.json (for verification script)
  const deploymentData = {
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
      StrataForgeAirdropFactory: airdropAddress
    },
    deploymentDate: new Date().toISOString()
  };

  // const deploymentData = {
  //   network: "Base Mainnet",
  //   chainId: 8453,
  //   deployer: deployer.address,
  //   contracts: {
  //     StrataForgeAdmin: adminAddress,
  //     StrataForgeERC20Implementation: erc20Address,
  //     StrataForgeERC721Implementation: erc721Address,
  //     StrataForgeERC1155Implementation: erc1155Address,
  //     StrataForgeMemecoinImplementation: memecoinAddress,
  //     StrataForgeStablecoinImplementation: stablecoinAddress,
  //     StrataForgeProxyFactory: proxyFactoryAddress,
  //     StrataForgeFactory: factoryAddress,
  //     StrataForgeAirdropFactory: airdropAddress
  //   },
  //   deploymentDate: new Date().toISOString()
  // };

  const tempPath = path.join(__dirname, "../temp.json");
  fs.writeFileSync(tempPath, JSON.stringify(deploymentData, null, 2));
  console.log("\n✓ Deployment addresses saved to temp.json");

  console.log("\n✓ Deployment completed successfully!");
  console.log("\nBlock Explorer: https://sepolia.basescan.org");
  // console.log("\nBlock Explorer: https://basescan.org");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

