"use client"

import { useState } from "react"
import { ClubCreationStepper } from "@/components/club-creation-stepper"
import { BasicInfoStep } from "@/components/steps/basic-info-step"
import { ClubDetailsStep } from "@/components/steps/club-details-step"
import { LogoCustomizerStep } from "@/components/steps/logo-customizer-step"
import { ReviewStep } from "@/components/steps/review-step"
import { useWallet } from "@suiet/wallet-kit"
import { Transaction } from "@mysten/sui/transactions"


export interface UploadedBlob {
  status: string
  blobId: string
  endEpoch: number
  suiRefType: string
  suiRef: string
  suiUrl: string
  blobUrl?: string
  mediaType?: string
}


export default function ClubCreator() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    basicInfo: {
      name: "",
      location: ""
    },
    clubDetails: {
      stadium: "",
      primaryColor: "#ff0000",
      secondaryColor: "#ffffff"
    },
    logo: {
      emblem: "",
    },
  })
  const { connected, account, signAndExecuteTransaction } = useWallet();
  const [isCreating, setIsCreating] = useState(false);
  const [walrusStatus, setWalrusStatus] = useState({ stage: 'idle', message: '' });
  const [uploadedBlobs, setUploadedBlobs] = useState([] as UploadedBlob[]);

  // Walrus Configuration
  const SUI_NETWORK = "testnet";
  const WALRUS_PUBLISHER_URL = "https://publisher.walrus-testnet.walrus.space"; 
  const WALRUS_AGGREGATOR_URL = "https://aggregator.walrus-testnet.walrus.space";
  const SUI_VIEW_OBJECT_URL = `https://suiscan.xyz/${SUI_NETWORK}/object`;
  const SUI_VIEW_TX_URL = `https://suiscan.xyz/${SUI_NETWORK}/tx`;

  const PACKAGE_ID = process.env.NEXT_PUBLIC_CLUB_NFT_PACKAGE_ID || "0x1"; 

  // Store blob using Walrus
  const storeBlob = async (file: any, storage_epochs = 5) => {
    setWalrusStatus({ stage: 'uploading', message: 'Uploading blob to Walrus...' });
    
    try {
      // Add the account address if the user is connected
      const sendToParam = connected && account ? `&send_object_to=${account.address}` : "";

      console.log('Uploading file:', file);
          
    if (typeof file === 'string' && file.startsWith('data:')) {
      const parts = file.split(';base64,');
      const contentType = parts[0].replace('data:', '');
      const base64 = parts[1];
      const byteCharacters = atob(base64);
      const byteArrays = [];
      for (let i = 0; i < byteCharacters.length; i += 512) {
        const slice = byteCharacters.slice(i, i + 512);
        const byteNumbers = new Array(slice.length);
        for (let j = 0; j < slice.length; j++) {
          byteNumbers[j] = slice.charCodeAt(j);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }
      file = new Blob(byteArrays, { type: contentType });
    }

      await console.log('Converted file:', file);
      
      // Upload the file to Walrus
      const response = await fetch(
        `${WALRUS_PUBLISHER_URL}/v1/blobs?epochs=${storage_epochs}${sendToParam}`, 
        {
          method: "PUT",
          body: file,
        }
      );

      console.log('Walrus upload response:', response);
      
      if (response.status !== 200) {
        throw new Error(`Failed to upload blob: ${response.statusText}`);
      }
      
      const responseData = await response.json();
      console.log('Blob uploaded successfully:', responseData);
      
      // Extract and return blob details
      let blobInfo : UploadedBlob;
      if ("alreadyCertified" in responseData) {
        blobInfo = {
          status: "Already certified",
          blobId: responseData.alreadyCertified.blobId,
          endEpoch: responseData.alreadyCertified.endEpoch,
          suiRefType: "Transaction Digest",
          suiRef: responseData.alreadyCertified.event.txDigest,
          suiUrl: `${SUI_VIEW_TX_URL}/${responseData.alreadyCertified.event.txDigest}`,

        };
      } else if ("newlyCreated" in responseData) {
        blobInfo = {
          status: "Newly created",
          blobId: responseData.newlyCreated.blobObject.blobId,
          endEpoch: responseData.newlyCreated.blobObject.storage.endEpoch,
          suiRefType: "Object ID",
          suiRef: responseData.newlyCreated.blobObject.id,
          suiUrl: `${SUI_VIEW_OBJECT_URL}/${responseData.newlyCreated.blobObject.id}`,
        };
      } else {
        throw Error("Unhandled successful response!");
      }
      
      // Add URL for retrieving the blob
      blobInfo.blobUrl = `${WALRUS_AGGREGATOR_URL}/v1/blobs/${blobInfo.blobId}`;
      blobInfo.mediaType = file.type;
      
      // Update UI with uploaded blob
      setUploadedBlobs(prev => [blobInfo, ...prev]);
      
      setWalrusStatus({ stage: 'success', message: 'Blob uploaded successfully' });
      console.log('Blob info:', blobInfo);
      return blobInfo;
      
    } catch (error: any) {
      console.error('Error storing blob:', error);
      setWalrusStatus({ stage: 'error', message: `Failed to upload: ${error.message}` });
      throw error;
    }
  };
  
  
  // Store logo image
  const storeLogoImage = async () => {
    if (!formData.logo) {
      throw new Error("No logo file selected");
    }
    // Store the logo in Walrus
    return await storeBlob(formData.logo.emblem);
  };
  
  // Create on-chain ClubNFT
  const createClubNFT = async (logoBlobId: string) => {
    if (!connected || !account) {
      throw new Error("Wallet not connected");
    }
    
    setWalrusStatus({ stage: 'minting', message: 'Creating club NFT on-chain...' });
    
    try {
      // Create the transaction block
      const tx = new Transaction();
      

      
      // Call the create_club function from your contract
      tx.moveCall({
        target: `${PACKAGE_ID}::club_nft::create_club`,
        arguments: [
          tx.pure.string(formData.basicInfo.name),
          tx.pure.string(formData.basicInfo.location),
          tx.pure.string(formData.clubDetails.stadium),
          tx.pure.string(formData.clubDetails.primaryColor),
          tx.pure.string(formData.clubDetails.secondaryColor),
          tx.pure.string(logoBlobId),
        ]
      });
      
      // Sign and execute the transaction
      const result = await signAndExecuteTransaction({
        transaction : tx
      });
      
      console.log('Club NFT created successfully:', result);
      setWalrusStatus({ stage: 'complete', message: 'Club created successfully!' });
      
      return result;
      
    } catch (error: any) {
      console.error('Error creating club NFT:', error);
      setWalrusStatus({ stage: 'error', message: `Failed to create NFT: ${error.message}` });
      throw error;
    }
  };
  
  // Handle the full club creation process
  const createClub = async () => {
    if (!connected) {
      alert('Please connect your Sui wallet first');
      return;
    }
    
    try {
      setIsCreating(true);
      
      // Store logo image
      setWalrusStatus({ stage: 'logo', message: 'Uploading club logo...' });
      const logoInfo = await storeLogoImage();
      
      // Create on-chain NFT with references to the blobs
      await createClubNFT(logoInfo.blobId);
      
      // Success!
      alert('Club created successfully!');
      
    } catch (error : any) {
      console.error('Error in club creation process:', error);
      setWalrusStatus({ stage: 'error', message: `Error: ${error.message}` });
      alert(`Error creating club: ${error.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  const steps = [
    {
      id: "basic-info",
      name: "Basic Information",
      component: (
        <BasicInfoStep
          data={formData.basicInfo}
          updateData={(data) => setFormData({ ...formData, basicInfo: data })}
          onNext={() => setCurrentStep(1)}
        />
      ),
    },
    {
      id: "club-details",
      name: "Club Details",
      component: (
        <ClubDetailsStep
          data={formData.clubDetails}
          updateData={(data) => setFormData({ ...formData, clubDetails: data })}
          onNext={() => setCurrentStep(2)}
          onBack={() => setCurrentStep(0)}
        />
      ),
    },
    {
      id: "logo-customizer",
      name: "Logo Customizer",
      component: (
        <LogoCustomizerStep
          data={formData.logo}
          clubName={formData.basicInfo.name}
          primaryColor={formData.clubDetails.primaryColor}
          secondaryColor={formData.clubDetails.secondaryColor}
          updateData={(data) => setFormData({ ...formData, logo: data })}
          onNext={() => setCurrentStep(3)}
          onBack={() => setCurrentStep(1)}
        />
      ),
    },
    {
      id: "review",
      name: "Review & Confirm",
      component: (
        <ReviewStep
          formData={formData}
          onBack={() => setCurrentStep(2)}
          onSubmit={createClub}
          isCreating={isCreating}
          walrusStatus={walrusStatus}
          uploadedBlobs={uploadedBlobs}
        />
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950">
      <div className="flex flex-col mx-auto py-8 px-4 sm:px-6">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-white mb-2">
            Create Your Club
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Build your dream sports club with our intuitive step-by-step process
          </p>
        </div>
        
        <div className="bg-gray-900 border border-gray-800 rounded-none p-6 shadow-lg w-6xl mx-auto justify-center">
          <div className="border-b border-gray-800 px-4 py-2">
            <ClubCreationStepper steps={steps} currentStep={currentStep} />
          </div>
          
          <div className="p-6 sm:p-8">
            <div className="mt-1 transition-all duration-300 ease-in-out">
              {steps[currentStep].component}
            </div>
          </div>
          
          <div className="px-6 py-1 flex justify-between items-center text-sm text-gray-300">
            <div>Step {currentStep + 1} of {steps.length}</div>
            <div>{Math.round((currentStep + 1) / steps.length * 100)}% complete</div>
          </div>
        </div>
        
        <div className="mt-4 text-center text-sm text-gray-500">
          <p>Powered by Sui | OnChainFC</p>
        </div>
      </div>
    </div>
  )
}