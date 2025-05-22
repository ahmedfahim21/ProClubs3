"use client"

import { useState } from "react"
import { ClubCreationStepper } from "@/components/club-creation-stepper"
import { BasicInfoStep } from "@/components/steps/basic-info-step"
import { ClubDetailsStep } from "@/components/steps/club-details-step"
import { LogoCustomizerStep } from "@/components/steps/logo-customizer-step"
import { ReviewStep } from "@/components/steps/review-step"
import { useWallet } from "@suiet/wallet-kit"
import { Transaction } from "@mysten/sui/transactions"
import { storeBlob } from "@/utils/blob"

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
  const { connected, account, address, signAndExecuteTransaction } = useWallet();
  const [isCreating, setIsCreating] = useState(false);
  const [isMinted, setIsMinted] = useState(false);

  const PACKAGE_ID = process.env.NEXT_PUBLIC_PACKAGE_ID || "0x1";
  const REGISTRY_ID = process.env.NEXT_PUBLIC_REGISTRY_OBJECT_ID || "0x1";

  // Create on-chain ClubNFT
  const createClubNFT = async (logoBlobId: string) => {
    if (!connected || !account) {
      throw new Error("Wallet not connected");
    }

    try {
      const tx = new Transaction();

      tx.moveCall({
        target: `${PACKAGE_ID}::club::create_club`,
        arguments: [
          tx.object(REGISTRY_ID),
          tx.pure.string(formData.basicInfo.name),
          tx.pure.string(formData.basicInfo.location),
          tx.pure.string(formData.clubDetails.stadium),
          tx.pure.string(formData.clubDetails.primaryColor),
          tx.pure.string(formData.clubDetails.secondaryColor),
          tx.pure.string(logoBlobId),
          tx.pure.string("4-4-2"),
          tx.pure.string("Balanced"),
          tx.pure.u64(0),
          tx.pure.u64(0),
          tx.pure.u64(0),
          tx.pure.u64(0),
          tx.pure.u64(0),
          tx.pure.u64(0),
        ]
      });

      const result = await signAndExecuteTransaction({
        transaction: tx,
      });

      console.log("Transaction result:", result);
      setIsMinted(true);

      return result;

    } catch (error: any) {
      console.error('Error creating club NFT:', error);
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

      const logoInfo = await storeBlob(formData.logo.emblem, 5, connected, address);
      await createClubNFT(logoInfo.blobId);

    } catch (error: any) {
      console.error('Error in club creation process:', error);
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
          isMinted={isMinted}
        />
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950">
      <div className="flex flex-col mx-auto py-8 px-4 sm:px-6">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-cyan-400 mb-2">
            Create Your Club
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Build your dream sports club with our intuitive step-by-step process
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-6 w-6xl mx-auto justify-center">
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
          <p>Powered by Sui | ProClubs3</p>
        </div>
      </div>
    </div>
  )
}