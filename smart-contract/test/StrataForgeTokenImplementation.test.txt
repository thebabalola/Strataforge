import { expect } from "chai";
import { ethers } from "hardhat";
import { Signer } from "ethers";

describe("StrataForgeTokenImplementation", function () {
  let token: any;
  let nft: any;
  let erc1155: any;
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

    // Deploy token contracts
    const StrataForgeERC20Implementation = await ethers.getContractFactory("StrataForgeERC20Implementation");
    const StrataForgeERC721Implementation = await ethers.getContractFactory("StrataForgeERC721Implementation");
    const StrataForgeERC1155Implementation = await ethers.getContractFactory("StrataForgeERC1155Implementation");
    
    token = await StrataForgeERC20Implementation.deploy();
    nft = await StrataForgeERC721Implementation.deploy();
    erc1155 = await StrataForgeERC1155Implementation.deploy();
  });

  describe("ERC20 Implementation", function () {
    beforeEach(async function () {
      // Initialize ERC20 token with features: [mint, burn, pause, transfer, approve]
      const features = [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true];
      await token.initialize("Test Token", "TEST", 1000000, 18, ownerAddress, features);
    });

    it("Should initialize correctly", async function () {
      expect(await token.name()).to.equal("Test Token");
      expect(await token.symbol()).to.equal("TEST");
      expect(await token.decimals()).to.equal(18);
      expect(await token.totalSupply()).to.equal(ethers.parseEther("1000000"));
      expect(await token.owner()).to.equal(ownerAddress);
    });

    it("Should have correct initial balance", async function () {
      expect(await token.balanceOf(ownerAddress)).to.equal(ethers.parseEther("1000000"));
    });

    it("Should allow transfers", async function () {
      const transferAmount = ethers.parseEther("100");
      await token.transfer(user1Address, transferAmount);
      expect(await token.balanceOf(user1Address)).to.equal(transferAmount);
      expect(await token.balanceOf(ownerAddress)).to.equal(ethers.parseEther("999900"));
    });

    it("Should emit Transfer event", async function () {
      const transferAmount = ethers.parseEther("100");
      await expect(token.transfer(user1Address, transferAmount))
        .to.emit(token, "Transfer")
        .withArgs(ownerAddress, user1Address, transferAmount);
    });

    it("Should allow approvals", async function () {
      const approveAmount = ethers.parseEther("100");
      await token.approve(user1Address, approveAmount);
      expect(await token.allowance(ownerAddress, user1Address)).to.equal(approveAmount);
    });

    it("Should emit Approval event", async function () {
      const approveAmount = ethers.parseEther("100");
      await expect(token.approve(user1Address, approveAmount))
        .to.emit(token, "Approval")
        .withArgs(ownerAddress, user1Address, approveAmount);
    });

    it("Should allow transferFrom", async function () {
      const transferAmount = ethers.parseEther("100");
      await token.approve(user1Address, transferAmount);
      await token.connect(user1).transferFrom(ownerAddress, user2Address, transferAmount);
      
      expect(await token.balanceOf(user2Address)).to.equal(transferAmount);
      expect(await token.balanceOf(ownerAddress)).to.equal(ethers.parseEther("999900"));
      expect(await token.allowance(ownerAddress, user1Address)).to.equal(0);
    });

    it("Should allow minting", async function () {
      const mintAmount = ethers.parseEther("1000");
      const initialSupply = await token.totalSupply();
      
      await token.mint(user1Address, mintAmount);
      
      expect(await token.totalSupply()).to.equal(initialSupply + mintAmount);
      expect(await token.balanceOf(user1Address)).to.equal(mintAmount);
    });

    it("Should emit Transfer event on mint", async function () {
      const mintAmount = ethers.parseEther("1000");
      await expect(token.mint(user1Address, mintAmount))
        .to.emit(token, "Transfer")
        .withArgs(ethers.ZeroAddress, user1Address, mintAmount);
    });

    it("Should allow burning", async function () {
      const burnAmount = ethers.parseEther("100");
      const initialSupply = await token.totalSupply();
      const initialBalance = await token.balanceOf(ownerAddress);
      
      await token.burn(burnAmount);
      
      expect(await token.totalSupply()).to.equal(initialSupply - burnAmount);
      expect(await token.balanceOf(ownerAddress)).to.equal(initialBalance - burnAmount);
    });

    it("Should emit Transfer event on burn", async function () {
      const burnAmount = ethers.parseEther("100");
      await expect(token.burn(burnAmount))
        .to.emit(token, "Transfer")
        .withArgs(ownerAddress, ethers.ZeroAddress, burnAmount);
    });

    it("Should allow burnFrom", async function () {
      const burnAmount = ethers.parseEther("100");
      await token.approve(user1Address, burnAmount);
      
      const initialSupply = await token.totalSupply();
      const initialBalance = await token.balanceOf(ownerAddress);
      
      await token.connect(user1).burnFrom(ownerAddress, burnAmount);
      
      expect(await token.totalSupply()).to.equal(initialSupply - burnAmount);
      expect(await token.balanceOf(ownerAddress)).to.equal(initialBalance - burnAmount);
    });

    it("Should allow pausing and unpausing", async function () {
      await token.pause();
      expect(await token.paused()).to.be.true;

      await token.unpause();
      expect(await token.paused()).to.be.false;
    });

    it("Should revert transfers when paused", async function () {
      await token.pause();
      
      await expect(
        token.transfer(user1Address, ethers.parseEther("100"))
      ).to.be.revertedWithCustomError(token, "EnforcedPause");
    });

    it("Should allow permit", async function () {
      const owner = ethers.Wallet.createRandom();
      const spender = user1Address;
      const value = ethers.parseEther("100");
      const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
      const nonce = await token.nonces(owner.address);

      const domain = {
        name: await token.name(),
        version: "1",
        chainId: await ethers.provider.getNetwork().then(n => n.chainId),
        verifyingContract: token.address
      };

      const types = {
        Permit: [
          { name: "owner", type: "address" },
          { name: "spender", type: "address" },
          { name: "value", type: "uint256" },
          { name: "nonce", type: "uint256" },
          { name: "deadline", type: "uint256" }
        ]
      };

      const message = {
        owner: owner.address,
        spender,
        value,
        nonce,
        deadline
      };

      const signature = await owner.signTypedData(domain, types, message);
      const { v, r, s } = ethers.Signature.from(signature);

      await token.permit(owner.address, spender, value, deadline, v, r, s);
      expect(await token.allowance(owner.address, spender)).to.equal(value);
    });

    it("Should allow increaseAllowance", async function () {
      const initialAmount = ethers.parseEther("100");
      const increaseAmount = ethers.parseEther("50");
      
      await token.approve(user1Address, initialAmount);
      await token.increaseAllowance(user1Address, increaseAmount);
      
      expect(await token.allowance(ownerAddress, user1Address)).to.equal(initialAmount + increaseAmount);
    });

    it("Should allow decreaseAllowance", async function () {
      const initialAmount = ethers.parseEther("100");
      const decreaseAmount = ethers.parseEther("30");
      
      await token.approve(user1Address, initialAmount);
      await token.decreaseAllowance(user1Address, decreaseAmount);
      
      expect(await token.allowance(ownerAddress, user1Address)).to.equal(initialAmount - decreaseAmount);
    });
  });

  describe("ERC721 Implementation", function () {
    beforeEach(async function () {
      // Initialize ERC721 NFT with features: [mint, burn, pause, setURI]
      const features = [true, true, true, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true];
      await nft.initialize("Test NFT", "TNFT", ownerAddress, features);
    });

    it("Should initialize correctly", async function () {
      expect(await nft.name()).to.equal("Test NFT");
      expect(await nft.symbol()).to.equal("TNFT");
      expect(await nft.owner()).to.equal(ownerAddress);
    });

    it("Should allow minting NFTs", async function () {
      await nft.mint(user1Address, 1);
      expect(await nft.ownerOf(1)).to.equal(user1Address);
      expect(await nft.balanceOf(user1Address)).to.equal(1);
    });

    it("Should emit Transfer event on mint", async function () {
      await expect(nft.mint(user1Address, 1))
        .to.emit(nft, "Transfer")
        .withArgs(ethers.ZeroAddress, user1Address, 1);
    });

    it("Should allow burning NFTs", async function () {
      await nft.mint(user1Address, 1);
      await nft.connect(user1).burn(1);
      
      await expect(nft.ownerOf(1)).to.be.revertedWithCustomError(nft, "ERC721NonexistentToken");
    });

    it("Should emit Transfer event on burn", async function () {
      await nft.mint(user1Address, 1);
      await expect(nft.connect(user1).burn(1))
        .to.emit(nft, "Transfer")
        .withArgs(user1Address, ethers.ZeroAddress, 1);
    });

    it("Should allow transfers", async function () {
      await nft.mint(user1Address, 1);
      await nft.connect(user1).transferFrom(user1Address, user2Address, 1);
      
      expect(await nft.ownerOf(1)).to.equal(user2Address);
      expect(await nft.balanceOf(user1Address)).to.equal(0);
      expect(await nft.balanceOf(user2Address)).to.equal(1);
    });

    it("Should allow approvals", async function () {
      await nft.mint(user1Address, 1);
      await nft.connect(user1).approve(user2Address, 1);
      expect(await nft.getApproved(1)).to.equal(user2Address);
    });

    it("Should allow setApprovalForAll", async function () {
      await nft.mint(user1Address, 1);
      await nft.connect(user1).setApprovalForAll(user2Address, true);
      expect(await nft.isApprovedForAll(user1Address, user2Address)).to.be.true;
    });

    it("Should allow pausing and unpausing", async function () {
      await nft.pause();
      expect(await nft.paused()).to.be.true;

      await nft.unpause();
      expect(await nft.paused()).to.be.false;
    });

    it("Should revert transfers when paused", async function () {
      await nft.mint(user1Address, 1);
      await nft.pause();
      
      await expect(
        nft.connect(user1).transferFrom(user1Address, user2Address, 1)
      ).to.be.revertedWithCustomError(nft, "EnforcedPause");
    });
  });

  describe("ERC1155 Implementation", function () {
    beforeEach(async function () {
      // Initialize ERC1155 with features: [mint, burn, pause, setURI]
      const features = [true, true, true, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true];
      await erc1155.initialize("https://example.com/metadata/{id}", ownerAddress, features);
    });

    it("Should initialize correctly", async function () {
      expect(await erc1155.owner()).to.equal(ownerAddress);
    });

    it("Should allow minting ERC1155 tokens", async function () {
      const tokenId = 1;
      const amount = 100;
      
      await erc1155.mint(user1Address, tokenId, amount);
      expect(await erc1155.balanceOf(user1Address, tokenId)).to.equal(amount);
    });

    it("Should emit TransferSingle event on mint", async function () {
      const tokenId = 1;
      const amount = 100;
      
      await expect(erc1155.mint(user1Address, tokenId, amount))
        .to.emit(erc1155, "TransferSingle")
        .withArgs(ownerAddress, ethers.ZeroAddress, user1Address, tokenId, amount);
    });

    it("Should allow burning ERC1155 tokens", async function () {
      const tokenId = 1;
      const amount = 100;
      
      await erc1155.mint(user1Address, tokenId, amount);
      await erc1155.connect(user1).burn(user1Address, tokenId, amount);
      
      expect(await erc1155.balanceOf(user1Address, tokenId)).to.equal(0);
    });

    it("Should emit TransferSingle event on burn", async function () {
      const tokenId = 1;
      const amount = 100;
      
      await erc1155.mint(user1Address, tokenId, amount);
      await expect(erc1155.connect(user1).burn(user1Address, tokenId, amount))
        .to.emit(erc1155, "TransferSingle")
        .withArgs(user1Address, user1Address, ethers.ZeroAddress, tokenId, amount);
    });

    it("Should allow batch minting", async function () {
      const tokenIds = [1, 2, 3];
      const amounts = [100, 200, 300];
      
      await erc1155.mintBatch(user1Address, tokenIds, amounts);
      
      for (let i = 0; i < tokenIds.length; i++) {
        expect(await erc1155.balanceOf(user1Address, tokenIds[i])).to.equal(amounts[i]);
      }
    });

    it("Should emit TransferBatch event on batch mint", async function () {
      const tokenIds = [1, 2, 3];
      const amounts = [100, 200, 300];
      
      await expect(erc1155.mintBatch(user1Address, tokenIds, amounts))
        .to.emit(erc1155, "TransferBatch")
        .withArgs(ownerAddress, ethers.ZeroAddress, user1Address, tokenIds, amounts);
    });

    it("Should allow batch burning", async function () {
      const tokenIds = [1, 2, 3];
      const amounts = [100, 200, 300];
      
      await erc1155.mintBatch(user1Address, tokenIds, amounts);
      await erc1155.connect(user1).burnBatch(user1Address, tokenIds, amounts);
      
      for (let i = 0; i < tokenIds.length; i++) {
        expect(await erc1155.balanceOf(user1Address, tokenIds[i])).to.equal(0);
      }
    });

    it("Should allow safeTransferFrom", async function () {
      const tokenId = 1;
      const amount = 100;
      
      await erc1155.mint(user1Address, tokenId, amount);
      await erc1155.connect(user1).safeTransferFrom(user1Address, user2Address, tokenId, amount, "0x");
      
      expect(await erc1155.balanceOf(user1Address, tokenId)).to.equal(0);
      expect(await erc1155.balanceOf(user2Address, tokenId)).to.equal(amount);
    });

    it("Should allow safeBatchTransferFrom", async function () {
      const tokenIds = [1, 2, 3];
      const amounts = [100, 200, 300];
      
      await erc1155.mintBatch(user1Address, tokenIds, amounts);
      await erc1155.connect(user1).safeBatchTransferFrom(user1Address, user2Address, tokenIds, amounts, "0x");
      
      for (let i = 0; i < tokenIds.length; i++) {
        expect(await erc1155.balanceOf(user1Address, tokenIds[i])).to.equal(0);
        expect(await erc1155.balanceOf(user2Address, tokenIds[i])).to.equal(amounts[i]);
      }
    });

    it("Should allow setApprovalForAll", async function () {
      await erc1155.connect(user1).setApprovalForAll(user2Address, true);
      expect(await erc1155.isApprovedForAll(user1Address, user2Address)).to.be.true;
    });

    it("Should allow pausing and unpausing", async function () {
      await erc1155.pause();
      expect(await erc1155.paused()).to.be.true;

      await erc1155.unpause();
      expect(await erc1155.paused()).to.be.false;
    });

    it("Should revert transfers when paused", async function () {
      const tokenId = 1;
      const amount = 100;
      
      await erc1155.mint(user1Address, tokenId, amount);
      await erc1155.pause();
      
      await expect(
        erc1155.connect(user1).safeTransferFrom(user1Address, user2Address, tokenId, amount, "0x")
      ).to.be.revertedWithCustomError(erc1155, "EnforcedPause");
    });
  });

  describe("Feature Control", function () {
    it("Should disable features when not enabled", async function () {
      // Initialize token with no features enabled
      const features = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
      await token.initialize("Test Token", "TEST", 1000000, 18, ownerAddress, features);

      // Should still allow basic transfers
      await token.transfer(user1Address, ethers.parseEther("100"));
      expect(await token.balanceOf(user1Address)).to.equal(ethers.parseEther("100"));

      // Should not allow minting
      await expect(
        token.mint(user1Address, ethers.parseEther("1000"))
      ).to.be.revertedWithCustomError(token, "FeatureNotEnabled");

      // Should not allow burning
      await expect(
        token.burn(ethers.parseEther("100"))
      ).to.be.revertedWithCustomError(token, "FeatureNotEnabled");

      // Should not allow pausing
      await expect(
        token.pause()
      ).to.be.revertedWithCustomError(token, "FeatureNotEnabled");
    });

    it("Should enable specific features", async function () {
      // Initialize token with only mint feature enabled
      const features = [true, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
      await token.initialize("Test Token", "TEST", 1000000, 18, ownerAddress, features);

      // Should allow minting
      await token.mint(user1Address, ethers.parseEther("1000"));
      expect(await token.balanceOf(user1Address)).to.equal(ethers.parseEther("1000"));

      // Should not allow burning
      await expect(
        token.burn(ethers.parseEther("100"))
      ).to.be.revertedWithCustomError(token, "FeatureNotEnabled");

      // Should not allow pausing
      await expect(
        token.pause()
      ).to.be.revertedWithCustomError(token, "FeatureNotEnabled");
    });
  });

  describe("Access Control", function () {
    it("Should only allow owner to mint", async function () {
      const features = [true, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
      await token.initialize("Test Token", "TEST", 1000000, 18, ownerAddress, features);

      await expect(
        token.connect(user1).mint(user2Address, ethers.parseEther("1000"))
      ).to.be.revertedWithCustomError(token, "FeatureNotEnabled");
    });

    it("Should only allow owner to pause", async function () {
      const features = [false, false, true, false, false, false, false, false, false, false, false, false, false, false, false];
      await token.initialize("Test Token", "TEST", 1000000, 18, ownerAddress, features);

      await expect(
        token.connect(user1).pause()
      ).to.be.revertedWithCustomError(token, "FeatureNotEnabled");
    });

    it("Should allow ownership transfer", async function () {
      await token.initialize("Test Token", "TEST", 1000000, 18, ownerAddress, [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true]);
      
      await token.transferOwnership(user1Address);
      expect(await token.owner()).to.equal(user1Address);
    });

    it("Should emit OwnershipTransferred event", async function () {
      await token.initialize("Test Token", "TEST", 1000000, 18, ownerAddress, [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true]);
      
      await expect(token.transferOwnership(user1Address))
        .to.emit(token, "OwnershipTransferred")
        .withArgs(ownerAddress, user1Address);
    });
  });

  describe("Edge Cases", function () {
    it("Should handle zero transfers", async function () {
      await token.initialize("Test Token", "TEST", 1000000, 18, ownerAddress, [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true]);
      
      await token.transfer(user1Address, 0);
      expect(await token.balanceOf(user1Address)).to.equal(0);
    });

    it("Should handle zero approvals", async function () {
      await token.initialize("Test Token", "TEST", 1000000, 18, ownerAddress, [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true]);
      
      await token.approve(user1Address, 0);
      expect(await token.allowance(ownerAddress, user1Address)).to.equal(0);
    });

    it("Should handle repeated initialization", async function () {
      const features = [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true];
      await token.initialize("Test Token", "TEST", 1000000, 18, ownerAddress, features);

      await expect(
        token.initialize("Another Token", "ATOK", 2000000, 18, user1Address, features)
      ).to.be.revertedWithCustomError(token, "AlreadyInitialized");
    });

    it("Should handle invalid decimals", async function () {
      const features = [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true];
      
      await expect(
        token.initialize("Test Token", "TEST", 1000000, 19, ownerAddress, features)
      ).to.be.revertedWithCustomError(token, "InvalidDecimals");
    });
  });
});
