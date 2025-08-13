# StrataForge Smart Contract Tests

This directory contains comprehensive tests for the StrataForge smart contract ecosystem.

## Test Files

### 1. `StrataForgeFactory.test.ts`
Tests for the main factory contract that creates different types of tokens:
- ERC20 token creation
- ERC721 NFT creation  
- ERC1155 multi-token creation
- Memecoin creation
- Stablecoin creation
- Access control and admin functions
- Pause/unpause functionality
- Token registry management

### 2. `StrataForgeAdmin.test.ts`
Tests for the admin contract that manages the ecosystem:
- Admin management (add/remove admins)
- Fee management (feature fees, airdrop fees)
- Contract management (factory, airdrop contract updates)
- Withdrawal proposal system
- Access control and permissions
- Pause/unpause functionality

### 3. `StrataForgeAirdropFactory.test.ts`
Tests for the airdrop factory contract:
- ERC20 airdrop creation
- ERC721 airdrop creation
- ERC1155 airdrop creation
- Airdrop management and tracking
- Fee payment validation
- Multiple airdrops from same creator
- Edge cases and error handling

### 4. `StrataForgeMerkleDistributor.test.ts`
Tests for the merkle distributor contract:
- ERC20 token distribution via merkle proofs
- ERC721 NFT distribution
- ERC1155 token distribution
- Merkle proof validation
- Claim functionality
- Time-based restrictions
- Access control and withdrawal

### 5. `StrataForgeTokenImplementation.test.ts`
Tests for the flexible token implementation:
- ERC20 functionality with feature selection
- ERC721 functionality with feature selection
- ERC1155 functionality with feature selection
- Feature control and validation
- Access control and permissions
- Edge cases and error handling

## Running Tests

### Run all tests:
```bash
npm test
```

### Run specific test file:
```bash
npx hardhat test test/StrataForgeFactory.test.ts
```

### Run tests with coverage:
```bash
npm run test:coverage
```

### Run tests in parallel:
```bash
npx hardhat test --parallel
```

## Test Structure

Each test file follows this structure:
1. **Setup**: Deploy contracts and initialize test environment
2. **Deployment Tests**: Verify contract deployment and initial state
3. **Core Functionality Tests**: Test main contract features
4. **Access Control Tests**: Verify permissions and restrictions
5. **Edge Cases**: Test error conditions and boundary cases
6. **Integration Tests**: Test interactions between contracts

## Test Coverage

The tests cover:
- ✅ Contract deployment and initialization
- ✅ All public functions and their edge cases
- ✅ Access control and permissions
- ✅ Event emissions
- ✅ Error conditions and custom errors
- ✅ Integration between contracts
- ✅ Gas optimization considerations
- ✅ Security vulnerabilities

## Test Data

Tests use:
- Mock tokens for testing
- Sample merkle trees and proofs
- Multiple test accounts
- Various token configurations
- Realistic fee structures

## Continuous Integration

These tests are designed to run in CI/CD pipelines and provide:
- Fast execution times
- Clear error messages
- Comprehensive coverage reporting
- Integration with deployment scripts

## Debugging Tests

To debug failing tests:
1. Run individual test files
2. Use `console.log()` for debugging
3. Check contract state between operations
4. Verify event emissions
5. Test with smaller datasets

## Adding New Tests

When adding new tests:
1. Follow the existing naming conventions
2. Include setup and teardown
3. Test both success and failure cases
4. Verify event emissions
5. Test edge cases and boundary conditions
6. Update this README if adding new test files
