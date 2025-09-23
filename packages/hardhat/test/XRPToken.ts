/* eslint-disable @typescript-eslint/no-unused-vars */
//
// this script executes when you run 'yarn harhat:test'
//
import hre from "hardhat";
import { expect } from "chai";
import { XRPToken } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

const { ethers } = hre;

describe("🚩 XRP Token: 🏵 Mock XRP Token 🤖", function () {
  const contractAddress = process.env.CONTRACT_ADDRESS;
  let yourToken: XRPToken;
  let yourTokenAddress = "";

  let owner: HardhatEthersSigner;
  let user1: HardhatEthersSigner;
  let user2: HardhatEthersSigner;
  let user3: HardhatEthersSigner;

  let tokenContractArtifact = "";
  if (contractAddress) {
    tokenContractArtifact = `contracts/XRPTokenAutograder.sol:XRPToken`;
  } else {
    tokenContractArtifact = "contracts/XRPToken.sol:XRPToken";
  }

  before(async () => {
    // Get the Signers object from ethers
    [owner, user1, user2, user3] = await ethers.getSigners();
  });

  it("Should deploy XRPToken", async function () {
    console.log("<< token artifact");
    console.log(tokenContractArtifact);
    const XRPTokenFactory = await ethers.getContractFactory(tokenContractArtifact);

    yourToken = (await XRPTokenFactory.deploy()) as XRPToken;
    yourTokenAddress = await yourToken.getAddress();
  });

  describe("balanceOf()", function () {
    it("Should show the XRP balance of an account", async function () {
      const balance = await yourToken.balanceOf(user1);
      const balanceXRP = parseInt(ethers.formatEther(balance));
      console.log("\t", " 🧾 Balance:", balanceXRP);
      expect(balanceXRP).to.equal(10000);
    });
  });
});
