const { network, ethers } = require("hardhat")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    // Basic NFT
    const basicNft = await ethers.getContract("BasicNft", deployer)
    const basicMintTx = await basicNft.mintNft()
    await basicMintTx.wait(1)
    console.log(`Basic NFT index 0 tokenURI: ${await basicNft.tokenURI(0)}`)

    // Dynamic SVG  NFT
    const highValue = ethers.utils.parseEther("4000")
    const dynamicSvgNft = await ethers.getContract("DynamicSvgNft", deployer)
    const dynamicSvgNftMintTx = await dynamicSvgNft.mintNft(highValue)
    await dynamicSvgNftMintTx.wait(1)
    console.log(`Dynamic SVG NFT index 0 tokenURI: ${await dynamicSvgNft.tokenURI(0)}`)

    // Random IPFS NFT
    const randomIpfsNft = await ethers.getContract("RandomIpfsNft", deployer)
    const mintFee = await randomIpfsNft.getMintFee()
    const randomIpfsNftMintTx = await randomIpfsNft.requestNft({ value: mintFee.toString() })
    const randomIpfsNftMintTxReceipt = await randomIpfsNftMintTx.wait(1)
    
    // Need to listen for response
    await new Promise(async (resolve) => {
        setTimeout(resolve, 300000) // Timeout time 5 minutes 
        
        // Setup listener for our event
        randomIpfsNft.once("NftMinted", async () => {
            resolve()
        })
        
        if (chainId == 31337) {
            const requestId = randomIpfsNftMintTxReceipt.events[1].args.requestId.toString()
            const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer)
            await vrfCoordinatorV2Mock.fulfillRandomWords(requestId, randomIpfsNft.address)
        }
    })
    console.log(`Random IPFS NFT index 0 tokenURI: ${await randomIpfsNft.tokenURI(0)}`)
}
module.exports.tags = ["all", "mint"]

/* / { deployments.get } = require("ethers/lib/utils");
const { network, ethers } = require("hardhat");
const {
  developmentChains,
  networkConfig,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");
const fs = require("fs");
const { resolve } = require("path");

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deployer } = await getNamedAccounts();

  const basicNft = await ethers.getContract("BasicNFT", deployer);
  const basicMintTx = await basicNft.mintNFT();
  await basicMintTx.wait(1);
  console.log(`Basic NFT index 0 has tokkenURI: ${await basicNft.tokenURI(0)}`);

  // const randomIpfsNft = await ethers.getContract("RandomIpfsNft", deployer);
  // const mintFee = await randomIpfsNft.getMintFee();
  // const randomIpfsNftMintTx = await randomIpfsNft.requestNft({
  //   value: mintFee.toString(),
  // });
  // const randomIpfsNftMintTxReceipt = await randomIpfsNftMintTx.wait(1);
  // await new Promise(async (resolve, reject) => {
  //   setTimeout(() => reject("Timeout: 'NFTMinted' event did not fire"), 600000);
  //   randomIpfsNft.once("NFTMinted", async function () {
  //     resolve();
  //   });
  //   // const randomIpfsNftMintTx = await randomIpfsNft.requestNft({
  //   //   value: mintFee.toString(),
  //   // });
  //   // const randomIpfsNftMintTxReceipt = await randomIpfsNftMintTx.wait(1);

  //   if (developmentChains.includes(network.name)) {
  //     const requestId =
  //       randomIpfsNftMintTxReceipt.events[1].args.requestId.toString();
  //     const vrfCoordinatorV2Mock = await ethers.getContract(
  //       "VRFCoordinatorV2Mock",
  //       deployer
  //     );
  //     await vrfCoordinatorV2Mock.fulfillRandomWords(
  //       requestId,
  //       randomIpfsNft.address
  //     );
  //   }
  // });
  // console.log(
  //   `Random IPFS NFT index 0 tokenURI: ${await randomIpfsNft.tokenURI(0)}`
  // );

  //Dynamic SVG NFT
  // const highValue = ethers.utils.parseEther("3000");
  // const dynamicSvgNft = await ethers.getContract("DynamicSvgNft", deployer);
  // const dynamicSvgNftMintTx = await dynamicSvgNft.mintNFT(highValue.toString());
  // await dynamicSvgNftMintTx.wait(1);
  // console.log("minted!");
  // const dynamicSvgNftTokenURI = await dynamicSvgNft.tokenURI(0);
  // console.log("queried!");
  // console.log(`Dynamic SVG NFT index 0 tokenURI: ${dynamicSvgNftTokenURI}`);
};

module.exports.tags = ["all", "mint"]; /*
