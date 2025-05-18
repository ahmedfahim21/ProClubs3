"use client"

import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

const competitions = [
  {
    id: "eredivisie",
    name: "Eredivisie",
    logo: "/api/placeholder/60/60?text=E",
    description: "Top Dutch professional football league.",
  },
  {
    id: "knvb-cup",
    name: "KNVB Cup",
    logo: "/api/placeholder/60/60?text=K",
    description: "The main national cup competition in the Netherlands.",
  },
  {
    id: "champions-league",
    name: "UEFA Champions League",
    logo: "/api/placeholder/60/60?text=CL",
    description: "Europe's premier club football tournament.",
  },
]

export default function CompetitionsPage() {
  const router = useRouter()

  return (
    <div className="flex flex-col h-screen w-full bg-gray-900 text-gray-100 font-sans">
      <div className="bg-gray-800 text-white p-4 flex items-center justify-between border-b border-gray-700">
        <div className="text-2xl font-bold text-green-400 tracking-tight">Competitions</div>
      </div>
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {competitions.map((comp) => (
            <div
              key={comp.id}
              className={cn(
                "flex flex-col items-center bg-gray-800 rounded-xl shadow hover:shadow-lg transition-shadow cursor-pointer border border-transparent hover:border-green-500 p-6 group",
              )}
              onClick={() => router.push(`/main/competitions/${comp.id}`)}
            >
              <img src={comp.logo} alt={comp.name} className="h-16 w-16 rounded-full border-2 border-gray-700 group-hover:border-green-400 transition mb-4" />
              <div className="text-xl font-semibold text-white mb-2 text-center">{comp.name}</div>
              <div className="text-sm text-gray-400 text-center">{comp.description}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 