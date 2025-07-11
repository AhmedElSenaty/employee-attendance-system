import { create } from "zustand";
import Cookies from "universal-cookie";
import { ILoggedInUser } from "../interfaces/auth.interfaces";

const cookies = new Cookies(null, { path: "/" });

// Helpers
const getUserFromStorage = (): ILoggedInUser => {
  try {
    const cookieUser = cookies.get("loggedInUser");
    const sessionUser = sessionStorage.getItem("loggedInUser");

    if (cookieUser) return cookieUser;
    if (sessionUser) return JSON.parse(sessionUser);
  } catch (error) {
    console.error("Error retrieving user from storage:", error);
  }

  return {
    token: "",
    id: "",
    name: "",
    role: "",
    departmentId: "",
    imageUrl: null,
    rememberMe: false,
    permissions: [],
  };
};

const saveUserToStorage = (user: ILoggedInUser) => {
  if (user.rememberMe) {
    const expiresDate = new Date();
    expiresDate.setMonth(expiresDate.getMonth() + 1);
    cookies.set("loggedInUser", user, { path: "/", expires: expiresDate });
  } else {
    sessionStorage.setItem("loggedInUser", JSON.stringify(user));
  }
};

const clearUserStorage = () => {
  cookies.remove("loggedInUser", { path: "/" });
  sessionStorage.removeItem("loggedInUser");
};

// Zustand store
type UserStore = ILoggedInUser & {
  setUser: (user: ILoggedInUser) => void;
  logoutUser: () => void;
};

export const useUserStore = create<UserStore>((set) => ({
  ...getUserFromStorage(),

  setUser: (user) => {
    if (!user.token) return;
    saveUserToStorage(user);
    set({ ...user });
  },

  logoutUser: () => {
    clearUserStorage();
    set({
      token: "",
      id: "",
      role: "",
      name: "",
      imageUrl: null,
      rememberMe: false,
      permissions: [],
    });
    window.location.href = "/login";
  },
}));
