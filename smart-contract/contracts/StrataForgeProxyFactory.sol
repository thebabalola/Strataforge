// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "./IStrataForgeTokens.sol";

contract StrataForgeProxyFactory is IStrataForgeTokens {
    address public immutable erc20Implementation;
    address public immutable erc721Implementation;
    address public immutable erc1155Implementation;
    address public immutable memecoinImplementation;
    address public immutable stablecoinImplementation;

    error InvalidImplementation();

    constructor(
        address _erc20Implementation,
        address _erc721Implementation,
        address _erc1155Implementation,
        address _memecoinImplementation,
        address _stablecoinImplementation
    ) {
        if (_erc20Implementation == address(0) ||
            _erc721Implementation == address(0) ||
            _erc1155Implementation == address(0) ||
            _memecoinImplementation == address(0) ||
            _stablecoinImplementation == address(0)) {
            revert InvalidImplementation();
        }

        erc20Implementation = _erc20Implementation;
        erc721Implementation = _erc721Implementation;
        erc1155Implementation = _erc1155Implementation;
        memecoinImplementation = _memecoinImplementation;
        stablecoinImplementation = _stablecoinImplementation;
    }

    function createERC20(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        uint8 decimals,
        address tokenOwner,
        bool[] memory features
    ) external returns (address) {
        address instance = Clones.clone(erc20Implementation);
        
        bytes memory initData = abi.encodeWithSignature(
            "initialize(string,string,uint96,uint8,address,bool[])",
            name,
            symbol,
            uint96(initialSupply),
            decimals,
            tokenOwner,
            features
        );
        
        (bool success, ) = instance.call(initData);
        require(success, "Initialization failed");
        
        return instance;
    }

    function createERC721(
        string memory name,
        string memory symbol,
        address tokenOwner,
        bool[] memory features
    ) external returns (address) {
        address instance = Clones.clone(erc721Implementation);
        
        bytes memory initData = abi.encodeWithSignature(
            "initialize(string,string,address,bool[])",
            name,
            symbol,
            tokenOwner,
            features
        );
        
        (bool success, ) = instance.call(initData);
        require(success, "Initialization failed");
        
        return instance;
    }

    function createERC1155(
        string memory uri,
        address tokenOwner,
        bool[] memory features
    ) external returns (address) {
        address instance = Clones.clone(erc1155Implementation);
        
        bytes memory initData = abi.encodeWithSignature(
            "initialize(string,address,bool[])",
            uri,
            tokenOwner,
            features
        );
        
        (bool success, ) = instance.call(initData);
        require(success, "Initialization failed");
        
        return instance;
    }

    function createMemecoin(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        uint8 decimals,
        address tokenOwner,
        uint256 maxWalletSize,
        uint256 maxTransactionAmount,
        bool[] memory features
    ) external returns (address) {
        address instance = Clones.clone(memecoinImplementation);
        
        bytes memory initData = abi.encodeWithSignature(
            "initialize(string,string,uint96,uint8,address,uint96,uint96,bool[])",
            name,
            symbol,
            uint96(initialSupply),
            decimals,
            tokenOwner,
            uint96(maxWalletSize),
            uint96(maxTransactionAmount),
            features
        );
        
        (bool success, ) = instance.call(initData);
        require(success, "Initialization failed");
        
        return instance;
    }

    function createStablecoin(
        string memory name,
        string memory symbol,
        address collateralToken,
        uint256 collateralRatio,
        address treasury,
        address tokenOwner,
        bool[] memory features
    ) external returns (address) {
        address instance = Clones.clone(stablecoinImplementation);
        
        bytes memory initData = abi.encodeWithSignature(
            "initialize(string,string,address,uint96,address,address,bool[])",
            name,
            symbol,
            collateralToken,
            uint96(collateralRatio),
            treasury,
            tokenOwner,
            features
        );
        
        (bool success, ) = instance.call(initData);
        require(success, "Initialization failed");
        
        return instance;
    }
}