import { create } from "zustand";

interface AuthenticationStoreState {
  dialogMessage: string;
  updateDialogMessage: (newMessage: string) => void;
  showDialog: boolean;
  updateShowDialog: (newValue: boolean) => void;
  confirmEmail: string;
  updateConfirmEmail: (email: string) => void;
}

export const useAuthenticationStore = create<AuthenticationStoreState>(
  (set) => ({
    dialogMessage: "",
    updateDialogMessage: (newMessage) => set({ dialogMessage: newMessage }),

    showDialog: false,
    updateShowDialog: (newValue) => set({ showDialog: newValue }),

    confirmEmail: "",
    updateConfirmEmail: (email) => set({ confirmEmail: email }),
  })
);
