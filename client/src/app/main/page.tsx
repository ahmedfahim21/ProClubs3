"use client";

import { ConnectButton } from "@suiet/wallet-kit";
import {useWallet} from '@suiet/wallet-kit';
import {Transaction} from "@mysten/sui/transactions";
import { useEffect } from "react";

export default function Main() {

  const wallet = useWallet()

  useEffect(() => {
    if (!wallet.connected) return;
    console.log('connected wallet name: ', wallet.name)
    console.log('account address: ', wallet.account?.address)
    console.log('account publicKey: ', wallet.account?.publicKey)
  }, [wallet.connected])

  // launch a move call for the connected account via wallet
  async function handleMoveCall() {
    const tx = new Transaction();
    const packageObjectId = "0x1";
    tx.moveCall({
      target: `${packageObjectId}::nft::mint`,
      arguments: [tx.pure.string("Example NFT")],
    });
    await wallet.signAndExecuteTransaction({
      transaction: tx,
    });
  }

  // launch a move call for the connected account via wallet
  async function handleSignMessage() {
    await wallet.signPersonalMessage({
      message: new TextEncoder().encode("Hello World"),
    });
  }


  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <ConnectButton />
        <div className="flex flex-col gap-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleMoveCall}
          >
            Move Call
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleSignMessage}
          >
            Sign Message
          </button>
        </div>
    </div>
  );
}
