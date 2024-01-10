import { toast, ToastOptions } from "react-toastify";

export enum ToastTypes {
  info = "info",
  success = "success",
  error = "error",
}

export const sendCustomNotification = ({
  type,
  message,
}: {
  type: string;
  message: string;
}) => {
  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
  } as ToastOptions;

  if (type === "info") {
    toast.info(message, toastOptions);
  } else if (type === "success") {
    toast.success(message, toastOptions);
  } else {
    toast.error(message, toastOptions);
  }
};
