import { create } from "zustand";

interface AppStoreState {
  // User entity in FireStore
  user: Record<string, any> | null;
  updateUser: (user: Record<string, any>) => void;

  // RecordMistake
  isOpenRecordMistakeForm: boolean;
  updateIsOpenRecordMistakeForm: (newValue: boolean) => void;
}

export const useAppStore = create<AppStoreState>((set) => ({
  user: null,
  updateUser: (user: Record<string, any>) => set({ user: user }),

  isOpenRecordMistakeForm: false,
  updateIsOpenRecordMistakeForm: (newValue) =>
    set({ isOpenRecordMistakeForm: newValue }),
}));
