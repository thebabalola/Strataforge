// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "./StrataForgeMerkleDistributor.sol";
import "./StrataForgeAdmin.sol";

contract StrataForgeAirdropFactory {
    struct AirdropInfo {
        address distributor;
        address token;
        address creator;
        uint32 startTime;
        uint32 totalRecipients;
        uint256 dropAmount;
        uint8 tokenType;
        uint8 reserved;
    }

    AirdropInfo[] public airdrops;
    mapping(address => uint32[]) public creatorAirdrops;

    StrataForgeAdmin public adminContract;

    event AirdropCreated(
        address indexed creator,
        address indexed distributor,
        address indexed token,
        uint8 tokenType,
        uint32 totalRecipients,
        uint32 airdropIndex
    );
    event AdminContractUpdated(address indexed newAdminContract);

    constructor(address _adminContract) {
        require(_adminContract != address(0), "Invalid admin address");
        adminContract = StrataForgeAdmin(_adminContract);
    }

    modifier onlyAdmin() {
        bool isAdmin;
        uint8 adminCount = adminContract.adminCount();
        for (uint8 i = 0; i < adminCount; i++) {
            if (adminContract.admin(i) == msg.sender) {
                isAdmin = true;
                break;
            }
        }
        require(isAdmin, "Not admin");
        _;
    }

    function updateAdminContract(address _adminContract) external onlyAdmin {
        require(_adminContract != address(0), "Invalid admin address");
        adminContract = StrataForgeAdmin(_adminContract);
        emit AdminContractUpdated(_adminContract);
    }

    function createERC20Airdrop(
        address token,
        bytes32 merkleRoot,
        uint256 dropAmount,
        uint32 totalRecipients,
        uint32 startTime
    ) external payable returns (address) {
        adminContract.payForAirdrop{value: msg.value}(msg.sender, totalRecipients);

        return _createAirdrop(
            token,
            merkleRoot,
            0,
            dropAmount,
            new uint256[](0),
            0,
            totalRecipients,
            startTime
        );
    }

    function createERC721Airdrop(
        address token,
        bytes32 merkleRoot,
        uint256[] calldata tokenIds,
        uint32 startTime
    ) external payable returns (address) {
        uint32 totalRecipients = uint32(tokenIds.length);
        adminContract.payForAirdrop{value: msg.value}(msg.sender, totalRecipients);

        return _createAirdrop(
            token,
            merkleRoot,
            1,
            1, // dummy amount
            tokenIds,
            0,
            totalRecipients,
            startTime
        );
    }

    function createERC1155Airdrop(
        address token,
        bytes32 merkleRoot,
        uint256 tokenId,
        uint256 dropAmount,
        uint32 totalRecipients,
        uint32 startTime
    ) external payable returns (address) {
        adminContract.payForAirdrop{value: msg.value}(msg.sender, totalRecipients);

        return _createAirdrop(
            token,
            merkleRoot,
            2,
            dropAmount,
            new uint256[](0),
            tokenId,
            totalRecipients,
            startTime
        );
    }

    function batchCreateERC20Airdrops(
        address[] calldata tokens,
        bytes32[] calldata merkleRoots,
        uint256[] calldata dropAmounts,
        uint32[] calldata totalRecipients,
        uint32[] calldata startTimes
    ) external payable returns (address[] memory distributors) {
        uint256 length = tokens.length;
        require(
            length == merkleRoots.length &&
            length == dropAmounts.length &&
            length == totalRecipients.length &&
            length == startTimes.length,
            "Input array length mismatch"
        );

        uint256 totalRecipientsSum;
        for (uint256 i = 0; i < length; i++) {
            totalRecipientsSum += totalRecipients[i];
        }

        adminContract.payForAirdrop{value: msg.value}(msg.sender, totalRecipientsSum);

        distributors = new address[](length);
        for (uint256 i = 0; i < length; i++) {
            distributors[i] = _createAirdrop(
                tokens[i],
                merkleRoots[i],
                0,
                dropAmounts[i],
                new uint256[](0),
                0,
                totalRecipients[i],
                startTimes[i]
            );
        }
    }

    function _createAirdrop(
        address token,
        bytes32 merkleRoot,
        uint8 tokenType,
        uint256 dropAmount,
        uint256[] memory tokenIds,
        uint256 tokenId,
        uint32 totalRecipients,
        uint32 startTime
    ) internal returns (address distributorAddress) {
        StrataForgeMerkleDistributor distributor = new StrataForgeMerkleDistributor(
            token,
            merkleRoot,
            tokenType,
            dropAmount,
            tokenIds,
            tokenId,
            totalRecipients,
            startTime
        );

        distributorAddress = address(distributor);

        if (airdrops.length >= type(uint32).max) revert("Airdrop index overflow");
        uint32 airdropIndex = uint32(airdrops.length);

        airdrops.push(AirdropInfo({
            distributor: distributorAddress,
            token: token,
            creator: msg.sender,
            startTime: startTime,
            totalRecipients: totalRecipients,
            dropAmount: dropAmount,
            tokenType: tokenType,
            reserved: 0
        }));

        creatorAirdrops[msg.sender].push(airdropIndex);

        emit AirdropCreated(
            msg.sender,
            distributorAddress,
            token,
            tokenType,
            totalRecipients,
            airdropIndex
        );

        return distributorAddress;
    }

    function getAirdropCount() external view returns (uint256) {
        return airdrops.length;
    }

    function getCreatorAirdrops(address creator) external view returns (AirdropInfo[] memory) {
        uint32[] memory indices = creatorAirdrops[creator];
        AirdropInfo[] memory result = new AirdropInfo[](indices.length);

        for (uint256 i = 0; i < indices.length; i++) {
            result[i] = airdrops[indices[i]];
        }

        return result;
    }

    function getActiveAirdrops(uint256 limit) external view returns (AirdropInfo[] memory) {
        uint256 total = airdrops.length;
        uint256 count;
        uint256 maxCheck = limit > 0 && limit < total ? limit : total;

        for (uint256 i = total; i > total - maxCheck;) {
            unchecked { --i; }
            if (airdrops[i].startTime <= block.timestamp) {
                ++count;
            }
        }

        AirdropInfo[] memory result = new AirdropInfo[](count);
        uint256 resultIndex;

        for (uint256 i = total; i > total - maxCheck && resultIndex < count;) {
            unchecked { --i; }
            if (airdrops[i].startTime <= block.timestamp) {
                result[resultIndex++] = airdrops[i];
            }
        }

        return result;
    }
}
