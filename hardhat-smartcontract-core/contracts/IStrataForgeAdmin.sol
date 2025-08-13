// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

interface IStrataForgeAdmin {
    function admin(uint8 index) external view returns (address);
    function adminCount() external view returns (uint8);
    function featureFee() external view returns (uint256);
    function payForFeatures(address user, uint8 featureCount) external payable returns (bool);
}