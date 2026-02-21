import { ethers } from 'ethers';

const abi = [
  'function storeBatch(string memory _batchHash)'
];

export async function storeOnBlockchain(batchHash) {
  const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  
  console.log("Wallet address being used:", wallet.address);

  const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, wallet);

  const tx = await contract.storeBatch(batchHash);
  const receipt = await tx.wait();

  return receipt.hash;
}