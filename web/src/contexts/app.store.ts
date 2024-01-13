import { create } from "zustand";
import { User } from "firebase/auth";

interface AppStoreState {
  user: Record<string, any> | null;
  updateUser: (user: Record<string, any>) => void;
}

export const useAppStore = create<AppStoreState>((set) => ({
  user: null,
  updateUser: (user: Record<string, any>) => set({ user: user }),
}));
