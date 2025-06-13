// src/store/sidebar.store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define the store type
type SidebarStore = {
  isOpen: boolean;
  toggleSidebar: () => void;
  setSidebar: (value: boolean) => void;
};

// Create the Zustand store with persistence
export const useSidebarStore = create<SidebarStore>()(
  persist(
    (set, get) => ({
      isOpen: true, // default: open

      // Toggle between open/close
      toggleSidebar: () => set({ isOpen: !get().isOpen }),

      // Set explicitly
      setSidebar: (value: boolean) => set({ isOpen: value }),
    }),
    {
      name: "sidebar-state", // name in localStorage
    }
  )
);
