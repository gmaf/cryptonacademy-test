import { ethers } from "hardhat";

async function main() {
  const Donations = await ethers.getContractFactory("Donations");
  const donations = await Donations.deploy();

  await donations.deployed();

  console.log("Donations deployed to:", donations.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
