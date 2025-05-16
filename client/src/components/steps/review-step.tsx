"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

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
    teamInfo: {
      league: string
      division: string
      rivals: string
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Check className="h-5 w-5 mr-2 text-green-500" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="font-medium">Club Name:</dt>
                <dd>{formData.basicInfo.name}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Location:</dt>
                <dd>{formData.basicInfo.location}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Founded:</dt>
                <dd>{formData.basicInfo.foundingYear}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Check className="h-5 w-5 mr-2 text-green-500" />
              Club Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="font-medium">Stadium:</dt>
                <dd>{formData.clubDetails.stadium}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Colors:</dt>
                <dd className="flex items-center">
                  <div
                    className="w-4 h-4 rounded-full mr-1"
                    style={{ backgroundColor: formData.clubDetails.primaryColor }}
                  ></div>
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: formData.clubDetails.secondaryColor }}
                  ></div>
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Motto:</dt>
                <dd>{formData.clubDetails.motto || "None"}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Check className="h-5 w-5 mr-2 text-green-500" />
              Team Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="font-medium">League:</dt>
                <dd>{formData.teamInfo.league}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Division:</dt>
                <dd>{formData.teamInfo.division}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Rivals:</dt>
                <dd>{formData.teamInfo.rivals || "None"}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Check className="h-5 w-5 mr-2 text-green-500" />
              Club Logo
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <canvas id="review-logo" width={150} height={150} className="border rounded-lg"></canvas>
          </CardContent>
        </Card>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-green-800 mb-2">Ready to Create Your Club!</h3>
        <p className="text-green-700">
          You've completed all the steps to create your club. Review the information above and click "Create Club" to
          finalize.
        </p>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onSubmit} className="bg-green-600 hover:bg-green-700">
          Create Club
        </Button>
      </div>
    </div>
  )
}
