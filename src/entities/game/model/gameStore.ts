import { create } from "zustand";

import { START_SPEED_MS } from "./constants";
import {
  createInitialGameData,
  getSpeedMs,
  hardDrop as applyHardDrop,
  moveHorizontal,
  stepDown,
} from "./gameLogic";
import type { GameData, GameStatus } from "./types";
import { trackPerformanceSync } from "@/shared/lib/performance/performanceTelemetry";

type GameStore = GameData & {
  status: GameStatus;
  speedMs: number;
  startGame: () => void;
  resetGame: () => void;
  togglePause: () => void;
  tick: () => void;
  moveLeft: () => void;
  moveRight: () => void;
  softDrop: () => void;
  hardDrop: () => void;
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...createInitialGameData(),
  status: "idle",
  speedMs: START_SPEED_MS,
  startGame: () => {
    trackPerformanceSync("game.startGame", () => {
      const nextData = createInitialGameData();
      const spawned = stepDown(nextData);
      const next = spawned.next;

      set({
        ...next,
        status: "playing",
        speedMs: getSpeedMs(next.level),
      });
    });
  },
  resetGame: () => {
    trackPerformanceSync("game.resetGame", () => {
      const nextData = createInitialGameData();
      set({
        ...nextData,
        status: "idle",
        speedMs: START_SPEED_MS,
      });
    });
  },
  togglePause: () => {
    trackPerformanceSync("game.togglePause", () => {
      set((state) => {
        if (state.status === "playing") {
          return { ...state, status: "paused" };
        }

        if (state.status === "paused") {
          return { ...state, status: "playing" };
        }

        return state;
      });
    });
  },
  tick: () => {
    trackPerformanceSync(
      "game.tick",
      () => {
      const { status, board, active, score, lines, level } = get();

      if (status !== "playing") {
        return;
      }

      const result = stepDown({ board, active, score, lines, level });

      set((state) => ({
        ...state,
        ...result.next,
        speedMs: getSpeedMs(result.next.level),
        status: result.gameOver ? "over" : state.status,
      }));
      },
      { kind: "sample", thresholdMs: 0 },
    );
  },
  moveLeft: () => {
    trackPerformanceSync("game.moveLeft", () => {
      const { status, board, active, score, lines, level } = get();

      if (status !== "playing") {
        return;
      }

      const next = moveHorizontal({ board, active, score, lines, level }, -1);
      set((state) => ({ ...state, ...next }));
    });
  },
  moveRight: () => {
    trackPerformanceSync("game.moveRight", () => {
      const { status, board, active, score, lines, level } = get();

      if (status !== "playing") {
        return;
      }

      const next = moveHorizontal({ board, active, score, lines, level }, 1);
      set((state) => ({ ...state, ...next }));
    });
  },
  softDrop: () => {
    trackPerformanceSync("game.softDrop", () => {
      const { status, board, active, score, lines, level } = get();

      if (status !== "playing") {
        return;
      }

      const result = stepDown({ board, active, score, lines, level });

      set((state) => ({
        ...state,
        ...result.next,
        speedMs: getSpeedMs(result.next.level),
        status: result.gameOver ? "over" : state.status,
      }));
    });
  },
  hardDrop: () => {
    trackPerformanceSync("game.hardDrop", () => {
      const { status, board, active, score, lines, level } = get();

      if (status !== "playing") {
        return;
      }

      const result = applyHardDrop({ board, active, score, lines, level });

      set((state) => ({
        ...state,
        ...result.next,
        speedMs: getSpeedMs(result.next.level),
        status: result.gameOver ? "over" : state.status,
      }));
    });
  },
}));
