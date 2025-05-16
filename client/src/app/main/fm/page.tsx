"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Home, Info, LayoutGrid, Search } from "lucide-react"
import { cn } from "@/lib/utils"

export default function FootballManager() {
  const [selectedTab, setSelectedTab] = useState("Overview")

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-100">
      {/* Left Sidebar */}


      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <div className="bg-indigo-950 text-white p-2 flex items-center">
          <div className="flex items-center space-x-2">
            <ChevronLeft className="h-6 w-6 bg-red-600 rounded-full p-1" />
            <ChevronRight className="h-6 w-6 bg-red-600 rounded-full p-1" />
          </div>
          <div className="ml-4 flex items-center space-x-2">
            <div className="bg-white rounded-full h-8 w-8 flex items-center justify-center">
              <img src="/placeholder.svg?height=30&width=30" alt="Team Logo" className="h-6 w-6" />
            </div>
            <ChevronUp className="h-4 w-4" />
            <Search className="h-5 w-5" />
          </div>
          <div className="ml-4">
            <div className="text-red-500 font-bold text-sm">TACTICS</div>
            <div className="text-xs">11th in Eredivisie - Next Match: Heracles Almelo (A) (Tomorrow 19:45)</div>
          </div>
          <div className="ml-auto flex items-center space-x-2">
            <div className="bg-indigo-800 rounded-full h-6 w-6 flex items-center justify-center">
              <span className="text-xs">P</span>
            </div>
            <div className="bg-indigo-800 rounded-full h-6 w-6 flex items-center justify-center">
              <Info className="h-4 w-4" />
            </div>
            <div className="bg-indigo-800 rounded-full h-6 w-6 flex items-center justify-center">
              <span className="text-xs">FM</span>
            </div>
            <div className="bg-indigo-950 border border-gray-600 rounded-lg px-2 py-1 flex items-center">
              <div>
                <div className="text-xs">9 AUG 2019</div>
                <div className="text-xs">Fri 0:00</div>
              </div>
              <div className="ml-4 bg-cyan-400 text-black px-2 py-1 rounded flex items-center">
                <span className="text-xs font-bold">CONTINUE</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-indigo-950 text-white flex border-t border-indigo-800">
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
            <div
              key={tab}
              className={cn("px-4 py-2 cursor-pointer", selectedTab === tab ? "border-b-2 border-white" : "")}
              onClick={() => setSelectedTab(tab)}
            >
              {tab} {tab === "Set Pieces" || tab === "Analysis" ? <ChevronDown className="inline h-4 w-4" /> : null}
            </div>
          ))}
          <div className="ml-auto bg-yellow-400 text-black px-3 py-1 flex items-center text-xs">
            <div>
              <div>New advice available</div>
              <div className="text-[10px]">
                Player Duty Combination, Tactical Style Changes, Team Instructions To Add
              </div>
            </div>
            <div className="ml-2 bg-yellow-500 rounded-full h-6 w-6 flex items-center justify-center">1</div>
          </div>
        </div>

        {/* Main Tactics Area */}
        <div className="flex-1 flex">
          {/* Left Tactics Panel */}
          <div className="w-[320px] bg-green-800 text-white p-4">
            <div className="flex items-center justify-between mb-4">
              <ChevronLeft className="h-6 w-6" />
              <div className="flex items-center">
                <div className="bg-green-700 px-2 py-1 text-xs">TACTICS</div>
                <div className="bg-green-700 px-2 py-1 text-xs ml-2">1</div>
              </div>
              <div className="flex items-center">
                <div className="bg-green-700 px-2 py-1 text-xs">4-2-3-1 Wide - Gegenpr...</div>
                <ChevronDown className="h-4 w-4 ml-1" />
              </div>
              <div className="bg-green-700 rounded-full h-6 w-6 flex items-center justify-center">+</div>
            </div>

            <div className="flex justify-between mb-2">
              <div className="text-xs">FAMILIARITY</div>
              <div className="text-xs">INTENSITY</div>
            </div>
            <div className="flex justify-between mb-4">
              <div className="w-1/2 bg-green-700 h-2 rounded-full">
                <div className="bg-green-500 h-full w-[90%] rounded-full"></div>
              </div>
              <div className="w-1/2 bg-green-700 h-2 rounded-full ml-2">
                <div className="bg-red-500 h-full w-[70%] rounded-full"></div>
              </div>
            </div>

            <div className="text-center mb-4">
              <div className="text-xs">FORMATION</div>
              <div className="flex items-center justify-center">
                <div className="text-lg font-bold">4-2-3-1 WIDE</div>
                <ChevronDown className="h-4 w-4 ml-1" />
              </div>
            </div>

            <div className="bg-green-900 p-3 mb-4">
              <div className="text-center mb-2">TACTICAL STYLE</div>
              <div className="flex items-center justify-center mb-4">
                <div className="font-bold">GEGENPRESS</div>
                <ChevronDown className="h-4 w-4 ml-1" />
              </div>

              <div className="text-center mb-2">MENTALITY</div>
              <div className="flex items-center justify-center mb-4">
                <div className="bg-green-800 rounded-full h-5 w-5 flex items-center justify-center mr-2">
                  <div className="bg-white rounded-full h-3 w-3"></div>
                </div>
                <div>Balanced</div>
                <ChevronDown className="h-4 w-4 ml-1" />
              </div>

              <div className="flex items-center mb-2">
                <div className="bg-green-800 rounded-full h-5 w-5 flex items-center justify-center mr-2">
                  <div className="bg-white rounded-full h-3 w-3"></div>
                </div>
                <div className="text-sm">IN POSSESSION</div>
              </div>
              <div className="text-xs ml-7 mb-1">Pass Into Space</div>
              <div className="text-xs ml-7 mb-1">Play Out Of Defence</div>
              <div className="text-xs ml-7 mb-1">Extremely High Tempo</div>
              <div className="text-xs ml-7 mb-4">Narrow</div>

              <div className="flex justify-center mb-4">
                <div className="bg-green-800 px-3 py-1 text-xs flex items-center">
                  <ChevronRight className="h-4 w-4 mr-1" />
                  CHANGE
                </div>
              </div>

              <div className="flex items-center mb-2">
                <div className="bg-green-800 rounded-full h-5 w-5 flex items-center justify-center mr-2">
                  <div className="bg-white rounded-full h-3 w-3"></div>
                </div>
                <div className="text-sm">IN TRANSITION</div>
              </div>
              <div className="text-xs ml-7 mb-1">Take Short Kicks</div>
              <div className="text-xs ml-7 mb-1">Distribute To Centre-Backs</div>
              <div className="text-xs ml-7 mb-1">Counter</div>
              <div className="text-xs ml-7 mb-4">Counter-Press</div>

              <div className="flex justify-center mb-4">
                <div className="bg-green-800 px-3 py-1 text-xs flex items-center">
                  <ChevronRight className="h-4 w-4 mr-1" />
                  CHANGE
                </div>
              </div>

              <div className="flex items-center mb-2">
                <div className="bg-green-800 rounded-full h-5 w-5 flex items-center justify-center mr-2">
                  <div className="bg-white rounded-full h-3 w-3"></div>
                </div>
                <div className="text-sm">OUT OF POSSESSION</div>
              </div>
              <div className="text-xs ml-7 mb-1">Higher Defensive Line</div>
              <div className="text-xs ml-7 mb-1">Much Higher Line Of Engagement</div>
              <div className="text-xs ml-7 mb-1">Extremely Urgent</div>
              <div className="text-xs ml-7 mb-1">Prevent Short GK Distribution</div>
              <div className="text-xs ml-7 mb-4"></div>

              <div className="flex justify-center mb-4">
                <div className="bg-green-800 px-3 py-1 text-xs flex items-center">
                  <ChevronRight className="h-4 w-4 mr-1" />
                  CHANGE
                </div>
              </div>

              <div className="text-center mb-2">TEAM FLUIDITY</div>
              <div className="flex items-center justify-center">
                <div className="bg-green-800 rounded-full h-5 w-5 flex items-center justify-center mr-2">
                  <div className="bg-white rounded-full h-3 w-3"></div>
                </div>
                <div>Flexible</div>
              </div>
            </div>
          </div>

          {/* Middle Pitch View */}
          <div className="flex-1 bg-green-700 relative">
            <div className="absolute right-4 top-4 bg-green-800 px-3 py-1 text-white text-xs">Analysis</div>

            {/* Soccer field with players */}
            <div className="h-full flex flex-col justify-between p-10">
              {/* Top third */}
              <div className="flex justify-center">
                <PlayerPosition number="10" position="DLF - Su" />
              </div>

              {/* Middle third */}
              <div className="flex justify-between">
                <PlayerPosition number="7" position="IF - Su" />
                <div className="flex flex-col items-center">
                  <PlayerPosition number="22" position="AM - At" />
                  <div className="mt-16">
                    <PlayerPosition number="20" position="AP - At" />
                  </div>
                </div>
                <PlayerPosition number="11" position="IF - At" />
              </div>

              {/* Defensive midfield */}
              <div className="flex justify-around">
                <PlayerPosition number="6" position="BBM - Su" />
                <PlayerPosition number="8" position="BPD - Su" />
              </div>

              {/* Defense */}
              <div className="flex justify-between">
                <PlayerPosition number="3" position="FB - Su" />
                <PlayerPosition number="5" position="BPD - St" />
                <PlayerPosition number="17" position="BPD - St" />
                <PlayerPosition number="12" position="CWB - Su" />
              </div>

              {/* Goalkeeper */}
              <div className="flex justify-center">
                <PlayerPosition number="24" position="SK - At" />
              </div>
            </div>
          </div>

          {/* Right Player Panel */}
          <div className="w-[350px] bg-indigo-950 text-white">
            <div className="p-2 flex justify-between items-center">
              <div className="bg-indigo-900 px-3 py-1 rounded-sm flex items-center">
                <div>Selection Info</div>
                <ChevronDown className="h-4 w-4 ml-1" />
              </div>
              <div className="flex">
                <div className="bg-indigo-900 px-3 py-1 rounded-sm mr-2">Selection Advice</div>
                <div className="bg-indigo-900 px-3 py-1 rounded-sm mr-2">Quick Pick</div>
                <div className="bg-indigo-900 px-3 py-1 rounded-sm flex items-center">
                  <div>Filter</div>
                  <ChevronDown className="h-4 w-4 ml-1" />
                </div>
              </div>
            </div>

            <div className="border-t border-indigo-800 p-2">
              <div className="flex text-xs mb-2">
                <div className="w-1/3 flex items-center">
                  <ChevronUp className="h-3 w-3 mr-1" />
                  POSITION/ROLE/DUTY
                </div>
                <div className="w-1/3 flex items-center">
                  <ChevronUp className="h-3 w-3 mr-1" />
                  ROLE ABILITY
                </div>
                <div className="w-1/6 text-center">PI</div>
                <div className="w-1/6">PLAYER</div>
                <div className="w-1/6 text-right">INF</div>
                <div className="w-1/6 text-right">CON/SHP</div>
                <div className="w-1/6 text-right flex items-center">
                  MOR...
                  <ChevronDown className="h-3 w-3 ml-1" />
                </div>
              </div>

              <PlayerRow
                position="GK"
                role="Sweeper Keeper"
                duty="Attack"
                stars={4}
                name="André Onana"
                condition={95}
                fitness={92}
              />

              <PlayerRow
                position="DR"
                role="Complete Wing-Back"
                duty="Support"
                stars={3}
                name="N. Mazraoui"
                condition={95}
                fitness={93}
              />

              <PlayerRow
                position="DCR"
                role="Ball Playing Defender"
                duty="Stopper"
                stars={3}
                name="Daley Blind"
                condition={88}
                fitness={100}
                highlight="wrt"
              />

              <PlayerRow
                position="DCL"
                role="Ball Playing Defender"
                duty="Stopper"
                stars={3}
                name="Joël Veltman"
                condition={84}
                fitness={100}
              />

              <PlayerRow
                position="DL"
                role="Full-Back"
                duty="Support"
                stars={4}
                name="N. Tagliafico"
                condition={81}
                fitness={100}
              />

              <PlayerRow
                position="MCR"
                role="Box To Box Midfielder"
                duty="Support"
                stars={4}
                name="D. van de Beek"
                condition={96}
                fitness={100}
                highlight="ben"
              />

              <PlayerRow
                position="MCL"
                role="Advanced Playmaker"
                duty="Attack"
                stars={2}
                name="R. Gravenberch"
                condition={99}
                fitness={97}
                highlight="spt"
              />

              <PlayerRow
                position="AMR"
                role="Inside Forward"
                duty="Support"
                stars={3}
                name="David Neres"
                condition={84}
                fitness={81}
              />

              <PlayerRow
                position="AMC"
                role="Attacking Midfielder"
                duty="Attack"
                stars={4}
                name="Hakim Ziyech"
                condition={83}
                fitness={93}
              />

              <PlayerRow
                position="AML"
                role="Inside Forward"
                duty="Attack"
                stars={4}
                name="Q. Promes"
                condition={80}
                fitness={93}
                highlight="pr"
              />

              <PlayerRow
                position="STC"
                role="Deep Lying Forward"
                duty="Support"
                stars={4}
                name="Dusan Tadic"
                condition={89}
                fitness={100}
              />

              <PlayerRow position="S1" role="" duty="" stars={0} name="Sergiño Dest" condition={90} fitness={74} />

              <PlayerRow
                position="S2"
                role=""
                duty=""
                stars={0}
                name="Perr Schuurs"
                condition={100}
                fitness={100}
                highlight="spt"
              />

              <PlayerRow
                position="S3"
                role=""
                duty=""
                stars={0}
                name="Z. Labyad"
                condition={100}
                fitness={86}
                highlight="spt"
              />

              <PlayerRow position="S4" role="" duty="" stars={0} name="Edson Álvarez" condition={91} fitness={93} />
            </div>

            <div className="border-t border-indigo-800 p-2">
              <div className="flex items-center justify-between">
                <div className="text-yellow-400 text-xs">RULES FOR EREDIVISIE MATCH AGAINST HERACLES ALMELO</div>
                <ChevronDown className="h-4 w-4" />
              </div>
              <div className="flex items-center mt-2">
                <div className="bg-green-500 h-4 w-4 flex items-center justify-center text-xs">✓</div>
                <div className="bg-gray-700 h-2 w-32 ml-2"></div>
                <div className="ml-2 text-xs">0</div>
                <div className="ml-2 text-xs">/</div>
                <div className="ml-2 text-xs">Maxi...</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


function PlayerPosition({ number, position }: { number: string; position: string }) {
  const [role, duty] = position.split(" - ")

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className="w-12 h-12 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-white font-bold">
          {number}
        </div>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border border-white"></div>
      </div>
      <div className="mt-1 bg-green-800 text-white text-xs px-2 py-1 rounded-sm flex items-center">
        {role} <ChevronDown className="h-3 w-3 ml-1" />
      </div>
      <div className="mt-1 bg-green-800 text-white text-xs px-2 py-1 rounded-sm">{duty || "Tactic"}</div>
    </div>
  )
}

function PlayerRow({
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
  highlight?: string
}) {
  return (
    <div className="flex items-center text-xs py-1 border-b border-indigo-900">
      <div className="w-8 text-center">{position}</div>
      <div className="w-6">
        <div className="h-4 w-4 bg-green-500 rounded-full"></div>
      </div>
      <div className="w-1/4">
        <div>{role}</div>
        {duty && <div className="text-blue-300">{duty}</div>}
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
      <div className="w-6 flex justify-center">
        <div className="h-4 w-4 bg-gray-700 rounded-sm flex items-center justify-center text-[10px]">
          {highlight ? highlight[0].toUpperCase() : ""}
        </div>
      </div>
      <div className="w-1/4 flex items-center">
        <div className="h-4 w-4 mr-1">🏴</div>
        <div>{name}</div>
        <ChevronDown className="h-3 w-3 ml-1" />
      </div>
      <div className="w-1/6 text-right">{condition}%</div>
      <div className="w-1/6 flex items-center justify-end">
        <div
          className={cn(
            "h-4 w-4 rounded-full border border-white flex items-center justify-center mr-1",
            fitness >= 90 ? "bg-green-500" : fitness >= 80 ? "bg-yellow-500" : "bg-red-500",
          )}
        ></div>
        {fitness}%
      </div>
      <div className="w-6 flex justify-center">
        <div className="h-4 w-4 bg-yellow-400 rounded-full"></div>
      </div>
    </div>
  )
}
