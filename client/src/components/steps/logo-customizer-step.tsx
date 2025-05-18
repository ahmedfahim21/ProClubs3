"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface LogoCustomizerData {
  emblem: string
}

interface LogoCustomizerStepProps {
  data: LogoCustomizerData
  clubName: string
  primaryColor: string
  secondaryColor: string
  updateData: (data: LogoCustomizerData) => void
  onNext: () => void
  onBack: () => void
}


export function LogoCustomizerStep({
  data,
  clubName,
  primaryColor,
  secondaryColor,
  updateData,
  onNext,
  onBack,
}: LogoCustomizerStepProps) {
  const [prompt, setPrompt] = useState("")
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Dummy AI image generation handler (replace with real API call)
  const handleGenerate = async () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setImageUrl("/OnChainFC.png") // Replace with actual image URL from API
      setLoading(false)
    }, 1500)
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!prompt.trim()) {
      newErrors.prompt = "Logo description is required"
    }
    if (!imageUrl) {
      newErrors.imageUrl = "Logo image is required"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      updateData({ emblem: imageUrl ?? "" })
      onNext()
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-6">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-8">
      {/* Left: Form and Club Info */}
      <div className="flex-1 space-y-6">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">Logo Customizer</h2>
        <div>
        <label className="block text-gray-200 mb-2" htmlFor="logo-prompt">
          Describe your logo
        </label>
        <input
          id="logo-prompt"
          type="text"
          className="pl-3 w-full h-12 bg-gray-900 border-1 border-gray-700 focus:border-blue-500  text-white rounded-none"
          placeholder="e.g. A modern football club logo with stars and stripes"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
        />
        </div>
        <div className="flex items-center gap-4">
        <Button
          type="button"
          onClick={handleGenerate}
          disabled={loading || !prompt}
          className="bg-cyan-600 hover:bg-cyan-500 text-white"
        >
          {loading ? "Generating..." : "Generate Logo"}
        </Button>
        </div>
        {/* Club Info */}
        <div className="mt-6 p-4 rounded bg-gray-800 border border-gray-700">
        <div className="mb-2">
          <span className="text-gray-400">Club Name: </span>
          <span className="font-semibold text-gray-100">{clubName}</span>
        </div>
        <div className="flex items-center gap-4">
          <div>
          <span className="text-gray-400">Primary Color: </span>
          <span
            className="inline-block w-5 h-5 rounded-full align-middle border border-gray-600 mr-1"
            style={{ backgroundColor: primaryColor }}
          />
          </div>
          <div>
          <span className="text-gray-400">Secondary Color: </span>
          <span
            className="inline-block w-5 h-5 rounded-full align-middle border border-gray-600 mr-1"
            style={{ backgroundColor: secondaryColor }}
          />
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
        disabled={!imageUrl}
        className="flex-1 h-10 bg-gradient-to-r from-cyan-600 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 rounded-none font-medium text-white shadow-md transition-all"
        >
        Continue to Review
        </Button>
      </div>
      </div>
      {/* Right: Logo Preview */}
      <div className="flex-shrink-0 flex flex-col items-center justify-center min-w-[220px]">
        {imageUrl ? (
        <Image
          width={256}
          height={256}
          src={imageUrl}
          alt="Generated Logo"
          className="w-48 h-48 object-contain rounded border"
        />
        ) : (
        <div className="w-48 h-48 flex items-center justify-center rounded border border-dashed border-gray-500 text-gray-400 bg-gray-900">
          Logo Preview
        </div>
        )}
      </div>
      </form>
    </div>
  )
}

export default LogoCustomizerStep
