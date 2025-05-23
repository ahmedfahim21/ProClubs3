"use client";

import { suiClient } from "@/utils/sui-client";
import { useWallet } from "@suiet/wallet-kit";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function FinancesPage() {
  const { address } = useWallet();
  const PACKAGE_ID = process.env.NEXT_PUBLIC_PACKAGE_ID || "0x1";
  const [suiBalance, setSuiBalance] = useState<string>("0");
  const [proBalance, setProBalance] = useState<string>("0");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchBalances(address: string) {
      if (!address) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const suibalances = await suiClient.getBalance({ owner: address, coinType: "0x2::sui::SUI" });
        const proCoinBalances = await suiClient.getBalance({ owner: address, coinType: `${PACKAGE_ID}::procoin::PROCOIN` });
        
        setSuiBalance(suibalances.totalBalance);
        setProBalance(proCoinBalances.totalBalance);
      } catch (error) {
        console.error("Error fetching balances:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchBalances(address || "");
  }, [address, PACKAGE_ID]);

  // Helper function to format large numbers
  const formatDisplayBalance = (balance: string) => {
    const num = parseInt(balance);
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(2) + " B";
    } else if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + " M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(2) + " K";
    }
    return num.toString();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-white">Finances</h1>
      
      {!address ? (
        <div className="text-center p-8 bg-gray-700 rounded-md border border-gray-600">
          <p className="text-gray-200">Please connect your wallet to view your balances</p>
        </div>
      ) : isLoading ? (
        <div className="text-center p-8 bg-gray-800 rounded-md">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-700 rounded w-1/3"></div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 p-6 rounded-md shadow-lg border border-gray-700 transition-all hover:border-cyan-500">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-md overflow-hidden mr-4 border border-gray-600">
                <Image 
                  src="https://strapi-dev.scand.app/uploads/sui_c07df05f00.png" 
                  alt="SUI Token" 
                  width={48} 
                  height={48}
                />
              </div>
              <h2 className="text-xl font-semibold text-white">SUI Token</h2>
            </div>
            <p className="text-3xl font-bold mb-2 text-cyan-500">{formatDisplayBalance(suiBalance)}</p>
            <p className="text-sm text-gray-400">Exact: {suiBalance}</p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-md shadow-lg border border-gray-700 transition-all hover:border-cyan-500">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-md overflow-hidden mr-4 border border-gray-600">
                <Image 
                  src="https://ahmedfahim.vercel.app/ProCoin.png" 
                  alt="PRO Coin" 
                  width={48} 
                  height={48}
                />
              </div>
              <h2 className="text-xl font-semibold text-white">PROCOIN</h2>
            </div>
            <p className="text-3xl font-bold mb-2 text-cyan-500">{formatDisplayBalance(proBalance)}</p>
            <p className="text-sm text-gray-400">Exact: {proBalance}</p>
          </div>
        </div>
      )}
      
      <div className="mt-8 bg-gray-800 p-6 rounded-md shadow-lg border border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-white">Transaction History</h2>
        <div className="bg-gray-750 p-4 rounded-md border border-gray-600">
          <p className="text-gray-300">Transaction history will be displayed here in future updates.</p>
        </div>
      </div>
    </div>
  );
}