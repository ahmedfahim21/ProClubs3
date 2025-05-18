"use client"

import { useState } from "react"
import { ClubCreationStepper } from "@/components/club-creation-stepper"
import { BasicInfoStep } from "@/components/steps/basic-info-step"
import { ClubDetailsStep } from "@/components/steps/club-details-step"
import { LogoCustomizerStep } from "@/components/steps/logo-customizer-step"
import { ReviewStep } from "@/components/steps/review-step"

export default function ClubCreator() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    basicInfo: {
      name: "",
      location: ""
    },
    clubDetails: {
      stadium: "",
      primaryColor: "#ff0000",
      secondaryColor: "#ffffff",
      motto: "",
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
      id: "logo-customizer",
      name: "Logo Customizer",
      component: (
        <LogoCustomizerStep
          data={formData.logo}
          clubName={formData.basicInfo.name}
          primaryColor={formData.clubDetails.primaryColor}
          secondaryColor={formData.clubDetails.secondaryColor}
          updateData={(data) => setFormData({ ...formData, logo: data })}
          onNext={() => setCurrentStep(3)}
          onBack={() => setCurrentStep(1)}
        />
      ),
    },
    {
      id: "review",
      name: "Review & Confirm",
      component: (
        <ReviewStep
          formData={formData}
          onBack={() => setCurrentStep(2)}
          onSubmit={() => alert("Club created successfully!")}
        />
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950">
      <div className="flex flex-col mx-auto py-8 px-4 sm:px-6">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-white mb-2">
            Create Your Club
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Build your dream sports club with our intuitive step-by-step process
          </p>
        </div>
        
        <div className="bg-gray-900 border border-gray-800 rounded-none p-6 shadow-lg w-6xl mx-auto justify-center">
          <div className="border-b border-gray-800 px-4 py-2">
            <ClubCreationStepper steps={steps} currentStep={currentStep} />
          </div>
          
          <div className="p-6 sm:p-8">
            <div className="mt-1 transition-all duration-300 ease-in-out">
              {steps[currentStep].component}
            </div>
          </div>
          
          <div className="px-6 py-1 flex justify-between items-center text-sm text-gray-300">
            <div>Step {currentStep + 1} of {steps.length}</div>
            <div>{Math.round((currentStep + 1) / steps.length * 100)}% complete</div>
          </div>
        </div>
        
        <div className="mt-4 text-center text-sm text-gray-500">
          <p>Powered by Sui | OnChainFC</p>
        </div>
      </div>
    </div>
  )
}