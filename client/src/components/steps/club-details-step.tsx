"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Landmark, Palette, Quote } from "lucide-react"

interface ClubDetailsData {
  stadium: string
  primaryColor: string
  secondaryColor: string
  motto: string
}

interface ClubDetailsStepProps {
  data: ClubDetailsData
  updateData: (data: ClubDetailsData) => void
  onNext: () => void
  onBack: () => void
}

export function ClubDetailsStep({ data, updateData, onNext, onBack }: ClubDetailsStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [focused, setFocused] = useState<string | null>(null)

  const predefinedColors = [
    "#e53e3e", // red
    "#dd6b20", // orange
    "#d69e2e", // yellow
    "#38a169", // green
    "#3182ce", // blue
    "#805ad5", // purple
    "#d53f8c", // pink
    "#000000", // black
    "#718096", // gray
    "#2d3748"  // dark gray
  ]

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!data.stadium.trim()) {
      newErrors.stadium = "Stadium name is required"
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
        <h2 className="text-2xl font-bold text-gray-800">Club Identity</h2>
        <p className="text-gray-500 mt-1">Define the visual and cultural identity of your team</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className={`transition-all duration-200 ${focused === 'stadium' ? 'scale-[1.02]' : ''}`}>
          <div className="flex items-center space-x-3 mb-2">
            <Landmark className="h-5 w-5 text-blue-500" />
            <Label htmlFor="stadium" className="text-base font-medium text-gray-700">Home Stadium</Label>
          </div>
          <Input
            id="stadium"
            placeholder="Enter stadium name"
            value={data.stadium}
            onChange={(e) => updateData({ ...data, stadium: e.target.value })}
            className={`pl-3 h-12 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-100 rounded-lg shadow-sm ${errors.stadium ? 'border-red-300' : ''}`}
            onFocus={() => setFocused('stadium')}
            onBlur={() => setFocused(null)}
          />
          {errors.stadium && (
            <p className="text-sm text-red-500 mt-1 flex items-center">
              <span className="inline-block w-1 h-1 bg-red-500 rounded-full mr-2"></span>
              {errors.stadium}
            </p>
          )}
          {!errors.stadium && (
            <p className="text-xs text-gray-500 mt-1 ml-1">Where will your team play home matches?</p>
          )}
        </div>

        <div className="space-y-6">
          <div className="flex items-center space-x-3 mb-2">
            <Palette className="h-5 w-5 text-blue-500" />
            <Label className="text-base font-medium text-gray-700">Club Colors</Label>
          </div>
          
          <div className="space-y-5">
            <div className="space-y-3">
              <Label htmlFor="primary-color" className="text-sm font-medium text-gray-600">Primary Color</Label>
              <div className="flex flex-col space-y-3">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-12 h-12 rounded-lg shadow-inner border border-gray-200 flex items-center justify-center overflow-hidden"
                    style={{ backgroundColor: data.primaryColor }}
                  >
                    <div className="w-full h-full bg-[url('/grid-pattern.svg')] opacity-30"></div>
                  </div>
                  <Input
                    id="primary-color"
                    type="color"
                    value={data.primaryColor}
                    onChange={(e) => updateData({ ...data, primaryColor: e.target.value })}
                    className="w-20 h-8 rounded overflow-hidden p-0 cursor-pointer"
                  />
                  <div className="text-sm font-mono text-gray-500 uppercase">
                    {data.primaryColor}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {predefinedColors.map((color) => (
                    <button
                      key={`primary-${color}`}
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 ${data.primaryColor.toLowerCase() === color ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'} shadow-sm transition-all hover:scale-110`}
                      style={{ backgroundColor: color }}
                      onClick={() => updateData({ ...data, primaryColor: color })}
                      aria-label={`Select ${color} as primary color`}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="secondary-color" className="text-sm font-medium text-gray-600">Secondary Color</Label>
              <div className="flex flex-col space-y-3">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-12 h-12 rounded-lg shadow-inner border border-gray-200 flex items-center justify-center overflow-hidden"
                    style={{ backgroundColor: data.secondaryColor }}
                  >
                    <div className="w-full h-full bg-[url('/grid-pattern.svg')] opacity-30"></div>
                  </div>
                  <Input
                    id="secondary-color"
                    type="color"
                    value={data.secondaryColor}
                    onChange={(e) => updateData({ ...data, secondaryColor: e.target.value })}
                    className="w-20 h-8 rounded overflow-hidden p-0 cursor-pointer"
                  />
                  <div className="text-sm font-mono text-gray-500 uppercase">
                    {data.secondaryColor}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {predefinedColors.map((color) => (
                    <button
                      key={`secondary-${color}`}
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 ${data.secondaryColor.toLowerCase() === color ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'} shadow-sm transition-all hover:scale-110`}
                      style={{ backgroundColor: color }}
                      onClick={() => updateData({ ...data, secondaryColor: color })}
                      aria-label={`Select ${color} as secondary color`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="py-1">
            <div className="w-full h-16 rounded-lg overflow-hidden border border-gray-200 shadow-sm flex">
              <div className="w-1/2 h-full" style={{ backgroundColor: data.primaryColor }}></div>
              <div className="w-1/2 h-full" style={{ backgroundColor: data.secondaryColor }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">Preview of your club colors</p>
          </div>
        </div>

        <div className={`transition-all duration-200 ${focused === 'motto' ? 'scale-[1.02]' : ''}`}>
          <div className="flex items-center space-x-3 mb-2">
            <Quote className="h-5 w-5 text-blue-500" />
            <Label htmlFor="motto" className="text-base font-medium text-gray-700">Club Motto</Label>
          </div>
          <Textarea
            id="motto"
            placeholder="Enter a short, inspiring phrase that represents your club's values"
            value={data.motto}
            onChange={(e) => updateData({ ...data, motto: e.target.value })}
            className={`pl-3 pt-3 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-100 rounded-lg shadow-sm ${errors.motto ? 'border-red-300' : ''}`}
            rows={2}
            onFocus={() => setFocused('motto')}
            onBlur={() => setFocused(null)}
          />
          <p className="text-xs text-gray-500 mt-1 ml-1">A slogan or phrase that encapsulates your club's spirit</p>
        </div>

        <div className="pt-6 flex justify-between items-center space-x-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onBack}
            className="px-4 py-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg"
          >
            Back
          </Button>
          <Button 
            type="submit" 
            className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg font-medium text-white shadow-md hover:shadow-lg transition-all duration-200"
          >
            Continue to Team Info
          </Button>
        </div>
      </form>
    </div>
  )
}