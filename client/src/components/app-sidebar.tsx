"use client";

import { useEffect, useState, useRef } from "react"
import { cn } from "@/lib/utils"
import { 
  Home, 
  Users, 
  Workflow, 
  Trophy,
  Banknote, 
  Building,
  ChevronLeft,
  Newspaper,
  ShoppingBag
} from "lucide-react"
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const clickSoundRef = useRef<HTMLAudioElement | null>(null)
  
  const pathname = usePathname();
  
  useEffect(() => {
    clickSoundRef.current = new Audio('/button.mp3'); 
    clickSoundRef.current.volume = 0.5;
  }, []);
  
  const playClickSound = () => {
    if (clickSoundRef.current) {
      clickSoundRef.current.currentTime = 0;
      clickSoundRef.current.play().catch(err => console.error("Audio playback error:", err));
    }
  };
  
  const menuItems = [
    { icon: <Home size={20} />, label: "Home", href: "/main" },
    { icon: <Newspaper size={20} />, label: "News", href: "/main/news" },
    { icon: <Users size={20} />, label: "Squad", href: "/main/squad" },
    { icon: <Workflow size={20} />, label: "Tactics", href: "/main/tactics" },
    { icon: <Trophy size={20} />, label: "Matches", href: "/main/matches" },
    { icon: <ShoppingBag size={20} />, label: "Transfers", href: "/main/transfers" },
    { icon: <Building size={20} />, label: "Club Info", href: "/main/club-info" },
    { icon: <Banknote size={20} />, label: "Finances", href: "/main/finances" }
  ]

  return (
    <div className={cn(
      "flex flex-col h-screen transition-all duration-300 ease-in-out bg-gradient-to-b from-gray-900 to-gray-800 text-white",
      collapsed ? "w-16" : "w-56"
    )}>
      {/* Header with logo */}
      <div className="p-4 border-b border-cyan-600 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center">
              <Image src="/ProClubs3.png" alt="Logo" className="w-8 h-8" width={24} height={24} />
            </div>
            <span className="font-bold text-lg tracking-tight">ProClubs3</span>
          </div>
        )}
        {collapsed && (
          <div className="mx-auto">
            <div className="w-8 h-8 rounded-full flex items-center justify-center">
              <Image src="/ProClubs3.png" alt="Logo" className="w-6 h-6" width={24} height={24} />
            </div>
          </div>
        )}
        <button 
          onClick={() => {
            playClickSound();
            setCollapsed(!collapsed);
          }} 
          className="w-6 h-6 rounded hover:bg-cyan-600 flex items-center justify-center"
        >
          <ChevronLeft size={16} className={cn("transition-transform", collapsed && "rotate-180")} />
        </button>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-cyan-600">
        <div className="space-y-1 px-2">
          {menuItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                href={item.href} 
                key={index} 
                onClick={playClickSound}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-sm cursor-pointer transition-all font-light",
                  isActive
                    ? "bg-cyan-600 shadow-md"
                    : "hover:bg-cyan-600/50 text-cyan-100"
                )}
              >
                <div
                  className={cn(
                    "flex items-center justify-center",
                    isActive ? "text-white" : "text-cyan-200"
                  )}
                >
                  {item.icon}
                </div>
                {!collapsed && (
                  <span
                    className={cn(
                      "font-medium text-sm whitespace-nowrap",
                      isActive ? "text-white" : "text-cyan-100"
                    )}
                  >
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer with next match */}
      <div className="mt-auto">
        {!collapsed && (
          <div className="px-4 py-2 text-xs text-cyan-300 text-center">
            <hr className="border-t border-cyan-600 m-1" />
            © 2025 ProClubs3
          </div>
        )}
      </div>
    </div>
  )
}