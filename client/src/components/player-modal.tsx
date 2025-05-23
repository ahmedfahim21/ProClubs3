"use client";

import { IPlayer } from "@/app/main/squad/page";
import Image from "next/image";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Transaction } from "@mysten/sui/transactions";
import { Input } from "./ui/input";
import { useWallet } from "@suiet/wallet-kit";

export function PlayerStatsModal({
    player,
    onClose
}: {
    player: IPlayer,
    onClose: () => void
}) {

    const [clubId, setClubId] = useState<string | null>(null);
    const KIOSK_ID = process.env.NEXT_PUBLIC_KIOSK_ID || "0x1";
    const KIOSK_OWNER_CAP_ID = process.env.NEXT_PUBLIC_KIOSK_OWNER_CAP_ID || "0x1";
    const [price, setPrice] = useState<number>(0);
    const [listing, setListing] = useState<"not-listed" | "listing" | "listed">("not-listed");
    const { account, signAndExecuteTransaction } = useWallet();

    useEffect(() => {
        const storedClubId = localStorage.getItem("clubId");
        if (storedClubId) {
            setClubId(storedClubId);
            console.log("Retrieved clubId from localStorage:", storedClubId);
        }
    }, []);

    const handleListing = async (id: string) => {
        console.log("Listing player:", id);
        if (!id || !account) return;

        try {
            console.log("Listing player:", id);
            console.log("Club ID:", clubId);
            console.log("Kiosk ID:", KIOSK_ID);
            console.log("Kiosk Owner Cap ID:", KIOSK_OWNER_CAP_ID);

            const tx = new Transaction();

            tx.moveCall({
                target: `${process.env.NEXT_PUBLIC_PACKAGE_ID}::transfer::list_player`,
                arguments: [
                    tx.object(id),
                    tx.object(KIOSK_ID),
                    tx.object(KIOSK_OWNER_CAP_ID),
                    tx.pure.u64(price),
                ],
            });

            const result = await signAndExecuteTransaction({
                transaction: tx,
            });

            console.log("Transaction result:", result);
            setListing("listed");

        } catch (error) {
            console.error("Error listing player:", error);
        }
    };

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
                        <X className="w-5 h-5" />
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

                    <div className="space-y-6">
                        <div className="bg-gray-700/40 p-4 rounded-lg border border-gray-600">
                            <h4 className="text-sm font-medium text-gray-300 mb-3">Transfer Market</h4>

                            <div className="flex items-end gap-4">
                                <div className="flex-1">
                                    <label htmlFor="price" className="block text-xs text-gray-400 mb-1.5">
                                        Price (SUI)
                                    </label>
                                    <Input
                                        id="price"
                                        type="number"
                                        placeholder="Enter amount"
                                        className="bg-gray-800 text-gray-200 border-gray-600 focus:border-cyan-500 focus:ring focus:ring-cyan-500/20"
                                        onChange={(e) => setPrice(Number(e.target.value))}
                                        value={price}
                                        min={0}
                                    />
                                </div>

                                <Button
                                    className="bg-gradient-to-br from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-medium px-5 py-2.5"
                                    onClick={() => handleListing(player?.id.id)}
                                    disabled={!price || listing === "listing" || listing === "listed"}
                                >
                                    {listing === "listing" ? (
                                        <>
                                            <span className="animate-pulse">Listing</span>...
                                        </>
                                    ) : listing === "listed" ? (
                                        <span className="text-green-400">Listed</span>
                                    ) : (
                                        "List Player"
                                    )}
                                    
                                </Button>
                            </div>

                            <p className="text-xs text-gray-400 mt-3">
                                Once listed, your player will appear in the transfer market.
                            </p>
                        </div>
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
