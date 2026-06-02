import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { getInitialReduceMotion } from "@/shared/lib/getInitialReduceMotion";

type SettingsState = {
  soundOn: boolean;
  reduceMotion: boolean;
  toggleSound: () => void;
  setReduceMotion: (reduceMotion: boolean) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      soundOn: true,
      reduceMotion: getInitialReduceMotion(),
      toggleSound: () => set((state) => ({ soundOn: !state.soundOn })),
      setReduceMotion: (reduceMotion) => set({ reduceMotion }),
    }),
    {
      name: "daker-may-settings",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
