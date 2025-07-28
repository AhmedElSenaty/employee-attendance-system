// src/store/notification.store.ts
import { create } from "zustand";

interface NotificationStore {
  countt: number;
  setCount: (value: number) => void;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  countt: 0,
  setCount: (value) => set({ countt: value }),
  increment: () => set((state) => ({ countt: state.countt + 1 })),
  decrement: () => set((state) => ({ countt: Math.max(state.countt - 1, 0) })),
  reset: () => set({ countt: 0 }),
}));
