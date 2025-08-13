const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const deployerAddress = "0x0eE1F2b663547dAa487F57C517C7563AdCf86da0";
  
  console.log("Deploying contracts to Core Testnet with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "tCORE");

  // Updated gas settings - higher gas limit, lower gas price
  const gasSettings = {
    maxFeePerGas: ethers.parseUnits("30", "gwei"),
    maxPriorityFeePerGas: ethers.parseUnits("1", "gwei"), // Reduced tip
    gasLimit: 6000000 // Increased gas limit
  };

  console.log("\n=== Deploying Token Implementations ===");

  // Deploy ERC20 Implementation
  console.log("Deploying ERC20 Implementation...");
  const StrataForgeERC20Implementation = await ethers.getContractFactory("StrataForgeERC20Implementation");
  const erc20Implementation = await StrataForgeERC20Implementation.deploy(gasSettings);
  await erc20Implementation.waitForDeployment();
  const erc20Address = await erc20Implementation.getAddress();
  console.log("✅ StrataForgeERC20Implementation deployed to:", erc20Address);

  // Deploy ERC721 Implementation
  console.log("Deploying ERC721 Implementation...");
  const StrataForgeERC721Implementation = await ethers.getContractFactory("StrataForgeERC721Implementation");
  const erc721Implementation = await StrataForgeERC721Implementation.deploy(gasSettings);
  await erc721Implementation.waitForDeployment();
  const erc721Address = await erc721Implementation.getAddress();
  console.log("✅ StrataForgeERC721Implementation deployed to:", erc721Address);

  // Deploy ERC1155 Implementation
  console.log("Deploying ERC1155 Implementation...");
  const StrataForgeERC1155Implementation = await ethers.getContractFactory("StrataForgeERC1155Implementation");
  const erc1155Implementation = await StrataForgeERC1155Implementation.deploy(gasSettings);
  await erc1155Implementation.waitForDeployment();
  const erc1155Address = await erc1155Implementation.getAddress();
  console.log("✅ StrataForgeERC1155Implementation deployed to:", erc1155Address);

  // Deploy Memecoin Implementation
  console.log("Deploying Memecoin Implementation...");
  const StrataForgeMemecoinImplementation = await ethers.getContractFactory("StrataForgeMemecoinImplementation");
  const memecoinImplementation = await StrataForgeMemecoinImplementation.deploy(gasSettings);
  await memecoinImplementation.waitForDeployment();
  const memecoinAddress = await memecoinImplementation.getAddress();
  console.log("✅ StrataForgeMemecoinImplementation deployed to:", memecoinAddress);

  // Deploy Stablecoin Implementation
  console.log("Deploying Stablecoin Implementation...");
  const StrataForgeStablecoinImplementation = await ethers.getContractFactory("StrataForgeStablecoinImplementation");
  const stablecoinImplementation = await StrataForgeStablecoinImplementation.deploy(gasSettings);
  await stablecoinImplementation.waitForDeployment();
  const stablecoinAddress = await stablecoinImplementation.getAddress();
  console.log("✅ StrataForgeStablecoinImplementation deployed to:", stablecoinAddress);

  console.log("\n=== Deploying Core Contracts ===");

  // Deploy Proxy Factory
  console.log("Deploying Proxy Factory...");
  const StrataForgeProxyFactory = await ethers.getContractFactory("StrataForgeProxyFactory");
  const proxyFactory = await StrataForgeProxyFactory.deploy(
    erc20Address,
    erc721Address,
    erc1155Address,
    memecoinAddress,
    stablecoinAddress,
    gasSettings
  );
  await proxyFactory.waitForDeployment();
  const proxyFactoryAddress = await proxyFactory.getAddress();
  console.log("✅ StrataForgeProxyFactory deployed to:", proxyFactoryAddress);

  // Deploy Admin Contract
  console.log("Deploying Admin Contract...");
  const StrataForgeAdmin = await ethers.getContractFactory("StrataForgeAdmin");
  const adminContract = await StrataForgeAdmin.deploy(deployerAddress, gasSettings);
  await adminContract.waitForDeployment();
  const adminAddress = await adminContract.getAddress();
  console.log("✅ StrataForgeAdmin deployed to:", adminAddress);

  // Deploy Main Factory
  console.log("Deploying Main Factory...");
  const StrataForgeFactory = await ethers.getContractFactory("StrataForgeFactory");
  const factoryContract = await StrataForgeFactory.deploy(adminAddress, proxyFactoryAddress, gasSettings);
  await factoryContract.waitForDeployment();
  const factoryAddress = await factoryContract.getAddress();
  console.log("✅ StrataForgeFactory deployed to:", factoryAddress);

  // Deploy Airdrop Factory
  console.log("Deploying Airdrop Factory...");
  const StrataForgeAirdropFactory = await ethers.getContractFactory("StrataForgeAirdropFactory");
  const airdropFactory = await StrataForgeAirdropFactory.deploy(adminAddress, gasSettings);
  await airdropFactory.waitForDeployment();
  const airdropAddress = await airdropFactory.getAddress();
  console.log("✅ StrataForgeAirdropFactory deployed to:", airdropAddress);

  console.log("\n=== Linking Contracts ===");

  // Link contracts in Admin
  console.log("Linking Factory contract in Admin...");
  const setFactoryTx = await adminContract.setFactoryContract(factoryAddress, gasSettings);
  await setFactoryTx.wait();
  console.log("✅ Factory contract linked in Admin");

  console.log("Linking Airdrop contract in Admin...");
  const setAirdropTx = await adminContract.setAirdropContract(airdropAddress, gasSettings);
  await setAirdropTx.wait();
  console.log("✅ Airdrop contract linked in Admin");

  console.log("\n=== Deployment Summary ===");
  console.log("Network: Core Testnet (1115)");
  console.log("Deployer:", deployerAddress);
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
  console.log("You can verify these contracts manually on Core Scan:");
  console.log("https://scan.test.btcs.network");
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
