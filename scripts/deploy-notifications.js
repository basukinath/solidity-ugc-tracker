const hre = require("hardhat");

async function main() {
  // Get the contract factory
  const NotificationPreferences = await hre.ethers.getContractFactory("NotificationPreferences");
  
  // Deploy the contract
  const notificationPreferences = await NotificationPreferences.deploy();
  
  // Wait for deployment to finish
  await notificationPreferences.deployed();
  
  console.log("NotificationPreferences contract deployed to:", notificationPreferences.address);
}

// Execute the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 