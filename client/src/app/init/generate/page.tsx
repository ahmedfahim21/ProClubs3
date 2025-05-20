"use client";

import { CalendarIcon, FlagIcon, LoaderCircle } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { NATIONALITIES, POSITIONS } from '@/utils/constants';

interface Player {
    id: string;
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


const generatePlayer = (nationality: keyof typeof NATIONALITIES) => {

    const countryData = NATIONALITIES[nationality] || NATIONALITIES["England"];
    const firstName = countryData.firstNames[Math.floor(Math.random() * countryData.firstNames.length)];
    const lastName = countryData.names[Math.floor(Math.random() * countryData.names.length)];

    const positionRoll = Math.random();
    let position: string = "MID";
    let cumulativeProbability = 0;

    for (const [pos, probability] of Object.entries(POSITIONS)) {
        cumulativeProbability += probability;
        if (positionRoll <= cumulativeProbability) {
            position = pos;
            break;
        }
    }

    const baseAttributes = {
        physical: Math.floor(Math.random() * 40) + 60,
        speed: Math.floor(Math.random() * 40) + 60,
        shooting: Math.floor(Math.random() * 40) + 60,
        passing: Math.floor(Math.random() * 40) + 60,
        dribbling: Math.floor(Math.random() * 40) + 60,
        defending: Math.floor(Math.random() * 40) + 60
    };

    const attributes = { ...baseAttributes };

    switch (position) {
        case "GK":
            attributes.physical = Math.min(99, attributes.physical + 10);
            attributes.defending = Math.min(99, attributes.defending + 15);
            attributes.shooting = Math.max(60, attributes.shooting - 15);
            attributes.dribbling = Math.max(60, attributes.dribbling - 10);
            break;
        case "DEF":
            attributes.physical = Math.min(99, attributes.physical + 10);
            attributes.defending = Math.min(99, attributes.defending + 15);
            attributes.shooting = Math.max(60, attributes.shooting - 5);
            break;
        case "MID":
            attributes.passing = Math.min(99, attributes.passing + 10);
            attributes.dribbling = Math.min(99, attributes.dribbling + 5);
            break;
        case "FWD":
            attributes.shooting = Math.min(99, attributes.shooting + 15);
            attributes.speed = Math.min(99, attributes.speed + 10);
            attributes.dribbling = Math.min(99, attributes.dribbling + 5);
            attributes.defending = Math.max(60, attributes.defending - 10);
            break;
    }

    const age = Math.floor(Math.random() * 21) + 17;

    return {
        id: Math.random().toString(36).substring(2, 9),
        firstName,
        lastName,
        name: `${firstName} ${lastName}`,
        nationality,
        position,
        age,
        attributes,
        imageUrl: null // Will be populated later
    };
};

const generateImagePrompt = (player: Player) => {
    const { name, nationality, position, age } = player;

    const positionElements: Record<string, string> = {
        "GK": "goalkeeper gloves, goalkeeper jersey",
        "DEF": "defender stance, focused expression",
        "MID": "midfielder pose, alert expression",
        "FWD": "forward stance, confident expression"
    };
    const positionElement = positionElements[position as keyof typeof positionElements] || "";

    let ageDescription = "";
    if (age < 22) {
        ageDescription = "young, fresh face";
    } else if (age > 30) {
        ageDescription = "experienced, mature features";
    } else {
        ageDescription = "in prime condition";
    }
    const enhancedPrompt = `
        Generate a professional football player headshot with the following specifications:
        - Portrait of a ${nationality} football player, ${ageDescription}, ${position} position, ${positionElement}.
        - Consistent portrait style: head and shoulders view
        - Solid color background (preferably white or gray)
        - Uniform lighting across all images
        - Cartoonish digital art style
        - Professional team jersey (generic, no specific team logo)
        - No text or watermarks
        - Aspect ratio: square
        `;
    return enhancedPrompt;
};

const PlayerCard = ({ player }: { player: Player }) => {
    const { name, nationality, position, age, attributes, imageUrl } = player;

    // Function to get color based on attribute value
    const getAttributeColor = (value: number) => {
        if (value >= 90) return "bg-green-500/40";
        if (value >= 80) return "bg-green-300/40";
        if (value >= 70) return "bg-yellow-400/40";
        if (value >= 60) return "bg-yellow-300/40";
        return "bg-red-400/40";
    };

    return (
        <div className="bg-gray-800 shadow-lg overflow-hidden transition-shadow duration-300">
            {/* Square image container with fixed aspect ratio */}
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
                    <span className="px-3 py-1 bg-cyan-600 text-white text-xs rounded-full font-medium">{position}</span>
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
                "GK": 2,  // 2 goalkeepers
                "DEF": 5, // 5 defenders
                "MID": 6, // 6 midfielders
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

    return (
        <div className="mx-auto p-4 bg-gray-900">
            <div className='max-w-6xl mx-auto'>
                <h1 className="text-3xl font-bold text-center my-6 text-gray-200">Football Player Generator</h1>

                <div className="flex justify-center mb-8">
                    <button
                        onClick={generateTeam}
                        disabled={isGenerating}
                        className="bg-cyan-600 text-white py-3 px-6 font-bold text-lg hover:bg-cyan-700 disabled:bg-gray-400"
                    >
                        {isGenerating ? 'Generating Team...' : 'Generate Random Team'}
                    </button>
                </div>

                {error && (
                    <div className="w-full p-4 mb-6 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
                        {error}
                    </div>
                )}

                {isGenerating && (
                    <div className="mb-8">
                        <div className="flex justify-between text-sm mb-1">
                            <span>Generating player images...</span>
                            <span>{generationProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4">
                            <div
                                className="bg-cyan-600 h-4 rounded-full transition-all duration-300 ease-in-out"
                                style={{ width: `${generationProgress}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                {players && players.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4 text-gray-300">My Team</h2>
                        <div className="mb-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {players.map(player => (
                                    <PlayerCard key={player.id} player={player} />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}