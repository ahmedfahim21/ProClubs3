"use client";
import { fetchBlobData } from '@/utils/blob';
import { suiClient } from '@/utils/sui-client';
import { Trophy, MapPin, Users, Target, Shield, Calendar, SquareMenu, BadgePercent } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const ClubDashboard = () => {

  const [clubId, setClubId] = useState<string | null>(null);
  const [clubData, setClubData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const storedClubId = localStorage.getItem("clubId");
    if (storedClubId) {
      setClubId(storedClubId);
      console.log("Retrieved clubId from localStorage:", storedClubId);
    }
  }, []);

  useEffect(() => {
    async function fetchClubData() {
      if (!clubId) return;

      try {
        setLoading(true);

        const response = await suiClient.getObject({
          id: clubId,
          options: { showContent: true },
        });

        setClubData(response.data?.content);
        console.log("Club data fetched:", response.data?.content);
        try {
          // @ts-expect-error handled
          const logoBlobId = response.data?.content?.fields?.logo_blob_id;
          const logoUrl = await fetchBlobData(logoBlobId);
          setImageUrl(logoUrl);

          console.log("Logo URL set:", logoUrl);

        } catch (err) {
          console.error('Error fetching club details:', err);
        }

      } catch (error) {
        console.error("Error fetching club data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchClubData();
  }, [clubId]);

  const StatCard = ({ icon: Icon, label, value, color = "text-cyan-400" }: { 
    icon: React.ElementType; 
    label: string; 
    value: string | number; 
    color?: string;
  }) => (
    <div className="bg-gray-800 p-6 border border-gray-700 hover:border-cyan-500 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium mb-1">{label}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </div>
        <Icon className="w-8 h-8 text-cyan-500" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-gray-900 p-6 overflow-auto">
      {loading ? (
        <div className="flex items-center justify-center h-[80vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
      ) : !clubData ? (
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold text-gray-400 mb-4">No club data available</h2>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="p-4 mb-8"
            style={{
              background: `linear-gradient(135deg, ${clubData.fields.primary_color}80, ${clubData.fields.secondary_color}80)`,
            }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <Image
                  src={imageUrl || "/default-logo.png"}
                  alt="Club Logo"
                  width={100}
                  height={100}
                  className="rounded-sm shadow-lg"
                />
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">{clubData.fields.name}</h1>
                  <div className="flex items-center gap-4 text-gray-300">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-cyan-500" />
                      <span>{clubData.fields.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-cyan-500" />
                      <span>{clubData.fields.stadium}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm mb-1">Owner</p>
                <p className="text-white text-sm">{clubData.fields.owner.slice(0, 8)}...{clubData.fields.owner.slice(-6)}</p>
                <p className="text-gray-400 text-sm mb-1">Club ID</p>
                <p className="text-sm text-white">{clubId?.slice(0, 8)}...{clubId?.slice(-6)}</p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={Calendar}
              label="Matches Played"
              value={clubData.fields.matches_played}
              color="text-white"
            />
            <StatCard
              icon={Trophy}
              label="Matches Won"
              value={clubData.fields.matches_won}
              color="text-green-400"
            />
            <StatCard
              icon={Target}
              label="Goals Scored"
              value={clubData.fields.goals_scored}
              color="text-cyan-400"
            />
            <StatCard
              icon={Shield}
              label="Goals Conceded"
              value={clubData.fields.goals_conceded}
              color="text-red-400"
            />
          </div>

          {/* Additional Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
              icon={SquareMenu}
              label="Draws"
              value={clubData.fields.matches_drawn}
              color="text-yellow-400"
            />
            <StatCard
              icon={BadgePercent}
              label="Losses"
              value={clubData.fields.matches_lost}
              color="text-red-400"
            />
            <StatCard
              icon={Users}
              label="Formation"
              value={clubData.fields.formation}
              color="text-purple-400"
            />
          </div>

          {/* Performance Summary */}
          <div className="mt-8 bg-gray-800 rounded-2xl p-8 border border-gray-700">
            <h3 className="text-2xl font-semibold text-cyan-400 mb-6">Season Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">{clubData.fields.matches_played}</div>
                <div className="text-gray-400 text-sm">Total Matches</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {clubData.fields.matches_played > 0 ?
                    Math.round((parseInt(clubData.fields.matches_won) / parseInt(clubData.fields.matches_played)) * 100) : 0}%
                </div>
                <div className="text-gray-400 text-sm">Win Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400 mb-2">
                  {parseInt(clubData.fields.goals_scored) - parseInt(clubData.fields.goals_conceded)}
                </div>
                <div className="text-gray-400 text-sm">Goal Difference</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClubDashboard;