"use client";

import { CalendarIcon, Droplet, FlagIcon, LoaderCircle } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { NATIONALITIES } from '@/utils/constants';
import { generateImagePrompt, generatePlayer } from '@/utils/player-gen';
import { useWallet } from '@suiet/wallet-kit';
import { redirect } from 'next/navigation';
import { storeBlob } from '@/utils/blob';
import { Transaction } from '@mysten/sui/transactions';
import { Button } from '@/components/ui/button';

export interface Player {
    firstName?: string;
    lastName?: string;
    name: string;
    nationality: string;
    position: string;
    age: number;
    attributes: {
        physical: number;
        speed: number;
        shooting: number;
        passing: number;
        dribbling: number;
        defending: number;
    };
    imageUrl: string | null;
}

const PlayerCard = ({ player }: { player: Player }) => {
    const { name, nationality, position, age, attributes, imageUrl } = player;

    const getAttributeColor = (value: number) => {
        if (value >= 90) return "bg-green-500/40";
        if (value >= 80) return "bg-green-300/40";
        if (value >= 70) return "bg-yellow-400/40";
        if (value >= 60) return "bg-yellow-300/40";
        return "bg-red-400/40";
    };

    return (
        <div className="bg-gray-800 shadow-lg overflow-hidden transition-shadow duration-300">
            <div className="relative aspect-square overflow-hidden">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={name}
                        fill
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full bg-gray-500">
                        <div className="text-gray-200 flex flex-col items-center">
                            <LoaderCircle className="animate-spin w-8 h-8 mb-2" />
                            <span>Image Loading...</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-5">
                {/* Header with name and position */}
                <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-lg text-gray-200">{name}</h3>
                    <span className="p-1 bg-cyan-600 text-white text-xs rounded-full font-medium">{position}</span>
                </div>

                {/* Player info */}
                <div className="flex justify-between text-sm text-gray-400 mb-4">
                    <div className="flex items-center">
                        <FlagIcon className="w-4 h-4 mr-1" />
                        <span>{nationality}</span>
                    </div>
                    <div className="flex items-center">
                        <CalendarIcon className="w-4 h-4 mr-1" />
                        <span>Age: {age}</span>
                    </div>
                </div>

                {/* Attributes section with chips */}
                <div className="grid grid-cols-3 gap-1">
                    {Object.entries(attributes).map(([key, value]) => (
                        <div
                            key={key}
                            className={`${getAttributeColor(value)} rounded-sm p-1 flex flex-col items-center justify-center transition-transform hover:scale-105`}
                        >
                            <span className="text-white font-bold text-sm">{value}</span>
                            <span className="text-white text-xs capitalize">{key}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default function FootballPlayerGenerator() {
    const [players, setPlayers] = useState<Player[] | null>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState("");
    const [generationProgress, setGenerationProgress] = useState(0);

    const availableNationalities = Object.keys(NATIONALITIES);

    const generateTeam = async () => {
        setIsGenerating(true);
        setError("");
        setGenerationProgress(0);

        try {
            const newPlayers = [];

            const targetPositions = {
                "GK": 0,  // 2 goalkeepers
                "DEF": 0, // 5 defenders
                "MID": 0, // 6 midfielders
                "FWD": 3  // 3 forwards
            };

            const positionCount = {
                "GK": 0,
                "DEF": 0,
                "MID": 0,
                "FWD": 0
            };

            for (const [position, count] of Object.entries(targetPositions)) {
                for (let i = 0; i < count; i++) {
                    const nationality = availableNationalities[Math.floor(Math.random() * availableNationalities.length)];

                    const player = generatePlayer(nationality as keyof typeof NATIONALITIES);
                    player.position = position; // Override the random position

                    newPlayers.push(player);
                    positionCount[position as keyof typeof positionCount]++;
                }
            }

            setPlayers(newPlayers);

            for (let i = 0; i < newPlayers.length; i++) {
                const player: Player = newPlayers[i];
                const prompt = generateImagePrompt(player);

                try {
                    const response = await fetch('/api/image-gen', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ prompt }),
                    });

                    if (!response.ok) {
                        throw new Error(`Failed to generate image for ${player.name}`);
                    }

                    const data = await response.json();

                    newPlayers[i] = { ...player, imageUrl: data.imageUrl };
                    setPlayers([...newPlayers]);

                    setGenerationProgress(Math.round(((i + 1) / newPlayers.length) * 100));
                } catch (err) {
                    console.error(`Error generating image for player ${player.name}:`, err);
                }
            }
        } catch (err: any) {
            setError(`Error generating team: ${err.message}`);
            console.error('Error generating team:', err);
        } finally {
            setIsGenerating(false);
            setGenerationProgress(100);
        }
    };

    const { connected, address, signAndExecuteTransaction } = useWallet();
    const [isMinting, setIsMinting] = useState<"not-minting" | "minting" | "minted">("not-minting");

    const PACKAGE_ID = process.env.NEXT_PUBLIC_PACKAGE_ID || "0x1";

    const handleMintPlayers = async () => {
        if (!connected) {
            alert('Please connect your Sui wallet first');
            return;
        }

        try {
            setIsMinting("minting");

            // First, store all images and collect the blob IDs
            const playersWithBlobs = await Promise.all(
                // @ts-expect-error handled
                players.map(async (player) => {
                    const imageInfo = await storeBlob(player.imageUrl, 5, connected, address);
                    return {
                        ...player,
                        blobId: imageInfo.blobId
                    };
                })
            );

            // Create a single transaction block for all players
            const tx = new Transaction();

            // Add each player creation to the transaction block
            playersWithBlobs.forEach(player => {
                tx.moveCall({
                    target: `${PACKAGE_ID}::player::create_player`,
                    arguments: [
                        tx.pure.string(player.name),
                        tx.pure.string(player.nationality),
                        tx.pure.string(player.position),
                        tx.pure.u8(player.attributes.speed),
                        tx.pure.u8(player.attributes.shooting),
                        tx.pure.u8(player.attributes.passing),
                        tx.pure.u8(player.attributes.dribbling),
                        tx.pure.u8(player.attributes.defending),
                        tx.pure.u8(player.attributes.physical),
                        tx.pure.u8(player.age),
                        tx.pure.string(player.blobId),
                    ]
                });
                console.log("Player added to transaction:", player.name);
            });

            // Execute the transaction block with a single wallet approval
            const result = await signAndExecuteTransaction({
                transaction: tx
            });

            console.log("Transaction result:", result);

            setIsMinting("minted");

        } catch (error: any) {
            console.error('Error in club creation process:', error);
            setIsMinting("not-minting");
        }
    };

    return (
        <div className="mx-auto min-h-screen p-4 bg-gray-900">
            <div className='max-w-6xl mx-auto'>
                <h1 className="text-4xl font-bold text-center my-6 text-cyan-400">Team Setup</h1>

                {!isGenerating && players?.length === 0 && (
                    <div className="text-center text-gray-300 my-14 border border-gray-700 max-w-4xl mx-auto p-6 transition-all duration-400 ease-in-out">
                        <p className="mb-4">Assemble your dream football squad — each player is algorithmically generated with balanced roles, diverse nationalities, and unique traits tailored for competitive play.</p>
                        <p className="text-sm opacity-75">Powered by AI, every player comes with a distinctive skillset and a procedurally generated portrait, making your team truly one of a kind.</p>
                    </div>

                )}

                {players?.length === 0 && (
                    <div className="flex justify-center mb-8">
                        <button
                            onClick={generateTeam}
                            disabled={isGenerating}
                            className="bg-cyan-600 text-white py-3 px-6 font-bold text-lg hover:bg-cyan-700 disabled:bg-gray-600 disabled:opacity-70 transition-colors shadow-lg"
                        >
                            {isGenerating ? 'Generating Team...' : 'Generate Random Team'}
                        </button>
                    </div>
                )}

                {error && (
                    <div className="w-full p-4 mb-6 bg-red-900/40 border border-red-700 text-red-200 rounded-lg text-center">
                        {error}
                    </div>
                )}

                {isGenerating && (
                    <div className="mb-8">
                        <div className="flex justify-between text-sm mb-1 text-gray-300">
                            <span>Generating player profiles...</span>
                            <span>{generationProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-4">
                            <div
                                className="bg-cyan-600 h-4 rounded-full transition-all duration-300 ease-in-out"
                                style={{ width: `${generationProgress}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                {players && players.length > 0 && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-300">Player Profiles</h2>
                            {isMinting === "not-minting" || isMinting === "minting" ? (
                                <Button
                                    className="bg-gradient-to-r from-cyan-600 to-cyan-500 text-white py-2 px-4 hover:from-cyan-700 hover:to-cyan-600 transition-all shadow-lg flex items-center gap-2"
                                    onClick={handleMintPlayers}
                                    disabled={isMinting == "minting" || isGenerating}
                                >
                                    <span>{isMinting == "minting" ? "Minting..." : isMinting == "not-minting" ? "Mint Players" : ""}</span>
                                    <Droplet className="w-4 h-4" />
                                </Button>
                            ) : (
                                <Button
                                    className="bg-gradient-to-r from-cyan-600 to-cyan-500 text-white py-2 px-4 hover:from-cyan-700 hover:to-cyan-600 transition-all shadow-lg flex items-center gap-2"
                                    onClick={() => redirect("/main")}
                                >
                                    Let&apos;s Begin
                                    <Droplet className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                        <div className="mb-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                {players.map((player, index) => (
                                    <PlayerCard key={index} player={player} />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}