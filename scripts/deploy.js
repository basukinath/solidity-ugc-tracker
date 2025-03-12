const hre = require("hardhat");

async function main() {
  // Get the contract factory
  const UserContent = await hre.ethers.getContractFactory("UserContent");
  
  // Deploy the contract
  const userContent = await UserContent.deploy();
  
  // Wait for deployment to finish
  await userContent.deployed();
  
  console.log("UserContent contract deployed to:", userContent.address);
}

// Execute the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 