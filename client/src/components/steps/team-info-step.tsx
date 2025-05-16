"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trophy, Award, Users } from "lucide-react"

interface TeamInfoData {
  league: string
  division: string
  rivals: string
}

interface TeamInfoStepProps {
  data: TeamInfoData
  updateData: (data: TeamInfoData) => void
  onNext: () => void
  onBack: () => void
}

export function TeamInfoStep({ data, updateData, onNext, onBack }: TeamInfoStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [focused, setFocused] = useState<string | null>(null)

  // Premier leagues and top competitions from around the world
  const leagues = [
    "Premier League", 
    "La Liga", 
    "Bundesliga", 
    "Serie A", 
    "Ligue 1", 
    "MLS", 
    "Eredivisie",
    "Primeira Liga",
    "Championship",
    "Liga MX",
    "Superliga Argentina",
    "J1 League",
    "A-League",
    "Other"
  ]

  const divisions = [
    "Top Division", 
    "Second Division", 
    "Third Division", 
    "Fourth Division", 
    "Regional League",
    "Amateur"
  ]

  // Popular club rivalries for autocomplete suggestions
  const popularRivals = [
    "Manchester United",
    "Liverpool",
    "Real Madrid",
    "Barcelona",
    "Bayern Munich",
    "Borussia Dortmund",
    "Juventus",
    "Inter Milan",
    "PSG",
    "Marseille"
  ]

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!data.league) {
      newErrors.league = "League is required"
    }

    if (!data.division) {
      newErrors.division = "Division is required"
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
        <h2 className="text-2xl font-bold text-gray-800">Competition Details</h2>
        <p className="text-gray-500 mt-1">Set up your team's competitive environment</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className={`transition-all duration-200 ${focused === 'league' ? 'scale-[1.02]' : ''}`}>
          <div className="flex items-center space-x-3 mb-2">
            <Trophy className="h-5 w-5 text-blue-500" />
            <Label htmlFor="league" className="text-base font-medium text-gray-700">League</Label>
          </div>
          <Select 
            value={data.league} 
            onValueChange={(value) => updateData({ ...data, league: value })}
            onOpenChange={(open) => setFocused(open ? 'league' : null)}
          >
            <SelectTrigger 
              id="league" 
              className={`h-12 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-100 rounded-lg shadow-sm ${errors.league ? 'border-red-300' : ''}`}
            >
              <SelectValue placeholder="Select a league" />
            </SelectTrigger>
            <SelectContent className="max-h-80">
              <div className="p-2 sticky top-0 bg-white border-b border-gray-100">
                <div className="text-xs font-medium text-gray-500 mb-1">Choose your competition</div>
              </div>
              <div className="py-1">
                {leagues.map((league) => (
                  <SelectItem key={league} value={league} className="cursor-pointer">
                    {league}
                  </SelectItem>
                ))}
              </div>
            </SelectContent>
          </Select>
          {errors.league && (
            <p className="text-sm text-red-500 mt-1 flex items-center">
              <span className="inline-block w-1 h-1 bg-red-500 rounded-full mr-2"></span>
              {errors.league}
            </p>
          )}
          {!errors.league && (
            <p className="text-xs text-gray-500 mt-1 ml-1">Which league will your club compete in?</p>
          )}
        </div>

        <div className={`transition-all duration-200 ${focused === 'division' ? 'scale-[1.02]' : ''}`}>
          <div className="flex items-center space-x-3 mb-2">
            <Award className="h-5 w-5 text-blue-500" />
            <Label htmlFor="division" className="text-base font-medium text-gray-700">Division</Label>
          </div>
          <Select 
            value={data.division} 
            onValueChange={(value) => updateData({ ...data, division: value })}
            onOpenChange={(open) => setFocused(open ? 'division' : null)}
          >
            <SelectTrigger 
              id="division" 
              className={`h-12 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-100 rounded-lg shadow-sm ${errors.division ? 'border-red-300' : ''}`}
            >
              <SelectValue placeholder="Select a division" />
            </SelectTrigger>
            <SelectContent>
              <div className="p-2 sticky top-0 bg-white border-b border-gray-100">
                <div className="text-xs font-medium text-gray-500 mb-1">Select your level of competition</div>
              </div>
              {divisions.map((division) => (
                <SelectItem key={division} value={division} className="cursor-pointer">
                  {division}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.division && (
            <p className="text-sm text-red-500 mt-1 flex items-center">
              <span className="inline-block w-1 h-1 bg-red-500 rounded-full mr-2"></span>
              {errors.division}
            </p>
          )}
          {!errors.division && (
            <p className="text-xs text-gray-500 mt-1 ml-1">Which division/tier will your club play in?</p>
          )}
        </div>

        <div className={`transition-all duration-200 ${focused === 'rivals' ? 'scale-[1.02]' : ''}`}>
          <div className="flex items-center space-x-3 mb-2">
            <Users className="h-5 w-5 text-blue-500" />
            <Label htmlFor="rivals" className="text-base font-medium text-gray-700">Main Rivals</Label>
          </div>
          <Input
            id="rivals"
            placeholder="Enter rival clubs (comma separated)"
            value={data.rivals}
            onChange={(e) => updateData({ ...data, rivals: e.target.value })}
            className="pl-3 h-12 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-100 rounded-lg shadow-sm"
            onFocus={() => setFocused('rivals')}
            onBlur={() => setFocused(null)}
          />
          <p className="text-xs text-gray-500 mt-1 ml-1">Who are your club's traditional or local rivals?</p>
          
          {data.rivals === '' && (
            <div className="mt-3">
              <p className="text-xs font-medium text-gray-500 mb-2">Suggestions:</p>
              <div className="flex flex-wrap gap-2">
                {popularRivals.slice(0, 5).map((rival) => (
                  <button
                    key={rival}
                    type="button"
                    className="px-3 py-1 bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-blue-600 rounded-full text-xs transition-colors"
                    onClick={() => {
                      const currentRivals = data.rivals ? `${data.rivals}, ${rival}` : rival;
                      updateData({ ...data, rivals: currentRivals });
                    }}
                  >
                    {rival}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="py-4 px-4 bg-blue-50 rounded-lg mt-2">
          <div className="flex items-start">
            <div className="bg-blue-100 p-1 rounded-full">
              <Trophy className="h-4 w-4 text-blue-600" />
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-blue-800">Team Competition Summary</h4>
              <p className="text-xs text-blue-600 mt-1">
                {data.league && data.division ? 
                  `Your club will compete in the ${data.division} of ${data.league}` : 
                  "Select your league and division to see your competition summary"}
                {data.rivals ? ` with rivals including ${data.rivals}` : ""}
              </p>
            </div>
          </div>
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
            Continue to Logo Design
          </Button>
        </div>
      </form>
    </div>
  )
}