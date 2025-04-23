// utils/toastUtils.ts
import { Bounce, toast } from "react-toastify";

export const showToast = (type: "success" | "error" | "warn", message: string) => {
  toast[type](message, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    transition: Bounce,
  });
};
