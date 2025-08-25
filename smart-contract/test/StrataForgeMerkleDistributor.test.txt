import { expect } from "chai";
import { ethers } from "hardhat";
import { Signer } from "ethers";

describe("StrataForgeMerkleDistributor", function () {
  let distributor: any;
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

  // Sample merkle tree data
  const recipients = [
    { address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", amount: "1000000000000000000" }, // user1
    { address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", amount: "2000000000000000000" }, // user2
    { address: "0x90F79bf6EB2c4f870365E785982E1f101E93b906", amount: "3000000000000000000" }, // user3
    { address: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65", amount: "4000000000000000000" }  // user4
  ];

  let merkleRoot: string;
  let merkleProofs: { [key: string]: string[] };

  beforeEach(async function () {
    [owner, user1, user2, user3, user4] = await ethers.getSigners();
    ownerAddress = await owner.getAddress();
    user1Address = await user1.getAddress();
    user2Address = await user2.getAddress();
    user3Address = await user3.getAddress();
    user4Address = await user4.getAddress();

    // Deploy mock tokens
    const MockERC20 = await ethers.getContractFactory("StrataForgeERC20Implementation");
    mockToken = await MockERC20.deploy();
    await mockToken.initialize("Mock Token", "MTK", 10000000, 18, ownerAddress, [true, false, true]);

    const MockERC721 = await ethers.getContractFactory("StrataForgeERC721Implementation");
    mockNFT = await MockERC721.deploy();
    await mockNFT.initialize("Mock NFT", "MNFT", ownerAddress, [true, false, true]);

    const MockERC1155 = await ethers.getContractFactory("StrataForgeERC1155Implementation");
    mockERC1155 = await MockERC1155.deploy();
    await mockERC1155.initialize("https://example.com/metadata/{id}", ownerAddress, [true, false, true]);

    // Generate merkle tree and proofs
    const { root, proofs } = generateMerkleTree(recipients);
    merkleRoot = root;
    merkleProofs = proofs;

    // Deploy distributor
    const StrataForgeMerkleDistributor = await ethers.getContractFactory("StrataForgeMerkleDistributor");
    distributor = await StrataForgeMerkleDistributor.deploy();
  });

  describe("ERC20 Distribution", function () {
    beforeEach(async function () {
      // Initialize ERC20 distributor
      await distributor.initialize(
        mockToken.address,
        merkleRoot,
        0, // tokenType: ERC20
        ethers.parseEther("10000"), // totalAmount
        recipients.length,
        Math.floor(Date.now() / 1000) + 3600 // startTime: 1 hour from now
      );

      // Transfer tokens to distributor
      await mockToken.transfer(distributor.address, ethers.parseEther("10000"));
    });

    it("Should initialize correctly", async function () {
      expect(await distributor.token()).to.equal(mockToken.address);
      expect(await distributor.merkleRoot()).to.equal(merkleRoot);
      expect(await distributor.tokenType()).to.equal(0); // ERC20
      expect(await distributor.totalAmount()).to.equal(ethers.parseEther("10000"));
      expect(await distributor.totalRecipients()).to.equal(recipients.length);
    });

    it("Should allow valid claim", async function () {
      const user1Amount = ethers.parseEther("1");
      const proof = merkleProofs[user1Address];

      const initialBalance = await mockToken.balanceOf(user1Address);
      await distributor.connect(user1).claim(user1Amount, proof);
      const finalBalance = await mockToken.balanceOf(user1Address);

      expect(finalBalance - initialBalance).to.equal(user1Amount);
    });

    it("Should emit Claimed event", async function () {
      const user1Amount = ethers.parseEther("1");
      const proof = merkleProofs[user1Address];

      await expect(distributor.connect(user1).claim(user1Amount, proof))
        .to.emit(distributor, "Claimed")
        .withArgs(user1Address, user1Amount);
    });

    it("Should revert on invalid proof", async function () {
      const user1Amount = ethers.parseEther("1");
      const invalidProof = ["0x" + "0".repeat(64)];

      await expect(
        distributor.connect(user1).claim(user1Amount, invalidProof)
      ).to.be.revertedWithCustomError(distributor, "InvalidProof");
    });

    it("Should revert on already claimed", async function () {
      const user1Amount = ethers.parseEther("1");
      const proof = merkleProofs[user1Address];

      await distributor.connect(user1).claim(user1Amount, proof);

      await expect(
        distributor.connect(user1).claim(user1Amount, proof)
      ).to.be.revertedWithCustomError(distributor, "AlreadyClaimed");
    });

    it("Should revert on wrong amount", async function () {
      const wrongAmount = ethers.parseEther("2"); // Wrong amount for user1
      const proof = merkleProofs[user1Address];

      await expect(
        distributor.connect(user1).claim(wrongAmount, proof)
      ).to.be.revertedWithCustomError(distributor, "InvalidProof");
    });

    it("Should allow multiple users to claim", async function () {
      // User1 claims
      const user1Amount = ethers.parseEther("1");
      const user1Proof = merkleProofs[user1Address];
      await distributor.connect(user1).claim(user1Amount, user1Proof);

      // User2 claims
      const user2Amount = ethers.parseEther("2");
      const user2Proof = merkleProofs[user2Address];
      await distributor.connect(user2).claim(user2Amount, user2Proof);

      expect(await mockToken.balanceOf(user1Address)).to.equal(user1Amount);
      expect(await mockToken.balanceOf(user2Address)).to.equal(user2Amount);
    });

    it("Should track claimed status correctly", async function () {
      const user1Amount = ethers.parseEther("1");
      const proof = merkleProofs[user1Address];

      expect(await distributor.isClaimed(user1Address)).to.be.false;
      await distributor.connect(user1).claim(user1Amount, proof);
      expect(await distributor.isClaimed(user1Address)).to.be.true;
    });
  });

  describe("ERC721 Distribution", function () {
    const tokenIds = [1, 2, 3, 4];

    beforeEach(async function () {
      // Initialize ERC721 distributor
      await distributor.initialize(
        mockNFT.address,
        merkleRoot,
        1, // tokenType: ERC721
        1, // totalAmount: 1 per claim
        tokenIds.length,
        Math.floor(Date.now() / 1000) + 3600 // startTime: 1 hour from now
      );

      // Mint NFTs to distributor
      for (let i = 0; i < tokenIds.length; i++) {
        await mockNFT.mint(distributor.address, tokenIds[i]);
      }
    });

    it("Should initialize correctly for ERC721", async function () {
      expect(await distributor.token()).to.equal(mockNFT.address);
      expect(await distributor.merkleRoot()).to.equal(merkleRoot);
      expect(await distributor.tokenType()).to.equal(1); // ERC721
      expect(await distributor.totalRecipients()).to.equal(tokenIds.length);
    });

    it("Should allow valid ERC721 claim", async function () {
      const user1Amount = 1; // 1 NFT
      const proof = merkleProofs[user1Address];

      const initialBalance = await mockNFT.balanceOf(user1Address);
      await distributor.connect(user1).claim(user1Amount, proof);
      const finalBalance = await mockNFT.balanceOf(user1Address);

      expect(finalBalance - initialBalance).to.equal(1);
    });

    it("Should emit Claimed event for ERC721", async function () {
      const user1Amount = 1;
      const proof = merkleProofs[user1Address];

      await expect(distributor.connect(user1).claim(user1Amount, proof))
        .to.emit(distributor, "Claimed")
        .withArgs(user1Address, user1Amount);
    });
  });

  describe("ERC1155 Distribution", function () {
    const tokenIds = [1, 2, 3];
    const amounts = [100, 200, 300];

    beforeEach(async function () {
      // Initialize ERC1155 distributor
      await distributor.initialize(
        mockERC1155.address,
        merkleRoot,
        2, // tokenType: ERC1155
        amounts.reduce((a, b) => a + b, 0), // totalAmount
        tokenIds.length,
        Math.floor(Date.now() / 1000) + 3600 // startTime: 1 hour from now
      );

      // Mint ERC1155 tokens to distributor
      for (let i = 0; i < tokenIds.length; i++) {
        await mockERC1155.mint(distributor.address, tokenIds[i], amounts[i]);
      }
    });

    it("Should initialize correctly for ERC1155", async function () {
      expect(await distributor.token()).to.equal(mockERC1155.address);
      expect(await distributor.merkleRoot()).to.equal(merkleRoot);
      expect(await distributor.tokenType()).to.equal(2); // ERC1155
      expect(await distributor.totalRecipients()).to.equal(tokenIds.length);
    });

    it("Should allow valid ERC1155 claim", async function () {
      const user1Amount = 100; // Amount for token ID 1
      const proof = merkleProofs[user1Address];

      const initialBalance = await mockERC1155.balanceOf(user1Address, 1);
      await distributor.connect(user1).claim(user1Amount, proof);
      const finalBalance = await mockERC1155.balanceOf(user1Address, 1);

      expect(finalBalance - initialBalance).to.equal(user1Amount);
    });
  });

  describe("Access Control", function () {
    it("Should only allow owner to withdraw unclaimed tokens", async function () {
      await distributor.initialize(
        mockToken.address,
        merkleRoot,
        0,
        ethers.parseEther("10000"),
        recipients.length,
        Math.floor(Date.now() / 1000) + 3600
      );

      await mockToken.transfer(distributor.address, ethers.parseEther("10000"));

      // Only owner should be able to withdraw
      await distributor.withdrawUnclaimed();
      expect(await mockToken.balanceOf(ownerAddress)).to.be.gt(0);

      // Non-owner should not be able to withdraw
      await expect(
        distributor.connect(user1).withdrawUnclaimed()
      ).to.be.revertedWithCustomError(distributor, "NotOwner");
    });

    it("Should emit Withdrawn event", async function () {
      await distributor.initialize(
        mockToken.address,
        merkleRoot,
        0,
        ethers.parseEther("10000"),
        recipients.length,
        Math.floor(Date.now() / 1000) + 3600
      );

      await mockToken.transfer(distributor.address, ethers.parseEther("10000"));

      await expect(distributor.withdrawUnclaimed())
        .to.emit(distributor, "Withdrawn")
        .withArgs(ethers.parseEther("10000"));
    });
  });

  describe("Time-based Restrictions", function () {
    it("Should revert claims before start time", async function () {
      await distributor.initialize(
        mockToken.address,
        merkleRoot,
        0,
        ethers.parseEther("10000"),
        recipients.length,
        Math.floor(Date.now() / 1000) + 7200 // 2 hours from now
      );

      await mockToken.transfer(distributor.address, ethers.parseEther("10000"));

      const user1Amount = ethers.parseEther("1");
      const proof = merkleProofs[user1Address];

      await expect(
        distributor.connect(user1).claim(user1Amount, proof)
      ).to.be.revertedWithCustomError(distributor, "NotStarted");
    });

    it("Should allow claims after start time", async function () {
      await distributor.initialize(
        mockToken.address,
        merkleRoot,
        0,
        ethers.parseEther("10000"),
        recipients.length,
        Math.floor(Date.now() / 1000) - 3600 // 1 hour ago
      );

      await mockToken.transfer(distributor.address, ethers.parseEther("10000"));

      const user1Amount = ethers.parseEther("1");
      const proof = merkleProofs[user1Address];

      await expect(
        distributor.connect(user1).claim(user1Amount, proof)
      ).to.not.be.reverted;
    });
  });

  describe("Edge Cases", function () {
    it("Should handle zero amount claims", async function () {
      await distributor.initialize(
        mockToken.address,
        merkleRoot,
        0,
        ethers.parseEther("10000"),
        recipients.length,
        Math.floor(Date.now() / 1000) + 3600
      );

      await mockToken.transfer(distributor.address, ethers.parseEther("10000"));

      const proof = merkleProofs[user1Address];

      await expect(
        distributor.connect(user1).claim(0, proof)
      ).to.be.revertedWithCustomError(distributor, "InvalidProof");
    });

    it("Should handle empty proof array", async function () {
      await distributor.initialize(
        mockToken.address,
        merkleRoot,
        0,
        ethers.parseEther("10000"),
        recipients.length,
        Math.floor(Date.now() / 1000) + 3600
      );

      await mockToken.transfer(distributor.address, ethers.parseEther("10000"));

      await expect(
        distributor.connect(user1).claim(ethers.parseEther("1"), [])
      ).to.be.revertedWithCustomError(distributor, "InvalidProof");
    });

    it("Should handle repeated initialization", async function () {
      await distributor.initialize(
        mockToken.address,
        merkleRoot,
        0,
        ethers.parseEther("10000"),
        recipients.length,
        Math.floor(Date.now() / 1000) + 3600
      );

      await expect(
        distributor.initialize(
          mockToken.address,
          merkleRoot,
          0,
          ethers.parseEther("10000"),
          recipients.length,
          Math.floor(Date.now() / 1000) + 3600
        )
      ).to.be.revertedWithCustomError(distributor, "AlreadyInitialized");
    });
  });
});

// Helper function to generate merkle tree and proofs
function generateMerkleTree(recipients: { address: string; amount: string }[]) {
  const leaves = recipients.map(recipient => 
    ethers.keccak256(
      ethers.solidityPacked(
        ["address", "uint256"],
        [recipient.address, recipient.amount]
      )
    )
  );

  // Simple merkle tree generation (for testing purposes)
  const root = ethers.keccak256(ethers.solidityPacked(["bytes32[]"], [leaves]));
  
  const proofs: { [key: string]: string[] } = {};
  recipients.forEach((recipient, index) => {
    proofs[recipient.address] = [leaves[(index + 1) % leaves.length]]; // Simplified proof
  });

  return { root, proofs };
}
