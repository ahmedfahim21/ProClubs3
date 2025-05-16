"use client"

import { useState } from "react"
import { ClubCreationStepper } from "@/components/club-creation-stepper"
import { BasicInfoStep } from "@/components/steps/basic-info-step"
import { ClubDetailsStep } from "@/components/steps/club-details-step"
import { TeamInfoStep } from "@/components/steps/team-info-step"
import { LogoCustomizerStep } from "@/components/steps/logo-customizer-step"
import { ReviewStep } from "@/components/steps/review-step"

export default function ClubCreator() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    basicInfo: {
      name: "",
      location: "",
      foundingYear: new Date().getFullYear(),
    },
    clubDetails: {
      stadium: "",
      primaryColor: "#ff0000",
      secondaryColor: "#ffffff",
      motto: "",
    },
    teamInfo: {
      league: "",
      division: "",
      rivals: "",
    },
    logo: {
      template: "shield",
      primaryColor: "#ff0000",
      secondaryColor: "#ffffff",
      text: "",
      emblem: "star",
    },
  })

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
      id: "team-info",
      name: "Team Information",
      component: (
        <TeamInfoStep
          data={formData.teamInfo}
          updateData={(data) => setFormData({ ...formData, teamInfo: data })}
          onNext={() => setCurrentStep(3)}
          onBack={() => setCurrentStep(1)}
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
          onNext={() => setCurrentStep(4)}
          onBack={() => setCurrentStep(2)}
        />
      ),
    },
    {
      id: "review",
      name: "Review & Confirm",
      component: (
        <ReviewStep
          formData={formData}
          onBack={() => setCurrentStep(3)}
          onSubmit={() => alert("Club created successfully!")}
        />
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
            Create Your Club
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Build your dream sports club with our intuitive step-by-step process
          </p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="border-b border-gray-100 px-6 py-4">
            <ClubCreationStepper steps={steps} currentStep={currentStep} />
          </div>
          
          <div className="p-6 sm:p-8">
            <div className="mt-2 transition-all duration-300 ease-in-out">
              {steps[currentStep].component}
            </div>
          </div>
          
          <div className="bg-gray-50 px-6 py-4 flex justify-between items-center text-sm text-gray-500">
            <div>Step {currentStep + 1} of {steps.length}</div>
            <div>{Math.round((currentStep + 1) / steps.length * 100)}% complete</div>
          </div>
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          Need help? <button className="text-blue-600 hover:text-blue-800 font-medium">Contact support</button>
        </div>
      </div>
    </div>
  )
}