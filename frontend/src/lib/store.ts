import { create } from "zustand";

export interface UserData {
    name: string;
    email: string;
    phone: string;
    store: string;
}

interface UserStore {
    user: UserData | null;
    setUser: (data: UserData) => void;

    resetUser: () => void;
}

const initialState: UserData = {
    name: "",
    email: "",
    phone: "",
    store: "",
}

export const useUserStore = create<UserStore>((set) => ({
    user: initialState,
    setUser: (data: UserData) => set( { user: data} ),
    resetUser: () => set( { user: initialState})
}))