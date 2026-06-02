import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ScoreState = {
  bestScore: number;
  setBestScore: (score: number) => void;
};

export const useScoreStore = create<ScoreState>()(
  persist(
    (set) => ({
      bestScore: 0,
      setBestScore: (score) =>
        set((state) =>
          score > state.bestScore ? { bestScore: score } : state,
        ),
    }),
    {
      name: "daker-may-score",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
