import { create } from "zustand";
import { User } from "firebase/auth";

interface AuthenticationStoreState {
  dialogMessage: string;
  updateDialogMessage: (newMessage: string) => void;
  showDialog: boolean;
  updateShowDialog: (newValue: boolean) => void;
  confirmEmail: string;
  updateConfirmEmail: (email: string) => void;
  authUserInfo: User | null;
  updateAutUserhInfo: (newAuthInfo: User) => void;
}

export const useAuthenticationStore = create<AuthenticationStoreState>(
  (set) => ({
    dialogMessage: "",
    updateDialogMessage: (newMessage) => set({ dialogMessage: newMessage }),

    showDialog: false,
    updateShowDialog: (newValue) => set({ showDialog: newValue }),

    confirmEmail: "",
    updateConfirmEmail: (email) => set({ confirmEmail: email }),

    authUserInfo: null,
    updateAutUserhInfo: (autUserhInfo) => set({ authUserInfo: autUserhInfo }),
  })
);
