"use client";

import { suiClient } from "@/utils/sui-client";
import { Transaction } from "@mysten/sui/transactions";
import { useWallet } from "@suiet/wallet-kit";
import { useEffect, useState } from "react";

type PlayerNFT = {
  id: { id: string };
  name: string;
  position: string;
  age: number;
  nationality: string;
  passing: number;
  defending: number;
  shooting: number;
  dribbling: number;
  physical: number;
  speed: number;
  image_blob_id: string;
};

type Listing = {
  name: {
    fields: {
      id: string;
      is_exclusive: boolean;
    };
  };
  value: string;
};

const KIOSK_ID = process.env.NEXT_PUBLIC_KIOSK_ID || "0x1";
const KIOSK_OWNER_CAP_ID = process.env.NEXT_PUBLIC_KIOSK_OWNER_CAP_ID || "0x1";

export default function TransfersPage() {
  const [loading, setLoading] = useState(false);
  const [playerData, setPlayerData] = useState<
    (PlayerNFT & { price: string | null })[]
  >([]);

  useEffect(() => {
    async function fetchListings() {
      if (!KIOSK_ID) return;
      setLoading(true);

      try {
        const { data: fields } = await suiClient.getDynamicFields({ parentId: KIOSK_ID });

        const objects = await Promise.all(
          fields.map((field: any) =>
            suiClient.getObject({ id: field.objectId, options: { showType: true, showContent: true } })
          )
        );

        console.log("Fetched objects:", objects);

        const players: Record<string, PlayerNFT> = {};
        const listings: Record<string, Listing> = {};

        for (const obj of objects) {
          const content = obj.data?.content;
          if (!content) continue;

          const { type, fields } = content;

          if (type.includes("::player::PlayerNFT")) {
            players[fields.id.id] = fields;
          } else if (type.includes("::kiosk::Listing")) {
            const playerId = fields.name.fields.id;
            listings[playerId] = fields;
          }
        }

        const combined = Object.values(players).map((player) => ({
          ...player,
          price: listings[player.id.id]?.value || null,
        }));

        setPlayerData(combined);
      } catch (err) {
        console.error("Error fetching listings:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchListings();
  }, [KIOSK_ID]);

  return (
    <div className="flex flex-col h-full w-full bg-gray-950 text-gray-100 font-sans p-6 gap-6">
      <h1 className="text-3xl font-bold text-cyan-500">Transfers</h1>

      {loading ? (
        <div className="flex items-center justify-center h-[80vh]">
          <p className="text-gray-400">Loading...</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {playerData.map((player, index) => (
            <PlayerCard player={player} key={index} />
          ))}
        </div>
      )}
    </div>
  );
}

function PlayerCard({ player }: { player: PlayerNFT & { price: string | null } }) {

  const { signAndExecuteTransaction } = useWallet();

  const handleBuy = async (id: string) => {
    try {
      const tx = new Transaction();

      tx.moveCall({
        target: "0x1::kiosk::buy_player",
        arguments: [
          tx.object(KIOSK_ID),
          tx.object(id),
          tx.object("0x2"),
          tx.object(KIOSK_OWNER_CAP_ID),
        ],
      });

      const result = await signAndExecuteTransaction({
        transaction: tx,
      });

      console.log("Transaction result:", result);
    } catch (error) {
      console.error("Error buying player:", error);
    }
  };



  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-5 rounded-xl border border-gray-700 hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-white">{player.name}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="bg-cyan-500/20 text-cyan-400 text-xs px-2 py-0.5 rounded-full">{player.position}</span>
            <span className="text-gray-400 text-xs">{player.nationality}</span>
            <span className="text-gray-400 text-xs">Age: {player.age}</span>
          </div>
        </div>
        {player.price && (
          <span className="bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-lg font-bold">
            {player.price} SUI
          </span>
        )}
      </div>
      
      <div className="mt-5 grid grid-cols-2 gap-2">
        {[
          { label: "Shooting", value: player.shooting },
          { label: "Passing", value: player.passing },
          { label: "Speed", value: player.speed },
          { label: "Physical", value: player.physical },
          { label: "Dribbling", value: player.dribbling },
          { label: "Defending", value: player.defending }
        ].map((stat) => (
          <div key={stat.label} className="bg-gray-800/50 rounded-lg p-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-400">{stat.label}</span>
              <span className="text-sm font-medium">{stat.value}</span>
            </div>
            <div className="h-1.5 w-full bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" 
                style={{ width: `${stat.value * 10}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      
      {!player.price && (
        <div className="mt-4 flex justify-center">
          <span className="bg-gray-700/50 text-gray-400 px-3 py-1 rounded-lg text-sm">
            Not listed for sale
          </span>
        </div>
      )}

      <div className="mt-4 flex justify-center">
        <button className="bg-cyan-500 text-white px-4 py-2 hover:bg-cyan-600 transition-all duration-300"
          onClick={() => handleBuy(player.id.id)}>
          Buy NFT
        </button>
      </div>

    </div>
  );
}
