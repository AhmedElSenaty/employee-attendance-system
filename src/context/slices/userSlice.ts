import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "universal-cookie";
import { ILoggedInUser } from "../../interfaces/authInterfaces";
import { RootState } from "../store";

const cookies = new Cookies(null, { path: "/" });

// Helper to retrieve user from cookies/sessionStorage
const getUserFromStorage = (): ILoggedInUser => {
  try {
    const cookieUser = cookies.get("loggedInUser");
    const sessionUser = sessionStorage.getItem("loggedInUser");

    if (cookieUser) return cookieUser;
    if (sessionUser) return JSON.parse(sessionUser);
  } catch (error) {
    console.error("Error retrieving user from storage:", error);
  }

  return { token: "", id: "", role: "", rememberMe: false, permissions: [] };
};

// Helper to persist user
const saveUserToStorage = (user: ILoggedInUser) => {
  if (user.rememberMe) {
    const expiresDate = new Date();
    expiresDate.setMonth(expiresDate.getMonth() + 1);
    cookies.set("loggedInUser", user, { path: "/", expires: expiresDate });
  } else {
    sessionStorage.setItem("loggedInUser", JSON.stringify(user));
  }
};

// Clear user data
const clearUserStorage = () => {
  cookies.remove("loggedInUser", { path: "/" });
  sessionStorage.removeItem("loggedInUser");
};

const initialState: ILoggedInUser = {
  ...getUserFromStorage(),
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<ILoggedInUser>) => {
      if (!action.payload.token) return;

      Object.assign(state, action.payload);
      saveUserToStorage(action.payload);
    },
    logoutUser: (state) => {
      Object.assign(state, {
        token: "",
        id: "",
        role: "",
        rememberMe: false,
        permissions: [],
      });
      clearUserStorage();
      window.location.href = "/login";
    },
  },
});

// Selectors
export const selectToken = (state: RootState): string => state.user.token;
export const selectIsLoggedIn = (state: RootState): boolean => Boolean(state.user.token);
export const selectHasRole = (role: string) => (state: RootState): boolean => state.user.role === role;
export const selectRole = () => (state: RootState): string => state.user.role;
export const selectID = () => (state: RootState): string => state.user.id;
export const selectPermissions = (state: RootState): string[] => state.user.permissions;

export const { setUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
