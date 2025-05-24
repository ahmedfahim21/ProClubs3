"use client";

import {useWallet} from '@suiet/wallet-kit';
import { useEffect, useState } from "react";
import { suiClient } from "@/utils/sui-client";
import Image from 'next/image';
import { fetchBlobData } from '@/utils/blob';
import { Home, Newspaper, Users, Workflow, Trophy, ShoppingBag, Building, Banknote } from 'lucide-react';
import Link from 'next/link';

const menuItems = [
  { icon: <Home size={20} />, label: "Home", href: "/main" },
  { icon: <Newspaper size={20} />, label: "News", href: "/main/news" },
  { icon: <Users size={20} />, label: "Squad", href: "/main/squad" },
  { icon: <Workflow size={20} />, label: "Tactics", href: "/main/tactics" },
  { icon: <Trophy size={20} />, label: "Matches", href: "/main/matches" },
  { icon: <ShoppingBag size={20} />, label: "Transfers", href: "/main/transfers" },
  { icon: <Building size={20} />, label: "Club Info", href: "/main/club-info" },
  { icon: <Banknote size={20} />, label: "Finances", href: "/main/finances" }
];

export default function Main() {

  const { account, address } = useWallet()
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [main, setMain] = useState<any>(null);
  const [clubId, setClubId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOwnedObjects() {
      if (!account || !address) return;
      
      try {
        setLoading(true);
        
        // Query objects owned by the connected wallet
        const response = await suiClient.getOwnedObjects({
          owner: address,
          options: { showContent: false },
          // Optional filter by type
          filter: {
            MoveModule : {
              package: process.env.NEXT_PUBLIC_PACKAGE_ID || "0x1",
              module: "club",
            },
          },
        });

        console.log("Owned objects:", response.data);
        const fetchedClubId = response?.data[0]?.data?.objectId || "";
        
        // Save clubId to localStorage for use in other pages
        localStorage.setItem("clubId", fetchedClubId);
        setClubId(fetchedClubId);
        
        console.log("Club ID saved to localStorage:", fetchedClubId);
        
      } catch (error) {
        console.error("Error fetching objects:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchOwnedObjects();
  }, [account, address]);

  useEffect(() => {
    async function fetchObject() {
      if (!account || !clubId) return;
      
      try {
        setLoading(true);
        
        // Query objects owned by the connected wallet
        const response = await suiClient.getObject({
          id: clubId,
          options: { showContent: true },
        });

        setMain(response.data?.content);
        console.log("Main object:", response);
        
      } catch (error) {
        console.error("Error fetching objects:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchObject();
  }, [account, clubId]);


  useEffect(() => {
    if (main) {
      const fetchClubDetails = async () => {
        if (!main?.fields?.logo_blob_id) return;
        
        try {
          const logoBlobId = main?.fields?.logo_blob_id;
          const logoUrl = await fetchBlobData(logoBlobId);
          setImageUrl(logoUrl);
          
          console.log("Logo URL set:", logoUrl);
          
        } catch (err) {
          console.error('Error fetching club details:', err);
        }
      };
      
      fetchClubDetails();
    }
  }, [main]);

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Club Header Section */}
        <div className="mb-16">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {imageUrl && (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full blur-lg opacity-50" />
                <Image 
                  src={imageUrl} 
                  alt="Club Logo" 
                  width={160} 
                  height={160} 
                  className="relative rounded-full shadow-xl border-4 border-white" 
                />
              </div>
            )}
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-bold text-gray-200 mb-2">
                {main?.fields?.name || 'Your Club'}
              </h1>
              {loading && (
                <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                  <span>Loading club details...</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {menuItems.map((item, index) => (
            <Link 
              href={item.href} 
              key={index}
              className="group relative overflow-hidden bg-gray-850 text-white rounded-sm shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-700 hover:border-gray-200"
            >
              {/* Card Content */}
              <div className="relative p-8 flex flex-col items-center text-center">
                {/* Icon Container */}
                <div className="mb-6 p-4 rounded-2xl bg-gray-700 group-hover:bg-gray-100 transition-all duration-300 transform group-hover:scale-110">
                  <div className="text-gray-100 group-hover:text-gray-800 transition-colors duration-300">
                    {item.icon}
                  </div>
                </div>
                
                {/* Label */}
                <h3 className="text-xl font-semibold group-hover:text-cyan-500 transition-colors duration-300 mb-3">
                  {item.label}
                </h3>
                
                {/* Decorative Line */}
                <div className="h-0.5 w-12 bg-gradient-to-r from-gray-200 to-gray-300 group-hover:w-16 transition-all duration-300" />
                
                {/* Hover Indicator */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}