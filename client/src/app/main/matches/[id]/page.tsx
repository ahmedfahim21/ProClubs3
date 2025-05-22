"use client"

import { useParams } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"

type TableRow = { pos: number; team: string; played: number; points: number }
type Match = { id: number; date: string; home: string; away: string; time: string }
type Stat = { label: string; value: string }
type Competition = {
  name: string
  table: TableRow[]
  schedule: Match[]
  stats: Stat[]
}

const competitions: Record<string, Competition> = {
  "eredivisie": {
    name: "Eredivisie",
    table: [
      { pos: 1, team: "FC AJAX", played: 30, points: 70 },
      { pos: 2, team: "PSV", played: 30, points: 68 },
      { pos: 3, team: "Feyenoord", played: 30, points: 65 },
    ],
    schedule: [
      { id: 1, date: "2024-06-10", home: "FC AJAX", away: "Heracles Almelo", time: "19:45" },
      { id: 2, date: "2024-06-13", home: "PSV", away: "FC AJAX", time: "21:00" },
    ],
    stats: [
      { label: "Top Scorer", value: "Tadic (21)" },
      { label: "Most Assists", value: "Ziyech (14)" },
    ],
  },
  "knvb-cup": {
    name: "KNVB Cup",
    table: [],
    schedule: [
      { id: 1, date: "2024-07-01", home: "FC AJAX", away: "AZ Alkmaar", time: "20:00" },
    ],
    stats: [
      { label: "Top Scorer", value: "Promes (5)" },
    ],
  },
  "champions-league": {
    name: "UEFA Champions League",
    table: [
      { pos: 1, team: "FC AJAX", played: 6, points: 13 },
      { pos: 2, team: "Chelsea", played: 6, points: 11 },
      { pos: 3, team: "Valencia", played: 6, points: 8 },
    ],
    schedule: [
      { id: 1, date: "2024-09-15", home: "FC AJAX", away: "Chelsea", time: "20:45" },
    ],
    stats: [
      { label: "Top Scorer", value: "Tadic (7)" },
    ],
  },
}

const tabs = ["Table", "Schedule", "Stats"]

export default function CompetitionDetailsPage() {
  const params = useParams()
  const id = params?.id as string
  const comp: Competition = competitions[id] || { name: "Competition", table: [], schedule: [], stats: [] }
  const [tab, setTab] = useState("Table")

  return (
    <div className="flex flex-col h-screen w-full bg-gray-900 text-gray-100 font-sans">
      {/* Top Bar */}
      <div className="bg-gray-800 text-white p-4 flex items-center border-b border-gray-700">
        <div className="text-2xl font-bold text-green-400 tracking-tight">{comp.name}</div>
      </div>
      {/* Tabs */}
      <div className="bg-gray-800 border-b border-gray-700 flex overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700">
        {tabs.map((t) => (
          <button
            key={t}
            className={cn(
              "px-5 py-3 whitespace-nowrap transition-colors border-b-2",
              tab === t
                ? "border-green-500 text-green-400 font-medium"
                : "border-transparent text-gray-300 hover:text-white hover:bg-gray-700"
            )}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-3xl mx-auto">
          {tab === "Table" && (
            <div className="bg-gray-800 rounded-xl shadow p-6">
              {comp.table.length > 0 ? (
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-green-400 border-b border-gray-700">
                      <th className="py-2">#</th>
                      <th className="py-2">Team</th>
                      <th className="py-2">Played</th>
                      <th className="py-2">Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comp.table.map((row: TableRow) => (
                      <tr key={row.team} className="border-b border-gray-700 hover:bg-gray-700">
                        <td className="py-2 font-bold">{row.pos}</td>
                        <td className="py-2">{row.team}</td>
                        <td className="py-2">{row.played}</td>
                        <td className="py-2 text-green-400 font-bold">{row.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-gray-400">No table data available.</div>
              )}
            </div>
          )}
          {tab === "Schedule" && (
            <div className="bg-gray-800 rounded-xl shadow p-6 flex flex-col gap-4">
              {comp.schedule.length > 0 ? comp.schedule.map((match: Match) => (
                <div key={match.id} className="flex items-center">
                  <div className="flex-1">
                    <div className="text-lg font-semibold text-white">{match.home} <span className="text-gray-400">vs</span> {match.away}</div>
                    <div className="text-sm text-gray-400 mt-1">{match.date} · {match.time}</div>
                  </div>
                </div>
              )) : <div className="text-gray-400">No matches scheduled.</div>}
            </div>
          )}
          {tab === "Stats" && (
            <div className="bg-gray-800 rounded-xl shadow p-6 flex flex-col gap-4">
              {comp.stats.length > 0 ? comp.stats.map((stat: Stat, i: number) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="text-gray-300">{stat.label}</div>
                  <div className="text-green-400 font-bold">{stat.value}</div>
                </div>
              )) : <div className="text-gray-400">No stats available.</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 