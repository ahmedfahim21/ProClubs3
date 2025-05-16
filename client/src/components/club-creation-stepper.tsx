import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface Step {
  id: string
  name: string
}

interface ClubCreationStepperProps {
  steps: Step[]
  currentStep: number
}

export function ClubCreationStepper({ steps, currentStep }: ClubCreationStepperProps) {
  return (
    <nav aria-label="Progress" className="relative">
      {/* Progress bar */}
      <div className="absolute top-5 left-4 right-4 h-1 bg-gray-100 rounded-full">
        <div
          className="absolute top-0 h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        ></div>
      </div>
      
      {/* Step indicators */}
      <ol className="relative grid grid-cols-5 w-full">
        {steps.map((step, index) => {
          // Determine if step is completed, current, or upcoming
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isUpcoming = index > currentStep;
          
          return (
            <li key={step.id} className="relative flex flex-col items-center">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full z-10 shadow-sm transition-all duration-300",
                  isCompleted 
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white" 
                    : isCurrent
                      ? "border-2 border-blue-500 bg-white text-blue-600 ring-4 ring-blue-50"
                      : "border-2 border-gray-200 bg-white text-gray-400"
                )}
              >
                {isCompleted ? 
                  <Check className="h-5 w-5" /> : 
                  <span className={cn("text-sm font-semibold", isCurrent && "animate-pulse")}>{index + 1}</span>
                }
              </div>
              
              <span
                className={cn(
                  "mt-3 text-xs font-medium text-center whitespace-nowrap px-1",
                  isCompleted ? "text-blue-600" : 
                  isCurrent ? "text-blue-600 font-semibold" : 
                  "text-gray-500"
                )}
              >
                {step.name}
              </span>
              
              {/* Line connector - hidden for aesthetic purposes, using the progress bar instead */}
              {index < steps.length - 1 && (
                <div className="absolute top-5 left-1/2 w-full h-0.5 hidden"></div>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}