"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trophy, MapPin, Calendar } from "lucide-react"

interface BasicInfoData {
  name: string
  location: string
  foundingYear: number
}

interface BasicInfoStepProps {
  data: BasicInfoData
  updateData: (data: BasicInfoData) => void
  onNext: () => void
}

export function BasicInfoStep({ data, updateData, onNext }: BasicInfoStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [focused, setFocused] = useState<string | null>(null)
  const currentYear = new Date().getFullYear()

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!data.name.trim()) {
      newErrors.name = "Club name is required"
    }

    if (!data.location.trim()) {
      newErrors.location = "Location is required"
    }

    const year = Number(data.foundingYear)
    if (isNaN(year) || year < 1800 || year > currentYear) {
      newErrors.foundingYear = `Year must be between 1800 and ${currentYear}`
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
        <h2 className="text-2xl font-bold text-gray-800">Club Fundamentals</h2>
        <p className="text-gray-500 mt-1">Let's start with the essential details of your club</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className={`relative transition-all duration-200 ${focused === 'name' ? 'scale-[1.02]' : ''}`}>
          <div className="flex items-center space-x-3 mb-2">
            <Trophy className="h-5 w-5 text-blue-500" />
            <Label htmlFor="club-name" className="text-base font-medium text-gray-700">Club Name</Label>
          </div>
          <div className="relative">
            <Input
              id="club-name"
              placeholder="Enter your club's name"
              value={data.name}
              onChange={(e) => updateData({ ...data, name: e.target.value })}
              className={`pl-3 h-12 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-100 rounded-lg shadow-sm ${errors.name ? 'border-red-300' : ''}`}
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
            <p className="text-xs text-gray-500 mt-1 ml-1">Choose a memorable name that represents your club's identity</p>
          )}
        </div>

        <div className={`transition-all duration-200 ${focused === 'location' ? 'scale-[1.02]' : ''}`}>
          <div className="flex items-center space-x-3 mb-2">
            <MapPin className="h-5 w-5 text-blue-500" />
            <Label htmlFor="location" className="text-base font-medium text-gray-700">Location</Label>
          </div>
          <Input
            id="location"
            placeholder="City, Country"
            value={data.location}
            onChange={(e) => updateData({ ...data, location: e.target.value })}
            className={`pl-3 h-12 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-100 rounded-lg shadow-sm ${errors.location ? 'border-red-300' : ''}`}
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
            <p className="text-xs text-gray-500 mt-1 ml-1">Where is your club based?</p>
          )}
        </div>

        <div className={`transition-all duration-200 ${focused === 'year' ? 'scale-[1.02]' : ''}`}>
          <div className="flex items-center space-x-3 mb-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            <Label htmlFor="founding-year" className="text-base font-medium text-gray-700">Founding Year</Label>
          </div>
          <Input
            id="founding-year"
            type="number"
            min="1800"
            max={currentYear}
            value={data.foundingYear}
            onChange={(e) => updateData({ 
              ...data, 
              foundingYear: Number.parseInt(e.target.value) || currentYear 
            })}
            className={`pl-3 h-12 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-100 rounded-lg shadow-sm ${errors.foundingYear ? 'border-red-300' : ''}`}
            onFocus={() => setFocused('year')}
            onBlur={() => setFocused(null)}
          />
          {errors.foundingYear && (
            <p className="text-sm text-red-500 mt-1 flex items-center">
              <span className="inline-block w-1 h-1 bg-red-500 rounded-full mr-2"></span>
              {errors.foundingYear}
            </p>
          )}
          {!errors.foundingYear && (
            <p className="text-xs text-gray-500 mt-1 ml-1">When was your club established?</p>
          )}
        </div>

        <div className="pt-6">
          <Button 
            type="submit" 
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg font-medium text-white shadow-md hover:shadow-lg transition-all duration-200"
          >
            Continue to Club Details
          </Button>
        </div>
      </form>
    </div>
  )
}