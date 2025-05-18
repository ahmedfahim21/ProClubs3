"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"

interface ReviewStepProps {
  formData: {
    basicInfo: {
      name: string
      location: string
      foundingYear: number
    }
    clubDetails: {
      stadium: string
      primaryColor: string
      secondaryColor: string
      motto: string
    }
    logo: {
      template: string
      primaryColor: string
      secondaryColor: string
      text: string
      emblem: string
    }
  }
  onBack: () => void
  onSubmit: () => void
}

export function ReviewStep({ formData, onBack, onSubmit }: ReviewStepProps) {
  return (
    <div className="max-w-xs mx-auto">
      <div className="mt-6 bg-gray-800 rounded-xl shadow-2xl w-full p-4 flex flex-col items-center">
      {/* NFT Logo inside the card */}
      <div className="mb-4 bg-gray-900 rounded-sm shadow-lg p-1 flex justify-center items-center">
        <Image
        width={80}
        height={80}
        src={formData.logo.emblem}
        alt="Club Logo"
        className="w-20 h-20 object-contain"
        />
      </div>
      {/* Card Content */}
      <div className="w-full text-center">
        <h2 className="text-lg font-bold mb-1 text-white truncate">{formData.basicInfo.name}</h2>
        <p className="text-xs text-cyan-400 mb-2">{formData.basicInfo.location} • {formData.basicInfo.foundingYear}</p>
        <div className="flex justify-center items-center gap-1 mb-2">
        <span
          className="w-4 h-4 rounded-full border border-cyan-700"
          style={{ backgroundColor: formData.clubDetails.primaryColor }}
          title="Primary Color"
        ></span>
        <span
          className="w-4 h-4 rounded-full border border-cyan-700"
          style={{ backgroundColor: formData.clubDetails.secondaryColor }}
          title="Secondary Color"
        ></span>
        </div>
        <div className="mb-2">
        <span className="inline-block bg-gray-800 text-cyan-200 px-2 py-0.5 rounded text-xs font-medium">
          {formData.clubDetails.stadium}
        </span>
        </div>
        <div className="mb-2">
        <span className="italic text-gray-400 text-xs">&quot;{formData.clubDetails.motto || "No motto"}&quot;</span>
        </div>
      </div>
      </div>

      <div className="pt-4 flex justify-between items-center gap-4">
        <Button
        type="button"
        variant="outline"
        onClick={onBack}
        className="px-4 py-2 border-gray-700 text-gray-800 hover:bg-gray-800 hover:text-gray-200 rounded-none"
        >
        Back
        </Button>
        <Button
        type="submit"
        className="flex-1 h-10 bg-gradient-to-r from-cyan-600 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 rounded-none font-medium text-white shadow-md transition-all"
        >
        Create Club & Mint NFT
        </Button>
      </div>
    </div>
  )
}
