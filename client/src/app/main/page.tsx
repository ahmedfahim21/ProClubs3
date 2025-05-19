"use client";

import {useWallet} from '@suiet/wallet-kit';
import { useEffect, useState } from "react";
import { suiClient } from "@/utils/sui-client";
import Image from 'next/image';

export default function Main() {

  const { account, address } = useWallet()
  const [objects, setObjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [main, setMain] = useState(null);

  useEffect(() => {
    async function fetchOwnedObjects() {
      if (!account) return;
      
      try {
        setLoading(true);
        
        // Query objects owned by the connected wallet
        const response = await suiClient.getOwnedObjects({
          owner: address,
          options: { showContent: true },
          // Optional filter by type
          filter: {
            MoveModule : {
              package: process.env.NEXT_PUBLIC_CLUB_NFT_PACKAGE_ID || "0x1",
              module: "club_nft",
            },
          },
        });

        console.log("Owned objects:", response.data);
        
        setObjects(response.data);
      } catch (error) {
        console.error("Error fetching objects:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchOwnedObjects();
  }, [account]);


  useEffect(() => {
    async function fetchObject() {
      if (!account) return;
      
      try {
        setLoading(true);
        
        // Query objects owned by the connected wallet
        const response = await suiClient.getObject({
          id: objects[3].data.objectId,
          options: { showContent: true },
        });

        console.log("Object data:", response.data);
        await setMain(response.data?.content);
        await console.log("Main object:", main);
        
      } catch (error) {
        console.error("Error fetching objects:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchObject();
    fetchClubDetails();
  }

  , [loading, objects]);


const WALRUS_AGGREGATOR_URL = "https://aggregator.walrus-testnet.walrus.space";

// Simplified approach using createObjectURL directly
const fetchBlobData = async (blobId) => {
  try {
    const response = await fetch(`${WALRUS_AGGREGATOR_URL}/v1/blobs/${blobId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch blob: ${response.statusText}`);
    }
    
    // Get the blob data
    const blob = await response.blob();
    console.log("Blob data:", blob);
    console.log("resp :", response);

    
    // Create an object URL directly
    const blobUrl = URL.createObjectURL(blob);
    console.log("Blob URL created:", blobUrl);
    
    return blobUrl;
  } catch (error) {
    console.error(`Error fetching blob ${blobId}:`, error);
    throw error;
  }
};

// Fetch club details using the Walrus blob IDs
const fetchClubDetails = async () => {
  try {
    // Parse the blob IDs from the reference string
    const logoBlobId = main?.fields?.logo_blob_id;
    
    // Fetch the logo image blob and get a blob URL
    const logoUrl = await fetchBlobData(logoBlobId);
    
    // Set the image URL directly with the blob URL
    setImageUrl(logoUrl);
    
    console.log("Logo URL set:", logoUrl);
    
  } catch (err) {
    console.error('Error fetching club details:', err);
  }
};


  return (
    <div>
      <h3>Your Objects</h3>
      <Image src={imageUrl} alt="Club Logo" width={100} height={100} className="rounded-full" />
      <p>{main?.fields?.name}</p>
      <p>{main?.fields?.location}</p>
      <p>{main?.fields?.stadium}</p>
      <p>{main?.fields?.primary_color}</p>
      <p>{main?.fields?.secondary_color}</p>

    </div>
  );
}
