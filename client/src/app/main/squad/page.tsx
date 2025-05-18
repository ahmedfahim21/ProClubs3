"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { Info, ChevronRight, Flag, Award, Activity, Heart, Zap, Shield, X, Users, LineChart, Calendar, Clock } from "lucide-react"

type Player = {
  id: number
  name: string
  position: string
  role: string
  duty: string
  nationality: string
  age: number
  number: number
  stars: number
  condition: number
  fitness: number
  photo: string
  bio: string
  stats: Record<string, number>
}

const players: Player[] = [
  {
    id: 1,
    name: "André Onana",
    position: "GK",
    role: "Sweeper Keeper",
    duty: "Attack",
    nationality: "Cameroon",
    age: 23,
    number: 24,
    stars: 4,
    condition: 95,
    fitness: 92,
    photo: "/api/placeholder/60/60",
    bio: "A commanding presence in goal, Onana is known for his reflexes and distribution. His ability to play with his feet makes him a perfect fit for the sweeper keeper role, allowing the team to build attacks from the back. Joined from Ajax in 2023 and quickly established himself as first choice.",
    stats: {
      appearances: 34,
      cleanSheets: 15,
      saves: 120,
      yellowCards: 2,
      redCards: 0,
      minutesPlayed: 3060,
      passAccuracy: 87,
      commandOfArea: 16
    },
  },
  {
    id: 2,
    name: "N. Mazraoui",
    position: "DR",
    role: "Wing-Back",
    duty: "Support",
    nationality: "Morocco",
    age: 21,
    number: 12,
    stars: 3,
    condition: 95,
    fitness: 93,
    photo: "/api/placeholder/60/60",
    bio: "Energetic and technical, Mazraoui offers width and creativity from the right. His crossing ability combined with stamina allows him to contribute both defensively and in attack. Product of the Ajax academy before making the move to strengthen our defensive options.",
    stats: {
      appearances: 30,
      assists: 5,
      tackles: 60,
      yellowCards: 3,
      redCards: 0,
      minutesPlayed: 2430,
      crossingAccuracy: 76,
      interceptions: 42,
      keyPasses: 23
    },
  },
  // ...add more players as needed
]

// Function to get position color
const getPositionColor = (position: string) => {
  const posMap: Record<string, string> = {
    'GK': 'bg-yellow-600',
    'DR': 'bg-blue-600',
    'DC': 'bg-blue-800',
    'DL': 'bg-blue-600',
    'MR': 'bg-green-600',
    'MC': 'bg-green-800',
    'ML': 'bg-green-600',
    'AMR': 'bg-purple-600',
    'AMC': 'bg-purple-800',
    'AML': 'bg-purple-600',
    'ST': 'bg-red-600',
    'CF': 'bg-red-800',
  };
  return posMap[position] || 'bg-gray-600';
};

// Function to format stat names
const formatStatName = (name: string) => {
  return name
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .replace(/Accuracy/g, ' Acc.')
    .replace(/Minutes Played/g, 'Mins')
    .replace(/Clean Sheets/g, 'Clean Sh.')
    .replace(/Yellow Cards/g, 'YC')
    .replace(/Red Cards/g, 'RC')
    .replace(/Command Of Area/g, 'Command')
    .replace(/Key Passes/g, 'Key P.');
};

// Function to get stat icon
const getStatIcon = (statName: string) => {
  const statIcons: Record<string, JSX.Element> = {
    appearances: <Calendar className="h-4 w-4" />,
    cleanSheets: <Shield className="h-4 w-4" />,
    saves: <Shield className="h-4 w-4" />,
    yellowCards: <span className="h-3 w-3 bg-yellow-400 rounded" />,
    redCards: <span className="h-3 w-3 bg-red-500 rounded" />,
    assists: <Award className="h-4 w-4" />,
    tackles: <Shield className="h-4 w-4" />,
    minutesPlayed: <Clock className="h-4 w-4" />,
    passAccuracy: <Activity className="h-4 w-4" />,
    crossingAccuracy: <Activity className="h-4 w-4" />,
    interceptions: <Shield className="h-4 w-4" />,
    keyPasses: <Activity className="h-4 w-4" />,
    commandOfArea: <Award className="h-4 w-4" />
  };
  
  return statIcons[statName] || <Info className="h-4 w-4" />;
};

export default function SquadPage() {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState("all")

  const handlePlayerClick = (player: Player) => {
    setSelectedPlayer(player)
    setOpen(true)
  }

  const filteredPlayers = filter === "all" ? players : players.filter(player => {
    if (filter === "gk") return player.position === "GK";
    if (filter === "def") return ["DR", "DC", "DL"].includes(player.position);
    if (filter === "mid") return ["MR", "MC", "ML", "AMR", "AMC", "AML"].includes(player.position);
    if (filter === "att") return ["ST", "CF"].includes(player.position);
    return true;
  });

  // Function to render condition/fitness bars with labels
  const renderProgressBar = (value: number, label: string, color: string) => (
    <div className="flex items-center gap-3 w-full">
      <div className="text-xs text-gray-300 font-medium min-w-8">{label}</div>
      <div className="h-2 w-full rounded-full bg-gray-800">
        <div
          className={`h-2 rounded-full ${color}`}
          style={{ width: `${value}%` }}
        ></div>
      </div>
      <div className="text-xs font-medium text-gray-100 min-w-8">{value}%</div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen w-full bg-gray-950 text-gray-100 font-sans">
      {/* Header with tabs */}
      <div className="bg-gray-900 text-white p-4 flex flex-col border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-green-400 tracking-tight flex items-center">
            <Users className="h-6 w-6 mr-2" />
            Squad Management
          </div>
          <div className="flex items-center space-x-2">
            <div className="bg-gray-800 px-3 py-1 rounded-md text-sm font-medium flex items-center">
              <LineChart className="h-4 w-4 mr-1 text-green-400" />
              <span className="text-gray-400">Season 2024/25</span>
            </div>
          </div>
        </div>
        
        {/* Filter tabs */}
        <div className="flex mt-4 space-x-1 border-b border-gray-800">
          <button 
            onClick={() => setFilter("all")}
            className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors ${filter === "all" ? "bg-gray-800 text-green-400" : "text-gray-400 hover:text-white hover:bg-gray-800/50"}`}
          >
            All Players
          </button>
          <button 
            onClick={() => setFilter("gk")}
            className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors ${filter === "gk" ? "bg-gray-800 text-yellow-400" : "text-gray-400 hover:text-white hover:bg-gray-800/50"}`}
          >
            Goalkeepers
          </button>
          <button 
            onClick={() => setFilter("def")}
            className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors ${filter === "def" ? "bg-gray-800 text-blue-400" : "text-gray-400 hover:text-white hover:bg-gray-800/50"}`}
          >
            Defenders
          </button>
          <button 
            onClick={() => setFilter("mid")}
            className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors ${filter === "mid" ? "bg-gray-800 text-green-400" : "text-gray-400 hover:text-white hover:bg-gray-800/50"}`}
          >
            Midfielders
          </button>
          <button 
            onClick={() => setFilter("att")}
            className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors ${filter === "att" ? "bg-gray-800 text-red-400" : "text-gray-400 hover:text-white hover:bg-gray-800/50"}`}
          >
            Attackers
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 gap-4">
            {filteredPlayers.map((player) => (
              <div
                key={player.id}
                className={cn(
                  "flex flex-col md:flex-row items-center p-4 bg-gray-900/50 hover:bg-gray-800 transition-colors cursor-pointer group rounded-xl border border-gray-800 hover:border-green-500/50 relative overflow-hidden",
                  selectedPlayer?.id === player.id && "border-green-500 bg-gray-800/80 shadow-lg shadow-green-900/20"
                )}
                onClick={() => handlePlayerClick(player)}
              >
                {/* Position indicator */}
                <div className={`absolute top-0 left-0 w-2 h-full ${getPositionColor(player.position)}`}></div>
                
                <div className="flex items-center w-full md:w-auto">
                  <div className="relative">
                    <img 
                      src={player.photo} 
                      alt={player.name} 
                      className="h-16 w-16 rounded-lg border-2 border-gray-700 group-hover:border-green-400 transition shadow-lg" 
                    />
                    <div className="absolute -bottom-2 -right-2 bg-gray-900 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold border border-gray-700">
                      {player.number}
                    </div>
                  </div>
                  
                  <div className="ml-4 flex-1">
                    <div className="flex items-center">
                      <div className={`px-2 py-1 text-xs font-bold rounded mr-2 ${getPositionColor(player.position)} text-white`}>
                        {player.position}
                      </div>
                      <div className="text-lg font-bold text-white">{player.name}</div>
                    </div>
                    
                    <div className="text-sm text-gray-300 mt-1 flex items-center">
                      <span className="font-medium">{player.role}</span>
                      <span className="mx-1">·</span>
                      <span className="text-green-400 font-medium">{player.duty}</span>
                    </div>
                    
                    <div className="flex items-center mt-2 space-x-2">
                      <div className="text-xs bg-gray-800 px-2 py-1 rounded-md flex items-center">
                        <Flag className="h-3 w-3 mr-1" />
                        {player.nationality}
                      </div>
                      <div className="text-xs bg-gray-800 px-2 py-1 rounded-md flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {player.age} yrs
                      </div>
                      <div className="flex text-yellow-400 ml-1">
                        {Array(5).fill(0).map((_, i) => (
                          <span key={i} className="text-sm">{i < player.stars ? "★" : "☆"}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 md:mt-0 md:ml-auto flex flex-col space-y-2 w-full md:w-72 max-w-sm">
                  {renderProgressBar(player.fitness, "FITNESS", player.fitness >= 90 ? "bg-green-500" : player.fitness >= 75 ? "bg-yellow-500" : "bg-red-500")}
                  {renderProgressBar(player.condition, "CONDITION", player.condition >= 90 ? "bg-green-500" : player.condition >= 75 ? "bg-yellow-500" : "bg-red-500")}
                </div>
                
                <ChevronRight className="hidden md:block h-5 w-5 text-gray-500 group-hover:text-green-400 ml-4 transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Player Detail Sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="max-w-xl w-full bg-gray-950 border-l border-gray-800 p-0 overflow-y-auto">
          {selectedPlayer && (
            <>
              <div className="sticky top-0 z-10 bg-gray-950/95 backdrop-blur-md border-b border-gray-800">
                <SheetHeader className="p-6 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="relative">
                        <div className={`absolute inset-0 rounded-xl ${getPositionColor(selectedPlayer.position)} opacity-20 blur-md`}></div>
                        <img 
                          src={selectedPlayer.photo} 
                          alt={selectedPlayer.name} 
                          className="h-24 w-24 rounded-xl border-2 border-green-500/40 shadow-lg relative z-10" 
                        />
                        <div className="absolute -bottom-2 -right-2 bg-gray-900 text-white text-sm rounded-full w-8 h-8 flex items-center justify-center font-bold border border-gray-700 shadow-md z-20">
                          {selectedPlayer.number}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <div className={`px-2 py-1 text-xs font-bold rounded mr-2 ${getPositionColor(selectedPlayer.position)} text-white`}>
                            {selectedPlayer.position}
                          </div>
                          <SheetTitle className="text-2xl text-green-400 font-bold">{selectedPlayer.name}</SheetTitle>
                        </div>
                        <div className="text-gray-300 mt-1 flex items-center text-sm">
                          <span className="font-medium">{selectedPlayer.role}</span>
                          <span className="mx-1">·</span>
                          <span className="text-green-400 font-medium">{selectedPlayer.duty}</span>
                        </div>
                        <div className="flex items-center mt-2 space-x-2">
                          <div className="text-xs bg-gray-800 px-2 py-1 rounded-md flex items-center">
                            <Flag className="h-3 w-3 mr-1" />
                            {selectedPlayer.nationality}
                          </div>
                          <div className="text-xs bg-gray-800 px-2 py-1 rounded-md flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {selectedPlayer.age} yrs
                          </div>
                          <div className="flex text-yellow-400">
                            {Array(5).fill(0).map((_, i) => (
                              <span key={i} className="text-sm">{i < selectedPlayer.stars ? "★" : "☆"}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <SheetClose asChild>
                      <button className="p-2 rounded-full hover:bg-gray-800 transition-colors">
                        <X className="h-5 w-5 text-gray-400" />
                      </button>
                    </SheetClose>
                  </div>
                </SheetHeader>
              </div>
              
              <div className="px-6 py-4">
                {/* Player Status */}
                <div className="flex flex-col space-y-3 mb-6 bg-gray-900 p-4 rounded-xl border border-gray-800">
                  <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-1">Player Status</h3>
                  {renderProgressBar(selectedPlayer.fitness, "FITNESS", selectedPlayer.fitness >= 90 ? "bg-green-500" : selectedPlayer.fitness >= 75 ? "bg-yellow-500" : "bg-red-500")}
                  {renderProgressBar(selectedPlayer.condition, "CONDITION", selectedPlayer.condition >= 90 ? "bg-green-500" : selectedPlayer.condition >= 75 ? "bg-yellow-500" : "bg-red-500")}
                </div>
                
                {/* Player Bio */}
                <div className="mb-6 bg-gray-900 p-4 rounded-xl border border-gray-800">
                  <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">Player Profile</h3>
                  <SheetDescription className="text-base text-gray-300 leading-relaxed">{selectedPlayer.bio}</SheetDescription>
                </div>
                
                {/* Player Stats */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">Season Statistics</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedPlayer.stats && Object.entries(selectedPlayer.stats).map(([key, value]) => (
                      <div key={key} className="bg-gray-900 rounded-lg p-4 flex items-center border border-gray-800 hover:border-green-900/50 hover:bg-gray-800/50 transition-colors group">
                        <div className="w-8 h-8 rounded-md bg-gray-800 flex items-center justify-center mr-3 group-hover:bg-green-900/30 transition-colors">
                          {getStatIcon(key)}
                        </div>
                        <div className="flex-1">
                          <div className="text-xs text-gray-400">{formatStatName(key)}</div>
                          <div className="text-xl font-bold text-white">{value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Additional sections could be added here */}
                <div className="bg-gray-900 p-4 rounded-xl border border-gray-800 mb-6">
                  <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">Player Form</h3>
                  <div className="flex items-center space-x-1 h-8">
                    {/* Form indicators: W, D, L */}
                    <div className="w-7 h-7 rounded-md bg-green-600 flex items-center justify-center text-xs font-bold text-white">W</div>
                    <div className="w-7 h-7 rounded-md bg-green-600 flex items-center justify-center text-xs font-bold text-white">W</div>
                    <div className="w-7 h-7 rounded-md bg-yellow-600 flex items-center justify-center text-xs font-bold text-white">D</div>
                    <div className="w-7 h-7 rounded-md bg-green-600 flex items-center justify-center text-xs font-bold text-white">W</div>
                    <div className="w-7 h-7 rounded-md bg-red-600 flex items-center justify-center text-xs font-bold text-white">L</div>
                  </div>
                </div>
                
                <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
                  <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">Contract Details</h3>
                  <div className="grid grid-cols-2 gap-y-3 text-sm">
                    <div>
                      <span className="text-gray-400">Joined Club:</span>
                      <span className="text-white ml-2">Jun 2023</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Contract Until:</span>
                      <span className="text-white ml-2">Jun 2027</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Weekly Wage:</span>
                      <span className="text-white ml-2">£65,000</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Release Clause:</span>
                      <span className="text-white ml-2">£42.5M</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}