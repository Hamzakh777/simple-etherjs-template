require("dotenv").config();
const ethers = require("ethers");
const fs = require("fs-extra");

async function main() {
  // RPC server
  // HTTP://127.0.0.1:7545
  // Provider gives read only access to the Ethereum Network
  const provider = new ethers.providers.JsonRpcBatchProvider(
    process.env.RPC_SERVER
  );

  const encryptedJson = fs.readFileSync("./encryptedKey.json", "utf8");
  // A class that inherits Signer and can sign transactions and messages using a private key
  let wallet = new ethers.Wallet.fromEncryptedJsonSync(
    encryptedJson,
    process.env.PRIVATE_KEY_PASSWORD
  );
  wallet = await wallet.connect(provider);

  const abi = fs.readFileSync(
    "./dist/SimpleStorage_sol_SimpleStorage.abi",
    "utf8"
  );
  const binary = fs.readFileSync(
    "./dist/SimpleStorage_sol_SimpleStorage.bin",
    "utf8"
  );
  // this is what we use to deploy a contract
  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  console.log("Deploying, please wait...");

  // deploy
  const contract = await contractFactory
    .deploy
    // we can do overrides
    // {
    //   gasLimit: 10000000000,
    // }
    ();

  // Transaction receipts
  const transactionReceipt = await contract.deployTransaction.wait(1);
  // what you get when the transaction has been processed by waiting for 1 block
  console.log("Here is the transaction receipt: ");
  console.log(transactionReceipt);
  // what you get when you just create your transaction
  console.log("Here is the deployment transaction: (transaction response)");
  console.log(contract.deployTransaction);

  console.log(contract);

  // call some functions on the contract
  const currentFavoriteNumber = await contract.retrieve();
  // Ethers.js has a utility called BigNumber for big numbers
  console.log("favorite number", currentFavoriteNumber.toString());

  const transactionResponse = await contract.store("7");
  const storeTransactionReceipt = await transactionResponse.wait(1);
  const updatedFavoriteNumber = await contract.retrieve();
  console.log("update favorite number is", updatedFavoriteNumber.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
