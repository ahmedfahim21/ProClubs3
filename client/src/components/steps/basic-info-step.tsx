"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trophy, MapPin } from "lucide-react"

interface BasicInfoData {
  name: string
  location: string
}

interface BasicInfoStepProps {
  data: BasicInfoData
  updateData: (data: BasicInfoData) => void
  onNext: () => void
}

export function BasicInfoStep({ data, updateData, onNext }: BasicInfoStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [focused, setFocused] = useState<string | null>(null)

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!data.name.trim()) {
      newErrors.name = "Club name is required"
    }

    if (!data.location.trim()) {
      newErrors.location = "Location is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onNext()
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-8">
        <p className="text-gray-300 mt-1">Let&apos;s start with the most essential details of your club</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* First row: Club Name */}
        <div className="w-full">
          <div className={`relative transition-all duration-200 ${focused === 'name' ? 'scale-[1.02]' : ''}`}>
            <div className="flex items-center space-x-3 mb-2">
              <Trophy className="h-5 w-5 text-cyan-500" />
              <Label htmlFor="club-name" className="text-base font-medium text-gray-200">Club Name</Label>
            </div>
            <div className="relative">
              <Input
                id="club-name"
                placeholder="Enter your club's name"
                value={data.name}
                onChange={(e) => updateData({ ...data, name: e.target.value })}
                className={`pl-3 h-12 bg-gray-900 border-1 border-gray-700 focus:border-blue-500  text-white rounded-none ${errors.name ? 'border-red-500' : ''} transition-all`}
                onFocus={() => setFocused('name')}
                onBlur={() => setFocused(null)}
              />
            </div>
            {errors.name && (
              <p className="text-sm text-red-500 mt-1 flex items-center">
                <span className="inline-block w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                {errors.name}
              </p>
            )}
            {!errors.name && (
              <p className="text-xs text-gray-400 mt-1 ml-1">Choose a memorable name that represents your club&apos;s identity</p>
            )}
          </div>
        </div>

        {/* Location */}
        <div className={`flex-1 transition-all duration-200 ${focused === 'location' ? 'scale-[1.02]' : ''}`}>
          <div className="flex items-center space-x-3 mb-2">
            <MapPin className="h-5 w-5 text-cyan-500" />
            <Label htmlFor="location" className="text-base font-medium text-gray-200">Location</Label>
          </div>
          <Input
            id="location"
            placeholder="City, Country"
            value={data.location}
            onChange={(e) => updateData({ ...data, location: e.target.value })}
            className={`pl-3 h-12 bg-gray-900 border-1 border-gray-700 focus:border-blue-500  text-white rounded-none ${errors.location ? 'border-red-500' : ''} transition-all`}
            onFocus={() => setFocused('location')}
            onBlur={() => setFocused(null)}
          />
          {errors.location && (
            <p className="text-sm text-red-500 mt-1 flex items-center">
              <span className="inline-block w-1 h-1 bg-red-500 rounded-full mr-2"></span>
              {errors.location}
            </p>
          )}
          {!errors.location && (
            <p className="text-xs text-gray-400 mt-1 ml-1">Where is your club based?</p>
          )}
        </div>

        <div className="pt-6">
          <Button
            type="submit"
            className="w-full h-12 bg-gradient-to-r from-cyan-600 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 rounded-none font-medium text-white shadow-md hover:shadow-lg transition-all duration-200"
          >
            Continue to Club Details
          </Button>
        </div>
      </form>
    </div>
  )
}