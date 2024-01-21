import { create } from "zustand";
import { Mistake } from "types";

interface AppStoreState {
  // User entity in FireStore
  user: Record<string, any> | null;
  updateUser: (user: Record<string, any>) => void;

  // Fetched Mistakes using certain `tags`
  mistakes: Mistake[];
  updateMistakes: (newMistakes: Mistake[]) => void;

  // Open / Close `RecordMistake` Dialog
  isOpenRecordMistakeForm: boolean;
  updateIsOpenRecordMistakeForm: (newValue: boolean) => void;

  // Open / Close `ManageCategories` Dialog
  isOpenManageCategoriesDialog: boolean;
  updateIsOpenManageCategoriesDialog: (newValue: boolean) => void;
}

export const useAppStore = create<AppStoreState>((set) => ({
  user: null,
  updateUser: (user: Record<string, any>) => set({ user: user }),

  mistakes: [],
  updateMistakes: (newMistakes: Mistake[]) => set({ mistakes: newMistakes }),

  isOpenRecordMistakeForm: true,
  updateIsOpenRecordMistakeForm: (newValue) =>
    set({ isOpenRecordMistakeForm: newValue }),

  isOpenManageCategoriesDialog: false,
  updateIsOpenManageCategoriesDialog: (newValue) =>
    set({ isOpenManageCategoriesDialog: newValue }),
}));
