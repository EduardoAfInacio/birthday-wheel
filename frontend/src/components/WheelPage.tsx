"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { motion, useAnimation } from "framer-motion";
import { Loader2, LogOut } from "lucide-react"; 
import { useAppStore } from "../lib/store";
import { api } from "../services/api";
import { useRouter } from "next/navigation";
import { SpinResponse, Prize } from "@/src/types/api";

export function WheelPage() {
    const controls = useAnimation();
    const router = useRouter();
    const { session, qrTokenCode, reset, setSpinResult } = useAppStore();
    
    const [isSpinning, setIsSpinning] = useState(false);
    const [wonPrize, setWonPrize] = useState<Prize | null>(null);
    const [displayPrizes, setDisplayPrizes] = useState<Prize[]>([]);
    
    const [isLoading, setIsLoading] = useState(true);
    const [isStoreHydrated, setIsStoreHydrated] = useState(false);

    const handleLogout = () => {
        reset();
        router.push("/");
    }

    useEffect(() => {
        setIsStoreHydrated(true);
    }, []);

    useEffect(() => {
        if (!isStoreHydrated) return;

        if (!session || !qrTokenCode) {
            router.push("/");
            return;
        }

        async function initializeWheel() {
            try {
                const prizes = await api.getPrizes();
                setDisplayPrizes(prizes);

                if (session?.prize && session.hasSpun) {
                    const savedPrize = session.prize;
                    setWonPrize(savedPrize); 
                    
                    const winningIndex = prizes.findIndex((p: Prize) => p.id === savedPrize.id);
                    
                    if (winningIndex !== -1) {
                        const totalSegments = prizes.length;
                        const segmentAngle = 360 / totalSegments;
                        const prizeRotation = 360 - (winningIndex * segmentAngle);
                        controls.set({ rotate: prizeRotation });
                    }
                }
            } catch (error) {
                console.error("Error loading prizes:", error);
            } finally {
                setIsLoading(false); 
            }
        }
        
        initializeWheel();
    }, [isStoreHydrated, session, qrTokenCode, router, controls]);

    const handleSpin = async () => {
        if (isSpinning || !session || !qrTokenCode) return;

        setIsSpinning(true);
        setWonPrize(null);

        try {
            const data: SpinResponse = await api.spin({
                userId: session.userId, 
                qrTokenCode: qrTokenCode
            });

            if (data.allPrizes && data.allPrizes.length > 0) {
                 setDisplayPrizes(data.allPrizes);
            }

            const winningIndex = data.prizeIndex;
            const totalSegments = data.allPrizes.length; 
            const segmentAngle = 360 / totalSegments;
            const randomOffset = (Math.random() - 0.5) * (segmentAngle * 0.4); 
            
            const prizeRotation = 360 - (winningIndex * segmentAngle);
            const totalRotation = 1800 + prizeRotation + randomOffset;

            await controls.start({
                rotate: totalRotation,
                transition: { duration: 5, ease: "circOut" },
            });

            setWonPrize(data.wonPrize);

            setSpinResult(data.wonPrize);
            
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 }
            });

        } catch (error: any) {
            if(error.message.includes("already spun")) {
                alert("You have already played! Refreshing to show your prize.");
            } else if(error.message.includes("stock is empty")) {
                alert("Sorry, all prizes have been claimed.")
            } else {
                alert("An error occurred. Please try again.");
            }
            controls.set({ rotate: 0 });
        } finally {
            setIsSpinning(false);
        }
    };

    const createSlicePath = (index: number, total: number, radius: number) => {
        if (total <= 0) return "";
        const angle = 360 / total;
        const startAngle = (index * angle) * (Math.PI / 180);
        const endAngle = ((index + 1) * angle) * (Math.PI / 180);
        const x1 = 50 + radius * Math.cos(startAngle);
        const y1 = 50 + radius * Math.sin(startAngle);
        const x2 = 50 + radius * Math.cos(endAngle);
        const y2 = 50 + radius * Math.sin(endAngle);
        return `M 50 50 L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;
    }

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center text-white">
                <Loader2 className="h-10 w-10 animate-spin" />
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center gap-8 py-10">
            <div className="absolute top-4 right-4">
                <button 
                    onClick={handleLogout}
                    className="p-2 bg-white/20 rounded-full hover:bg-white/40 transition-colors text-white"
                    title="Logout"
                >
                    <LogOut size={20} />
                </button>
            </div>
            
            <div className="relative w-80 h-80">
                {/* Arrow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20">
                    <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-yellow-400 drop-shadow-md" />
                </div>

                {/* Wheel */}
                <motion.div
                    className="w-full h-full"
                    animate={controls}
                    initial={{ rotate: 0 }}
                    style={{ filter: "drop-shadow(0px 10px 15px rgba(0,0,0,0.2))" }}
                >
                    <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                        {displayPrizes.map((p, i) => {
                            const total = displayPrizes.length;
                            const angle = 360 / total;
                            const midAngle = (i * angle) + (angle / 2);
                            const rad = midAngle * (Math.PI / 180);
                            
                            const textRadius = 35;
                            const textX = 50 + textRadius * Math.cos(rad);
                            const textY = 50 + textRadius * Math.sin(rad);

                            return (
                                <g key={p.id || i}>
                                    <path 
                                        d={createSlicePath(i, total, 50)} 
                                        fill={p.color || '#ccc'} 
                                        stroke="white" 
                                        strokeWidth="0.5" 
                                    />
                                    <g transform={`translate(${textX}, ${textY}) rotate(${midAngle + 90})`}>
                                        <text 
                                            x="0" y="0" 
                                            fill="white" 
                                            textAnchor="middle" 
                                            dominantBaseline="middle"
                                            fontSize="4" 
                                            fontWeight="800"
                                            className="uppercase"
                                        >
                                            {p.name?.substring(0, 10)}
                                        </text>
                                    </g>
                                </g>
                            )
                        })}
                    </svg>
                </motion.div>

                <button 
                    onClick={handleSpin}
                    disabled={isSpinning || !!wonPrize}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center font-extrabold text-purple-600 hover:scale-105 transition-transform z-10 text-sm tracking-widest border-4 border-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {wonPrize ? "DONE" : (isSpinning ? "..." : "SPIN")}
                </button>
            </div>

            {/* Result Card */}
            {wonPrize && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-6 rounded-xl shadow-2xl text-center border border-gray-100 w-full max-w-sm"
                >
                    <h2 className="text-2xl font-bold text-gray-800">
                        {session?.hasSpun ? "You already won!" : "Congratulations!"}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">You won:</p>
                    <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 my-4">
                        {wonPrize.name}
                    </div>
                    {wonPrize.description && <p className="text-xs text-gray-400 mb-4">{wonPrize.description}</p>}
                    <button className="w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold shadow-md hover:shadow-lg transition-all">
                        CLAIM PRIZE
                    </button>
                </motion.div>
            )}
        </div>
    )
}