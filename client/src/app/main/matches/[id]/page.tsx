'use client';

import FootballSimulator, { FootballSimulatorRef } from '@/components/simulator';
import { useRef, useState, useEffect } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { suiClient } from "@/utils/sui-client";
import { fetchBlobData } from "@/utils/blob";

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
    logo_blob_id?: string;
    formation?: string;
    style?: string;
    primary_color: string;
    secondary_color: string;
  };
  logoUrl?: string;
}

interface MatchEvent {
  type: 'goal' | 'card' | 'match_end' | 'other';
  minute: number;
  player?: string;
  description: string;
  score?: {
    home: number;
    away: number;
  };
  team?: 'home' | 'away';
  error?: string;
}

const AITeam = {
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
    formation: "4-3-3",
    style: "attacking",
    primary_color: "#00ff00",
    secondary_color: "#000000"
  },
  logoUrl: "https://ahmedfahim.vercel.app/ProCoin.png"
};

export default function Home() {
  const searchParams = useSearchParams();
  const [homeTeam, setHomeTeam] = useState({ name: 'Home Team', formation: '4-4-2', style: 'attacking', primaryColor: '#000', secondaryColor: '#000', matches_played: 0, matches_won: 0, matches_drawn: 0, matches_lost: 0, goals_scored: 0, goals_conceded: 0 });
  const [awayTeam, setAwayTeam] = useState({ name: 'Away Team', formation: '4-4-2', style: 'defensive', primaryColor: '#000', secondaryColor: '#000', matches_played: 0, matches_won: 0, matches_drawn: 0, matches_lost: 0, goals_scored: 0, goals_conceded: 0 });
  const [matchEvents, setMatchEvents] = useState<MatchEvent[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentScore, setCurrentScore] = useState({ home: 0, away: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  const [loading, setLoading] = useState(true);

  const simulatorRef = useRef<FootballSimulatorRef>(null);

  useEffect(() => {
    const fetchClubData = async () => {
      try {
        const challengedClubParam = searchParams.get('challengedClub');
        const clubId = localStorage.getItem("clubId");
        
        console.log('URL Parameters:', {
          challengedClubParam,
          clubId,
          rawChallengedClub: searchParams.get('challengedClub'),
          rawClubId: searchParams.get('id'),
          allParams: Object.fromEntries(searchParams.entries())
        });

        if (!challengedClubParam || !clubId) {
          console.error('Missing required parameters:', { challengedClubParam, clubId });
          return;
        }

        // Verify if the IDs are valid Sui object IDs
        const isValidSuiId = (id: string) => /^0x[a-fA-F0-9]{64}$/.test(id);
        console.log('ID Validation:', {
          isHomeIdValid: isValidSuiId(clubId),
          isAwayIdValid: isValidSuiId(challengedClubParam),
          homeId: clubId,
          awayId: challengedClubParam
        });

          const homeClubResponse = await suiClient.getObject({
            id: clubId,
            options: { showContent: true },
          });

          if (homeClubResponse.data?.content && 'fields' in homeClubResponse.data.content) {
            const homeClub = homeClubResponse.data.content as unknown as IClub;

            setHomeTeam({
              name: homeClub.fields.name,
              formation: homeClub.fields.formation || '4-4-2',
              style: homeClub.fields.style || 'balanced',
              primaryColor: homeClub.fields.primary_color,
              secondaryColor: homeClub.fields.secondary_color,
              matches_played: homeClub.fields.matches_played,
              matches_won: homeClub.fields.matches_won,
              matches_drawn: homeClub.fields.matches_drawn,
              matches_lost: homeClub.fields.matches_lost,
              goals_scored: homeClub.fields.goals_scored,
              goals_conceded: homeClub.fields.goals_conceded
            });
          }


        // Fetch away club data
        if (challengedClubParam === "0x1") {
          // AI team is away team
          setAwayTeam({
            name: AITeam.fields.name,
            formation: AITeam.fields.formation,
            style: AITeam.fields.style,
            primaryColor: AITeam.fields.primary_color,
            secondaryColor: AITeam.fields.secondary_color,
            matches_played: AITeam.fields.matches_played,
            matches_won: AITeam.fields.matches_won,
            matches_drawn: AITeam.fields.matches_drawn,
            matches_lost: AITeam.fields.matches_lost,
            goals_scored: AITeam.fields.goals_scored,
            goals_conceded: AITeam.fields.goals_conceded
          });
        } else {
          // Fetch away club data from Sui
          const awayClubResponse = await suiClient.getObject({
            id: challengedClubParam,
            options: { showContent: true },
          });

          if (awayClubResponse.data?.content && 'fields' in awayClubResponse.data.content) {
            const awayClub = awayClubResponse.data.content as unknown as IClub;

            setAwayTeam({
              name: awayClub.fields.name,
              formation: awayClub.fields.formation || '4-4-2',
              style: awayClub.fields.style || 'balanced',
              primaryColor: awayClub.fields.primary_color,
              secondaryColor: awayClub.fields.secondary_color,
              matches_played: awayClub.fields.matches_played,
              matches_won: awayClub.fields.matches_won,
              matches_drawn: awayClub.fields.matches_drawn,
              matches_lost: awayClub.fields.matches_lost,
              goals_scored: awayClub.fields.goals_scored,
              goals_conceded: awayClub.fields.goals_conceded
            });
          }
        }
      } catch (error) {
        console.error('Error fetching club data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClubData();
  }, [searchParams]);

  const handleEventAnimation = async (event: MatchEvent) => {
    if (isAnimating) return;
    setIsAnimating(true);

    try {
      if (event.type === 'goal') {
        if (event.team === 'home') {
          await simulatorRef.current?.animateHomeGoal();
        } else if (event.team === 'away') {
          await simulatorRef.current?.animateAwayGoal();
        }
      } else {
        await simulatorRef.current?.animateRandomEvent();
      }
    } finally {
      setIsAnimating(false);
    }
  };

  const simulateMatch = async () => {
    if (!homeTeam.name || !awayTeam.name) {
      alert('Please enter team names');
      return;
    }

    setIsSimulating(true);
    setMatchEvents([]);
    setCurrentScore({ home: 0, away: 0 });

    try {
      const response = await fetch('/api/simulate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          homeTeam: {
            name: homeTeam.name,
            style: homeTeam.style,
            formation: homeTeam.formation,
          },
          awayTeam: {
            name: awayTeam.name,
            style: awayTeam.style,
            formation: awayTeam.formation,
          }
        }),
        }
      );

      if (!response.body) {
        throw new Error('Response body is null');
      }

      console.log(response.body)

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        console.log(lines)

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const eventData = JSON.parse(line.slice(6)) as MatchEvent;
              
              if (eventData.error) {
                console.error('Simulation error:', eventData.error);
                setIsSimulating(false);
                break;
              }

              setMatchEvents(prev => [...prev, eventData]);

              if (eventData.type === 'match_end') {
                setIsSimulating(false);
                
                // Update match statistics for both teams
                try {
                  const homeClubId = localStorage.getItem("clubId");
                  const awayClubId = searchParams.get('challengedClub');
                  
                  if (homeClubId) {
                    await fetch('/api/update-match-stats', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        clubId: homeClubId,
                        matches_played: homeTeam.matches_played + 1,
                        matches_won: currentScore.home > currentScore.away ? homeTeam.matches_won + 1 : homeTeam.matches_won,
                        matches_drawn: currentScore.home === currentScore.away ? homeTeam.matches_drawn + 1 : homeTeam.matches_drawn,
                        matches_lost: currentScore.home < currentScore.away ? homeTeam.matches_lost + 1 : homeTeam.matches_lost,
                        goals_scored: homeTeam.goals_scored + currentScore.home,
                        goals_conceded: homeTeam.goals_conceded + currentScore.away
                      }),
                    });
                  }

                  if (awayClubId && awayClubId !== "0x1") {
                    await fetch('/api/update-match-stats', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        clubId: awayClubId,
                        matches_played: awayTeam.matches_played + 1,
                        matches_won: currentScore.away > currentScore.home ? awayTeam.matches_won + 1 : awayTeam.matches_won,
                        matches_drawn: currentScore.home === currentScore.away ? awayTeam.matches_drawn + 1 : awayTeam.matches_drawn,
                        matches_lost: currentScore.away < currentScore.home ? awayTeam.matches_lost + 1 : awayTeam.matches_lost,
                        goals_scored: awayTeam.goals_scored + currentScore.away,
                        goals_conceded: awayTeam.goals_conceded + currentScore.home
                      }),
                    });
                  }
                } catch (error) {
                  console.error('Error updating match statistics:', error);
                }
                
                break;
              }
              
              if (eventData.score) {
                setCurrentScore(eventData.score);
              }

              await new Promise(resolve => setTimeout(resolve, 1000));
              await handleEventAnimation(eventData);
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      console.error('Error simulating match:', error);
      setIsSimulating(false);
    }
  };

  return (
    <div className="flex h-[92vh] w-full overflow-auto bg-gray-900 text-gray-100 font-sans">
      <div className="flex-1 flex flex-col">
        {/* Main Match Area */}
        <div className="flex-1 flex h-full">
          {/* Left Panel - Scoreboard and Events */}
          <div className="w-[400px] bg-gray-800 border-r border-gray-700 flex flex-col">
            {/* Scoreboard */}
            <div className="p-6 bg-gradient-to-b from-gray-800 to-gray-900 border-b border-gray-700">
              <div className="text-center mb-4">
                <div className="text-sm text-gray-400 mb-1">LIVE MATCH</div>
                <div className="text-4xl font-bold text-white tracking-wider">
                  {currentScore.home} - {currentScore.away}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-right flex-1">
                  <div className="text-lg font-medium" style={{ color: homeTeam.primaryColor }}>{homeTeam.name}</div>
                  <div className="text-xs text-gray-400">
                    {homeTeam.formation} • {homeTeam.style}
                  </div>
                </div>
                <div className="mx-4 text-gray-500">VS</div>
                <div className="text-left flex-1">
                  <div className="text-lg font-medium" style={{ color: awayTeam.primaryColor }}>{awayTeam.name}</div>
                  <div className="text-xs text-gray-400">
                    {awayTeam.formation} • {awayTeam.style}
                  </div>
                </div>
              </div>
            </div>

            {/* Match Events */}
            <div className="flex-1 overflow-hidden flex flex-col">
              <div className="p-4 border-b border-gray-700">
                <h2 className="text-lg font-medium bg-cyan-500 bg-clip-text text-transparent">Match Events</h2>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {matchEvents.map((event, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-md border-l-4 ${
                      event.type === 'goal' 
                        ? 'bg-green-900/30 border-green-500' 
                        : event.type === 'card'
                        ? 'bg-yellow-900/30 border-yellow-500'
                        : 'bg-gray-700/30 border-gray-500'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-cyan-400">{event.minute}'</span>
                          <span className="text-sm bg-gray-700 px-2 py-1 rounded text-gray-200 capitalize">
                            {event.type}
                          </span>
                          {event.player && (
                            <span className="font-medium text-gray-200">{event.player}</span>
                          )}
                        </div>
                        <p className="text-gray-300 text-sm">{event.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isSimulating && (
                  <div className="text-center py-4">
                    <div className="inline-flex items-center gap-2 text-cyan-400">
                      <div className="animate-spin h-4 w-4 border-2 border-cyan-400 border-t-transparent rounded-full"></div>
                      <span>Match in progress...</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Match Controls */}
            <div className="p-4 border-t border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <button
                  className="text-sm bg-gray-700 hover:bg-gray-600 transition-colors px-3 py-1 rounded flex items-center"
                  onClick={() => {
                    setMatchEvents([]);
                    setCurrentScore({ home: 0, away: 0 });
                  }}
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Reset
                </button>
              </div>

              <button
                className={`w-full text-sm ${isSimulating ? 'bg-gray-700' : 'bg-cyan-700 hover:bg-cyan-600'} transition-colors px-3 py-2 flex items-center justify-center rounded-md`}
                onClick={simulateMatch}
                disabled={isSimulating || isAnimating}
              >
                <Play className="h-4 w-4 mr-2" />
                <span>{isSimulating ? 'Simulating Match...' : 'Simulate Match'}</span>
              </button>
            </div>
          </div>

          {/* Right Panel - Football Simulator */}
          <div className="flex-1 flex flex-col p-4">
            <div className="flex-1 flex items-center justify-center">
              <FootballSimulator 
                ref={simulatorRef}
                onAnimationComplete={() => {
                  console.log('Animation completed');
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}