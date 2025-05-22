"use client"

import { useEffect, useState } from "react"
import {
  ChevronDown,
  Save,
  Check,
  RotateCcw,
  GripVertical
} from "lucide-react"
import { FORMATIONS, PLAYING_STYLES, PLAYERS } from "@/utils/constants";
import { Transaction } from "@mysten/sui/transactions";
import { useSuiClient, useWallet } from "@suiet/wallet-kit";

export default function FootballManager() {
  // State for selected formation and playing style
  const [formation, setFormation] = useState("4-2-3-1 Wide");
  const [playingStyle, setPlayingStyle] = useState("Gegenpress");
  const [showFormationDropdown, setShowFormationDropdown] = useState(false);
  const [showStyleDropdown, setShowStyleDropdown] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const { address } = useWallet();

  // Player swap functionality
  const [players, setPlayers] = useState(PLAYERS);
  const [draggedPlayerIndex, setDraggedPlayerIndex] = useState(null);
  const [dragOverPlayerIndex, setDragOverPlayerIndex] = useState(null);

  const [clubId, setClubId] = useState<string | null>(null);
  const { signTransaction } = useWallet();
  const suiClient = useSuiClient();

  useEffect(() => {
    const storedClubId = localStorage.getItem("clubId");
    if (storedClubId) {
      setClubId(storedClubId);
      console.log("Retrieved clubId from localStorage:", storedClubId);
    }
  }, []);

  // Get the positions for the current formation
  const currentFormationPositions = FORMATIONS[formation].positions;
  const currentStyle = PLAYING_STYLES[playingStyle];

  // Player drag and drop handlers
  const handleDragStart = (index) => {
    setDraggedPlayerIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    setDragOverPlayerIndex(index);
  };

  const handleDrop = (e, index) => {
    e.preventDefault();

    if (draggedPlayerIndex === null) return;

    // Create a new array with the players in the new order
    const newPlayers = [...players];
    const draggedPlayer = newPlayers[draggedPlayerIndex];

    // Remove the dragged player from the array
    newPlayers.splice(draggedPlayerIndex, 1);

    // Insert the dragged player at the new position
    newPlayers.splice(index, 0, draggedPlayer);

    // Update the state
    setPlayers(newPlayers);
    setDraggedPlayerIndex(null);
    setDragOverPlayerIndex(null);
    setUnsavedChanges(true);
  };

  const handleDragEnd = () => {
    setDraggedPlayerIndex(null);
    setDragOverPlayerIndex(null);
  };

  // Helper function to map position coordinates to actual CSS classes
  const getPositionClasses = (x, y) => {
    const xClasses = {
      "left": "left-[10%]",
      "left-center": "left-[20%]",
      "center-left": "left-[30%]",
      "center": "left-1/2 -translate-x-1/2",
      "center-right": "right-[30%]",
      "right-center": "right-[20%]",
      "right": "right-[10%]"
    };

    const yClasses = {
      "bottom": "bottom-[5%]",
      "defense": "bottom-[20%]",
      "def-mid": "bottom-[35%]",
      "midfield": "bottom-[50%]",
      "attack-mid": "bottom-[65%]",
      "attack": "bottom-[75%]",
      "top": "top-[10%]"
    };

    return `${xClasses[x]} ${yClasses[y]}`;
  };

  const handleSaveTactic = async () => {
    if (!clubId || !address) {
      console.error("Club ID is not set.");
      return;
    }

    setUnsavedChanges(false);
    setShowSaveConfirmation(true);

    const txb = new Transaction();
    txb.moveCall({
      target: `${process.env.NEXT_PUBLIC_PACKAGE_ID}::club::update_tactics`,
      arguments: [
        txb.object(clubId),
        txb.pure.string(formation),
        txb.pure.string(playingStyle)
      ],
    });

    txb.setSender(address);

    const txBytes = await txb.build({ client: suiClient });

    const response = await fetch('/api/sponsor-tx', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ txBytes: Array.from(txBytes), sender: address }),
    });
    const { sponsoredTxBytes, sponsorSignature } = await response.json();

    console.log("Sponsored transaction bytes:", txBytes);

    const userSignature = await signTransaction({ transaction: sponsoredTxBytes });

    console.log("User signature:", userSignature, sponsorSignature);

    await suiClient.executeTransactionBlock({
      transactionBlock: sponsoredTxBytes,
      signature: [userSignature.signature, sponsorSignature],
    });

  }



  return (
    <div className="flex h-[92vh] w-full overflow-auto bg-gray-900 text-gray-100 font-sans">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Main Tactics Area */}
        <div className="flex-1 flex h-full">
          {/* Left Tactics Panel */}
          <div className="w-[300px] bg-gray-800 border-r border-gray-700 flex flex-col p-4">
            <div className="flex items-center justify-between mb-6">
              <div className="text-xl font-medium bg-cyan-500 bg-clip-text text-transparent">TACTICS</div>
              <div className="relative">
                <button
                  className="text-sm bg-gray-700 hover:bg-gray-600 transition-colors px-3 py-1 rounded-md flex items-center"
                  onClick={() => setShowFormationDropdown(!showFormationDropdown)}
                >
                  <span>{formation}</span>
                  <ChevronDown className="h-4 w-4 ml-1" />
                </button>

                {showFormationDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-gray-800 shadow-lg rounded-md overflow-hidden z-20">
                    {Object.keys(FORMATIONS).map((form) => (
                      <button
                        key={form}
                        className="w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors flex items-center"
                        onClick={() => {
                          setFormation(form);
                          setShowFormationDropdown(false);
                          setUnsavedChanges(true);
                        }}
                      >
                        {form === formation && <Check className="h-4 w-4 mr-2 text-cyan-400" />}
                        <span>{form}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-900 rounded-md p-4 mb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="relative">
                  <button
                    className="text-lg font-medium uppercase flex items-center"
                    onClick={() => setShowStyleDropdown(!showStyleDropdown)}
                  >
                    {playingStyle}
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </button>

                  {showStyleDropdown && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-gray-800 shadow-lg rounded-md overflow-hidden z-20">
                      {Object.keys(PLAYING_STYLES).map((style) => (
                        <button
                          key={style}
                          className="w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors flex items-center"
                          onClick={() => {
                            setPlayingStyle(style);
                            setShowStyleDropdown(false);
                            setUnsavedChanges(true);
                          }}
                        >
                          {style === playingStyle && <Check className="h-4 w-4 mr-2 text-cyan-400" />}
                          <span>{style}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="text-sm">MENTALITY</div>
                <div className="flex items-center">
                  <div className={`h-2 w-2 ${getMentalityColor(currentStyle.mentality)} rounded-full mr-1`}></div>
                  <div className="text-sm">{currentStyle.mentality}</div>
                </div>
              </div>

              <div className="mb-4 border-t border-gray-700 pt-4">
                <div className="flex items-center mb-2">
                  <div className="text-sm font-medium">POSSESSION</div>
                </div>
                <div className="pl-3 text-xs space-y-1 text-gray-300">
                  {currentStyle.possession.map((item, index) => (
                    <div key={`possession-${index}`}>• {item}</div>
                  ))}
                </div>
              </div>

              <div className="mb-4 border-t border-gray-700 pt-4">
                <div className="flex items-center mb-2">
                  <div className="text-sm font-medium">TRANSITION</div>
                </div>
                <div className="pl-3 text-xs space-y-1 text-gray-300">
                  {currentStyle.transition.map((item, index) => (
                    <div key={`transition-${index}`}>• {item}</div>
                  ))}
                </div>
              </div>

              <div className="mb-2 border-t border-gray-700 pt-4">
                <div className="flex items-center mb-2">
                  <div className="text-sm font-medium">DEFENSE</div>
                </div>
                <div className="pl-3 text-xs space-y-1 text-gray-300">
                  {currentStyle.defense.map((item, index) => (
                    <div key={`defense-${index}`}>• {item}</div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-auto">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs text-gray-400 flex items-center">
                  {unsavedChanges && (
                    <>
                      <div className="h-2 w-2 bg-yellow-500 rounded-full mr-1"></div>
                      <span>Unsaved changes</span>
                    </>
                  )}
                </div>
                <button
                  className="text-sm bg-gray-700 hover:bg-gray-600 transition-colors px-3 py-1 rounded flex items-center"
                  onClick={() => {
                    setFormation("4-2-3-1 Wide");
                    setPlayingStyle("Gegenpress");
                    setPlayers(PLAYERS);
                    setUnsavedChanges(true);
                  }}
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Reset
                </button>
              </div>

              <button
                className={`w-full text-sm ${unsavedChanges ? 'bg-cyan-700 hover:bg-cyan-600' : 'bg-gray-700 hover:bg-gray-600'} transition-colors px-3 py-2 flex items-center justify-center`}
                onClick={handleSaveTactic}
              >
                <Save className="h-4 w-4 mr-2" />
                <span>Save Tactic</span>
              </button>

              {showSaveConfirmation && (
                <div className="mt-2 text-xs text-center py-1 bg-cyan-800 bg-opacity-50 rounded">
                  <span className="flex items-center justify-center">
                    <Check className="h-3 w-3 mr-1 text-cyan-400" />
                    Tactic saved successfully
                  </span>
                </div>
              )}
            </div>
          </div>


          {/* Middle Pitch View */}
          <div className="w-[500px] bg-gray-800 border-l border-gray-700 flex flex-col">
            <div className="p-3 border-b border-gray-700 flex justify-between items-center">
              <div className="text-lg font-medium bg-cyan-500 bg-clip-text text-transparent">SQUAD</div>
              <div className="text-xs text-gray-400">Drag to reorder players</div>
            </div>

            <div className="flex text-xs p-3 border-b border-gray-700 bg-gray-900">
              <div className="w-4"></div>
              <div className="w-10 text-center">#</div>
              <div className="w-[70px]">POS</div>
              <div className="flex-1">PLAYER</div>
              <div className="w-14">RATING</div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700">
              {players.slice(0, 11).map((player, index) => (
                <ModernPlayerRow
                  key={`player-${index}`}
                  index={index}
                  number={player.number}
                  position={player.position}
                  stars={player.stars}
                  name={player.name}
                  isStarter={true}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onDragEnd={handleDragEnd}
                  isDragging={index === draggedPlayerIndex}
                  isDragOver={index === dragOverPlayerIndex}
                />
              ))}

              <div className="mt-2 px-3 py-2 bg-gray-900 text-sm font-medium">SUBSTITUTES & RESERVES</div>

              {players.slice(11).map((player, index) => (
                <ModernPlayerRow
                  key={`sub-${index}`}
                  index={index + 11}
                  number={player.number}
                  position={player.position}
                  stars={player.stars}
                  name={player.name}
                  isStarter={false}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onDragEnd={handleDragEnd}
                  isDragging={index + 11 === draggedPlayerIndex}
                  isDragOver={index + 11 === dragOverPlayerIndex}
                />
              ))}
            </div>
          </div>


          {/* Right Player Panel */}
          <div className="flex-1 bg-green-900 relative overflow-hidden h-full m-2 my-auto">

            {/* Pitch markings */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 border-2 border-white border-opacity-20 rounded-md m-4"></div>
              <div className="absolute inset-0 flex flex-col">
                <div className="w-full h-1/2 border-b border-white border-opacity-30"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-white border-opacity-30"></div>
                <div className="absolute top-0 left-1/4 right-1/4 h-20 border-b border-l border-r border-white border-opacity-30"></div>
                <div className="absolute bottom-0 left-1/4 right-1/4 h-20 border-t border-l border-r border-white border-opacity-30"></div>

                {/* Center spot */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>

                {/* Subtle grass pattern */}
                <div className="absolute inset-0 bg-gradient-to-b from-green-800 to-green-900 opacity-30 mix-blend-overlay"></div>
                <div className="absolute inset-0" style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(255,255,255,0.03) 20px, rgba(255,255,255,0.03) 40px)'
                }}></div>
              </div>
            </div>

            {/* Player positions */}
            <div className="h-full relative z-10">
              {currentFormationPositions.map((pos, index) => {
                const player = players[index] || { number: '?', name: 'Unknown', role: 'NA', duty: 'Su' };
                return (
                  <div
                    key={`position-${index}`}
                    className={`absolute ${getPositionClasses(pos.x, pos.y)}`}
                  >
                    <PlayerPosition
                      number={player.number}
                      position={player.position}
                      name={player.name}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function getMentalityColor(mentality) {
  switch (mentality) {
    case "Very Defensive": return "bg-blue-800";
    case "Defensive": return "bg-blue-600";
    case "Cautious": return "bg-blue-400";
    case "Balanced": return "bg-green-500";
    case "Positive": return "bg-yellow-500";
    case "Attacking": return "bg-orange-500";
    case "Very Attacking": return "bg-red-600";
    default: return "bg-green-500";
  }
}

function PlayerPosition({ number, position, name }) {
  return (
    <div className="group">
      <div className="relative mx-auto justify-center items-center flex">
        <div className="w-12 h-12 bg-gray-800 bg-opacity-80 backdrop-blur-sm rounded-full border-2 border-white flex items-center justify-center text-white font-bold transform transition-transform group-hover:scale-110">
          {number}
        </div>
      </div>
      <div className="mt-1 text-white text-xs px-2 py-1 text-center bg-black bg-opacity-70 backdrop-blur-sm rounded-md invisible group-hover:visible transition-opacity">
        <div className="font-bold">{name}</div>
        <div className="text-gray-400 text-xs">{position}</div>
      </div>
    </div>
  )
}

export function ModernPlayerRow({
  index,
  number,
  position,
  stars,
  name,
  isStarter,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  isDragging,
  isDragOver
}) {
  return (
    <div
      className={`flex items-center text-sm py-2 px-3 border-b border-gray-700 hover:bg-gray-700 transition-colors cursor-move
        ${isStarter ? '' : 'opacity-80'}
        ${isDragging ? 'opacity-50 bg-gray-600' : ''}
        ${isDragOver ? 'border-t-2 border-cyan-400' : ''}
      `}
      draggable={true}
      onDragStart={() => onDragStart(index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDrop={(e) => onDrop(e, index)}
      onDragEnd={onDragEnd}
    >
      <div className="w-4 mr-1 text-gray-500 flex items-center">
        <GripVertical size={14} />
      </div>
      <div className="w-8 text-right mr-2 font-medium text-sm">{number}</div>
      <div className="w-[70px] text-gray-400 text-sm">{position}</div>
      <div className="w-66 flex items-center">
        {name}
      </div>
      <div className="w-10 flex">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <div key={i} className={i < stars ? "text-cyan-300" : "text-gray-600"}>
              ★
            </div>
          ))}
      </div>
    </div>
  )
}