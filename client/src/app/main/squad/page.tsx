"use client"

import { useState } from "react"
import { ModernPlayerRow } from "../tactics/page"
import { PLAYERS } from "@/utils/constants"


export default function SquadPage() {

  const [players, setPlayers] = useState(PLAYERS);
  const [draggedPlayerIndex, setDraggedPlayerIndex] = useState(null);
  const [dragOverPlayerIndex, setDragOverPlayerIndex] = useState(null);

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
  };

  const handleDragEnd = () => {
    setDraggedPlayerIndex(null);
    setDragOverPlayerIndex(null);
  };


  return (
    <div className="w-full bg-gray-800 border-l border-gray-700 flex flex-col text-white">
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
  )
}