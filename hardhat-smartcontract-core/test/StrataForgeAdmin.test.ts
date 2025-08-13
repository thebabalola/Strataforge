import { expect } from "chai";
import { ethers } from "hardhat";
import { Signer } from "ethers";

describe("StrataForgeAdmin", function () {
  let admin: any;
  let factory: any;
  let tokenFactory: any;
  let airdropFactory: any;
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

    // Deploy token factory (using ERC20 implementation as the main factory)
    const StrataForgeERC20Implementation = await ethers.getContractFactory("StrataForgeERC20Implementation");
    tokenFactory = await StrataForgeERC20Implementation.deploy();

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
  });

  describe("Deployment", function () {
    it("Should deploy with correct initial state", async function () {
      expect(await admin.owner()).to.equal(ownerAddress);
      expect(await admin.adminCount()).to.equal(1);
      expect(await admin.admin(0)).to.equal(ownerAddress);
      expect(await admin.featureFeeUSD()).to.equal(2 * 10**8);
    });

    it("Should have owner as first admin", async function () {
      expect(await admin.admin(0)).to.equal(ownerAddress);
    });
  });

  describe("Admin Management", function () {
    it("Should allow adding new admin", async function () {
      await admin.addAdmin(user1Address);
      expect(await admin.adminCount()).to.equal(2);
      expect(await admin.admin(1)).to.equal(user1Address);
    });

    it("Should emit AdminAdded event", async function () {
      await expect(admin.addAdmin(user1Address))
        .to.emit(admin, "AdminAdded")
        .withArgs(user1Address);
    });

    it("Should revert when adding admin at limit", async function () {
      // Add admins up to the limit (assuming limit is 255 based on uint8)
      for (let i = 1; i <= 254; i++) {
        const signer = await ethers.getSigner(i.toString());
        await admin.addAdmin(await signer.getAddress());
      }

      await expect(
        admin.addAdmin(user4Address)
      ).to.be.revertedWithCustomError(admin, "AdminLimitReached");
    });

    it("Should allow removing admin", async function () {
      await admin.addAdmin(user1Address);
      await admin.addAdmin(user2Address);
      
      await admin.removeAdmin(user1Address);
      expect(await admin.adminCount()).to.equal(2);
      expect(await admin.admin(1)).to.equal(user2Address);
    });

    it("Should emit AdminRemoved event", async function () {
      await admin.addAdmin(user1Address);
      await expect(admin.removeAdmin(user1Address))
        .to.emit(admin, "AdminRemoved")
        .withArgs(user1Address);
    });

    it("Should revert when removing last admin", async function () {
      await expect(
        admin.removeAdmin(ownerAddress)
      ).to.be.revertedWithCustomError(admin, "CannotRemoveLastAdmin");
    });

    it("Should revert when removing non-existent admin", async function () {
      await expect(
        admin.removeAdmin(user1Address)
      ).to.be.revertedWithCustomError(admin, "NotAdmin");
    });
  });

  describe("Contract Management", function () {
    it("Should allow setting factory contract", async function () {
      await admin.setFactoryContract(user1Address);
      expect(await admin.factoryContract()).to.equal(user1Address);
    });

    it("Should emit FactoryContractUpdated event", async function () {
      await expect(admin.setFactoryContract(user1Address))
        .to.emit(admin, "FactoryContractUpdated")
        .withArgs(user1Address);
    });

    it("Should revert when setting zero address as factory", async function () {
      await expect(
        admin.setFactoryContract(ethers.ZeroAddress)
      ).to.be.revertedWithCustomError(admin, "InvalidAddress");
    });

    it("Should allow setting airdrop contract", async function () {
      await admin.setAirdropContract(user1Address);
      expect(await admin.airdropContract()).to.equal(user1Address);
    });

    it("Should emit AirdropContractUpdated event", async function () {
      await expect(admin.setAirdropContract(user1Address))
        .to.emit(admin, "AirdropContractUpdated")
        .withArgs(user1Address);
    });

    it("Should revert when setting zero address as airdrop contract", async function () {
      await expect(
        admin.setAirdropContract(ethers.ZeroAddress)
      ).to.be.revertedWithCustomError(admin, "InvalidAddress");
    });
  });

  describe("Fee Management", function () {
    it("Should allow setting feature fee", async function () {
      const newFee = 5 * 10**8; // $5 USD
      await admin.setFeatureFee(newFee);
      expect(await admin.featureFeeUSD()).to.equal(newFee);
    });

    it("Should emit FeatureFeeUpdated event", async function () {
      const newFee = 5 * 10**8;
      await expect(admin.setFeatureFee(newFee))
        .to.emit(admin, "FeatureFeeUpdated")
        .withArgs(newFee);
    });

    it("Should revert when setting zero fee", async function () {
      await expect(
        admin.setFeatureFee(0n)
      ).to.be.revertedWithCustomError(admin, "InvalidAmount");
    });

    it("Should allow setting airdrop fees", async function () {
      const newTiers = [
        { minRecipients: 1, maxRecipients: 100, feeUSD: 1 * 10**8 },
        { minRecipients: 101, maxRecipients: 1000, feeUSD: 5 * 10**8 },
        { minRecipients: 1001, maxRecipients: 10000, feeUSD: 10 * 10**8 }
      ];

      await admin.setAirdropFees(newTiers);
      const feeTier = await admin.airdropFees(0);
      expect(feeTier.minRecipients).to.equal(1n);
      expect(feeTier.maxRecipients).to.equal(100n);
      expect(feeTier.feeUSD).to.equal(1n * 10n**8n);
    });

    it("Should emit AirdropFeesUpdated event", async function () {
      const newTiers = [
        { minRecipients: 1, maxRecipients: 100, feeUSD: 1 * 10**8 }
      ];

      await expect(admin.setAirdropFees(newTiers))
        .to.emit(admin, "AirdropFeesUpdated");
    });

    it("Should revert when setting empty airdrop fees", async function () {
      await expect(
        admin.setAirdropFees([])
      ).to.be.revertedWithCustomError(admin, "InvalidAmount");
    });

    it("Should get correct airdrop fee for recipient count", async function () {
      const newTiers = [
        { minRecipients: 1, maxRecipients: 100, feeUSD: 1 * 10**8 },
        { minRecipients: 101, maxRecipients: 1000, feeUSD: 5 * 10**8 }
      ];
      await admin.setAirdropFees(newTiers);

      expect(await admin.getAirdropFeeUSD(50)).to.equal(1 * 10**8);
      expect(await admin.getAirdropFeeUSD(500)).to.equal(5 * 10**8);
    });
  });

  describe("Feature Payment", function () {
    it("Should process feature payment correctly", async function () {
      const featureCount = 3;
      const payment = ethers.parseEther("0.1");

      await expect(
        factory.connect(user1).createERC20(
          "Test", "TEST", 1000000, 18, [true, false, true],
          { value: payment }
        )
      ).to.emit(admin, "FeaturesPaid")
        .withArgs(user1Address, featureCount, payment);
    });

    it("Should revert with insufficient ETH", async function () {
      const payment = ethers.parseEther("0.001");

      await expect(
        factory.connect(user1).createERC20(
          "Test", "TEST", 1000000, 18, [true, false, true],
          { value: payment }
        )
      ).to.be.revertedWithCustomError(admin, "InsufficientPayment");
    });
  });

  describe("Airdrop Payment", function () {
    beforeEach(async function () {
      // Set up airdrop fees
      const newTiers = [
        { minRecipients: 1, maxRecipients: 100, feeUSD: 1 * 10**8 },
        { minRecipients: 101, maxRecipients: 1000, feeUSD: 5 * 10**8 }
      ];
      await admin.setAirdropFees(newTiers);
    });

    it("Should process airdrop payment correctly", async function () {
      const recipientCount = 50;
      const payment = ethers.parseEther("0.05");

      await expect(
        airdropFactory.connect(user1).createERC20Airdrop(
          user2Address, // mock token
          ethers.keccak256(ethers.toUtf8Bytes("test")), // mock merkle root
          ethers.parseEther("1000"),
          recipientCount,
          Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
          { value: payment }
        )
      ).to.emit(admin, "AirdropFeePaid")
        .withArgs(user1Address, recipientCount, payment);
    });
  });

  describe("Withdrawal Proposals", function () {
    beforeEach(async function () {
      // Add some ETH to admin contract
      await user1.sendTransaction({
        to: admin.address,
        value: ethers.parseEther("1.0")
      });
    });

    it("Should allow proposing withdrawal", async function () {
      const amount = ethers.parseEther("0.5");
      await admin.connect(user1).proposeWithdrawal(amount);

      expect(await admin.proposalCounter()).to.equal(1);
      const proposal = await admin.withdrawalProposals(1);
      expect(proposal.proposer).to.equal(user1Address);
      expect(proposal.amount).to.equal(amount);
      expect(proposal.executed).to.be.false;
    });

    it("Should emit WithdrawalProposed event", async function () {
      const amount = ethers.parseEther("0.5");
      await expect(admin.connect(user1).proposeWithdrawal(amount))
        .to.emit(admin, "WithdrawalProposed")
        .withArgs(1, user1Address, amount);
    });

    it("Should revert when proposing zero amount", async function () {
      await expect(
        admin.connect(user1).proposeWithdrawal("0")
      ).to.be.revertedWithCustomError(admin, "InvalidAmount");
    });

    it("Should allow approving withdrawal proposal", async function () {
      const amount = ethers.parseEther("0.5");
      await admin.connect(user1).proposeWithdrawal(amount);

      await admin.connect(user2).approveWithdrawal(1);
      const proposal = await admin.withdrawalProposals(1);
      expect(proposal.approvals).to.equal(2); // 1 from proposer + 1 from approver
    });

    it("Should emit WithdrawalApproved event", async function () {
      const amount = ethers.parseEther("0.5");
      await admin.connect(user1).proposeWithdrawal(amount);

      await expect(admin.connect(user2).approveWithdrawal(1))
        .to.emit(admin, "WithdrawalApproved")
        .withArgs(1, user2Address);
    });

    it("Should revert when approving already approved proposal", async function () {
      const amount = ethers.parseEther("0.5");
      await admin.connect(user1).proposeWithdrawal(amount);

      await admin.connect(user2).approveWithdrawal(1);
      await expect(
        admin.connect(user2).approveWithdrawal(1)
      ).to.be.revertedWithCustomError(admin, "AlreadyApproved");
    });

    it("Should auto-execute withdrawal when majority approves", async function () {
      const amount = ethers.parseEther("0.5");
      await admin.connect(user1).proposeWithdrawal(amount);

      // Add more admins to test majority approval
      await admin.addAdmin(user2Address);
      await admin.addAdmin(user3Address);

      const initialBalance = await ethers.provider.getBalance(user1Address);
      await admin.connect(user2).approveWithdrawal(1); // This should auto-execute
      const finalBalance = await ethers.provider.getBalance(user1Address);

      expect(finalBalance).to.be.gt(initialBalance);
    });

    it("Should emit WithdrawalExecuted event on auto-execution", async function () {
      const amount = ethers.parseEther("0.5");
      await admin.connect(user1).proposeWithdrawal(amount);

      // Add more admins
      await admin.addAdmin(user2Address);
      await admin.addAdmin(user3Address);

      await expect(admin.connect(user2).approveWithdrawal(1))
        .to.emit(admin, "WithdrawalExecuted")
        .withArgs(1, amount);
    });
  });

  describe("Pause/Unpause Functionality", function () {
    it("Should allow pausing and unpausing", async function () {
      await admin.pause();
      expect(await admin.paused()).to.be.true;

      await admin.unpause();
      expect(await admin.paused()).to.be.false;
    });
  });

  describe("Access Control", function () {
    it("Should only allow airdrop contract to call payForAirdrop", async function () {
      const recipientCount = 50;
      const payment = ethers.parseEther("0.05");

      await expect(
        admin.connect(user1).payForAirdrop(user1Address, recipientCount, { value: payment })
      ).to.be.revertedWithCustomError(admin, "OnlyAirdropContract");
    });

    it("Should only allow factory contract to call payForFeatures", async function () {
      const featureCount = 3;
      const payment = ethers.parseEther("0.1");

      await expect(
        admin.connect(user1).payForFeatures(user1Address, featureCount, { value: payment })
      ).to.be.revertedWithCustomError(admin, "OnlyFactory");
    });
  });

  describe("Edge Cases", function () {
    it("Should handle multiple withdrawal proposals", async function () {
      const amount1 = ethers.parseEther("0.3");
      const amount2 = ethers.parseEther("0.4");

      await admin.connect(user1).proposeWithdrawal(amount1);
      await admin.connect(user2).proposeWithdrawal(amount2);

      expect(await admin.proposalCounter()).to.equal(2);
    });

    it("Should handle admin removal and reordering", async function () {
      await admin.addAdmin(user1Address);
      await admin.addAdmin(user2Address);
      await admin.addAdmin(user3Address);

      // Remove middle admin
      await admin.removeAdmin(user2Address);

      expect(await admin.adminCount()).to.equal(3);
      expect(await admin.admin(1)).to.equal(user3Address);
    });

    it("Should get correct balance", async function () {
      await user1.sendTransaction({
        to: admin.address,
        value: ethers.parseEther("1.0")
      });

      expect(await admin.getBalance()).to.equal(ethers.parseEther("1.0"));
    });
  });
});

 