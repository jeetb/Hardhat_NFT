const { assert, expect } = require("chai");
const { network, getNamedAccounts, deployments, ethers } = require("hardhat");
const {
  networkConfig,
  developmentChains,
} = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("NFT Unit Tests", async function () {
      let basicNFT, deployer, tokenURI;
      beforeEach(async () => {
        accounts = await ethers.getSigners();
        deployer = accounts[0];
        //const { deploy, log } = deployments;
        //const args = [];
        // basicNFT = await deploy("BasicNFT", {
        //   from: deployer,
        //   log: true,
        //   args: args,
        //   waitConfirmations: networkConfig.waitConfirmations || 1,
        // });
        await deployments.fixture(["basicnft"]);
        basicNFT = await ethers.getContract("BasicNFT");
      });

      it("initialises s_tokenCounter to 0", async function () {
        const s_tokenCounter = await basicNFT.getTokenCounter();
        assert.equal(s_tokenCounter.toString(), "0");
      });

      it("initialises the name and symbol correctly", async function () {
        const name = await basicNFT.name();
        const symbol = await basicNFT.symbol();
        assert.equal(name.toString(), "Dogie");
        assert.equal(symbol.toString(), "DOG");
      });
      it("The tokenURI is correct", async function () {
        tokenURI = await basicNFT.tokenURI(0);
        assert(
          tokenURI.toString(),
          "ipfs://bafybeig37ioir76s7mg5oobetncojcm3c3hxasyd4rvid4jqhy4gkaheg4/?filename=0-PUG.json"
        );
      });
      describe("mintNFT", async function () {
        let initialTokenCounter,
          finalTokenCounter,
          initialBalance,
          finalBalance;
        beforeEach(async () => {
          initialTokenCounter = await basicNFT.getTokenCounter();
          initialBalance = await basicNFT.balanceOf(deployer.address);
          //const initialOwner = await basicNFT.ownerOf(initialTokenCounter);
          const tx = await basicNFT.mintNFT();
          await tx.wait(1);
          finalBalance = await basicNFT.balanceOf(deployer.address);
          //const owner = await basicNFT.ownerOf(initialTokenCounter);
          finalTokenCounter = await basicNFT.getTokenCounter();
        });

        // it("token doesn't exist before minting", function () {
        //   assert.equal(initial_owner, address(0));
        // });
        // it("token ownership is transferred to deployer", function () {
        //   assert.equal(owner.toString(), deployer.address.toString());
        // });
        it("owner's balance gets updated", function () {
          assert.equal(
            (initialBalance + 1).toString(),
            finalBalance.toString()
          );
        });
        it("token counters get updated and mintnft function returns the proper counter", function () {
          assert.equal(finalTokenCounter, (initialTokenCounter + 1).toString());
        });
      });
    });
