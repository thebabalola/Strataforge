// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IStrataForgeTokens {
    function createERC20(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        uint8 decimals,
        address tokenOwner,
        bool[] memory features
    ) external returns (address);

    function createERC721(
        string memory name,
        string memory symbol,
        address tokenOwner,
        bool[] memory features
    ) external returns (address);

    function createERC1155(
        string memory uri,
        address tokenOwner,
        bool[] memory features
    ) external returns (address);

    function createMemecoin(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        uint8 decimals,
        address tokenOwner,
        uint256 maxWalletSize,
        uint256 maxTransactionAmount,
        bool[] memory features
    ) external returns (address);

    function createStablecoin(
        string memory name,
        string memory symbol,
        address collateralToken,
        uint256 collateralRatio,
        address treasury,
        address tokenOwner,
        bool[] memory features
    ) external returns (address);
}