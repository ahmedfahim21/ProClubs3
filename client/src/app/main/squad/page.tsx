"use client"

import { useEffect, useState } from "react"
import { useWallet } from "@suiet/wallet-kit";
import { suiClient } from "@/utils/sui-client";
import { fetchBlobData } from "@/utils/blob";
import Image from "next/image";

interface IPlayer {
  name: string;
  position: string;
  nationality: string;
  age: number;
  defending: number;
  passing: number;
  shooting: number;
  dribbling: number;
  speed: number;
  physical: number;
  image_blob_id?: string;
  imageUrl?: string;
}

export default function SquadPage() {

  const [draggedPlayerIndex, setDraggedPlayerIndex] = useState<number | null>(null);
  const [dragOverPlayerIndex, setDragOverPlayerIndex] = useState<number | null>(null);
  const { account, address } = useWallet()
  const [loading, setLoading] = useState(false);
  const [playerIds, setPlayerIds] = useState<string[]>([]);
  const [players, setPlayers] = useState<IPlayer[]>([]);

  useEffect(() => {
    async function fetchOwnedObjects() {
      if (!account || !address) return;

      try {
        setLoading(true);

        // Query objects owned by the connected wallet
        const response = await suiClient.getOwnedObjects({
          owner: address,
          options: { showContent: false },
          // Optional filter by type
          filter: {
            MoveModule: {
              package: process.env.NEXT_PUBLIC_PACKAGE_ID || "0x1",
              module: "player",
            },
          },
        });

        const ids = response.data.map((player) => player.data?.objectId || "");
        setPlayerIds(ids);

      } catch (error) {
        console.error("Error fetching objects:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchOwnedObjects();
  }, [account, address]);

  useEffect(() => {
  async function fetchObjects() {
    if (!account || playerIds.length === 0) return;

    try {
      setLoading(true);

      const playerPromises = playerIds.map(async (playerId) => {
        const response = await suiClient.getObject({
          id: playerId,
          options: { showContent: true },
        });

        // @ts-expect-error handled
        const fields = response.data?.content?.fields;
        const imageBlobId = fields?.image_blob_id;

        let imageUrl = undefined;
        if (imageBlobId) {
          imageUrl = await fetchBlobData(imageBlobId);
        }

        return { ...fields, imageUrl } as IPlayer;
      });

      const playerObjects = await Promise.all(playerPromises);
      setPlayers(playerObjects);

    } catch (error) {
      console.error("Error fetching objects:", error);
    } finally {
      setLoading(false);
    }
  }

  fetchObjects();
}, [account, playerIds]);



  // Player drag and drop handlers
  const handleDragStart = (index: number) => {
    setDraggedPlayerIndex(index);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    setDragOverPlayerIndex(index);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();

    if (draggedPlayerIndex === null) return;

    const newPlayers = [...players];
    const draggedPlayer = newPlayers[draggedPlayerIndex];

    newPlayers.splice(draggedPlayerIndex, 1);

    newPlayers.splice(index, 0, draggedPlayer);

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
      {loading ? (
        <div className="flex items-center justify-center h-[80vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
      ) : (<>
        <div className="p-3 border-b border-gray-700 flex justify-between items-center">
          <div className="text-lg font-medium bg-cyan-500 bg-clip-text text-transparent">SQUAD</div>
          <div className="text-xs text-gray-400">Drag to reorder players</div>
        </div>

        <div className="flex text-xs p-3 border-b border-gray-700 bg-gray-900">
          <div className="w-4"></div>
          <div className="w-10 text-center">#</div>
          <div className="w-[70px]">POS</div>
          <div className="flex-1">PLAYER</div>
          <div className="w-20">AGE</div>
          <div className="w-40">NAT</div>
          <div className="w-32"></div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700">
          {players.slice(0, 11).map((player, index) => (
            <PlayerRow
              key={index}
              index={index}
              position={player.position}
              nationality={player.nationality}
              imageUrl={player.imageUrl}
              age={player.age}
              name={player.name}
              defending={player.defending}
              passing={player.passing}
              shooting={player.shooting}
              dribbling={player.dribbling}
              speed={player.speed}
              physical={player.physical}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onDragEnd={handleDragEnd}
              isDragging={index === draggedPlayerIndex}
              isDragOver={index === dragOverPlayerIndex}
            />
          ))}
        </div>
      </>)}
    </div>
  )
}

function PlayerRow({
  index,
  position,
  nationality,
  imageUrl,
  age,
  name,
  defending,
  passing,
  shooting,
  dribbling,
  speed,
  physical,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  isDragging,
  isDragOver,
}: IPlayer & {
  index: number
  onDragStart: (index: number) => void
  onDragOver: (e: React.DragEvent<HTMLDivElement>, index: number) => void
  onDrop: (e: React.DragEvent<HTMLDivElement>, index: number) => void
  onDragEnd: () => void
  isDragging: boolean
  isDragOver: boolean
}) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div
        className={`flex items-center p-3 border-b border-gray-700 hover:bg-gray-750 transition-colors duration-150 cursor-pointer
        ${isDragging ? "opacity-50 bg-gray-600" : ""} 
        ${isDragOver ? "bg-gray-700" : ""}`}
        draggable={true}
        onDragStart={() => onDragStart(index)}
        onDragOver={(e) => onDragOver(e, index)}
        onDrop={(e) => onDrop(e, index)}
        onDragEnd={onDragEnd}
        onClick={() => setShowModal(true)}
      >
        <div className="w-4 flex items-center">
          <div className="w-1 h-4 bg-cyan-500 rounded-full mr-2"></div>
        </div>
        <div className="w-10 text-center font-medium text-cyan-400">{index + 1}</div>
        <div className="w-[70px] uppercase text-xs font-semibold text-gray-300">{position}</div>
        <div className="flex items-center flex-1">
          {imageUrl ? (
            <div className="relative w-8 h-8 mr-3 rounded-full overflow-hidden border border-gray-600">
              <Image src={imageUrl} alt={name} className="object-cover" fill />
            </div>
          ) : (
            <div className="w-8 h-8 mr-3 bg-gray-700 rounded-full flex items-center justify-center text-xs">
              {name?.charAt(0) || '?'}
            </div>
          )}
          <span className="font-medium">{name}</span>
        </div>
        <div className="w-20 text-center text-gray-300">{age}</div>
        <div className="w-32 text-center text-gray-300">{nationality}</div>
        <div className="w-48 flex justify-center">
          <div className="px-3 py-2 text-xs font-semibold text-cyan-400 border border-cyan-500 hover:bg-cyan-500 hover:text-white transition-colors duration-150 rounded-md">
            View Stats
          </div>
        </div>
      </div>

      {showModal && (
        <PlayerStatsModal
          player={{
            name,
            position,
            nationality,
            age,
            defending,
            passing,
            shooting,
            dribbling,
            speed,
            physical,
            imageUrl
          }}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}

function PlayerStatsModal({ 
  player, 
  onClose 
}: { 
  player: IPlayer, 
  onClose: () => void 
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/70 " onClick={onClose}>
      <div className="bg-gray-800 border border-gray-700 rounded-lg w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-medium bg-cyan-500 bg-clip-text text-transparent">
            PLAYER DETAILS
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-5">
          <div className="flex items-center mb-6">
            {player.imageUrl ? (
              <div className="relative w-16 h-16 mr-4 rounded-full overflow-hidden border border-gray-600">
                <Image src={player.imageUrl} alt={player.name} className="object-cover" fill />
              </div>
            ) : (
              <div className="w-16 h-16 mr-4 bg-gray-700 rounded-full flex items-center justify-center text-2xl">
                {player.name?.charAt(0) || '?'}
              </div>
            )}
            <div>
              <h4 className="text-xl font-bold">{player.name}</h4>
              <div className="flex items-center text-sm text-gray-300">
                <span className="uppercase font-semibold text-cyan-400 mr-2">{player.position}</span>
                <span className="mr-2">•</span>
                <span>{player.nationality}</span>
                <span className="mx-2">•</span>
                <span>{player.age} yrs</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <StatBar label="DEFENDING" value={player.defending} />
            <StatBar label="PASSING" value={player.passing} />
            <StatBar label="SHOOTING" value={player.shooting} />
            <StatBar label="DRIBBLING" value={player.dribbling} />
            <StatBar label="SPEED" value={player.speed} />
            <StatBar label="PHYSICAL" value={player.physical} />
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBar({ label, value }: { label: string, value: number }) {
  return (
    <div className="flex flex-col">
      <div className="flex justify-between mb-1">
        <span className="text-xs text-gray-400">{label}</span>
        <span className="text-xs font-bold text-cyan-400">{value}</span>
      </div>
      <div className="h-2 bg-gray-700 rounded overflow-hidden">
        <div 
          className="h-full bg-cyan-500" 
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );
}
