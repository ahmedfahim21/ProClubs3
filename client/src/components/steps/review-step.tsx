"use client"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { redirect } from "next/navigation"

interface ReviewStepProps {
  formData: {
    basicInfo: {
      name: string
      location: string
    }
    clubDetails: {
      stadium: string
      primaryColor: string
      secondaryColor: string
    }
    logo: {
      emblem: string
    }
  }
  onBack: () => void
  onSubmit: () => void
  isCreating: boolean
  isMinted: boolean
}

export function ReviewStep({ formData, onBack, onSubmit, isCreating, isMinted }: ReviewStepProps) {
  return (
    <div className="max-w-xs mx-auto">
      <div className="mt-6 bg-gray-800 rounded-xl shadow-2xl w-full p-4 flex flex-col items-center">
      {/* NFT Logo inside the card */}
      <div className="mb-4 rounded-sm bg-gray-800 flex justify-center items-center">
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
        <p className="text-xs text-cyan-400 mb-2">{formData.basicInfo.location}</p>
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
      </div>
      </div>

      <div className="pt-4 flex flex-col gap-3">
        <div className="flex justify-between items-center gap-4">
          <Button
        type="button"
        variant="outline"
        onClick={onBack}
        className="px-4 h-9 py-2 bg-gray-850 border-cyan-500 text-cyan-500 hover:bg-white/90 hover:text-cyan-500 rounded-none transition-all"
        disabled={isCreating || isMinted}
          >
        Back
          </Button>

        {!isMinted ?
          (<Button
        type="submit"
        className="flex-1 h-10 bg-gradient-to-r from-cyan-600 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 rounded-none font-medium text-white shadow-md transition-all"
        disabled={isCreating}
        onClick={onSubmit}
          >
        {isCreating ? "Creating..." : "Create Club & Mint NFT"}
          </Button>)
          :
          (<Button
        type="button"
        className="flex-1 h-10 bg-gradient-to-r from-cyan-600 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 rounded-none font-medium text-white shadow-md transition-all"
        onClick={() => redirect("/init/team")}
          >
          Go to Team
          </Button>)
        }
        </div>
      </div>
    </div>
  )
}
