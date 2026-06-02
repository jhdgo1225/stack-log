import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { CHARACTER_LIST } from "./characters";

type CharacterState = {
  selectedId: string;
  selectCharacter: (id: string) => void;
};

const DEFAULT_CHARACTER_ID = CHARACTER_LIST[0]?.id ?? "flare";

export const useCharacterStore = create<CharacterState>()(
  persist(
    (set) => ({
      selectedId: DEFAULT_CHARACTER_ID,
      selectCharacter: (selectedId) => set({ selectedId }),
    }),
    {
      name: "daker-may-character",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
