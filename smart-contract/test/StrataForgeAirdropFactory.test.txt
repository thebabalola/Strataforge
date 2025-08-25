import { expect } from "chai";
import { ethers } from "hardhat";
import { Signer } from "ethers";

describe("StrataForgeAirdropFactory", function () {
  let airdropFactory: any;
  let admin: any;
  let factory: any;
  let tokenFactory: any;
  let mockToken: any;
  let mockNFT: any;
  let mockERC1155: any;
  let owner: Signer;
  let user1: Signer;
  let user2: Signer;
  let user3: Signer;
  let user4: Signer;
  let ownerAddress: string;
  let user1Address: string;
  let user2Address: string;
  let user3Address: string;
  let user4Address: string;

  beforeEach(async function () {
    [owner, user1, user2, user3, user4] = await ethers.getSigners();
    ownerAddress = await owner.getAddress();
    user1Address = await user1.getAddress();
    user2Address = await user2.getAddress();
    user3Address = await user3.getAddress();
    user4Address = await user4.getAddress();

    // Deploy admin contract
    const StrataForgeAdmin = await ethers.getContractFactory("StrataForgeAdmin");
    admin = await StrataForgeAdmin.deploy(ownerAddress);

    // Deploy token factory
    const StrataForgeTokenImplementation = await ethers.getContractFactory("StrataForgeTokenImplementation");
    tokenFactory = await StrataForgeTokenImplementation.deploy();

    // Deploy factory contract
    const StrataForgeFactory = await ethers.getContractFactory("StrataForgeFactory");
    factory = await StrataForgeFactory.deploy(admin.address, tokenFactory.address);

    // Deploy airdrop factory
    const StrataForgeAirdropFactory = await ethers.getContractFactory("StrataForgeAirdropFactory");
    airdropFactory = await StrataForgeAirdropFactory.deploy(admin.address);

    // Set up admin contract
    await admin.setFactoryContract(factory.address);
    await admin.setAirdropContract(airdropFactory.address);
    await admin.setFeatureFee(2 * 10**8); // $2 USD

    // Set up airdrop fees
    const newTiers = [
      { minRecipients: 1, maxRecipients: 100, feeUSD: 1 * 10**8 },
      { minRecipients: 101, maxRecipients: 1000, feeUSD: 5 * 10**8 }
    ];
    await admin.setAirdropFees(newTiers);

    // Deploy mock tokens for testing
    const MockERC20 = await ethers.getContractFactory("StrataForgeERC20Implementation");
    mockToken = await MockERC20.deploy();
    await mockToken.initialize("Mock Token", "MTK", 1000000, 18, user1Address, [true, false, true]);

    const MockERC721 = await ethers.getContractFactory("StrataForgeERC721Implementation");
    mockNFT = await MockERC721.deploy();
    await mockNFT.initialize("Mock NFT", "MNFT", user1Address, [true, false, true]);

    const MockERC1155 = await ethers.getContractFactory("StrataForgeERC1155Implementation");
    mockERC1155 = await MockERC1155.deploy();
    await mockERC1155.initialize("https://example.com/metadata/{id}", user1Address, [true, false, true]);
  });

  describe("Deployment", function () {
    it("Should deploy with correct initial state", async function () {
      expect(await airdropFactory.adminContract()).to.equal(admin.address);
      expect(await airdropFactory.airdrops(0)).to.deep.equal([
        ethers.ZeroAddress, // distributor
        ethers.ZeroAddress, // token
        ethers.ZeroAddress, // creator
        0n, // startTime
        0n, // totalRecipients
        0n, // dropAmount
        0n, // tokenType
        0n  // reserved
      ]);
    });
  });

  describe("Admin Management", function () {
    it("Should allow admin to update admin contract", async function () {
      const newAdmin = await ethers.getContractFactory("StrataForgeAdmin");
      const newAdminContract = await newAdmin.deploy(user1Address);
      
      await airdropFactory.updateAdminContract(newAdminContract.address);
      expect(await airdropFactory.adminContract()).to.equal(newAdminContract.address);
    });

    it("Should emit AdminContractUpdated event", async function () {
      const newAdmin = await ethers.getContractFactory("StrataForgeAdmin");
      const newAdminContract = await newAdmin.deploy(user1Address);
      
      await expect(airdropFactory.updateAdminContract(newAdminContract.address))
        .to.emit(airdropFactory, "AdminContractUpdated")
        .withArgs(newAdminContract.address);
    });

    it("Should revert when non-admin tries to update admin contract", async function () {
      const newAdmin = await ethers.getContractFactory("StrataForgeAdmin");
      const newAdminContract = await newAdmin.deploy(user1Address);
      
      await expect(
        airdropFactory.connect(user1).updateAdminContract(newAdminContract.address)
      ).to.be.revertedWith("Not admin");
    });
  });

  describe("ERC20 Airdrop Creation", function () {
    it("Should create ERC20 airdrop successfully", async function () {
      const token = mockToken.address;
      const merkleRoot = ethers.keccak256(ethers.toUtf8Bytes("test merkle root"));
      const dropAmount = ethers.parseEther("1000");
      const totalRecipients = 50;
      const startTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
      const payment = ethers.parseEther("0.05");

      const tx = await airdropFactory.connect(user1).createERC20Airdrop(
        token, merkleRoot, dropAmount, totalRecipients, startTime,
        { value: payment }
      );

      const receipt = await tx.wait();
      const event = receipt?.logs.find((log: any) => 
        log.fragment?.name === "AirdropCreated"
      );

      expect(event).to.not.be.undefined;
      expect(await airdropFactory.airdrops(0)).to.not.deep.equal([
        ethers.ZeroAddress, ethers.ZeroAddress, ethers.ZeroAddress, 0n, 0n, 0n, 0n, 0n
      ]);
    });

    it("Should emit AirdropCreated event", async function () {
      const token = mockToken.address;
      const merkleRoot = ethers.keccak256(ethers.toUtf8Bytes("test merkle root"));
      const dropAmount = ethers.parseEther("1000");
      const totalRecipients = 50;
      const startTime = Math.floor(Date.now() / 1000) + 3600;
      const payment = ethers.parseEther("0.05");

      await expect(
        airdropFactory.connect(user1).createERC20Airdrop(
          token, merkleRoot, dropAmount, totalRecipients, startTime,
          { value: payment }
        )
      ).to.emit(airdropFactory, "AirdropCreated")
        .withArgs(user1Address, ethers.anyValue, token, 0, totalRecipients, 0);
    });

    it("Should revert with insufficient payment", async function () {
      const token = mockToken.address;
      const merkleRoot = ethers.keccak256(ethers.toUtf8Bytes("test merkle root"));
      const dropAmount = ethers.parseEther("1000");
      const totalRecipients = 50;
      const startTime = Math.floor(Date.now() / 1000) + 3600;
      const payment = ethers.parseEther("0.001");

      await expect(
        airdropFactory.connect(user1).createERC20Airdrop(
          token, merkleRoot, dropAmount, totalRecipients, startTime,
          { value: payment }
        )
      ).to.be.revertedWithCustomError(admin, "InsufficientPayment");
    });
  });

  describe("ERC721 Airdrop Creation", function () {
    it("Should create ERC721 airdrop successfully", async function () {
      const token = mockNFT.address;
      const merkleRoot = ethers.keccak256(ethers.toUtf8Bytes("test merkle root"));
      const tokenIds = [1, 2, 3, 4, 5];
      const startTime = Math.floor(Date.now() / 1000) + 3600;
      const payment = ethers.parseEther("0.05");

      const tx = await airdropFactory.connect(user1).createERC721Airdrop(
        token, merkleRoot, tokenIds, startTime,
        { value: payment }
      );

      const receipt = await tx.wait();
      const event = receipt?.logs.find((log: any) => 
        log.fragment?.name === "AirdropCreated"
      );

      expect(event).to.not.be.undefined;
    });

    it("Should emit AirdropCreated event for ERC721", async function () {
      const token = mockNFT.address;
      const merkleRoot = ethers.keccak256(ethers.toUtf8Bytes("test merkle root"));
      const tokenIds = [1, 2, 3, 4, 5];
      const startTime = Math.floor(Date.now() / 1000) + 3600;
      const payment = ethers.parseEther("0.05");

      await expect(
        airdropFactory.connect(user1).createERC721Airdrop(
          token, merkleRoot, tokenIds, startTime,
          { value: payment }
        )
      ).to.emit(airdropFactory, "AirdropCreated")
        .withArgs(user1Address, ethers.anyValue, token, 1, tokenIds.length, 0);
    });
  });

  describe("ERC1155 Airdrop Creation", function () {
    it("Should create ERC1155 airdrop successfully", async function () {
      const token = mockERC1155.address;
      const merkleRoot = ethers.keccak256(ethers.toUtf8Bytes("test merkle root"));
      const tokenIds = [1, 2, 3];
      const amounts = [100, 200, 300];
      const startTime = Math.floor(Date.now() / 1000) + 3600;
      const payment = ethers.parseEther("0.05");

      const tx = await airdropFactory.connect(user1).createERC1155Airdrop(
        token, merkleRoot, tokenIds, amounts, startTime,
        { value: payment }
      );

      const receipt = await tx.wait();
      const event = receipt?.logs.find((log: any) => 
        log.fragment?.name === "AirdropCreated"
      );

      expect(event).to.not.be.undefined;
    });

    it("Should emit AirdropCreated event for ERC1155", async function () {
      const token = mockERC1155.address;
      const merkleRoot = ethers.keccak256(ethers.toUtf8Bytes("test merkle root"));
      const tokenIds = [1, 2, 3];
      const amounts = [100, 200, 300];
      const startTime = Math.floor(Date.now() / 1000) + 3600;
      const payment = ethers.parseEther("0.05");

      await expect(
        airdropFactory.connect(user1).createERC1155Airdrop(
          token, merkleRoot, tokenIds, amounts, startTime,
          { value: payment }
        )
      ).to.emit(airdropFactory, "AirdropCreated")
        .withArgs(user1Address, ethers.anyValue, token, 2, tokenIds.length, 0);
    });
  });

  describe("Airdrop Management", function () {
    beforeEach(async function () {
      // Create an airdrop first
      const token = mockToken.address;
      const merkleRoot = ethers.keccak256(ethers.toUtf8Bytes("test merkle root"));
      const dropAmount = ethers.parseEther("1000");
      const totalRecipients = 50;
      const startTime = Math.floor(Date.now() / 1000) + 3600;
      const payment = ethers.parseEther("0.05");

      await airdropFactory.connect(user1).createERC20Airdrop(
        token, merkleRoot, dropAmount, totalRecipients, startTime,
        { value: payment }
      );
    });

    it("Should return correct airdrop count", async function () {
      expect(await airdropFactory.getAirdropCount()).to.equal(1);
    });

    it("Should return correct creator airdrops", async function () {
      const creatorAirdrops = await airdropFactory.getCreatorAirdrops(user1Address);
      expect(creatorAirdrops.length).to.equal(1);
      expect(creatorAirdrops[0]).to.equal(0); // First airdrop has index 0
    });

    it("Should return correct airdrop info", async function () {
      const airdropInfo = await airdropFactory.getAirdropInfo(0);
      expect(airdropInfo.creator).to.equal(user1Address);
      expect(airdropInfo.token).to.equal(mockToken.address);
      expect(airdropInfo.totalRecipients).to.equal(50);
    });

    it("Should return empty array for user with no airdrops", async function () {
      const creatorAirdrops = await airdropFactory.getCreatorAirdrops(user2Address);
      expect(creatorAirdrops.length).to.equal(0);
    });
  });

  describe("Multiple Airdrops", function () {
    it("Should allow multiple airdrops from same creator", async function () {
      const token = mockToken.address;
      const merkleRoot = ethers.keccak256(ethers.toUtf8Bytes("test merkle root"));
      const dropAmount = ethers.parseEther("1000");
      const totalRecipients = 50;
      const startTime = Math.floor(Date.now() / 1000) + 3600;
      const payment = ethers.parseEther("0.05");

      // Create first airdrop
      await airdropFactory.connect(user1).createERC20Airdrop(
        token, merkleRoot, dropAmount, totalRecipients, startTime,
        { value: payment }
      );

      // Create second airdrop
      await airdropFactory.connect(user1).createERC20Airdrop(
        token, merkleRoot, dropAmount, totalRecipients, startTime,
        { value: payment }
      );

      expect(await airdropFactory.getAirdropCount()).to.equal(2);
      
      const creatorAirdrops = await airdropFactory.getCreatorAirdrops(user1Address);
      expect(creatorAirdrops.length).to.equal(2);
      expect(creatorAirdrops[0]).to.equal(0);
      expect(creatorAirdrops[1]).to.equal(1);
    });

    it("Should handle airdrops from different creators", async function () {
      const token = mockToken.address;
      const merkleRoot = ethers.keccak256(ethers.toUtf8Bytes("test merkle root"));
      const dropAmount = ethers.parseEther("1000");
      const totalRecipients = 50;
      const startTime = Math.floor(Date.now() / 1000) + 3600;
      const payment = ethers.parseEther("0.05");

      // Create airdrop from user1
      await airdropFactory.connect(user1).createERC20Airdrop(
        token, merkleRoot, dropAmount, totalRecipients, startTime,
        { value: payment }
      );

      // Create airdrop from user2
      await airdropFactory.connect(user2).createERC20Airdrop(
        token, merkleRoot, dropAmount, totalRecipients, startTime,
        { value: payment }
      );

      expect(await airdropFactory.getAirdropCount()).to.equal(2);
      
      const user1Airdrops = await airdropFactory.getCreatorAirdrops(user1Address);
      const user2Airdrops = await airdropFactory.getCreatorAirdrops(user2Address);
      
      expect(user1Airdrops.length).to.equal(1);
      expect(user2Airdrops.length).to.equal(1);
      expect(user1Airdrops[0]).to.equal(0);
      expect(user2Airdrops[0]).to.equal(1);
    });
  });

  describe("Edge Cases", function () {
    it("Should handle zero address token", async function () {
      const token = ethers.ZeroAddress;
      const merkleRoot = ethers.keccak256(ethers.toUtf8Bytes("test merkle root"));
      const dropAmount = ethers.parseEther("1000");
      const totalRecipients = 50;
      const startTime = Math.floor(Date.now() / 1000) + 3600;
      const payment = ethers.parseEther("0.05");

      // This should still work as the contract doesn't validate token address
      await airdropFactory.connect(user1).createERC20Airdrop(
        token, merkleRoot, dropAmount, totalRecipients, startTime,
        { value: payment }
      );

      expect(await airdropFactory.getAirdropCount()).to.equal(1);
    });

    it("Should handle past start time", async function () {
      const token = mockToken.address;
      const merkleRoot = ethers.keccak256(ethers.toUtf8Bytes("test merkle root"));
      const dropAmount = ethers.parseEther("1000");
      const totalRecipients = 50;
      const startTime = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
      const payment = ethers.parseEther("0.05");

      // This should still work as the contract doesn't validate start time
      await airdropFactory.connect(user1).createERC20Airdrop(
        token, merkleRoot, dropAmount, totalRecipients, startTime,
        { value: payment }
      );

      expect(await airdropFactory.getAirdropCount()).to.equal(1);
    });

    it("Should handle large recipient counts", async function () {
      const token = mockToken.address;
      const merkleRoot = ethers.keccak256(ethers.toUtf8Bytes("test merkle root"));
      const dropAmount = ethers.parseEther("1000");
      const totalRecipients = 10000;
      const startTime = Math.floor(Date.now() / 1000) + 3600;
      const payment = ethers.parseEther("0.1"); // Higher payment for more recipients

      await airdropFactory.connect(user1).createERC20Airdrop(
        token, merkleRoot, dropAmount, totalRecipients, startTime,
        { value: payment }
      );

      expect(await airdropFactory.getAirdropCount()).to.equal(1);
    });
  });
});
