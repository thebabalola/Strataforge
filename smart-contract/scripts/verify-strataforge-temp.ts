import { run } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("🔍 Verifying StrataForge contracts on Basescan (Base Sepolia)...\n");
  // console.log("🔍 Verifying StrataForge contracts on Basescan (Base Mainnet)...\n");

  // Load deployment information from temp.json
  const deploymentPath = path.join(__dirname, "../temp.json");
  const deploymentData = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));

  const deployerAddress = deploymentData.deployer;
  const contracts = deploymentData.contracts;

  console.log("📋 Deployed Contracts:");
  console.log(`   Network: ${deploymentData.network} (Chain ID: ${deploymentData.chainId})`);
  console.log(`   Deployer: ${deployerAddress}\n`);

  // Define contracts with their constructor arguments
  const contractsToVerify = [
    {
      name: "StrataForgeERC20Implementation",
      address: contracts.StrataForgeERC20Implementation,
      constructorArgs: [] // No constructor arguments
    },
    {
      name: "StrataForgeERC721Implementation",
      address: contracts.StrataForgeERC721Implementation,
      constructorArgs: [] // No constructor arguments
    },
    {
      name: "StrataForgeERC1155Implementation",
      address: contracts.StrataForgeERC1155Implementation,
      constructorArgs: [] // No constructor arguments
    },
    {
      name: "StrataForgeMemecoinImplementation",
      address: contracts.StrataForgeMemecoinImplementation,
      constructorArgs: [] // No constructor arguments
    },
    {
      name: "StrataForgeStablecoinImplementation",
      address: contracts.StrataForgeStablecoinImplementation,
      constructorArgs: [] // No constructor arguments
    },
    {
      name: "StrataForgeProxyFactory",
      address: contracts.StrataForgeProxyFactory,
      constructorArgs: [
        contracts.StrataForgeERC20Implementation,
        contracts.StrataForgeERC721Implementation,
        contracts.StrataForgeERC1155Implementation,
        contracts.StrataForgeMemecoinImplementation,
        contracts.StrataForgeStablecoinImplementation
      ]
    },
    {
      name: "StrataForgeAdmin",
      address: contracts.StrataForgeAdmin,
      constructorArgs: [deployerAddress] // owner address
    },
    {
      name: "StrataForgeFactory",
      address: contracts.StrataForgeFactory,
      constructorArgs: [
        contracts.StrataForgeAdmin, // admin contract
        contracts.StrataForgeProxyFactory // proxy factory
      ]
    },
    {
      name: "StrataForgeAirdropFactory",
      address: contracts.StrataForgeAirdropFactory,
      constructorArgs: [
        contracts.StrataForgeAdmin // admin contract
      ]
    }
  ];

  console.log("📋 Contracts to verify:");
  contractsToVerify.forEach(contract => {
    console.log(`  - ${contract.name}: ${contract.address}`);
  });
  console.log();

  console.log("🚀 Starting verification process...\n");

  for (const contract of contractsToVerify) {
    try {
      console.log(`🔍 Verifying ${contract.name}...`);
      
      await run("verify:verify", {
        address: contract.address,
        constructorArguments: contract.constructorArgs,
      });
      
      console.log(`✅ ${contract.name} verified successfully!`);
      console.log(`🔗 View on Basescan: https://sepolia.basescan.org/address/${contract.address}\n`);
      // console.log(`🔗 View on Basescan: https://basescan.org/address/${contract.address}\n`);
      
      // Add delay between verifications to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 5000));
      
    } catch (error: any) {
      if (error.message && error.message.includes("Already Verified")) {
        console.log(`✅ ${contract.name} is already verified!`);
      } else if (error.message && error.message.includes("Contract source code already verified")) {
        console.log(`✅ ${contract.name} is already verified (different message)!`);
      } else {
        console.log(`❌ Failed to verify ${contract.name}:`, error.message);
      }
      console.log();
    }
  }

  console.log("🎉 Verification process completed!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

