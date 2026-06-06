import { LEVEL_CLEAR_DELAY_MS } from "./constants";
import { useGameStore } from "./gameStore";
import type { GameData, GameStatus } from "./types";

export type GameRuntimeSnapshot = GameData & {
  status: GameStatus;
  speedMs: number;
  clearDelayMs: number;
};

export const syncGameStoreState = (snapshot: GameRuntimeSnapshot) => {
  useGameStore.setState({
    ...snapshot,
    clearDelayMs:
      snapshot.status === "levelClear" ? LEVEL_CLEAR_DELAY_MS : snapshot.clearDelayMs,
  });
};

