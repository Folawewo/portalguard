import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ethers } from "ethers";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const artifactPath = path.resolve(
    __dirname,
    "../artifacts/contracts/PortalGuardRegistry.sol/PortalGuardRegistry.json"
  );

  if (!fs.existsSync(artifactPath)) {
    throw new Error("Artifact not found. Run 'npx hardhat compile' first.");
  }

  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
  const rpcUrl = process.env.RPC_URL || "http://127.0.0.1:8545";
  const provider = new ethers.JsonRpcProvider(rpcUrl);

  let signer;
  if (process.env.PRIVATE_KEY) {
    signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  } else {
    signer = await provider.getSigner(0).catch(() => {
      const wallet = ethers.Wallet.createRandom().connect(provider);
      return wallet;
    });
  }

  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, signer);
  const contract = await factory.deploy();
  await contract.waitForDeployment();
  const address = await contract.getAddress();

  console.log(`PortalGuardRegistry deployed to: ${address}`);
  return address;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
