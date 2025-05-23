"use client"

import { Button } from "@/components/ui/button";
import { fetchBlobData } from "@/utils/blob";
import { suiClient } from "@/utils/sui-client";
import { BuildingIcon, LocationEdit } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface IClub {
  fields: {
    name: string;
    location: string;
    stadium: string;
    matches_played: number;
    matches_won: number;
    matches_drawn: number;
    matches_lost: number;
    goals_scored: number;
    goals_conceded: number;
    primary_color: string;
    secondary_color: string;
  };
  logoUrl?: string;
  id?: string;
}

const AIClub = {
  fields: {
    name: "ProCoins FC",
    location: "AI Realm",
    stadium: "AI Arena",
    matches_played: 100,
    matches_won: 50,
    matches_drawn: 0,
    matches_lost: 50,
    goals_scored: 50,
    goals_conceded: 50,
  },
  logoUrl: "https://ahmedfahim.vercel.app/ProCoin.png",
  id: "0x1",
};

export default function CompetitionsPage() {
  const router = useRouter();
  const REGISTRY_OBJECT_ID = process.env.NEXT_PUBLIC_REGISTRY_OBJECT_ID || "0x1";
  const [clubs, setClubs] = useState<IClub[]>([]);
  const [clubId, setClubId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedClubId = localStorage.getItem("clubId");
    if (storedClubId) {
      setClubId(storedClubId);
      console.log("Retrieved clubId from localStorage:", storedClubId);
    } else {
      console.log("No club ID found in localStorage");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!clubId) return;

    async function fetchOtherClubs(ownClubId: string) {
      try {
        const registryObject = await suiClient.getObject({
          id: REGISTRY_OBJECT_ID,
          options: {
            showContent: true,
          }
        });

        // @ts-expect-error handled
        const clubIds = registryObject.data?.content?.fields?.clubs || [];
        const otherClubIds = clubIds.filter((id: string) => id !== ownClubId);

        const clubDataPromises = otherClubIds.map(async (id: string) => {
          try {
            const response = await suiClient.getObject({
              id: id,
              options: { showContent: true },
            });

            const clubContent = response.data?.content;
            if (clubContent) {
              try {
                // @ts-expect-error handled
                const logoBlobId = clubContent.fields?.logo_blob_id;
                if (logoBlobId) {
                  const logoUrl = await fetchBlobData(logoBlobId);
                  return { ...clubContent, logoUrl , id };
                }
              } catch (err) {
                console.error(`Error fetching logo for club ${id}:`, err);
              }
            }
            return clubContent;
          } catch (error) {
            console.error(`Error fetching club ${id}:`, error);
            return null;
          }
        });

        const fetchedClubs = await Promise.all(clubDataPromises);
        const validClubs = fetchedClubs.filter((club: IClub) => club !== null);

        setClubs([...validClubs, AIClub]);
        console.log("Fetched clubs:", validClubs, fetchedClubs);
      } catch (error) {
        console.error('Error fetching clubs from registry:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchOtherClubs(clubId);

  }, [clubId, REGISTRY_OBJECT_ID]);

  const handleChallenge = (challengedClub: IClub) => {
    if (!challengedClub.id) return;
    router.push(`/main/matches/match?challengedClub=${challengedClub.id}`);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100">

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : clubs.length === 0 ? (
            <div className="text-center py-16 bg-gray-800/50 rounded-xl border border-gray-700">
              <h3 className="mt-4 text-xl font-medium">No other clubs found</h3>
              <p className="mt-2 text-gray-400">Check back later for potential match opportunities</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clubs.map((club, index) => (
                <div key={index} className="bg-gray-800/80 rounded-sm overflow-hidden border border-gray-700 shadow-lg hover:shadow-cyan-500/20 hover:border-cyan-500/50 transition duration-300">
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="rounded-sm overflow-hidden aspect-square">
                        {club.logoUrl && typeof club.logoUrl === "string" && (
                          <Image src={club.logoUrl} alt="Club logo" width={60} height={60} className="object-contain" />
                        )}
                      </div>
                      <h3 className="text-xl font-bold ml-4 text-cyan-500">
                        {club.fields?.name || "Unknown Club"}
                      </h3>
                    </div>

                    <div className="text-gray-300 text-sm">
                      {club.fields?.location && (
                        <div className="flex items-center mb-2">
                          <LocationEdit className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{club.fields.location}</span>
                        </div>
                      )}
                      {club.fields?.stadium && (
                        <div className="flex items-center mb-2">
                          <BuildingIcon className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{club.fields.stadium}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-700 grid grid-cols-2 gap-2">
                      <div className="text-center bg-gray-700/50 p-2 rounded">
                        <div className="text-xs text-gray-400">Played</div>
                        <div className="font-bold text-white">{club.fields?.matches_played || 0}</div>
                      </div>
                      <div className="text-center bg-gray-700/50 p-2 rounded">
                        <div className="text-xs text-gray-400">Won</div>
                        <div className="font-bold text-green-400">{club.fields?.matches_won || 0}</div>
                      </div>
                      <div className="text-center bg-gray-700/50 p-2 rounded">
                        <div className="text-xs text-gray-400">Drawn</div>
                        <div className="font-bold text-yellow-400">{club.fields?.matches_drawn || 0}</div>
                      </div>
                      <div className="text-center bg-gray-700/50 p-2 rounded">
                        <div className="text-xs text-gray-400">Lost</div>
                        <div className="font-bold text-red-400">{club.fields?.matches_lost || 0}</div>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-between items-center">
                      <div>
                        <span className="text-xs text-gray-500">Goals</span>
                        <div className="flex items-center">
                          <span className="text-green-400 font-medium">{club.fields?.goals_scored || 0}</span>
                          <span className="mx-1 text-gray-600">:</span>
                          <span className="text-red-400 font-medium">{club.fields?.goals_conceded || 0}</span>
                        </div>
                      </div>
                      <Button 
                        className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-none text-sm font-medium transition-colors duration-200"
                        onClick={() => handleChallenge(club)}
                      >
                        Challenge
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}