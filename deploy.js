const ethers = require("ethers");
const fs = require("fs-extra");

async function main() {
  // RPC server
  // HTTP://127.0.0.1:7545
  // Provider gives read only access to the Ethereum Network
  const provider = new ethers.providers.JsonRpcBatchProvider(
    "HTTP://127.0.0.1:7545"
  );
  // A class that inherits Signer and can sign transactions and messages using a private key
  const wallet = new ethers.Wallet(
    "9f1e6652394221718b5f6b5f38613972a91a6fdfee40fac4a2703f2db40c4ba4",
    provider
  );

  const abi = fs.readFileSync("./dist/SimpleStorage_sol_SimpleStorage.abi", "utf8");
  const binary = fs.readFileSync("./dist/SimpleStorage_sol_SimpleStorage.bin", "utf8")
  // this is what we use to deploy a contract
  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  console.log("Deploying, please wait...");

  // deploy
  const contract = await contractFactory.deploy();
  console.log(contract);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
