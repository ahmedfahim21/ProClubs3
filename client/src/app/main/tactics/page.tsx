"use client"

import type React from "react"

import { useState } from "react"
import { 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  ChevronUp, 
  Info, 
  Search,
  Settings,
  Calendar,
  Filter,
  ArrowRight,
  Menu,
  Play
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function FootballManager() {
  const [selectedTab, setSelectedTab] = useState("Overview")

  return (
    <div className="flex h-screen w-full overflow-scroll bg-gray-900 text-gray-100 font-sans">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <div className="bg-gray-800 text-white p-3 flex items-center justify-between border-b border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button className="p-1 hover:bg-gray-700 rounded transition-colors">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button className="p-1 hover:bg-gray-700 rounded transition-colors">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="bg-gray-700 rounded-md p-2 mr-2">
                <img src="/api/placeholder/30/30" alt="Team Logo" className="h-6 w-6" />
              </div>
              <div>
                <div className="text-green-400 font-medium">FC AJAX</div>
                <div className="text-sm text-gray-400">11th in Eredivisie</div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-gray-400 mr-4" />
            <div className="flex bg-gray-700 rounded-md p-1 items-center">
              <Calendar className="h-4 w-4 text-gray-300 mr-2" />
              <div>
                <div className="text-xs">9 AUG 2019</div>
                <div className="text-xs">Fri 0:00</div>
              </div>
              <button className="ml-4 bg-green-500 hover:bg-green-600 text-black transition-colors px-3 py-1 rounded-md flex items-center space-x-1">
                <span className="text-xs font-bold">CONTINUE</span>
                <Play className="h-3 w-3 fill-current" />
              </button>
            </div>
          </div>
        </div>

        {/* Next Match Banner */}
        <div className="bg-gray-800 px-4 py-2 flex items-center text-sm">
          <div className="flex items-center mr-8">
            <div className="font-medium text-gray-400 mr-2">Next Match:</div>
            <div className="font-medium">Heracles Almelo (A)</div>
            <div className="ml-2 text-gray-400">Tomorrow 19:45</div>
          </div>
          
          <div className="ml-auto flex items-center space-x-2 bg-yellow-500 bg-opacity-20 px-3 py-1 rounded-md">
            <div className="text-yellow-400">New advice available</div>
            <div className="ml-2 bg-yellow-500 text-black rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">1</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-gray-800 border-b border-gray-700 flex overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700">
          {[
            "Overview",
            "Team",
            "Player",
            "Set Pieces",
            "Captains",
            "Match Plans",
            "Opposition Instructions",
            "Analysis",
          ].map((tab) => (
            <button
              key={tab}
              className={cn(
                "px-5 py-3 whitespace-nowrap transition-colors", 
                selectedTab === tab 
                  ? "border-b-2 border-green-500 text-green-400 font-medium" 
                  : "text-gray-300 hover:text-white hover:bg-gray-700"
              )}
              onClick={() => setSelectedTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Main Tactics Area */}
        <div className="flex-1 flex">
          {/* Left Tactics Panel */}
          <div className="w-[300px] bg-gray-800 border-r border-gray-700 flex flex-col p-4">
            <div className="flex items-center justify-between mb-6">
              <div className="text-xl font-medium text-green-400">TACTICS</div>
              <button className="text-sm bg-gray-700 hover:bg-gray-600 transition-colors px-3 py-1 rounded-md flex items-center">
                <span>4-2-3-1 Wide</span>
                <ChevronDown className="h-4 w-4 ml-1" />
              </button>
            </div>

            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <div className="text-sm">FAMILIARITY</div>
                <div className="text-sm text-green-400">90%</div>
              </div>
              <div className="w-full bg-gray-700 h-2 rounded-full">
                <div className="bg-green-500 h-full w-[90%] rounded-full"></div>
              </div>
            </div>
              
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <div className="text-sm">INTENSITY</div>
                <div className="text-sm text-yellow-400">70%</div>
              </div>
              <div className="w-full bg-gray-700 h-2 rounded-full">
                <div className="bg-yellow-500 h-full w-[70%] rounded-full"></div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-md p-4 mb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="text-lg font-medium">GEGENPRESS</div>
                <button className="text-xs bg-gray-800 hover:bg-gray-700 transition-colors px-2 py-1 rounded flex items-center">
                  <Settings className="h-3 w-3 mr-1" />
                  CHANGE
                </button>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm">MENTALITY</div>
                <div className="flex items-center">
                  <div className="h-2 w-2 bg-green-500 rounded-full mr-1"></div>
                  <div className="text-sm">Balanced</div>
                </div>
              </div>
              
              <div className="mb-4 border-t border-gray-700 pt-4">
                <div className="flex items-center mb-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full mr-1"></div>
                  <div className="text-sm font-medium">IN POSSESSION</div>
                </div>
                <div className="pl-3 text-xs space-y-1 text-gray-300">
                  <div>• Pass Into Space</div>
                  <div>• Play Out Of Defence</div>
                  <div>• Extremely High Tempo</div>
                  <div>• Narrow</div>
                </div>
              </div>
              
              <div className="mb-4 border-t border-gray-700 pt-4">
                <div className="flex items-center mb-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full mr-1"></div>
                  <div className="text-sm font-medium">IN TRANSITION</div>
                </div>
                <div className="pl-3 text-xs space-y-1 text-gray-300">
                  <div>• Take Short Kicks</div>
                  <div>• Distribute To Centre-Backs</div>
                  <div>• Counter</div>
                  <div>• Counter-Press</div>
                </div>
              </div>
              
              <div className="mb-2 border-t border-gray-700 pt-4">
                <div className="flex items-center mb-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full mr-1"></div>
                  <div className="text-sm font-medium">OUT OF POSSESSION</div>
                </div>
                <div className="pl-3 text-xs space-y-1 text-gray-300">
                  <div>• Higher Defensive Line</div>
                  <div>• Much Higher Line Of Engagement</div>
                  <div>• Extremely Urgent</div>
                  <div>• Prevent Short GK Distribution</div>
                </div>
              </div>
            </div>
            
            <div className="mt-auto flex justify-center">
              <button className="text-sm bg-gray-700 hover:bg-gray-600 transition-colors px-3 py-2 rounded-md flex items-center">
                <span>Save Tactic</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>

          {/* Middle Pitch View */}
          <div className="flex-1 bg-green-900 relative overflow-hidden h-[85vh]">
            <div className="absolute right-4 top-4 bg-gray-900 bg-opacity-60 backdrop-blur-sm px-3 py-1 rounded-md text-white text-xs">
              <button className="flex items-center">
                <Info className="h-3 w-3 mr-1" />
                Analysis
              </button>
            </div>

            {/* Pitch markings - simplified for clarity */}
            <div className="absolute inset-0 flex flex-col">
              <div className="w-full h-1/2 border-b border-white border-opacity-20"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-white border-opacity-20"></div>
              <div className="absolute top-0 left-1/4 right-1/4 h-16 border-b border-l border-r border-white border-opacity-20"></div>
              <div className="absolute bottom-0 left-1/4 right-1/4 h-16 border-t border-l border-r border-white border-opacity-20"></div>
            </div>

            {/* Soccer field with players */}
            <div className="h-full flex flex-col justify-between p-10 relative z-10">
              {/* Top third - Attack */}
              <div className="flex justify-center">
                <PlayerPosition number="10" position="DLF - Su" name="Tadic" />
              </div>

              {/* Middle third */}
              <div className="flex justify-between">
                <PlayerPosition number="7" position="IF - Su" name="Neres" />
                <div className="flex flex-col items-center">
                  <PlayerPosition number="22" position="AM - At" name="Ziyech" />
                  <div className="mt-16">
                    <PlayerPosition number="20" position="AP - At" name="Gravenberch" />
                  </div>
                </div>
                <PlayerPosition number="11" position="IF - At" name="Promes" />
              </div>

              {/* Defensive midfield */}
              <div className="flex justify-around">
                <PlayerPosition number="6" position="BBM - Su" name="v.d. Beek" />
                <PlayerPosition number="8" position="BPD - Su" name="Álvarez" />
              </div>

              {/* Defense */}
              <div className="flex justify-between">
                <PlayerPosition number="3" position="FB - Su" name="Tagliafico" />
                <PlayerPosition number="5" position="BPD - St" name="Blind" />
                <PlayerPosition number="17" position="BPD - St" name="Veltman" />
                <PlayerPosition number="12" position="CWB - Su" name="Mazraoui" />
              </div>

              {/* Goalkeeper */}
              <div className="flex justify-center">
                <PlayerPosition number="24" position="SK - At" name="Onana" />
              </div>
            </div>
          </div>

          {/* Right Player Panel */}
          <div className="w-[600px] bg-gray-800 border-l border-gray-700 flex flex-col">
            <div className="p-3 border-b border-gray-700 flex justify-between items-center">
              <div className="text-lg font-medium text-green-400">SQUAD</div>
              <div className="flex items-center space-x-2">
                <button className="p-1 hover:bg-gray-700 rounded transition-colors">
                  <Filter className="h-4 w-4" />
                </button>
                <button className="p-1 hover:bg-gray-700 rounded transition-colors">
                  <Menu className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex text-xs p-3 border-b border-gray-700 bg-gray-900">
              <div className="w-1/4">POSITION/ROLE</div>
              <div className="w-1/6">RATING</div>
              <div className="w-1/3">PLAYER</div>
              <div className="w-1/6 text-right">FIT</div>
              <div className="w-1/6 text-right">CON</div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700">
              <ModernPlayerRow
                position="GK"
                role="Sweeper Keeper"
                duty="Attack"
                stars={4}
                name="André Onana"
                condition={95}
                fitness={92}
              />

              <ModernPlayerRow
                position="DR"
                role="Wing-Back"
                duty="Support"
                stars={3}
                name="N. Mazraoui"
                condition={95}
                fitness={93}
              />

              <ModernPlayerRow
                position="DCR"
                role="Ball Playing Def"
                duty="Stopper"
                stars={3}
                name="Daley Blind"
                condition={88}
                fitness={100}
                highlight={true}
              />

              <ModernPlayerRow
                position="DCL"
                role="Ball Playing Def"
                duty="Stopper"
                stars={3}
                name="Joël Veltman"
                condition={84}
                fitness={100}
              />

              <ModernPlayerRow
                position="DL"
                role="Full-Back"
                duty="Support"
                stars={4}
                name="N. Tagliafico"
                condition={81}
                fitness={100}
              />

              <ModernPlayerRow
                position="MCR"
                role="Box To Box Mid"
                duty="Support"
                stars={4}
                name="D. van de Beek"
                condition={96}
                fitness={100}
                highlight={true}
              />

              <ModernPlayerRow
                position="MCL"
                role="Adv. Playmaker"
                duty="Attack"
                stars={2}
                name="R. Gravenberch"
                condition={99}
                fitness={97}
                highlight={true}
              />

              <ModernPlayerRow
                position="AMR"
                role="Inside Forward"
                duty="Support"
                stars={3}
                name="David Neres"
                condition={84}
                fitness={81}
              />

              <ModernPlayerRow
                position="AMC"
                role="Attacking Mid"
                duty="Attack"
                stars={4}
                name="Hakim Ziyech"
                condition={83}
                fitness={93}
              />

              <ModernPlayerRow
                position="AML"
                role="Inside Forward"
                duty="Attack"
                stars={4}
                name="Q. Promes"
                condition={80}
                fitness={93}
                highlight={true}
              />

              <ModernPlayerRow
                position="STC"
                role="Deep Lying Fwd"
                duty="Support"
                stars={4}
                name="Dusan Tadic"
                condition={89}
                fitness={100}
              />

              <div className="mt-2 px-3 py-2 bg-gray-900 text-sm font-medium">SUBSTITUTES</div>

              <ModernPlayerRow 
                position="S1" 
                role="" 
                duty="" 
                stars={0} 
                name="Sergiño Dest" 
                condition={90} 
                fitness={74} 
              />

              <ModernPlayerRow
                position="S2"
                role=""
                duty=""
                stars={0}
                name="Perr Schuurs"
                condition={100}
                fitness={100}
                highlight={true}
              />

              <ModernPlayerRow
                position="S3"
                role=""
                duty=""
                stars={0}
                name="Z. Labyad"
                condition={100}
                fitness={86}
                highlight={true}
              />

              <ModernPlayerRow 
                position="S4" 
                role="" 
                duty="" 
                stars={0} 
                name="Edson Álvarez" 
                condition={91} 
                fitness={93} 
              />
            </div>

            <div className="border-t border-gray-700 p-3">
              <div className="flex items-center justify-between text-sm">
                <div className="text-green-400">Match Rules</div>
                <div className="text-gray-400">Eredivisie - Heracles Almelo (A)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PlayerPosition({ number, position, name }: { number: string; position: string; name: string }) {
  const [role, duty] = position.split(" - ")

  return (
    <div className="group">
      <div className="relative">
        <div className="w-12 h-12 bg-gray-800 bg-opacity-80 backdrop-blur-sm rounded-full border-2 border-white flex items-center justify-center text-white font-bold transform transition-transform group-hover:scale-110">
          {number}
        </div>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border border-white"></div>
      </div>
      <div className="mt-1 text-white text-xs px-2 py-1 text-center bg-black bg-opacity-60 backdrop-blur-sm rounded-md invisible group-hover:visible transition-opacity">
        <div className="font-bold">{name}</div>
        <div className="flex justify-center items-center mt-1">
          <span>{role}</span>
          <span className="mx-1">·</span>
          <span className="text-green-400">{duty}</span>
        </div>
      </div>
    </div>
  )
}

function ModernPlayerRow({
  position,
  role,
  duty,
  stars,
  name,
  condition,
  fitness,
  highlight,
}: {
  position: string
  role: string
  duty: string
  stars: number
  name: string
  condition: number
  fitness: number
  highlight?: boolean
}) {
  return (
    <div className={cn(
      "flex items-center text-sm py-1 px-1 border-b border-gray-700 hover:bg-gray-700 transition-colors", 
      highlight ? "bg-gray-700 bg-opacity-50" : ""
    )}>
      <div className="w-10 text-center font-medium text-sm px-2">{position}</div>
      <div className="w-1/4">
        {role && (
          <div className="flex flex-col">
            <div className="text-xs">{role}</div>
            {duty && <div className="text-xs text-green-400">{duty}</div>}
          </div>
        )}
      </div>
      <div className="w-1/6 flex">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <div key={i} className={i < stars ? "text-yellow-400" : "text-gray-600"}>
              ★
            </div>
          ))}
      </div>
      <div className="w-1/3 flex items-center">
        <div className="mr-2">
          <div className="h-6 w-6 bg-gray-600 rounded-full flex items-center justify-center text-xs">
            🏴
          </div>
        </div>
        <div className="truncate">{name}</div>
      </div>
      <div className="w-1/6 text-right">
        <div
          className={cn(
            "inline-block h-2 w-8 rounded-full",
            fitness >= 90 ? "bg-green-500" : fitness >= 80 ? "bg-yellow-500" : "bg-red-500",
          )}
        ></div>
      </div>
      <div className="w-1/6 text-right">
        <div
          className={cn(
            "inline-block h-2 w-8 rounded-full",
            condition >= 90 ? "bg-green-500" : condition >= 80 ? "bg-yellow-500" : "bg-red-500",
          )}
        ></div>
      </div>
    </div>
  )
}