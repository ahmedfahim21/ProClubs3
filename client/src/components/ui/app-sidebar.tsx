"use client";

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { 
  Home, 
  Users, 
  Workflow, 
  BarChart2,
  Calendar, 
  Trophy, 
  Search, 
  Banknote, 
  Building, 
  GraduationCap,
  ChevronLeft,
  Newspaper,
  ShoppingBag
} from "lucide-react"

export default function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [windowWidth, setWindowWidth] = useState(0)
  
  // Auto-collapse on smaller screens
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
      if (window.innerWidth < 640) {
        setCollapsed(true)
      }
    }
    
    // Set initial value
    handleResize()
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  const menuItems = [
    { icon: <Home size={20} />, label: "Home" },
    { icon: <Newspaper size={20} />, label: "News" },
    { icon: <Users size={20} />, label: "Squad" },
    { icon: <Workflow size={20} />, label: "Tactics", active: true },
    { icon: <BarChart2 size={20} />, label: "Team Report" },
    { icon: <Calendar size={20} />, label: "Schedule" },
    { icon: <Trophy size={20} />, label: "Competitions" },
    { icon: <ShoppingBag size={20} />, label: "Marketplace" },
    { icon: <Search size={20} />, label: "Transfers" },
    { icon: <Building size={20} />, label: "Club Info" },
    { icon: <Banknote size={20} />, label: "Finances" },
    { icon: <GraduationCap size={20} />, label: "Dev. Centre" },
  ]

  return (
    <div className={cn(
      "flex flex-col h-screen transition-all duration-300 ease-in-out bg-gradient-to-b from-blue-700 to-blue-800 text-white",
      collapsed ? "w-16" : "w-56"
    )}>
      {/* Header with logo */}
      <div className="p-4 border-b border-blue-600 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <Trophy size={16} className="text-blue-700" />
            </div>
            <span className="font-bold text-lg tracking-tight">OnChainFC</span>
          </div>
        )}
        {collapsed && (
          <div className="mx-auto">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <Trophy size={16} className="text-blue-700" />
            </div>
          </div>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)} 
          className="w-6 h-6 rounded hover:bg-blue-600 flex items-center justify-center"
        >
          <ChevronLeft size={16} className={cn("transition-transform", collapsed && "rotate-180")} />
        </button>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-red-600">
        <div className="space-y-1 px-2">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer transition-all font-light",
                item.active 
                  ? "bg-red-600 shadow-md" 
                  : "hover:bg-red-600/50 text-red-100"
              )}
            >
              <div className={cn(
                "flex items-center justify-center",
                item.active ? "text-white" : "text-red-200"
              )}>
                {item.icon}
              </div>
              {!collapsed && (
                <span className={cn(
                  "font-medium text-sm whitespace-nowrap",
                  item.active ? "text-white" : "text-red-100"
                )}>
                  {item.label}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer with next match */}
      <div className="mt-auto">
        <div className="bg-red-900/60 p-3 border-t border-blue-600">
          {!collapsed ? (
            <>
              <div className="text-xs font-semibold text-red-200 uppercase tracking-wider mb-1">Next Match</div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-100 shadow-sm"></div>
                  <span className="font-bold text-sm">Arsenal</span>
                </div>
                <div className="bg-blue-800 px-2 py-1 rounded text-xs font-bold">AWAY</div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center">
              <Calendar size={16} className="text-red-200" />
              <div className="w-6 h-6 rounded-full bg-gray-100 mt-1 shadow-sm"></div>
            </div>
          )}
        </div>
        {!collapsed && (
          <div className="px-4 py-2 text-xs text-red-300 text-center">© 2025 Football Manager</div>
        )}
      </div>
    </div>
  )
}