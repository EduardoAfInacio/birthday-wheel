"use client";

import { useState } from "react"
import confetti from "canvas-confetti"
import { motion, useAnimation } from "framer-motion"
import { ShoppingBag, Star, Truck, RefreshCcw, Percent, Gift } from "lucide-react";
import { useUserStore } from "../lib/store";

const prizes = [ 
    { label: "10% OFF", color: "#FF6B6B", icon: Percent },       // Index 0
    { label: "20% OFF", color: "#4ECDC4", icon: Percent },       // Index 1
    { label: "30% OFF", color: "#FFE66D", icon: Percent },       // Index 2
    { label: "50% OFF", color: "#1A535C", icon: Star },          // Index 3 (Winner)
    { label: "FREE SHIPPING", color: "#FF9F1C", icon: Truck },   // Index 4
    { label: "TRY AGAIN", color: "#F7FFF7", icon: RefreshCcw },  // Index 5
]

export function WheelPage() {
    const controls = useAnimation();
    const user = useUserStore((state) => state.user);
    const [spinning, setSpinning] = useState(false);
    const [prize, setPrize] = useState<string | null>(null);

    const spin = async () => {
        if (spinning) return;
        setSpinning(true);
        setPrize(null);

        const winningIndex = 3; // 50% OFF (Dark Blue)
        const segmentAngle = 360 / prizes.length;
        
        // 1. (winningIndex * segmentAngle) -> Angle where the segment starts
        // 2. (segmentAngle / 2) -> Add half to get the CENTER of the segment
        // 3. 360 - (...) -> Invert to spin clockwise to the top
        const rotationNeeded = 360 - (winningIndex * segmentAngle) - (segmentAngle / 2);
        
        // Add 10 full spins (360 * 10) + the precise rotation
        const spinRotation = (360 * 10) + rotationNeeded;

        // Add a small random variation (-10% to +10% of the slice) for realism
        // but without leaving the winning color
        const randomOffset = (Math.random() - 0.5) * (segmentAngle * 0.2); 

        await controls.start({
            rotate: spinRotation + randomOffset,
            transition: { duration: 6, ease: "circOut", type: "tween" },
        })

        setSpinning(false);
        setPrize(prizes[winningIndex].label);

        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
        })
    }

    const createSlicePath = (index: number, total: number, radius: number) => {
        const angle = 360 / total;
        const startAngle = (index * angle) * (Math.PI / 180);
        const endAngle = ((index + 1) * angle) * (Math.PI / 180);
        const x1 = 50 + radius * Math.cos(startAngle);
        const y1 = 50 + radius * Math.sin(startAngle);
        const x2 = 50 + radius * Math.cos(endAngle);
        const y2 = 50 + radius * Math.sin(endAngle);
        return `M 50 50 L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;
    }

    return (
        <div className="flex flex-col items-center gap-8 py-10">
            <div className="relative w-80 h-80">
                {/* Indicator Arrow (Fixed at top) */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20">
                    <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-yellow-400 drop-shadow-md" />
                </div>

                {/* Wheel Container */}
                <motion.div
                    className="w-full h-full"
                    animate={controls}
                    initial={{ rotate: 0 }}
                    style={{ filter: "drop-shadow(0px 10px 15px rgba(0,0,0,0.2))" }}
                >
                    {/* SVG with initial -90deg rotation so Index 0 starts at the top */}
                    <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                        {prizes.map((p, i) => {
                            const angle = 360 / prizes.length;
                            const midAngle = (i * angle) + (angle / 2);
                            const rad = midAngle * (Math.PI / 180);
                            
                            // Adjusted positions (Text on edge, icon in center)
                            const iconRadius = 22;
                            const iconX = 50 + iconRadius * Math.cos(rad);
                            const iconY = 50 + iconRadius * Math.sin(rad);

                            const textRadius = 38;
                            const textX = 50 + textRadius * Math.cos(rad);
                            const textY = 50 + textRadius * Math.sin(rad);

                            return (
                                <g key={i}>
                                    <path 
                                        d={createSlicePath(i, prizes.length, 50)} 
                                        fill={p.color} 
                                        stroke="white" 
                                        strokeWidth="0.5" 
                                    />
                                    
                                    {/* Icon */}
                                    <g transform={`translate(${iconX}, ${iconY}) rotate(${midAngle + 90})`}>
                                        <foreignObject x="-5" y="-5" width="10" height="10">
                                            <div className={`flex justify-center items-center h-full w-full ${['#F7FFF7', '#FFE66D'].includes(p.color) ? 'text-gray-800' : 'text-white'}`}>
                                                <p.icon size={10} strokeWidth={2.5} />
                                            </div>
                                        </foreignObject>
                                    </g>

                                    {/* Text */}
                                    <g transform={`translate(${textX}, ${textY}) rotate(${midAngle + 90})`}>
                                        <text 
                                            x="0" 
                                            y="0" 
                                            fill={['#F7FFF7', '#FFE66D'].includes(p.color) ? '#1f2937' : 'white'}
                                            textAnchor="middle" 
                                            dominantBaseline="middle"
                                            fontSize="3.8" 
                                            fontWeight="800"
                                            fontFamily="Arial, sans-serif"
                                            style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}
                                        >
                                            {p.label}
                                        </text>
                                    </g>
                                </g>
                            )
                        })}
                    </svg>
                </motion.div>

                {/* Center Button */}
                <button 
                    onClick={spin}
                    disabled={spinning}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center font-extrabold text-purple-600 hover:scale-105 transition-transform z-10 text-sm tracking-widest border-4 border-gray-100"
                >
                    SPIN
                </button>
            </div>

            {/* Result Card */}
            {prize && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-6 rounded-xl shadow-2xl text-center border border-gray-100 w-full max-w-sm"
                >
                    <h2 className="text-2xl font-bold text-gray-800">Congratulations, {user?.name}!</h2>
                    <p className="text-gray-500 text-sm mt-1">You won:</p>
                    <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 my-4">
                        {prize}
                    </div>
                    <button className="w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold shadow-md hover:shadow-lg transition-all">
                        CLAIM PRIZE
                    </button>
                </motion.div>
            )}
        </div>
    )
}