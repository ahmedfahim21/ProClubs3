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
      <div className="mb-6">
      <h2 className="text-2xl font-bold text-gray-100">Club Identity</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
      <div className={`transition-all duration-200 ${focused === 'stadium' ? 'scale-[1.02]' : ''}`}>
        <div className="flex items-center space-x-3 mb-2">
        <Landmark className="h-5 w-5 text-cyan-500" />
        <Label htmlFor="stadium" className="text-base font-medium text-gray-200">Home Stadium</Label>
        </div>
        <Input
        id="stadium"
        placeholder="Stadium name"
        value={data.stadium}
        onChange={(e) => updateData({ ...data, stadium: e.target.value })}
        className={`pl-3 h-10 bg-gray-900 border border-gray-700 focus:border-blue-500 text-white rounded-none ${errors.stadium ? 'border-red-500' : ''} transition-all`}
        onFocus={() => setFocused('stadium')}
        onBlur={() => setFocused(null)}
        />
        {errors.stadium && (
        <p className="text-xs text-red-500 mt-1">{errors.stadium}</p>
        )}
      </div>

      <div>
        <div className="flex items-center space-x-3 mb-2">
        <Palette className="h-5 w-5 text-cyan-500" />
        <Label className="text-base font-medium text-gray-200">Club Colors</Label>
        </div>
        <div className="flex items-center gap-6">
        {/* Primary Color */}
        <div className="flex flex-col items-center gap-2">
          <Label htmlFor="primary-color" className="text-xs text-gray-400">Primary</Label>
          <Input
          id="primary-color"
          type="color"
          value={data.primaryColor}
          onChange={(e) => updateData({ ...data, primaryColor: e.target.value })}
          className="w-7 h-7 p-0 border-0 bg-transparent cursor-pointer"
          aria-label="Primary color"
          />
          <div className="flex flex-wrap gap-1 mt-1">
          {predefinedColors.map((color) => (
            <button
            key={`primary-${color}`}
            type="button"
            className={`w-4 h-4 rounded-full border-2 ${data.primaryColor.toLowerCase() === color ? 'border-cyan-500' : 'border-gray-700'} transition-all`}
            style={{ backgroundColor: color }}
            onClick={() => updateData({ ...data, primaryColor: color })}
            aria-label={`Select ${color} as primary color`}
            />
          ))}
          </div>
        </div>
        {/* Secondary Color */}
        <div className="flex flex-col items-center gap-2">
          <Label htmlFor="secondary-color" className="text-xs text-gray-400">Secondary</Label>
          <Input
          id="secondary-color"
          type="color"
          value={data.secondaryColor}
          onChange={(e) => updateData({ ...data, secondaryColor: e.target.value })}
          className="w-7 h-7 p-0 border-0 bg-transparent cursor-pointer"
          aria-label="Secondary color"
          />
          <div className="flex flex-wrap gap-1 mt-1">
          {predefinedColors.map((color) => (
            <button
            key={`secondary-${color}`}
            type="button"
            className={`w-4 h-4 rounded-full border-2 ${data.secondaryColor.toLowerCase() === color ? 'border-cyan-500' : 'border-gray-700'} transition-all`}
            style={{ backgroundColor: color }}
            onClick={() => updateData({ ...data, secondaryColor: color })}
            aria-label={`Select ${color} as secondary color`}
            />
          ))}
          </div>
        </div>
        {/* Preview */}
        <div className="flex flex-col items-center gap-2">
          <Label className="text-xs text-gray-400">Preview</Label>
          <div className="w-8 h-8 rounded border border-gray-700 flex overflow-hidden">
          <div className="w-1/2 h-full" style={{ backgroundColor: data.primaryColor }} />
          <div className="w-1/2 h-full" style={{ backgroundColor: data.secondaryColor }} />
          </div>
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
        Continue to Logo Customizer
        </Button>
      </div>
      </form>
    </div>
  )
}