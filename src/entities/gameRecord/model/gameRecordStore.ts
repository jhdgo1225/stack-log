import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { GameRecord } from "./types";

type GameRecordState = {
  records: GameRecord[];
  addRecord: (record: GameRecord) => void;
};

const MAX_RECORDS = 200;

export const useGameRecordStore = create<GameRecordState>()(
  persist(
    (set) => ({
      records: [],
      addRecord: (record) =>
        set((state) => ({
          records: [record, ...state.records].slice(0, MAX_RECORDS),
        })),
    }),
    {
      name: "daker-may-game-records",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
