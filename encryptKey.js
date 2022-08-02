// to not risk someone stealing our local private key, we encrypt it
require("dotenv").config();
const ethers = require("ethers");
const fs = require("fs-extra");

async function main() {
  const wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY);
  const encryptedJsonKey = await wallet.encrypt(
    process.env.PRIVATE_KEY_PASSWORD,
    process.env.WALLET_PRIVATE_KEY
  );
  fs.writeFileSync("./encryptedKey.json", encryptedJsonKey);
  console.log(encryptedJsonKey);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
