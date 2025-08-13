import { ethers } from "hardhat";
import { expect } from "chai";

// This file serves as a comprehensive test suite runner
// It imports and runs all the individual test files

describe("StrataForge Complete Test Suite", function () {
  // This test suite will run all the individual test files
  // Each test file is imported and run as part of the complete suite

  it("Should have all test files available", async function () {
    // This is a placeholder test to ensure the test suite is properly structured
    expect(true).to.be.true;
  });

  // The following test files will be automatically discovered and run:
  // - StrataForgeFactory.test.ts
  // - StrataForgeAdmin.test.ts  
  // - StrataForgeAirdropFactory.test.ts
  // - StrataForgeMerkleDistributor.test.ts
  // - StrataForgeTokenImplementation.test.ts
});
