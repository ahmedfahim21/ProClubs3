"use client";
import { Trophy } from 'lucide-react';
import Image from 'next/image';
import { ConnectButton, useWallet } from '@suiet/wallet-kit';
import Link from 'next/link';

export default function Home() {

  const wallet = useWallet();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <Image src="/ProClubs3.png" alt="Logo" width={100} height={100} className="rounded-full" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">ProClubs3</h1>
          <p className="text-gray-400">Connect your wallet to start your career</p>
        </div>
        
        {/* Container with sharp edges */}
        <div className="bg-gray-900 border border-gray-800 rounded-none p-6 shadow-lg">
          {!wallet.connected ? (
            <>
              <h2 className="text-xl font-bold text-white mb-6 border-b border-gray-800 pb-2">Connect Wallet</h2>
              
              <div className="pt-4 mx-auto justify-between flex items-center text-center">
                <ConnectButton className="flex items-center justify-center mx-auto rounded-none"/> 
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold text-white mb-6 border-b border-gray-800 pb-2">Success!</h2>
              <div className="p-6 text-center">
                <ConnectButton className="flex items-center justify-center mx-auto rounded-none"/>
                <div className="my-4 text-cyan-500 flex justify-center">
                  <Trophy className="h-16 w-16" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Ready to Play!</h3>
                <p className="text-gray-400 mb-4">Your wallet is connected successfully!</p>
                <Link href="/init" className="flex items-center justify-center">
                  <button className="bg-cyan-600 text-white py-3 px-6 rounded-none hover:bg-cyan-700 transition-all">
                    Start Your Career
                  </button>
                </Link>
              </div>
            </>
          )}
        </div>
        
        {/* Footer */}
        <div className="mt-4 text-center text-sm text-gray-500">
          <p>Powered by Sui</p>
        </div>
      </div>
    </div>
  );
}