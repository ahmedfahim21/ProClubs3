import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";


// Create a Sui client connecting to the network of your choice
export const suiClient = new SuiClient({
  url: getFullnodeUrl('testnet'), // Options: 'devnet', 'testnet', 'mainnet'
});