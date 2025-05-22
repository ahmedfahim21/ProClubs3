"use client";

import {useWallet} from '@suiet/wallet-kit';
import { useEffect, useState } from "react";
import { suiClient } from "@/utils/sui-client";
import Image from 'next/image';
import { fetchBlobData } from '@/utils/blob';

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

  useEffect(() => {
    if (main) {
      fetchClubDetails();
    }
  }, [main]);

  return (
    <div>
      <h3>Your Objects</h3>
      {loading && <p>Loading...</p>}
      {imageUrl && (
        <Image 
          src={imageUrl} 
          alt="Club Logo" 
          width={100} 
          height={100} 
          className="rounded-full" 
        />
      )}
      {main?.fields && (
        <div>
          <p>Name: {main.fields.name}</p>
          <p>Location: {main.fields.location}</p>
          <p>Stadium: {main.fields.stadium}</p>
          <p>Primary Color: {main.fields.primary_color}</p>
          <p>Secondary Color: {main.fields.secondary_color}</p>
        </div>
      )}
    </div>
  );
}