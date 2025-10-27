// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Pausable.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Initializable {
    bool private _initialized;
    
    error AlreadyInitialized();
    
    modifier initializer() {
        if (_initialized) revert AlreadyInitialized();
        _initialized = true;
        _;
    }
}

// ============================================================================
// STRATAFORGE ERC20 IMPLEMENTATION - FLEXIBLE FEATURE SELECTION
// ============================================================================
contract StrataForgeERC20Implementation is 
    ERC20, 
    ERC20Burnable, 
    ERC20Pausable, 
    ERC20Permit,
    Ownable, 
    AccessControl,
    Initializable 
{
    mapping(bytes4 => bool) public enabledFeatures;
    uint8 private _decimals;
    string private _tokenName;
    string private _tokenSymbol;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    error InvalidDecimals();
    error InvalidAmount();
    error FeatureNotEnabled();

    constructor() ERC20("StrataForge ERC20", "SF20") ERC20Permit("StrataForge ERC20") Ownable(msg.sender) {}

    // --- FINAL FIX: Internal pure helper function to get feature list ---
    function _getAllFeatureHashes() internal pure returns (bytes4[] memory) {
        bytes4[] memory _featureHashes = new bytes4[](15);
        _featureHashes[0] = bytes4(keccak256("mint(address,uint256)"));
        _featureHashes[1] = bytes4(keccak256("burn(uint256)"));
        _featureHashes[2] = bytes4(keccak256("pause()"));
        _featureHashes[3] = bytes4(keccak256("transfer(address,uint256)"));
        _featureHashes[4] = bytes4(keccak256("approve(address,uint256)"));
        _featureHashes[5] = bytes4(keccak256("transferFrom(address,address,uint256)"));
        _featureHashes[6] = bytes4(keccak256("increaseAllowance(address,uint256)"));
        _featureHashes[7] = bytes4(keccak256("decreaseAllowance(address,uint256)"));
        _featureHashes[8] = bytes4(keccak256("burnFrom(address,uint256)"));
        _featureHashes[9] = bytes4(keccak256("permit(address,address,uint256,uint256,uint8,bytes32,bytes32)"));
        _featureHashes[10] = bytes4(keccak256("grantRole(bytes32,address)"));
        _featureHashes[11] = bytes4(keccak256("revokeRole(bytes32,address)"));
        _featureHashes[12] = bytes4(keccak256("renounceRole(bytes32,address)"));
        _featureHashes[13] = bytes4(keccak256("transferOwnership(address)"));
        _featureHashes[14] = bytes4(keccak256("renounceOwnership()"));
        return _featureHashes;
    }

    function initialize(
        string memory name_,
        string memory symbol_,
        uint96 initialSupply,
        uint8 decimals_,
        address tokenOwner,
        bool[] memory features
    ) external initializer {
        if (decimals_ > 18) revert InvalidDecimals();
        _tokenName = name_;
        _tokenSymbol = symbol_;
        _decimals = decimals_;
        _transferOwnership(tokenOwner);
        _mint(tokenOwner, uint256(initialSupply) * 10 ** decimals_);

        _grantRole(DEFAULT_ADMIN_ROLE, tokenOwner);
        _grantRole(MINTER_ROLE, tokenOwner);
        _grantRole(PAUSER_ROLE, tokenOwner);

        bytes4[] memory allFeatureHashes = _getAllFeatureHashes();
        for (uint i = 0; i < allFeatureHashes.length; i++) {
            if (i < features.length) {
                enabledFeatures[allFeatureHashes[i]] = features[i];
            } else {
                enabledFeatures[allFeatureHashes[i]] = false;
            }
        }

        if (features.length == 0) {
            enabledFeatures[allFeatureHashes[2]] = true; // pause()
        }
    }

    function getEnabledFeatures() external view returns (bool[] memory) {
        bytes4[] memory allFeatureHashes = _getAllFeatureHashes();
        bool[] memory featuresStatus = new bool[](allFeatureHashes.length);
        for (uint i = 0; i < allFeatureHashes.length; i++) {
            featuresStatus[i] = enabledFeatures[allFeatureHashes[i]];
        }
        return featuresStatus;
    }

    function name() public view virtual override returns (string memory) {
        return _tokenName;
    }

    function symbol() public view virtual override returns (string memory) {
        return _tokenSymbol;
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        if (!enabledFeatures[bytes4(keccak256("mint(address,uint256)"))]) revert FeatureNotEnabled();
        if (amount == 0) revert InvalidAmount();
        _mint(to, amount);
    }

    function burn(uint256 amount) public virtual override {
        if (!enabledFeatures[bytes4(keccak256("burn(uint256)"))]) revert FeatureNotEnabled();
        super.burn(amount);
    }

    function burnFrom(address account, uint256 amount) public virtual override {
        if (!enabledFeatures[bytes4(keccak256("burnFrom(address,uint256)"))]) revert FeatureNotEnabled();
        super.burnFrom(account, amount);
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        if (!enabledFeatures[bytes4(keccak256("pause()"))]) revert FeatureNotEnabled();
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        if (!enabledFeatures[bytes4(keccak256("pause()"))]) revert FeatureNotEnabled();
        _unpause();
    }

    function transfer(address to, uint256 value) public virtual override returns (bool) {
        if (!enabledFeatures[bytes4(keccak256("transfer(address,uint256)"))]) revert FeatureNotEnabled();
        return super.transfer(to, value);
    }

    function approve(address spender, uint256 value) public virtual override returns (bool) {
        if (!enabledFeatures[bytes4(keccak256("approve(address,uint256)"))]) revert FeatureNotEnabled();
        return super.approve(spender, value);
    }

    function transferFrom(address from, address to, uint256 value) public virtual override returns (bool) {
        if (!enabledFeatures[bytes4(keccak256("transferFrom(address,address,uint256)"))]) revert FeatureNotEnabled();
        return super.transferFrom(from, to, value);
    }

    function increaseAllowance(address spender, uint256 addedValue) public virtual returns (bool) {
        if (!enabledFeatures[bytes4(keccak256("increaseAllowance(address,uint256)"))]) revert FeatureNotEnabled();
        _approve(msg.sender, spender, allowance(msg.sender, spender) + addedValue);
        return true;
    }

    function decreaseAllowance(address spender, uint256 subtractedValue) public virtual returns (bool) {
        if (!enabledFeatures[bytes4(keccak256("decreaseAllowance(address,uint256)"))]) revert FeatureNotEnabled();
        uint256 currentAllowance = allowance(msg.sender, spender);
        require(currentAllowance >= subtractedValue, "ERC20: decreased allowance below zero");
        _approve(msg.sender, spender, currentAllowance - subtractedValue);
        return true;
    }

    function permit(
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public virtual override {
        if (!enabledFeatures[bytes4(keccak256("permit(address,address,uint256,uint256,uint8,bytes32,bytes32)"))]) revert FeatureNotEnabled();
        super.permit(owner, spender, value, deadline, v, r, s);
    }

    function grantRole(bytes32 role, address account) public virtual override {
        if (!enabledFeatures[bytes4(keccak256("grantRole(bytes32,address)"))]) revert FeatureNotEnabled();
        super.grantRole(role, account);
    }

    function revokeRole(bytes32 role, address account) public virtual override {
        if (!enabledFeatures[bytes4(keccak256("revokeRole(bytes32,address)"))]) revert FeatureNotEnabled();
        super.revokeRole(role, account);
    }

    function renounceRole(bytes32 role, address account) public virtual override {
        if (!enabledFeatures[bytes4(keccak256("renounceRole(bytes32,address)"))]) revert FeatureNotEnabled();
        super.renounceRole(role, account);
    }

    function transferOwnership(address newOwner) public virtual override {
        if (!enabledFeatures[bytes4(keccak256("transferOwnership(address)"))]) revert FeatureNotEnabled();
        super.transferOwnership(newOwner);
    }

    function renounceOwnership() public virtual override {
        if (!enabledFeatures[bytes4(keccak256("renounceOwnership()"))]) revert FeatureNotEnabled();
        super.renounceOwnership();
    }

    function _update(address from, address to, uint256 value) 
        internal 
        virtual 
        override(ERC20, ERC20Pausable) 
    {
        super._update(from, to, value);
    }

    function supportsInterface(bytes4 interfaceId) 
        public 
        view 
        virtual 
        override(AccessControl) 
        returns (bool) 
    {
        return super.supportsInterface(interfaceId);
    }
}

// ============================================================================
// STRATAFORGE ERC721 IMPLEMENTATION
// ============================================================================
contract StrataForgeERC721Implementation is 
    ERC721, 
    ERC721URIStorage, 
    ERC721Burnable, 
    ERC721Pausable,
    ERC721Enumerable,
    Ownable, 
    AccessControl,
    Initializable 
{
    mapping(bytes4 => bool) public enabledFeatures;
    uint256 private _tokenIdCounter;
    string private _baseTokenURI;
    string private _tokenName;
    string private _tokenSymbol;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant URI_SETTER_ROLE = keccak256("URI_SETTER_ROLE");

    error FeatureNotEnabled();

    constructor() ERC721("StrataForge ERC721", "SF721") Ownable(msg.sender) {}

    function _getAllFeatureHashes() internal pure returns (bytes4[] memory) {
        bytes4[] memory _featureHashes = new bytes4[](18);
        _featureHashes[0] = bytes4(keccak256("mint(address)"));
        _featureHashes[1] = bytes4(keccak256("mintWithURI(address,string)"));
        _featureHashes[2] = bytes4(keccak256("burn(uint256)"));
        _featureHashes[3] = bytes4(keccak256("pause()"));
        _featureHashes[4] = bytes4(keccak256("setBaseURI(string)"));
        _featureHashes[5] = bytes4(keccak256("approve(address,uint256)"));
        _featureHashes[6] = bytes4(keccak256("safeMint(address)"));
        _featureHashes[7] = bytes4(keccak256("safeMintWithURI(address,string)"));
        _featureHashes[8] = bytes4(keccak256("setApprovalForAll(address,bool)"));
        _featureHashes[9] = bytes4(keccak256("transferFrom(address,address,uint256)"));
        _featureHashes[10] = bytes4(keccak256("safeTransfersFrom(address,address,uint256)"));
        _featureHashes[11] = bytes4(keccak256("safeTransferFrom(address,address,uint256,bytes)"));
        _featureHashes[12] = bytes4(keccak256("setTokenURI(uint256,string)"));
        _featureHashes[13] = bytes4(keccak256("grantRole(bytes32,address)"));
        _featureHashes[14] = bytes4(keccak256("revokeRole(bytes32,address)"));
        _featureHashes[15] = bytes4(keccak256("renounceRole(bytes32,address)"));
        _featureHashes[16] = bytes4(keccak256("transferOwnership(address)"));
        _featureHashes[17] = bytes4(keccak256("renounceOwnership()"));
        return _featureHashes;
    }

    function initialize(
        string memory name_,
        string memory symbol_,
        address tokenOwner,
        bool[] memory features
    ) external initializer {
        _tokenName = name_;
        _tokenSymbol = symbol_;
        _transferOwnership(tokenOwner);

        _grantRole(DEFAULT_ADMIN_ROLE, tokenOwner);
        _grantRole(MINTER_ROLE, tokenOwner);
        _grantRole(PAUSER_ROLE, tokenOwner);
        _grantRole(URI_SETTER_ROLE, tokenOwner);

        bytes4[] memory allFeatureHashes = _getAllFeatureHashes();
        for (uint i = 0; i < allFeatureHashes.length; i++) {
            if (i < features.length) {
                enabledFeatures[allFeatureHashes[i]] = features[i];
            } else {
                enabledFeatures[allFeatureHashes[i]] = false;
            }
        }

        if (features.length == 0) {
            enabledFeatures[allFeatureHashes[3]] = true; // pause()
        }
    }

    function getEnabledFeatures() external view returns (bool[] memory) {
        bytes4[] memory allFeatureHashes = _getAllFeatureHashes();
        bool[] memory featuresStatus = new bool[](allFeatureHashes.length);
        for (uint i = 0; i < allFeatureHashes.length; i++) {
            featuresStatus[i] = enabledFeatures[allFeatureHashes[i]];
        }
        return featuresStatus;
    }

    function name() public view virtual override returns (string memory) {
        return _tokenName;
    }

    function symbol() public view virtual override returns (string memory) {
        return _tokenSymbol;
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function setBaseURI(string memory baseURI) external onlyRole(URI_SETTER_ROLE) {
        if (!enabledFeatures[bytes4(keccak256("setBaseURI(string)"))]) revert FeatureNotEnabled();
        _baseTokenURI = baseURI;
    }

    function mint(address to) public onlyRole(MINTER_ROLE) returns (uint256) {
        if (!enabledFeatures[bytes4(keccak256("mint(address)"))]) revert FeatureNotEnabled();
        _tokenIdCounter++;
        uint256 tokenId = _tokenIdCounter;
        _mint(to, tokenId);
        return tokenId;
    }

    function mintWithURI(address to, string memory uri) public onlyRole(MINTER_ROLE) returns (uint256) {
        if (!enabledFeatures[bytes4(keccak256("mintWithURI(address,string)"))]) revert FeatureNotEnabled();
        uint256 tokenId = mint(to);
        _setTokenURI(tokenId, uri);
        return tokenId;
    }

    function safeMint(address to) public onlyRole(MINTER_ROLE) returns (uint256) {
        if (!enabledFeatures[bytes4(keccak256("safeMint(address)"))]) revert FeatureNotEnabled();
        _tokenIdCounter++;
        uint256 tokenId = _tokenIdCounter;
        _safeMint(to, tokenId);
        return tokenId;
    }

    function safeMintWithURI(address to, string memory uri) public onlyRole(MINTER_ROLE) returns (uint256) {
        if (!enabledFeatures[bytes4(keccak256("safeMintWithURI(address,string)"))]) revert FeatureNotEnabled();
        uint256 tokenId = safeMint(to);
        _setTokenURI(tokenId, uri);
        return tokenId;
    }

    function burn(uint256 tokenId) public virtual override {
        if (!enabledFeatures[bytes4(keccak256("burn(uint256)"))]) revert FeatureNotEnabled();
        super.burn(tokenId);
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        if (!enabledFeatures[bytes4(keccak256("pause()"))]) revert FeatureNotEnabled();
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        if (!enabledFeatures[bytes4(keccak256("pause()"))]) revert FeatureNotEnabled();
        _unpause();
    }

    function approve(address to, uint256 tokenId) public virtual override(ERC721, IERC721) {
        if (!enabledFeatures[bytes4(keccak256("approve(address,uint256)"))]) revert FeatureNotEnabled();
        super.approve(to, tokenId);
    }

    function setApprovalForAll(address operator, bool approved) public virtual override(ERC721, IERC721) {
        if (!enabledFeatures[bytes4(keccak256("setApprovalForAll(address,bool)"))]) revert FeatureNotEnabled();
        super.setApprovalForAll(operator, approved);
    }

    function transferFrom(address from, address to, uint256 tokenId) public virtual override(ERC721, IERC721) {
        if (!enabledFeatures[bytes4(keccak256("transferFrom(address,address,uint256)"))]) revert FeatureNotEnabled();
        super.transferFrom(from, to, tokenId);
    }

    function safeTransfersFrom(address from, address to, uint256 tokenId) public {
        if (!enabledFeatures[bytes4(keccak256("safeTransfersFrom(address,address,uint256)"))]) {
            revert FeatureNotEnabled();
        }
        super.safeTransferFrom(from, to, tokenId); // calls the parent version
    }

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public virtual override(ERC721, IERC721) {
        if (!enabledFeatures[bytes4(keccak256("safeTransferFrom(address,address,uint256,bytes)"))]) revert FeatureNotEnabled();
        super.safeTransferFrom(from, to, tokenId, data);
    }

    function setTokenURI(uint256 tokenId, string memory uri) public onlyRole(URI_SETTER_ROLE) {
        if (!enabledFeatures[bytes4(keccak256("setTokenURI(uint256,string)"))]) revert FeatureNotEnabled();
        _setTokenURI(tokenId, uri);
    }

    function grantRole(bytes32 role, address account) public virtual override {
        if (!enabledFeatures[bytes4(keccak256("grantRole(bytes32,address)"))]) revert FeatureNotEnabled();
        super.grantRole(role, account);
    }

    function revokeRole(bytes32 role, address account) public virtual override {
        if (!enabledFeatures[bytes4(keccak256("revokeRole(bytes32,address)"))]) revert FeatureNotEnabled();
        super.revokeRole(role, account);
    }

    function renounceRole(bytes32 role, address account) public virtual override {
        if (!enabledFeatures[bytes4(keccak256("renounceRole(bytes32,address)"))]) revert FeatureNotEnabled();
        super.renounceRole(role, account);
    }

    function transferOwnership(address newOwner) public virtual override {
        if (!enabledFeatures[bytes4(keccak256("transferOwnership(address)"))]) revert FeatureNotEnabled();
        super.transferOwnership(newOwner);
    }

    function renounceOwnership() public virtual override {
        if (!enabledFeatures[bytes4(keccak256("renounceOwnership()"))]) revert FeatureNotEnabled();
        super.renounceOwnership();
    }

    function _update(address to, uint256 tokenId, address auth) 
        internal 
        virtual 
        override(ERC721, ERC721Enumerable, ERC721Pausable) 
        returns (address) 
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value) 
        internal 
        virtual 
        override(ERC721, ERC721Enumerable) 
    {
        super._increaseBalance(account, value);
    }

    function tokenURI(uint256 tokenId) 
        public 
        view 
        virtual 
        override(ERC721, ERC721URIStorage) 
        returns (string memory) 
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) 
        public 
        view 
        virtual 
        override(ERC721, ERC721Enumerable, ERC721URIStorage, AccessControl) 
        returns (bool) 
    {
        return super.supportsInterface(interfaceId);
    }
}

// ============================================================================
// STRATAFORGE ERC1155 IMPLEMENTATION
// ============================================================================
contract StrataForgeERC1155Implementation is 
    ERC1155, 
    ERC1155Burnable, 
    ERC1155Pausable,
    Ownable, 
    AccessControl,
    Initializable 
{
    mapping(bytes4 => bool) public enabledFeatures;
    mapping(uint256 => string) private _tokenURIs;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant URI_SETTER_ROLE = keccak256("URI_SETTER_ROLE");

    error FeatureNotEnabled();
    
    constructor() ERC1155("") Ownable(msg.sender) {}

    function _getAllFeatureHashes() internal pure returns (bytes4[] memory) {
        bytes4[] memory _featureHashes = new bytes4[](15);
        _featureHashes[0] = bytes4(keccak256("mint(address,uint256,uint256,bytes)"));
        _featureHashes[1] = bytes4(keccak256("burn(address,uint256,uint256)"));
        _featureHashes[2] = bytes4(keccak256("pause()"));
        _featureHashes[3] = bytes4(keccak256("setURI(string)"));
        _featureHashes[4] = bytes4(keccak256("setTokenURI(uint256,string)"));
        _featureHashes[5] = bytes4(keccak256("safeTransferFrom(address,address,uint256,uint256,bytes)"));
        _featureHashes[6] = bytes4(keccak256("setApprovalForAll(address,bool)"));
        _featureHashes[7] = bytes4(keccak256("mintBatch(address,uint256[],uint256[],bytes)"));
        _featureHashes[8] = bytes4(keccak256("burnBatch(address,uint256[],uint256[])"));
        _featureHashes[9] = bytes4(keccak256("safeBatchTransferFrom(address,address,uint256[],uint256[],bytes)"));
        _featureHashes[10] = bytes4(keccak256("grantRole(bytes32,address)"));
        _featureHashes[11] = bytes4(keccak256("revokeRole(bytes32,address)"));
        _featureHashes[12] = bytes4(keccak256("renounceRole(bytes32,address)"));
        _featureHashes[13] = bytes4(keccak256("transferOwnership(address)"));
        _featureHashes[14] = bytes4(keccak256("renounceOwnership()"));
        return _featureHashes;
    }

    function initialize(
        string memory uri_,
        address tokenOwner,
        bool[] memory features
    ) external initializer {
        _setURI(uri_);
        _transferOwnership(tokenOwner);

        _grantRole(DEFAULT_ADMIN_ROLE, tokenOwner);
        _grantRole(MINTER_ROLE, tokenOwner);
        _grantRole(PAUSER_ROLE, tokenOwner);
        _grantRole(URI_SETTER_ROLE, tokenOwner);

        bytes4[] memory allFeatureHashes = _getAllFeatureHashes();
        for (uint i = 0; i < allFeatureHashes.length; i++) {
            if (i < features.length) {
                enabledFeatures[allFeatureHashes[i]] = features[i];
            } else {
                enabledFeatures[allFeatureHashes[i]] = false;
            }
        }

        if (features.length == 0) {
            enabledFeatures[allFeatureHashes[2]] = true; // pause()
        }
    }
    
    function getEnabledFeatures() external view returns (bool[] memory) {
        bytes4[] memory allFeatureHashes = _getAllFeatureHashes();
        bool[] memory featuresStatus = new bool[](allFeatureHashes.length);
        for (uint i = 0; i < allFeatureHashes.length; i++) {
            featuresStatus[i] = enabledFeatures[allFeatureHashes[i]];
        }
        return featuresStatus;
    }

    function setURI(string memory newuri) public onlyRole(URI_SETTER_ROLE) {
        if (!enabledFeatures[bytes4(keccak256("setURI(string)"))]) revert FeatureNotEnabled();
        _setURI(newuri);
    }

    function setTokenURI(uint256 id, string memory tokenURI) public onlyRole(URI_SETTER_ROLE) {
        if (!enabledFeatures[bytes4(keccak256("setTokenURI(uint256,string)"))]) revert FeatureNotEnabled();
        _tokenURIs[id] = tokenURI;
    }

    function uri(uint256 id) public view virtual override returns (string memory) {
        string memory tokenURI = _tokenURIs[id];
        return bytes(tokenURI).length > 0 ? tokenURI : super.uri(id);
    }

    function mint(address to, uint256 id, uint256 amount, bytes memory data) public onlyRole(MINTER_ROLE) {
        if (!enabledFeatures[bytes4(keccak256("mint(address,uint256,uint256,bytes)"))]) revert FeatureNotEnabled();
        _mint(to, id, amount, data);
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data) public onlyRole(MINTER_ROLE) {
        if (!enabledFeatures[bytes4(keccak256("mintBatch(address,uint256[],uint256[],bytes)"))]) revert FeatureNotEnabled();
        _mintBatch(to, ids, amounts, data);
    }

    function burn(address account, uint256 id, uint256 amount) public virtual override {
        if (!enabledFeatures[bytes4(keccak256("burn(address,uint256,uint256)"))]) revert FeatureNotEnabled();
        super.burn(account, id, amount);
    }

    function burnBatch(address account, uint256[] memory ids, uint256[] memory amounts) public virtual override {
        if (!enabledFeatures[bytes4(keccak256("burnBatch(address,uint256[],uint256[])"))]) revert FeatureNotEnabled();
        super.burnBatch(account, ids, amounts);
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        if (!enabledFeatures[bytes4(keccak256("pause()"))]) revert FeatureNotEnabled();
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        if (!enabledFeatures[bytes4(keccak256("pause()"))]) revert FeatureNotEnabled();
        _unpause();
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public virtual override {
        if (!enabledFeatures[bytes4(keccak256("safeTransferFrom(address,address,uint256,uint256,bytes)"))]) revert FeatureNotEnabled();
        super.safeTransferFrom(from, to, id, amount, data);
    }

    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public virtual override {
        if (!enabledFeatures[bytes4(keccak256("safeBatchTransferFrom(address,address,uint256[],uint256[],bytes)"))]) revert FeatureNotEnabled();
        super.safeBatchTransferFrom(from, to, ids, amounts, data);
    }

    function setApprovalForAll(address operator, bool approved) public virtual override {
        if (!enabledFeatures[bytes4(keccak256("setApprovalForAll(address,bool)"))]) revert FeatureNotEnabled();
        super.setApprovalForAll(operator, approved);
    }

    function grantRole(bytes32 role, address account) public virtual override {
        if (!enabledFeatures[bytes4(keccak256("grantRole(bytes32,address)"))]) revert FeatureNotEnabled();
        super.grantRole(role, account);
    }

    function revokeRole(bytes32 role, address account) public virtual override {
        if (!enabledFeatures[bytes4(keccak256("revokeRole(bytes32,address)"))]) revert FeatureNotEnabled();
        super.revokeRole(role, account);
    }

    function renounceRole(bytes32 role, address account) public virtual override {
        if (!enabledFeatures[bytes4(keccak256("renounceRole(bytes32,address)"))]) revert FeatureNotEnabled();
        super.renounceRole(role, account);
    }

    function transferOwnership(address newOwner) public virtual override {
        if (!enabledFeatures[bytes4(keccak256("transferOwnership(address)"))]) revert FeatureNotEnabled();
        super.transferOwnership(newOwner);
    }

    function renounceOwnership() public virtual override {
        if (!enabledFeatures[bytes4(keccak256("renounceOwnership()"))]) revert FeatureNotEnabled();
        super.renounceOwnership();
    }

    function _update(address from, address to, uint256[] memory ids, uint256[] memory values) 
        internal 
        virtual 
        override(ERC1155, ERC1155Pausable) 
    {
        super._update(from, to, ids, values);
    }

    function supportsInterface(bytes4 interfaceId) 
        public 
        view 
        virtual 
        override(ERC1155, AccessControl) 
        returns (bool) 
    {
        return super.supportsInterface(interfaceId);
    }
}

// ============================================================================
// STRATAFORGE MEMECOIN IMPLEMENTATION
// ============================================================================
contract StrataForgeMemecoinImplementation is 
    ERC20, 
    ERC20Burnable, 
    ERC20Pausable,
    Ownable, 
    AccessControl,
    Initializable 
{
    mapping(bytes4 => bool) public enabledFeatures;
    uint8 private _decimals;
    string private _tokenName;
    string private _tokenSymbol;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    error ExceedsMaxTransaction();
    error ExceedsMaxWalletSize();
    error InvalidDecimals();
    error InvalidAmount();
    error FeatureNotEnabled();

    uint96 public maxWalletSize;
    uint96 public maxTransactionAmount;
    mapping(address => bool) public isExcludedFromLimits;

    constructor() ERC20("StrataForge Memecoin", "SFM") Ownable(msg.sender) {}

    function _getAllFeatureHashes() internal pure returns (bytes4[] memory) {
        bytes4[] memory _featureHashes = new bytes4[](15);
        _featureHashes[0] = bytes4(keccak256("mint(address,uint256)"));
        _featureHashes[1] = bytes4(keccak256("burn(uint256)"));
        _featureHashes[2] = bytes4(keccak256("pause()"));
        _featureHashes[3] = bytes4(keccak256("setMaxWalletSize(uint96)"));
        _featureHashes[4] = bytes4(keccak256("setMaxTransactionAmount(uint96)"));
        _featureHashes[5] = bytes4(keccak256("excludeFromLimits(address,bool)"));
        _featureHashes[6] = bytes4(keccak256("transfer(address,uint256)"));
        _featureHashes[7] = bytes4(keccak256("approve(address,uint256)"));
        _featureHashes[8] = bytes4(keccak256("transferFrom(address,address,uint256)"));
        _featureHashes[9] = bytes4(keccak256("increaseAllowance(address,uint256)"));
        _featureHashes[10] = bytes4(keccak256("decreaseAllowance(address,uint256)"));
        _featureHashes[11] = bytes4(keccak256("burnFrom(address,uint256)"));
        _featureHashes[12] = bytes4(keccak256("grantRole(bytes32,address)"));
        _featureHashes[13] = bytes4(keccak256("revokeRole(bytes32,address)"));
        _featureHashes[14] = bytes4(keccak256("transferOwnership(address)"));
        return _featureHashes;
    }

    function initialize(
        string memory name_,
        string memory symbol_,
        uint96 initialSupply,
        uint8 decimals_,
        address tokenOwner,
        uint96 _maxWalletSize,
        uint96 _maxTransactionAmount,
        bool[] memory features
    ) external initializer {
        if (decimals_ > 18) revert InvalidDecimals();
        _tokenName = name_;
        _tokenSymbol = symbol_;
        _decimals = decimals_;
        _transferOwnership(tokenOwner);
        _mint(tokenOwner, uint256(initialSupply) * 10 ** decimals_);
        maxWalletSize = uint96(_maxWalletSize * 10 ** decimals_);
        maxTransactionAmount = uint96(_maxTransactionAmount * 10 ** decimals_);
        isExcludedFromLimits[tokenOwner] = true;

        _grantRole(DEFAULT_ADMIN_ROLE, tokenOwner);
        _grantRole(MINTER_ROLE, tokenOwner);
        _grantRole(PAUSER_ROLE, tokenOwner);

        bytes4[] memory allFeatureHashes = _getAllFeatureHashes();
        for (uint i = 0; i < allFeatureHashes.length; i++) {
            if (i < features.length) {
                enabledFeatures[allFeatureHashes[i]] = features[i];
            } else {
                enabledFeatures[allFeatureHashes[i]] = false;
            }
        }

        if (features.length == 0) {
            enabledFeatures[allFeatureHashes[2]] = true; // pause()
        }
    }

    function getEnabledFeatures() external view returns (bool[] memory) {
        bytes4[] memory allFeatureHashes = _getAllFeatureHashes();
        bool[] memory featuresStatus = new bool[](allFeatureHashes.length);
        for (uint i = 0; i < allFeatureHashes.length; i++) {
            featuresStatus[i] = enabledFeatures[allFeatureHashes[i]];
        }
        return featuresStatus;
    }

    function name() public view virtual override returns (string memory) {
        return _tokenName;
    }

    function symbol() public view virtual override returns (string memory) {
        return _tokenSymbol;
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    function setMaxWalletSize(uint96 amount) public onlyOwner {
        if (!enabledFeatures[bytes4(keccak256("setMaxWalletSize(uint96)"))]) revert FeatureNotEnabled();
        maxWalletSize = uint96(amount * 10 ** decimals());
    }

    function setMaxTransactionAmount(uint96 amount) public onlyOwner {
        if (!enabledFeatures[bytes4(keccak256("setMaxTransactionAmount(uint96)"))]) revert FeatureNotEnabled();
        maxTransactionAmount = uint96(amount * 10 ** decimals());
    }

    function excludeFromLimits(address account, bool excluded) public onlyOwner {
        if (!enabledFeatures[bytes4(keccak256("excludeFromLimits(address,bool)"))]) revert FeatureNotEnabled();
        isExcludedFromLimits[account] = excluded;
    }

    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        if (!enabledFeatures[bytes4(keccak256("mint(address,uint256)"))]) revert FeatureNotEnabled();
        if (amount == 0) revert InvalidAmount();
        _mint(to, amount);
    }

    function burn(uint256 amount) public virtual override {
        if (!enabledFeatures[bytes4(keccak256("burn(uint256)"))]) revert FeatureNotEnabled();
        super.burn(amount);
    }

    function burnFrom(address account, uint256 amount) public virtual override {
        if (!enabledFeatures[bytes4(keccak256("burnFrom(address,uint256)"))]) revert FeatureNotEnabled();
        super.burnFrom(account, amount);
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        if (!enabledFeatures[bytes4(keccak256("pause()"))]) revert FeatureNotEnabled();
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        if (!enabledFeatures[bytes4(keccak256("pause()"))]) revert FeatureNotEnabled();
        _unpause();
    }

    function transfer(address to, uint256 value) public virtual override returns (bool) {
        if (!enabledFeatures[bytes4(keccak256("transfer(address,uint256)"))]) revert FeatureNotEnabled();
        return super.transfer(to, value);
    }

    function approve(address spender, uint256 value) public virtual override returns (bool) {
        if (!enabledFeatures[bytes4(keccak256("approve(address,uint256)"))]) revert FeatureNotEnabled();
        return super.approve(spender, value);
    }

    function transferFrom(address from, address to, uint256 value) public virtual override returns (bool) {
        if (!enabledFeatures[bytes4(keccak256("transferFrom(address,address,uint256)"))]) revert FeatureNotEnabled();
        return super.transferFrom(from, to, value);
    }

    function increaseAllowance(address spender, uint256 addedValue) public virtual returns (bool) {
        if (!enabledFeatures[bytes4(keccak256("increaseAllowance(address,uint256)"))]) revert FeatureNotEnabled();
        _approve(msg.sender, spender, allowance(msg.sender, spender) + addedValue);
        return true;
    }

    function decreaseAllowance(address spender, uint256 subtractedValue) public virtual returns (bool) {
        if (!enabledFeatures[bytes4(keccak256("decreaseAllowance(address,uint256)"))]) revert FeatureNotEnabled();
        uint256 currentAllowance = allowance(msg.sender, spender);
        require(currentAllowance >= subtractedValue, "ERC20: decreased allowance below zero");
        _approve(msg.sender, spender, currentAllowance - subtractedValue);
        return true;
    }

    function grantRole(bytes32 role, address account) public virtual override {
        if (!enabledFeatures[bytes4(keccak256("grantRole(bytes32,address)"))]) revert FeatureNotEnabled();
        super.grantRole(role, account);
    }

    function revokeRole(bytes32 role, address account) public virtual override {
        if (!enabledFeatures[bytes4(keccak256("revokeRole(bytes32,address)"))]) revert FeatureNotEnabled();
        super.revokeRole(role, account);
    }

    function transferOwnership(address newOwner) public virtual override {
        if (!enabledFeatures[bytes4(keccak256("transferOwnership(address)"))]) revert FeatureNotEnabled();
        super.transferOwnership(newOwner);
    }

    function _update(address from, address to, uint256 amount) 
        internal 
        virtual 
        override(ERC20, ERC20Pausable) 
    {
        if (from != address(0) && to != address(0)) {
            if (!isExcludedFromLimits[from] && !isExcludedFromLimits[to]) {
                if (amount > maxTransactionAmount) revert ExceedsMaxTransaction();
                if (to != address(0) && to != address(this)) {
                    if (balanceOf(to) + amount > maxWalletSize) revert ExceedsMaxWalletSize();
                }
            }
        }
        super._update(from, to, amount);
    }

    function supportsInterface(bytes4 interfaceId) 
        public 
        view 
        virtual 
        override(AccessControl) 
        returns (bool) 
    {
        return super.supportsInterface(interfaceId);
    }
}

// ============================================================================
// STRATAFORGE STABLECOIN IMPLEMENTATION
// ============================================================================
contract StrataForgeStablecoinImplementation is 
    ERC20, 
    ERC20Burnable, 
    ERC20Pausable,
    Ownable, 
    AccessControl,
    Initializable 
{
    mapping(bytes4 => bool) public enabledFeatures;
    string private _tokenName;
    string private _tokenSymbol;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    error InvalidCollateralAmount();
    error InsufficientBalance();
    error InsufficientCollateral();
    error InvalidRatio();
    error InvalidFees();
    error InvalidTreasury();
    error TransferFailed();
    error InvalidAmount();
    error FeatureNotEnabled();

    address public collateralToken;
    uint96 public collateralRatio;
    address public treasury;
    uint32 public mintFee = 50;
    uint32 public redeemFee = 50;
    mapping(address => uint256) public collateralDeposited;

    constructor() ERC20("StrataForge Stablecoin", "SFSC") Ownable(msg.sender) {}

    function _getAllFeatureHashes() internal pure returns (bytes4[] memory) {
        bytes4[] memory _featureHashes = new bytes4[](15);
        _featureHashes[0] = bytes4(keccak256("mint(uint256)"));
        _featureHashes[1] = bytes4(keccak256("redeem(uint256)"));
        _featureHashes[2] = bytes4(keccak256("burn(uint256)"));
        _featureHashes[3] = bytes4(keccak256("pause()"));
        _featureHashes[4] = bytes4(keccak256("setCollateralRatio(uint96)"));
        _featureHashes[5] = bytes4(keccak256("setFees(uint32,uint32)"));
        _featureHashes[6] = bytes4(keccak256("setTreasury(address)"));
        _featureHashes[7] = bytes4(keccak256("transfer(address,uint256)"));
        _featureHashes[8] = bytes4(keccak256("approve(address,uint256)"));
        _featureHashes[9] = bytes4(keccak256("transferFrom(address,address,uint256)"));
        _featureHashes[10] = bytes4(keccak256("increaseAllowance(address,uint256)"));
        _featureHashes[11] = bytes4(keccak256("decreaseAllowance(address,uint256)"));
        _featureHashes[12] = bytes4(keccak256("burnFrom(address,uint256)"));
        _featureHashes[13] = bytes4(keccak256("grantRole(bytes32,address)"));
        _featureHashes[14] = bytes4(keccak256("transferOwnership(address)"));
        return _featureHashes;
    }

    function initialize(
        string memory name_,
        string memory symbol_,
        address _collateralToken,
        uint96 _collateralRatio,
        address _treasury,
        address tokenOwner,
        bool[] memory features
    ) external initializer {
        _tokenName = name_;
        _tokenSymbol = symbol_;
        _transferOwnership(tokenOwner);
        collateralToken = _collateralToken;
        collateralRatio = _collateralRatio;
        treasury = _treasury;

        _grantRole(DEFAULT_ADMIN_ROLE, tokenOwner);
        _grantRole(MINTER_ROLE, tokenOwner);
        _grantRole(PAUSER_ROLE, tokenOwner);

        bytes4[] memory allFeatureHashes = _getAllFeatureHashes();
        for (uint i = 0; i < allFeatureHashes.length; i++) {
            if (i < features.length) {
                enabledFeatures[allFeatureHashes[i]] = features[i];
            } else {
                enabledFeatures[allFeatureHashes[i]] = false;
            }
        }

        if (features.length == 0) {
            enabledFeatures[allFeatureHashes[3]] = true; // pause()
        }
    }

    function getEnabledFeatures() external view returns (bool[] memory) {
        bytes4[] memory allFeatureHashes = _getAllFeatureHashes();
        bool[] memory featuresStatus = new bool[](allFeatureHashes.length);
        for (uint i = 0; i < allFeatureHashes.length; i++) {
            featuresStatus[i] = enabledFeatures[allFeatureHashes[i]];
        }
        return featuresStatus;
    }
    
    function name() public view virtual override returns (string memory) {
        return _tokenName;
    }

    function symbol() public view virtual override returns (string memory) {
        return _tokenSymbol;
    }

    function decimals() public view virtual override returns (uint8) {
        return 6;
    }

    function setCollateralRatio(uint96 _collateralRatio) public onlyOwner {
        if (!enabledFeatures[bytes4(keccak256("setCollateralRatio(uint96)"))]) revert FeatureNotEnabled();
        if (_collateralRatio < 10000) revert InvalidRatio();
        collateralRatio = _collateralRatio;
    }

    function setFees(uint32 _mintFee, uint32 _redeemFee) public onlyOwner {
        if (!enabledFeatures[bytes4(keccak256("setFees(uint32,uint32)"))]) revert FeatureNotEnabled();
        if (_mintFee > 500 || _redeemFee > 500) revert InvalidFees();
        mintFee = _mintFee;
        redeemFee = _redeemFee;
    }

    function setTreasury(address _treasury) public onlyOwner {
        if (!enabledFeatures[bytes4(keccak256("setTreasury(address)"))]) revert FeatureNotEnabled();
        if (_treasury == address(0)) revert InvalidTreasury();
        treasury = _treasury;
    }

    function mint(uint256 collateralAmount) public {
        if (!enabledFeatures[bytes4(keccak256("mint(uint256)"))]) revert FeatureNotEnabled();
        if (collateralAmount == 0) revert InvalidCollateralAmount();

        IERC20 collateral = IERC20(collateralToken);
        if (!collateral.transferFrom(msg.sender, address(this), collateralAmount)) revert TransferFailed();

        uint256 tokensToMint = (collateralAmount * 10000) / collateralRatio;
        uint256 fee = (tokensToMint * mintFee) / 10000;
        uint256 mintAmount = tokensToMint - fee;

        collateralDeposited[msg.sender] += collateralAmount;
        _mint(msg.sender, mintAmount);
        if (fee > 0 && treasury != address(0)) {
            _mint(treasury, fee);
        }
    }

    function redeem(uint256 tokenAmount) public {
        if (!enabledFeatures[bytes4(keccak256("redeem(uint256)"))]) revert FeatureNotEnabled();
        if (tokenAmount == 0) revert InvalidAmount();
        if (balanceOf(msg.sender) < tokenAmount) revert InsufficientBalance();

        uint256 collateralToReturn = (tokenAmount * collateralRatio) / 10000;
        if (collateralDeposited[msg.sender] < collateralToReturn) revert InsufficientCollateral();

        uint256 fee = (collateralToReturn * redeemFee) / 10000;
        uint256 returnAmount = collateralToReturn - fee;

        collateralDeposited[msg.sender] -= collateralToReturn;
        _burn(msg.sender, tokenAmount);

        IERC20 collateral = IERC20(collateralToken);
        if (!collateral.transfer(msg.sender, returnAmount)) revert TransferFailed();
        if (fee > 0 && treasury != address(0)) {
            if (!collateral.transfer(treasury, fee)) revert TransferFailed();
        }
    }

    function burn(uint256 amount) public virtual override {
        if (!enabledFeatures[bytes4(keccak256("burn(uint256)"))]) revert FeatureNotEnabled();
        super.burn(amount);
    }

    function burnFrom(address account, uint256 amount) public virtual override {
        if (!enabledFeatures[bytes4(keccak256("burnFrom(address,uint256)"))]) revert FeatureNotEnabled();
        super.burnFrom(account, amount);
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        if (!enabledFeatures[bytes4(keccak256("pause()"))]) revert FeatureNotEnabled();
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        if (!enabledFeatures[bytes4(keccak256("pause()"))]) revert FeatureNotEnabled();
        _unpause();
    }

    function transfer(address to, uint256 value) public virtual override returns (bool) {
        if (!enabledFeatures[bytes4(keccak256("transfer(address,uint256)"))]) revert FeatureNotEnabled();
        return super.transfer(to, value);
    }

    function approve(address spender, uint256 value) public virtual override returns (bool) {
        if (!enabledFeatures[bytes4(keccak256("approve(address,uint256)"))]) revert FeatureNotEnabled();
        return super.approve(spender, value);
    }

    function transferFrom(address from, address to, uint256 value) public virtual override returns (bool) {
        if (!enabledFeatures[bytes4(keccak256("transferFrom(address,address,uint256)"))]) revert FeatureNotEnabled();
        return super.transferFrom(from, to, value);
    }

    function increaseAllowance(address spender, uint256 addedValue) public virtual returns (bool) {
        if (!enabledFeatures[bytes4(keccak256("increaseAllowance(address,uint256)"))]) revert FeatureNotEnabled();
        _approve(msg.sender, spender, allowance(msg.sender, spender) + addedValue);
        return true;
    }

    function decreaseAllowance(address spender, uint256 subtractedValue) public virtual returns (bool) {
        if (!enabledFeatures[bytes4(keccak256("decreaseAllowance(address,uint256)"))]) revert FeatureNotEnabled();
        uint256 currentAllowance = allowance(msg.sender, spender);
        require(currentAllowance >= subtractedValue, "ERC20: decreased allowance below zero");
        _approve(msg.sender, spender, currentAllowance - subtractedValue);
        return true;
    }

    function grantRole(bytes32 role, address account) public virtual override {
        if (!enabledFeatures[bytes4(keccak256("grantRole(bytes32,address)"))]) revert FeatureNotEnabled();
        super.grantRole(role, account);
    }

    function transferOwnership(address newOwner) public virtual override {
        if (!enabledFeatures[bytes4(keccak256("transferOwnership(address)"))]) revert FeatureNotEnabled();
        super.transferOwnership(newOwner);
    }

    function _update(address from, address to, uint256 amount) 
        internal 
        virtual 
        override(ERC20, ERC20Pausable) 
    {
        super._update(from, to, amount);
    }

    function supportsInterface(bytes4 interfaceId) 
        public 
        view 
        virtual 
        override(AccessControl) 
        returns (bool) 
    {
        return super.supportsInterface(interfaceId);
    }
}