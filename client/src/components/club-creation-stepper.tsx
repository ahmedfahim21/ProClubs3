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
      <div className="absolute top-5 left-4 right-4 h-1 bg-slate-600 rounded-full w-[80%] mx-auto">
        <div
          className="absolute top-0 h-full bg-cyan-300 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${(currentStep / (steps.length -1)) * 100}%` }}
        ></div>
      </div>
      
      {/* Step indicators */}
      <ol className="relative grid grid-cols-4 w-full">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isUpcoming = index > currentStep;
          
          return (
            <li key={step.id} className="relative flex flex-col items-center">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full z-10 shadow-sm transition-all duration-300",
                  isCompleted 
                    ? "bg-cyan-500 text-white" 
                    : isCurrent
                      ? "border-2 border-cyan-500 bg-slate-300 text-cyan-600"
                      : "border-2 border-gray-200 bg-slate-300 text-slate-500"
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
                  isCompleted ? "text-cyan-500" : 
                  isCurrent ? "text-cyan-500 font-semibold" : 
                  "text-gray-500"
                )}
              >
                {step.name}
              </span>
              
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