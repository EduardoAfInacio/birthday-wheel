import { create } from "zustand";
import { ParticipateResponse, Prize } from "../types/api";

interface AppState {
    session: ParticipateResponse | null;
    setSession: (data: ParticipateResponse) => void;

    qrTokenCode: string | null;
    setQrTokenCode: (code: string) => void;

    prizes: Prize[];
    setPrizes: (prizes: Prize[]) => void;
}

export const useAppStore = create<AppState>((set) => ({
    session: null,
    setSession: (data: ParticipateResponse) => set({ session: data }),

    qrTokenCode: null,
    setQrTokenCode: (code: string) => set({ qrTokenCode: code}),

    prizes: [],
    setPrizes: (prizes: Prize[]) => set({ prizes }),
}))