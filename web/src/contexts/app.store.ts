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

  // Open / Close `UpdateMistake` Dialog
  isOpenUpdateMistakeDialog: boolean;
  updateIsOpenUpdateMistakeDialog: (newValue: boolean) => void;
  editMistakeId: string;
  updateEditMistakeId: (newValue: string) => void;
}

export const useAppStore = create<AppStoreState>((set) => ({
  user: null,
  updateUser: (user: Record<string, any>) => set({ user: user }),

  mistakes: [],
  updateMistakes: (newMistakes: Mistake[]) => set({ mistakes: newMistakes }),

  isOpenRecordMistakeForm: false,
  updateIsOpenRecordMistakeForm: (newValue) =>
    set({ isOpenRecordMistakeForm: newValue }),

  isOpenManageCategoriesDialog: false,
  updateIsOpenManageCategoriesDialog: (newValue) =>
    set({ isOpenManageCategoriesDialog: newValue }),

  isOpenUpdateMistakeDialog: false,
  updateIsOpenUpdateMistakeDialog: (newValue) =>
    set({ isOpenUpdateMistakeDialog: newValue }),

  editMistakeId: "",
  updateEditMistakeId: (newValue) => set({ editMistakeId: newValue }),
}));
