// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./IStrataForgeAdmin.sol";
import "./IStrataForgeTokens.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract StrataForgeFactory is ReentrancyGuard, Pausable {
    IStrataForgeAdmin public adminContract;
    IStrataForgeTokens public tokenFactory;

    enum TokenType { ERC20, ERC721, ERC1155, Memecoin, Stablecoin }

    error NotAdmin();
    error InvalidName();
    error InvalidSymbol();
    error InvalidSupply();
    error InvalidURI();
    error InvalidCollateralToken();
    error InvalidTreasury();
    error InvalidTokenId();
    error InvalidAddress();
    error InsufficientPayment();

    struct TokenInfo {
        address tokenAddress;
        string name;
        string symbol;
        uint96 initialSupply;
        uint40 timestamp;
        TokenType tokenType;
        address creator;
    }

    mapping(uint64 => TokenInfo) public tokenRegistry;
    mapping(address => uint64) public creatorTokenCount;
    uint64 public tokenIdCounter;

    event TokenCreated(
        address indexed creator,
        address indexed tokenAddress,
        string name,
        string symbol,
        uint96 initialSupply,
        uint40 timestamp,
        TokenType tokenType,
        uint64 tokenId
    );

    modifier onlyAdmin() {
        bool isAdmin;
        for (uint8 i = 0; i < adminContract.adminCount(); i++) {
            if (adminContract.admin(i) == msg.sender) {
                isAdmin = true;
                break;
            }
        }
        if (!isAdmin) revert NotAdmin();
        _;
    }

    constructor(address _adminContract, address _tokenFactory) {
        adminContract = IStrataForgeAdmin(_adminContract);
        tokenFactory = IStrataForgeTokens(_tokenFactory);
    }

    function updateAdminContract(address _adminContract) external onlyAdmin {
        if (_adminContract == address(0)) revert InvalidAddress();
        adminContract = IStrataForgeAdmin(_adminContract);
    }

    function createERC20(
        string memory name,
        string memory symbol,
        uint96 initialSupply,
        uint8 decimals,
        bool[] memory features // e.g., [mint, burn, pause, etc.]
    ) external payable nonReentrant whenNotPaused returns (address) {
        if (bytes(name).length == 0) revert InvalidName();
        if (bytes(symbol).length == 0) revert InvalidSymbol();
        if (initialSupply == 0) revert InvalidSupply();

        uint8 featureCount = _countFeatures(features);
        if (!adminContract.payForFeatures{value: msg.value}(msg.sender, featureCount)) revert InsufficientPayment();

        address newToken = tokenFactory.createERC20(name, symbol, initialSupply, decimals, msg.sender, features);
        return _registerToken(name, symbol, initialSupply, newToken, TokenType.ERC20);
    }

    function createERC721(
        string memory name,
        string memory symbol,
        bool[] memory features // e.g., [mint, burn, pause, setURI, etc.]
    ) external payable nonReentrant whenNotPaused returns (address) {
        if (bytes(name).length == 0) revert InvalidName();
        if (bytes(symbol).length == 0) revert InvalidSymbol();

        uint8 featureCount = _countFeatures(features);
        if (!adminContract.payForFeatures{value: msg.value}(msg.sender, featureCount)) revert InsufficientPayment();

        address newToken = tokenFactory.createERC721(name, symbol, msg.sender, features);
        return _registerToken(name, symbol, 0, newToken, TokenType.ERC721);
    }

    function createERC1155(
        string memory uri,
        bool[] memory features // e.g., [mint, burn, pause, setURI, etc.]
    ) external payable nonReentrant whenNotPaused returns (address) {
        if (bytes(uri).length == 0) revert InvalidURI();

        uint8 featureCount = _countFeatures(features);
        if (!adminContract.payForFeatures{value: msg.value}(msg.sender, featureCount)) revert InsufficientPayment();

        address newToken = tokenFactory.createERC1155(uri, msg.sender, features);
        return _registerToken("ERC1155", "MULTI", 0, newToken, TokenType.ERC1155);
    }

    function createMemecoin(
        string memory name,
        string memory symbol,
        uint96 initialSupply,
        uint8 decimals,
        uint96 maxWalletSize,
        uint96 maxTransactionAmount,
        bool[] memory features // e.g., [mint, burn, pause, setLimits, etc.]
    ) external payable nonReentrant whenNotPaused returns (address) {
        if (bytes(name).length == 0) revert InvalidName();
        if (bytes(symbol).length == 0) revert InvalidSymbol();
        if (initialSupply == 0) revert InvalidSupply();

        uint8 featureCount = _countFeatures(features);
        if (!adminContract.payForFeatures{value: msg.value}(msg.sender, featureCount)) revert InsufficientPayment();

        address newToken = tokenFactory.createMemecoin(name, symbol, initialSupply, decimals, msg.sender, maxWalletSize, maxTransactionAmount, features);
        return _registerToken(name, symbol, initialSupply, newToken, TokenType.Memecoin);
    }

    function createStablecoin(
        string memory name,
        string memory symbol,
        address collateralToken,
        uint96 collateralRatio,
        address treasury,
        bool[] memory features // e.g., [mint, burn, pause, setFees, etc.]
    ) external payable nonReentrant whenNotPaused returns (address) {
        if (bytes(name).length == 0) revert InvalidName();
        if (bytes(symbol).length == 0) revert InvalidSymbol();
        if (collateralToken == address(0)) revert InvalidCollateralToken();
        if (treasury == address(0)) revert InvalidTreasury();

        uint8 featureCount = _countFeatures(features);
        if (!adminContract.payForFeatures{value: msg.value}(msg.sender, featureCount)) revert InsufficientPayment();

        address newToken = tokenFactory.createStablecoin(name, symbol, collateralToken, collateralRatio, treasury, msg.sender, features);
        return _registerToken(name, symbol, 0, newToken, TokenType.Stablecoin);
    }

    function _registerToken(
        string memory name,
        string memory symbol,
        uint96 initialSupply,
        address tokenAddress,
        TokenType tokenType
    ) internal returns (address) {
        uint64 tokenId = ++tokenIdCounter;
        uint40 timestamp = uint40(block.timestamp);

        tokenRegistry[tokenId] = TokenInfo({
            tokenAddress: tokenAddress,
            name: name,
            symbol: symbol,
            initialSupply: initialSupply,
            timestamp: timestamp,
            tokenType: tokenType,
            creator: msg.sender
        });
        creatorTokenCount[msg.sender]++;

        emit TokenCreated(
            msg.sender,
            tokenAddress,
            name,
            symbol,
            initialSupply,
            timestamp,
            tokenType,
            tokenId
        );
        return tokenAddress;
    }

    function _countFeatures(bool[] memory features) internal pure returns (uint8) {
        uint8 count = 0;
        for (uint256 i = 0; i < features.length; i++) {
            if (features[i]) count++;
        }
        return count;
    }

    function pause() external onlyAdmin {
        _pause();
    }

    function unpause() external onlyAdmin {
        _unpause();
    }

    function getTokenCount(address creator) external view returns (uint64) {
        return creatorTokenCount[creator];
    }

    function getTotalTokenCount() external view returns (uint64) {
        return tokenIdCounter;
    }

    function getTokenById(uint64 tokenId) external view returns (TokenInfo memory) {
        if (tokenId == 0 || tokenId > tokenIdCounter) revert InvalidTokenId();
        return tokenRegistry[tokenId];
    }
}