import { NextResponse } from 'next/server';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { Transaction } from '@mysten/sui/transactions';
import { decodeSuiPrivateKey } from "@mysten/sui/cryptography";

const suiClient = new SuiClient({ url: getFullnodeUrl('testnet') });

const suiPrivKey = process.env.SUI_PVT_KEY!;
const { secretKey } = decodeSuiPrivateKey(suiPrivKey);
const keypair = Ed25519Keypair.fromSecretKey(secretKey);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            clubId,
            matches_played,
            matches_won,
            matches_drawn,
            matches_lost,
            goals_scored,
            goals_conceded
        } = body;

        // Create a new transaction
        const tx = new Transaction();
        
        // Add the update_matches_stats function call
        tx.moveCall({
            target: `${process.env.NEXT_PUBLIC_PACKAGE_ID}::club::update_matches_stats`,
            arguments: [
                tx.object(clubId),
                tx.pure.u64(matches_played),
                tx.pure.u64(matches_won),
                tx.pure.u64(matches_drawn),
                tx.pure.u64(matches_lost),
                tx.pure.u64(goals_scored),
                tx.pure.u64(goals_conceded),
            ],
        });
        tx.setSender(keypair.getPublicKey().toSuiAddress());

        // Build and sign the transaction
        const builtTx = await tx.build({ client: suiClient });
        const signedTx = await keypair.signTransaction(builtTx);

        // Execute the transaction
        const result = await suiClient.executeTransactionBlock({
            transactionBlock: signedTx.bytes,
            signature: signedTx.signature,
            options: {
                showEffects: true,
                showEvents: true,
            },
        });

        return NextResponse.json({ success: true, result });
    } catch (error) {
        console.error('Error updating match stats:', error);
        return NextResponse.json(
            { error: 'Failed to update match statistics' },
            { status: 500 }
        );
    }
} 