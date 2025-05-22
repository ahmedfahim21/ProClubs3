import { NextRequest, NextResponse } from "next/server";
import { getFullnodeUrl, SuiClient, SuiObjectRef } from '@mysten/sui/client';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { Transaction } from '@mysten/sui/transactions';
import { decodeSuiPrivateKey } from "@mysten/sui/cryptography";

const client = new SuiClient({ url: getFullnodeUrl('testnet') });

const suiPrivKey = process.env.SUI_PVT_KEY!; // suiprivkey1...
const { secretKey } = decodeSuiPrivateKey(suiPrivKey);

// Now use secretKey (which is a Uint8Array) with Ed25519Keypair
const sponsorKeypair = Ed25519Keypair.fromSecretKey(secretKey);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { txBytes, sender } = body;

    if (!txBytes) {
      return NextResponse.json(
        { error: 'Transaction bytes are required' },
        { status: 400 }
      );
    }

    if (!sender) {
      return NextResponse.json(
        { error: 'Sender address is required' },
        { status: 400 }
      );
    }

    // Get sponsor address and ensure it has funds
    const sponsorAddress = sponsorKeypair.getPublicKey().toSuiAddress();

    // Get gas payment coins for sponsor
    const coins = await client.getCoins({ 
      owner: sponsorAddress, 
      limit: 1 
    });

    if (coins.data.length === 0) {
      return NextResponse.json(
        { error: 'Sponsor account has no SUI coins for gas payment' },
        { status: 500 }
      );
    }

    const payment: SuiObjectRef[] = coins.data.map((coin) => ({
      objectId: coin.coinObjectId,
      version: coin.version,
      digest: coin.digest,
    }));

    // Decode the transaction bytes from base64
    const transactionBytes = new Uint8Array(Buffer.from(txBytes, 'base64'));
    
    // Create transaction from the provided bytes
    const tx = Transaction.from(transactionBytes);
    
    // Set transaction properties for sponsorship
    tx.setSender(sender);
    tx.setGasOwner(sponsorAddress);
    tx.setGasPayment(payment);

    // Build and sign the transaction
    const builtTx = await tx.build({ client });
    const signedTx = await sponsorKeypair.signTransaction(builtTx);

    console.log('Transaction sponsored successfully, digest would be:', signedTx);

    return NextResponse.json({
      sponsoredTxBytes: signedTx.bytes,
      sponsorSignature: signedTx.signature,
    });

  } catch (e) {
    console.error('Sponsor transaction error:', e);
    return NextResponse.json({
      error: e instanceof Error ? e.message : 'Unknown error occurred',
    }, { status: 500 });
  }
}