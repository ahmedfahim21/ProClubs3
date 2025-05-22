"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"

// Mock schedule data
const matches = [
  {
    id: 1,
    date: "2024-06-10",
    time: "19:45",
    home: "FC AJAX",
    away: "Heracles Almelo",
    venue: "Home",
  },
  {
    id: 2,
    date: "2024-06-13",
    time: "21:00",
    home: "PSV",
    away: "FC AJAX",
    venue: "Away",
  },
  {
    id: 3,
    date: "2024-06-18",
    time: "18:30",
    home: "FC AJAX",
    away: "Feyenoord",
    venue: "Home",
  },
]

function getMonthDays(year: number, month: number) {
  const lastDay = new Date(year, month + 1, 0)
  const days = []
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i))
  }
  return days
}

function formatDate(date: Date) {
  return date.toISOString().split("T")[0]
}

export default function SchedulePage() {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())

  const days = getMonthDays(currentYear, currentMonth)
  const matchDates = matches.map(m => m.date)

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }
  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const displayMonth = new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' })

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-gray-900 text-gray-100 font-sans">
      {/* Calendar View */}
      <div className="md:w-1/2 w-full p-8 flex flex-col items-center border-b md:border-b-0 md:border-r border-gray-800">
        <div className="flex items-center justify-between w-full max-w-md mb-4">
          <button onClick={handlePrevMonth} className="p-2 rounded hover:bg-gray-800 transition-colors">
            <ChevronLeft className="h-5 w-5 text-gray-400" />
          </button>
          <div className="text-xl font-bold text-cyan-400 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-cyan-400" />
            {displayMonth}
          </div>
          <button onClick={handleNextMonth} className="p-2 rounded hover:bg-gray-800 transition-colors">
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-2 w-full max-w-md">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="text-xs text-gray-400 text-center mb-1">{d}</div>
          ))}
          {/* Padding for first day */}
          {Array(days[0].getDay()).fill(0).map((_, i) => (
            <div key={"pad-"+i}></div>
          ))}
          {days.map((day) => {
            const dateStr = formatDate(day)
            const isToday = formatDate(today) === dateStr
            const hasMatch = matchDates.includes(dateStr)
            return (
              <div
                key={dateStr}
                className={cn(
                  "flex items-center justify-center h-10 w-10 rounded-full cursor-pointer transition-all",
                  isToday ? "bg-cyan-700 text-white font-bold" : "hover:bg-gray-800",
                  hasMatch ? "border-2 border-cyan-400" : "border border-gray-700"
                )}
                title={dateStr}
              >
                {day.getDate()}
                {hasMatch && <span className="absolute mt-8 w-2 h-2 bg-cyan-400 rounded-full"></span>}
              </div>
            )
          })}
        </div>
      </div>
      {/* List View */}
      <div className="md:w-1/2 w-full p-8 flex flex-col">
        <div className="text-2xl font-bold text-cyan-400 mb-6">Upcoming Matches</div>
        <div className="flex flex-col gap-4">
          {matches.map((match) => (
            <div key={match.id} className="flex items-center bg-gray-800 rounded-lg p-4 shadow hover:shadow-lg transition-shadow border border-transparent hover:border-cyan-500">
              <div className="flex-1">
                <div className="text-lg font-semibold text-white">{match.home} <span className="text-gray-400">vs</span> {match.away}</div>
                <div className="text-sm text-gray-400 mt-1">{match.venue} · {match.date} · {match.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 