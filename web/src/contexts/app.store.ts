import { create } from "zustand";
import { Mistake, User } from "types";

interface AppStoreState {
  // ? User entity in FireStore
  user: User | null;
  updateUser: (user: User) => void;

  // ? Fetched Mistakes using certain `tags`
  mistakes: Mistake[];
  updateMistakes: (newMistakes: Mistake[]) => void;

  // ? Open / Close `RecordMistake` Dialog
  isOpenRecordMistakeForm: boolean;
  updateIsOpenRecordMistakeForm: (newValue: boolean) => void;

  // ? Open / Close `ManageCategories` Dialog
  isOpenManageCategoriesDialog: boolean;
  updateIsOpenManageCategoriesDialog: (newValue: boolean) => void;

  // ? Open / Close `UpdateMistake` Dialog
  isOpenUpdateMistakeDialog: boolean;
  updateIsOpenUpdateMistakeDialog: (newValue: boolean) => void;
  editMistakeId: string;
  updateEditMistakeId: (newValue: string) => void;

  // ? Open / Close `AddRepetition` Dialog
  isOpenAddRepetitionDialog: boolean;
  updateIsOpenAddRepetitionDialog: (newValue: boolean) => void;

  // ? Switch between AddRepetition and EditRepetition Form
  isEditRepetition: boolean;
  updateIsEditRepetition: (newValue: boolean) => void;
  editRepetitionId: string;
  updateEditRepetitionId: (newValue: string) => void;
}

export const useAppStore = create<AppStoreState>((set) => ({
  user: null,
  updateUser: (user: User) => set({ user: user }),

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

  isOpenAddRepetitionDialog: false,
  updateIsOpenAddRepetitionDialog: (newValue) =>
    set({ isOpenAddRepetitionDialog: newValue }),

  isEditRepetition: false,
  updateIsEditRepetition: (newValue) => set({ isEditRepetition: newValue }),

  editRepetitionId: "",
  updateEditRepetitionId: (newValue) => set({ editRepetitionId: newValue }),
}));
