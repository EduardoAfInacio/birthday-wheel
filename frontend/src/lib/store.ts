import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ParticipateResponse, Prize } from "../types/api";
import { Session } from "inspector/promises";

interface AppState {
    session: ParticipateResponse | null;
    setSession: (data: ParticipateResponse) => void;

    setSpinResult: (prize: Prize) => void;

    qrTokenCode: string | null;
    setQrTokenCode: (code: string) => void;

    prizes: Prize[];
    setPrizes: (prizes: Prize[]) => void;
    reset: () => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            session: null,
            setSession: (data) => set({ session: data }),

            setSpinResult: (prize) => set((state) => ({
                session: state.session? {
                    ...state.session,
                    hasSpun: true,
                    prize: prize,
                }: null
            })),

            qrTokenCode: null,
            setQrTokenCode: (code) => set({ qrTokenCode: code }),

            prizes: [], 
            setPrizes: (prizes) => set({ prizes }),

            reset: () => {
                localStorage.removeItem('birthday-wheel-storage');
                set({ session: null, qrTokenCode: null, prizes: [] })
            }
        }),
        {
            name: 'birthday-wheel-storage',
            storage: createJSONStorage(() => localStorage), 

            partialize: (state) => ({ 
                session: state.session, 
                qrTokenCode: state.qrTokenCode 
            }),
        }
    )
);