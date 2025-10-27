// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "./StrataForgeFactory.sol";

contract StrataForgeAdmin is Ownable, ReentrancyGuard, Pausable {
    StrataForgeFactory public factoryContract;
    address public airdropContract;

    uint256 public featureFeeUSD = 2 * 10**8; // $2 in USD (8 decimals)

    struct AirdropFeeTier {
        uint256 minRecipients;
        uint256 maxRecipients;
        uint256 feeUSD;
    }

    AirdropFeeTier[] public airdropFees;

    error NotAdmin();
    error InvalidAddress();
    error AdminLimitReached();
    error CannotRemoveLastAdmin();
    error InsufficientETH();
    error TransferFailed();
    error InvalidAmount();
    error InsufficientFunds();
    error InvalidProposal();
    error AlreadyApproved();
    error ProposalExecuted();
    error OnlyFactory();
    error OnlyAirdropContract();
    error InvalidFeatureCount();
    error InvalidRecipientCount();
    error InvalidFeeTier();

    mapping(uint8 => address) public admin;
    uint8 public adminCount;

    struct WithdrawalProposal {
        address proposer;
        uint96 amount;
        uint8 approvals;
        bool executed;
        mapping(address => bool) hasApproved;
    }

    mapping(uint32 => WithdrawalProposal) public withdrawalProposals;
    uint32 public proposalCounter;

    event AdminAdded(address indexed admin);
    event AdminRemoved(address indexed admin);
    event WithdrawalProposed(uint32 indexed proposalId, address indexed proposer, uint96 amount);
    event WithdrawalApproved(uint32 indexed proposalId, address indexed admin);
    event WithdrawalExecuted(uint32 indexed proposalId, uint96 amount);
    event FactoryContractUpdated(address indexed newFactory);
    event AirdropContractUpdated(address indexed newAirdropContract);
    event FeatureFeeUpdated(uint256 newFeatureFeeUSD);
    event AirdropFeesUpdated();
    event AirdropFeePaid(address indexed user, uint256 recipientCount, uint256 feeETH);
    event FeaturesPaid(address indexed user, uint8 featureCount, uint256 ethPaid);

    // Removed the onlyAdmin modifier completely

    modifier onlyAirdropContract() {
        if (msg.sender != airdropContract) revert OnlyAirdropContract();
        _;
    }

    constructor(address initialAdmin) Ownable(initialAdmin) {
        admin[0] = initialAdmin;
        adminCount = 1;
    }

    // Removed onlyAdmin modifier from below functions:

    function setFactoryContract(address _factoryContract) external {
        if (_factoryContract == address(0)) revert InvalidAddress();
        factoryContract = StrataForgeFactory(_factoryContract);
        emit FactoryContractUpdated(_factoryContract);
    }

    function setAirdropContract(address _airdropContract) external {
        if (_airdropContract == address(0)) revert InvalidAddress();
        airdropContract = _airdropContract;
        emit AirdropContractUpdated(_airdropContract);
    }

    function setFeatureFee(uint256 _feeUSD) external {
        if (_feeUSD == 0) revert InvalidAmount();
        featureFeeUSD = _feeUSD;
        emit FeatureFeeUpdated(_feeUSD);
    }

    function setAirdropFees(AirdropFeeTier[] calldata newTiers) external {
        if (newTiers.length == 0) revert InvalidAmount();
        delete airdropFees;
        for (uint256 i = 0; i < newTiers.length; i++) {
            if (
                newTiers[i].minRecipients == 0 ||
                newTiers[i].minRecipients > newTiers[i].maxRecipients ||
                (i > 0 && newTiers[i].minRecipients <= newTiers[i - 1].maxRecipients)
            ) revert InvalidFeeTier();
            airdropFees.push(newTiers[i]);
        }
        emit AirdropFeesUpdated();
    }

    function getAirdropFeeUSD(uint256 numRecipients) public view returns (uint256) {
        for (uint256 i = 0; i < airdropFees.length; i++) {
            if (numRecipients >= airdropFees[i].minRecipients && numRecipients <= airdropFees[i].maxRecipients) {
                return airdropFees[i].feeUSD;
            }
        }
        revert InvalidRecipientCount();
    }

    function payForFeatures(address user, uint8 featureCount) external payable nonReentrant whenNotPaused returns (bool) {
        if (msg.sender != address(factoryContract)) revert OnlyFactory();
        if (featureCount == 0) revert InvalidFeatureCount();
        if (msg.value == 0) revert InsufficientETH();

        emit FeaturesPaid(user, featureCount, msg.value);
        return true;
    }

    function payForAirdrop(address user, uint256 recipientCount) external payable onlyAirdropContract nonReentrant whenNotPaused returns (uint256) {
        if (recipientCount == 0) revert InvalidRecipientCount();
        if (msg.value == 0) revert InsufficientETH();

        emit AirdropFeePaid(user, recipientCount, msg.value);
        return getAirdropFeeUSD(recipientCount);
    }

    function pause() external {
        _pause();
    }

    function unpause() external {
        _unpause();
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function addAdmin(address newAdmin) external {
        if (newAdmin == address(0)) revert InvalidAddress();
        if (adminCount >= 255) revert AdminLimitReached();
        for (uint8 i = 0; i < adminCount; i++) {
            if (admin[i] == newAdmin) return;
        }
        admin[adminCount] = newAdmin;
        adminCount++;
        emit AdminAdded(newAdmin);
    }

    function removeAdmin(address adminToRemove) external {
        if (adminCount <= 1) revert CannotRemoveLastAdmin();
        for (uint8 i = 0; i < adminCount; i++) {
            if (admin[i] == adminToRemove) {
                admin[i] = admin[adminCount - 1];
                delete admin[adminCount - 1];
                adminCount--;
                emit AdminRemoved(adminToRemove);
                return;
            }
        }
        revert NotAdmin();
    }

    function proposeWithdrawal(uint96 amount) external returns (uint32 proposalId) {
        if (amount == 0 || amount > address(this).balance) revert InvalidAmount();
        proposalId = proposalCounter++;
        WithdrawalProposal storage proposal = withdrawalProposals[proposalId];
        proposal.proposer = msg.sender;
        proposal.amount = amount;
        proposal.approvals = 1;
        proposal.executed = false;
        proposal.hasApproved[msg.sender] = true;
        emit WithdrawalProposed(proposalId, msg.sender, amount);
    }

    function approveWithdrawal(uint32 proposalId) external {
        WithdrawalProposal storage proposal = withdrawalProposals[proposalId];
        if (proposal.proposer == address(0)) revert InvalidProposal();
        if (proposal.executed) revert ProposalExecuted();
        if (proposal.hasApproved[msg.sender]) revert AlreadyApproved();
        proposal.hasApproved[msg.sender] = true;
        proposal.approvals++;
        emit WithdrawalApproved(proposalId, msg.sender);
        if (proposal.approvals > adminCount / 2) {
            _executeWithdrawal(proposalId);
        }
    }

    function _executeWithdrawal(uint32 proposalId) internal {
        WithdrawalProposal storage proposal = withdrawalProposals[proposalId];
        if (proposal.executed) revert ProposalExecuted();
        if (proposal.amount > address(this).balance) revert InsufficientFunds();
        proposal.executed = true;
        (bool success, ) = proposal.proposer.call{value: proposal.amount}("");
        if (!success) revert TransferFailed();
        emit WithdrawalExecuted(proposalId, proposal.amount);
    }
}
