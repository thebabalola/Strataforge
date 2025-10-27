// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import {IERC1155Receiver} from "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import {MerkleProof} from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

error AlreadyClaimed();
error InvalidProof();
error AirdropNotStarted();
error TransferFailed();

contract StrataForgeMerkleDistributor is IERC1155Receiver {
    event Claimed(address indexed recipient, uint256 amount, uint256 tokenId);

    bytes32 public immutable merkleRoot;
    address public immutable token;
    uint8 public immutable tokenType;
    uint32 public immutable startTime;
    uint256 public immutable dropAmount; // ← changed from uint32 to uint256
    uint32 public immutable totalRecipients;
    uint256 public immutable tokenId;

    uint32 public claimedCount;
    mapping(address => bool) public hasClaimed;

    uint256[] private tokenIds;

    constructor(
        address token_,
        bytes32 merkleRoot_,
        uint8 tokenType_,
        uint256 dropAmount_, // ← changed from uint32 to uint256
        uint256[] memory tokenIds_,
        uint256 tokenId_,
        uint32 totalRecipients_,
        uint32 startTime_
    ) {
        require(token_ != address(0), "Invalid token address");
        require(startTime_ > 0, "Invalid start time");

        token = token_;
        merkleRoot = merkleRoot_;
        tokenType = tokenType_;
        dropAmount = dropAmount_; // ← no cast needed anymore
        totalRecipients = totalRecipients_;
        startTime = startTime_;

        if (tokenType_ == 1) {
            tokenIds = tokenIds_;
        }

        tokenId = tokenType_ == 2 ? tokenId_ : 0;
    }

    function claim(bytes32[] calldata proof) external {
        if (block.timestamp < startTime) revert AirdropNotStarted();
        if (hasClaimed[msg.sender]) revert AlreadyClaimed();

        if (
            !MerkleProof.verify(
                proof,
                merkleRoot,
                keccak256(abi.encodePacked(msg.sender))
            )
        ) {
            revert InvalidProof();
        }

        hasClaimed[msg.sender] = true;
        uint32 currentClaim = claimedCount++;

        if (tokenType == 0) {
            _safeERC20Transfer(token, msg.sender, dropAmount);
            emit Claimed(msg.sender, dropAmount, 0);
        } else if (tokenType == 1) {
            uint256 nftId = tokenIds[currentClaim];
            IERC721(token).transferFrom(address(this), msg.sender, nftId);
            emit Claimed(msg.sender, 1, nftId);
        } else {
            IERC1155(token).safeTransferFrom(
                address(this),
                msg.sender,
                tokenId,
                dropAmount,
                ""
            );
            emit Claimed(msg.sender, dropAmount, tokenId);
        }
    }

    function _safeERC20Transfer(
        address token_,
        address to,
        uint256 amount
    ) private {
        (bool success, bytes memory data) = token_.call(
            abi.encodeWithSelector(IERC20.transfer.selector, to, amount)
        );
        if (!success || (data.length != 0 && !abi.decode(data, (bool)))) {
            revert TransferFailed();
        }
    }

    function getRemainingTokens() external view returns (uint256) {
        if (tokenType == 0) {
            return IERC20(token).balanceOf(address(this));
        } else if (tokenType == 1) {
            return totalRecipients - claimedCount;
        } else {
            return IERC1155(token).balanceOf(address(this), tokenId);
        }
    }

    function getTokenIds() external view returns (uint256[] memory) {
        return tokenIds;
    }

    // IERC1155Receiver
    function onERC1155Received(
        address,
        address,
        uint256,
        uint256,
        bytes calldata
    ) external pure override returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address,
        address,
        uint256[] calldata,
        uint256[] calldata,
        bytes calldata
    ) external pure override returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public pure override returns (bool) {
        return interfaceId == type(IERC1155Receiver).interfaceId;
    }
}
