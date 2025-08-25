import { expect } from "chai";
import { ethers } from "hardhat";
import { Signer } from "ethers";

describe("StrataForgeFactory", function () {
  let factory: any;
  let admin: any;
  let tokenFactory: any;
  let owner: Signer;
  let user1: Signer;
  let user2: Signer;
  let user3: Signer;
  let ownerAddress: string;
  let user1Address: string;
  let user2Address: string;
  let user3Address: string;

  beforeEach(async function () {
    [owner, user1, user2, user3] = await ethers.getSigners();
    ownerAddress = await owner.getAddress();
    user1Address = await user1.getAddress();
    user2Address = await user2.getAddress();
    user3Address = await user3.getAddress();

    // Deploy admin contract
    const StrataForgeAdmin = await ethers.getContractFactory("StrataForgeAdmin");
    admin = await StrataForgeAdmin.deploy(ownerAddress);

    // Deploy token factory (using ERC20 implementation as the main factory)
    const StrataForgeERC20Implementation = await ethers.getContractFactory("StrataForgeERC20Implementation");
    tokenFactory = await StrataForgeERC20Implementation.deploy();

    // Deploy factory contract
    const StrataForgeFactory = await ethers.getContractFactory("StrataForgeFactory");
    factory = await StrataForgeFactory.deploy(await admin.getAddress(), await tokenFactory.getAddress());

    // Set up admin contract
    await admin.setFactoryContract(await factory.getAddress());
    await admin.setFeatureFee(2 * 10**8); // $2 USD
  });

  describe("Deployment", function () {
    it("Should deploy with correct initial state", async function () {
      expect(await factory.adminContract()).to.equal(await admin.getAddress());
      expect(await factory.tokenFactory()).to.equal(await tokenFactory.getAddress());
      expect(await factory.tokenIdCounter()).to.equal(0);
    });

    it("Should allow admin to update admin contract", async function () {
      const newAdmin = await ethers.getContractFactory("StrataForgeAdmin");
      const newAdminContract = await newAdmin.deploy(user1Address);
      
      await factory.updateAdminContract(await newAdminContract.getAddress());
      expect(await factory.adminContract()).to.equal(await newAdminContract.getAddress());
    });

    it("Should revert when non-admin tries to update admin contract", async function () {
      const newAdmin = await ethers.getContractFactory("StrataForgeAdmin");
      const newAdminContract = await newAdmin.deploy(user1Address);
      
      await expect(
        factory.connect(user1).updateAdminContract(await newAdminContract.getAddress())
      ).to.be.revertedWithCustomError(factory, "NotAdmin");
    });
  });

  describe("ERC20 Token Creation", function () {
    it("Should create ERC20 token successfully", async function () {
      const name = "Test Token";
      const symbol = "TEST";
      const initialSupply = 1000000;
      const decimals = 18;
      const features = [true, false, true, false, false]; // [mint, burn, pause, etc.]

      const tx = await factory.connect(user1).createERC20(
        name, symbol, initialSupply, decimals, features,
        { value: ethers.parseEther("0.1") }
      );

      const receipt = await tx.wait();
      const event = receipt?.logs.find((log: any) => 
        log.fragment?.name === "TokenCreated"
      );

      expect(event).to.not.be.undefined;
      expect(await factory.tokenIdCounter()).to.equal(1);
      
      const tokenInfo = await factory.getTokenById(1);
      expect(tokenInfo.name).to.equal(name);
      expect(tokenInfo.symbol).to.equal(symbol);
      expect(tokenInfo.initialSupply).to.equal(initialSupply);
      expect(tokenInfo.creator).to.equal(user1Address);
    });

    it("Should revert with empty name", async function () {
      const features = [true, false, true];
      
      await expect(
        factory.connect(user1).createERC20(
          "", "TEST", 1000000, 18, features,
          { value: ethers.parseEther("0.1") }
        )
      ).to.be.revertedWithCustomError(factory, "InvalidName");
    });

    it("Should revert with empty symbol", async function () {
      const features = [true, false, true];
      
      await expect(
        factory.connect(user1).createERC20(
          "Test Token", "", 1000000, 18, features,
          { value: ethers.parseEther("0.1") }
        )
      ).to.be.revertedWithCustomError(factory, "InvalidSymbol");
    });

    it("Should revert with zero initial supply", async function () {
      const features = [true, false, true];
      
      await expect(
        factory.connect(user1).createERC20(
          "Test Token", "TEST", 0, 18, features,
          { value: ethers.parseEther("0.1") }
        )
      ).to.be.revertedWithCustomError(factory, "InvalidSupply");
    });

    it("Should revert with insufficient payment", async function () {
      const features = [true, false, true];
      
      await expect(
        factory.connect(user1).createERC20(
          "Test Token", "TEST", 1000000, 18, features,
          { value: ethers.parseEther("0.001") }
        )
      ).to.be.revertedWithCustomError(factory, "InsufficientPayment");
    });
  });

  describe("ERC721 Token Creation", function () {
    it("Should create ERC721 token successfully", async function () {
      const name = "Test NFT";
      const symbol = "TNFT";
      const features = [true, false, true, false];

      const tx = await factory.connect(user1).createERC721(
        name, symbol, features,
        { value: ethers.parseEther("0.1") }
      );

      const receipt = await tx.wait();
      const event = receipt?.logs.find((log: any) => 
        log.fragment?.name === "TokenCreated"
      );

      expect(event).to.not.be.undefined;
      expect(await factory.tokenIdCounter()).to.equal(1);
      
      const tokenInfo = await factory.getTokenById(1);
      expect(tokenInfo.name).to.equal(name);
      expect(tokenInfo.symbol).to.equal(symbol);
      expect(tokenInfo.initialSupply).to.equal(0);
      expect(tokenInfo.creator).to.equal(user1Address);
    });
  });

  describe("ERC1155 Token Creation", function () {
    it("Should create ERC1155 token successfully", async function () {
      const uri = "https://example.com/metadata/{id}";
      const features = [true, false, true];

      const tx = await factory.connect(user1).createERC1155(
        uri, features,
        { value: ethers.parseEther("0.1") }
      );

      const receipt = await tx.wait();
      const event = receipt?.logs.find((log: any) => 
        log.fragment?.name === "TokenCreated"
      );

      expect(event).to.not.be.undefined;
      expect(await factory.tokenIdCounter()).to.equal(1);
      
      const tokenInfo = await factory.getTokenById(1);
      expect(tokenInfo.name).to.equal("ERC1155");
      expect(tokenInfo.symbol).to.equal("MULTI");
      expect(tokenInfo.creator).to.equal(user1Address);
    });

    it("Should revert with empty URI", async function () {
      const features = [true, false, true];
      
      await expect(
        factory.connect(user1).createERC1155(
          "", features,
          { value: ethers.parseEther("0.1") }
        )
      ).to.be.revertedWithCustomError(factory, "InvalidURI");
    });
  });

  describe("Memecoin Creation", function () {
    it("Should create memecoin successfully", async function () {
      const name = "Test Meme";
      const symbol = "MEME";
      const initialSupply = 1000000000;
      const decimals = 18;
      const maxWalletSize = 10000000;
      const maxTransactionAmount = 1000000;
      const features = [true, false, true, true];

      const tx = await factory.connect(user1).createMemecoin(
        name, symbol, initialSupply, decimals, maxWalletSize, maxTransactionAmount, features,
        { value: ethers.parseEther("0.1") }
      );

      const receipt = await tx.wait();
      const event = receipt?.logs.find((log: any) => 
        log.fragment?.name === "TokenCreated"
      );

      expect(event).to.not.be.undefined;
      expect(await factory.tokenIdCounter()).to.equal(1);
      
      const tokenInfo = await factory.getTokenById(1);
      expect(tokenInfo.name).to.equal(name);
      expect(tokenInfo.symbol).to.equal(symbol);
      expect(tokenInfo.initialSupply).to.equal(initialSupply);
      expect(tokenInfo.creator).to.equal(user1Address);
    });
  });

  describe("Stablecoin Creation", function () {
    it("Should create stablecoin successfully", async function () {
      const name = "Test Stable";
      const symbol = "STBL";
      const collateralToken = user2Address; // Mock collateral token
      const collateralRatio = 150; // 150%
      const treasury = user3Address;
      const features = [true, false, true, false];

      const tx = await factory.connect(user1).createStablecoin(
        name, symbol, collateralToken, collateralRatio, treasury, features,
        { value: ethers.parseEther("0.1") }
      );

      const receipt = await tx.wait();
      const event = receipt?.logs.find((log: any) => 
        log.fragment?.name === "TokenCreated"
      );

      expect(event).to.not.be.undefined;
      expect(await factory.tokenIdCounter()).to.equal(1);
      
      const tokenInfo = await factory.getTokenById(1);
      expect(tokenInfo.name).to.equal(name);
      expect(tokenInfo.symbol).to.equal(symbol);
      expect(tokenInfo.creator).to.equal(user1Address);
    });

    it("Should revert with zero collateral token address", async function () {
      const features = [true, false, true];
      
      await expect(
        factory.connect(user1).createStablecoin(
          "Test Stable", "STBL", ethers.ZeroAddress, 150, user3Address, features,
          { value: ethers.parseEther("0.1") }
        )
      ).to.be.revertedWithCustomError(factory, "InvalidCollateralToken");
    });

    it("Should revert with zero treasury address", async function () {
      const features = [true, false, true];
      
      await expect(
        factory.connect(user1).createStablecoin(
          "Test Stable", "STBL", user2Address, 150, ethers.ZeroAddress, features,
          { value: ethers.parseEther("0.1") }
        )
      ).to.be.revertedWithCustomError(factory, "InvalidTreasury");
    });
  });

  describe("Pause/Unpause Functionality", function () {
    it("Should allow admin to pause and unpause", async function () {
      await factory.pause();
      expect(await factory.paused()).to.be.true;

      await factory.unpause();
      expect(await factory.paused()).to.be.false;
    });

    it("Should revert when non-admin tries to pause", async function () {
      await expect(
        factory.connect(user1).pause()
      ).to.be.revertedWithCustomError(factory, "NotAdmin");
    });

    it("Should revert token creation when paused", async function () {
      await factory.pause();
      
      const features = [true, false, true];
      await expect(
        factory.connect(user1).createERC20(
          "Test", "TEST", 1000000, 18, features,
          { value: ethers.parseEther("0.1") }
        )
      ).to.be.revertedWithCustomError(factory, "EnforcedPause");
    });
  });

  describe("Token Registry Functions", function () {
    beforeEach(async function () {
      // Create a token first
      const features = [true, false, true];
      await factory.connect(user1).createERC20(
        "Test Token", "TEST", 1000000, 18, features,
        { value: ethers.parseEther("0.1") }
      );
    });

    it("Should return correct token count for creator", async function () {
      expect(await factory.getTokenCount(user1Address)).to.equal(1);
      expect(await factory.getTokenCount(user2Address)).to.equal(0);
    });

    it("Should return correct total token count", async function () {
      expect(await factory.getTotalTokenCount()).to.equal(1);
    });

    it("Should return correct token info by ID", async function () {
      const tokenInfo = await factory.getTokenById(1);
      expect(tokenInfo.name).to.equal("Test Token");
      expect(tokenInfo.symbol).to.equal("TEST");
      expect(tokenInfo.creator).to.equal(user1Address);
    });

    it("Should revert when getting non-existent token", async function () {
      await expect(
        factory.getTokenById(999)
      ).to.be.revertedWithCustomError(factory, "InvalidTokenId");
    });

    it("Should revert when getting token with ID 0", async function () {
      await expect(
        factory.getTokenById(0)
      ).to.be.revertedWithCustomError(factory, "InvalidTokenId");
    });
  });

  describe("Feature Counting", function () {
    it("Should count features correctly", async function () {
      const features1 = [true, false, true, false, true];
      const features2 = [false, false, false];
      const features3 = [true, true, true, true, true];

      // Create tokens with different feature counts
      await factory.connect(user1).createERC20(
        "Token1", "T1", 1000000, 18, features1,
        { value: ethers.parseEther("0.1") }
      );

      await factory.connect(user2).createERC20(
        "Token2", "T2", 1000000, 18, features2,
        { value: ethers.parseEther("0.1") }
      );

      await factory.connect(user3).createERC20(
        "Token3", "T3", 1000000, 18, features3,
        { value: ethers.parseEther("0.1") }
      );

      expect(await factory.getTotalTokenCount()).to.equal(3);
    });
  });

  describe("Multiple Token Creation", function () {
    it("Should allow multiple tokens from same creator", async function () {
      const features = [true, false, true];

      // Create first token
      await factory.connect(user1).createERC20(
        "Token1", "T1", 1000000, 18, features,
        { value: ethers.parseEther("0.1") }
      );

      // Create second token
      await factory.connect(user1).createERC721(
        "NFT1", "NFT1", features,
        { value: ethers.parseEther("0.1") }
      );

      expect(await factory.getTokenCount(user1Address)).to.equal(2);
      expect(await factory.getTotalTokenCount()).to.equal(2);

      const token1 = await factory.getTokenById(1);
      const token2 = await factory.getTokenById(2);

      expect(token1.name).to.equal("Token1");
      expect(token2.name).to.equal("NFT1");
    });
  });
});
