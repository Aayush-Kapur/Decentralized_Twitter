const hre = require("hardhat");

async function main() {
  
  const TwitterClone = await hre.ethers.getContractFactory("TwitterClone");
  const twitterclone = await TwitterClone.deploy();
  await twitterclone.deployed();

  console.log("TwitterClone deployed to:", twitterclone.address);
}

// TwitterClone deployed to: 0x4709eEDfDB1E57cbAB7a36f6ea971D9cf5FD2be7

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
