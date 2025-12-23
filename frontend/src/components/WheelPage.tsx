"use client";

import { useState } from "react"
import * as confetti from "canvas-confetti"
import { motion, useAnimation } from "framer-motion"
import { Button } from "./ui/button";

const prizes = [ 
    { label: "10% OFF", color: "#FF6B6B" },
    { label: "20% OFF", color: "#4ECDC4" },
    { label: "30% OFF", color: "#FFE66D" },
    { label: "50% OFF", color: "#1A535C" },
    { label: "Frete Grátis", color: "#FF9F1C" },
    { label: "Tente de novo", color: "#F7FFF7" }, 
]

export function WheelPage() {
    const controls = useAnimation();
    const [spinning, setSpinning] = useState(false);
    const [prize, setPrize] = useState<string | null>(null);

    const spin = async () => {
        if (spinning) return;
        setSpinning(true);
        setPrize(null);

        const winningIndex = 3;
        const segmentAngle = 360 / prizes.length;
        const currentRotation = 0 
        const spinRotation = 1800 + (360 - (winningIndex * segmentAngle))

        await controls.start({
            rotate: spinRotation,
            transition: { duration: 4, type: "spring", damping: 10, stiffness: 50 },
        })

        setSpinning(false);
        setPrize(prizes[winningIndex].label);

        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }  
        })
    }
    return (
        <div className="flex flex-col items-center gap-8">
        <div className="relative w-80 h-80 rounded-full border-4 border-white shadow-2xl overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-yellow-400" />

            <motion.div
            className="w-full h-full"
            animate={controls}
            style={{ borderRadius: "50%" }}
            >
            <div className="w-full h-full rounded-full" 
                style={{
                    background: `conic-gradient(
                    ${prizes.map((p, i) => 
                        `${p.color} ${(i * 100)/prizes.length}% ${((i+1) * 100)/prizes.length}%`
                    ).join(', ')}
                    )`
                }} 
            />
            </motion.div>
            <button 
            onClick={spin}
            disabled={spinning}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center font-bold text-purple-600 hover:scale-105 transition"
            >
            SPIN
            </button>
        </div>
        {prize && (
            <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-xl text-center"
            >
            <h2 className="text-2xl font-bold text-gray-800">Congratulations!</h2>
            <p className="text-lg">Você ganhou: <span className="font-bold text-pink-600 text-3xl block mt-2">{prize}</span></p>
            <Button className="mt-4 w-full bg-pink-500">Enjoy your prize!</Button>
            </motion.div>
        )}
        </div>
    )
}