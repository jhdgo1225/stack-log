import { create } from "zustand";

import { trackPerformanceSync } from "@/shared/lib/performance/performanceTelemetry";

import { getGameEngineBridge } from "./gameBridge";
import {
  LEVEL_CLEAR_DELAY_MS,
  LEVEL_TARGET_SCORES,
  START_SPEED_MS,
} from "./constants";
import {
  createInitialGameData,
  getSpeedMs,
  hardDrop as applyHardDrop,
  holdBlock as applyHoldBlock,
  moveHorizontal,
  reduceSkillCooldownMax,
  reduceSkillCooldowns,
  rotateActiveBlock,
  spawnNextBlock,
  stepDown,
  tickObstacles,
  useSkill as applySkill,
} from "./gameLogic";
import type { GameData, GameStatus, SkillKey } from "./types";

const COOLDOWN_TICK_MS = 250;

type GameStore = GameData & {
  status: GameStatus;
  speedMs: number;
  clearDelayMs: number;
  startGame: () => void;
  startLevel: () => void;
  continueAfterClear: () => void;
  resetGame: () => void;
  resetRun: () => void;
  togglePause: () => void;
  toggleHelp: () => void;
  tick: () => void;
  tickSkillCooldowns: () => void;
  moveLeft: () => void;
  moveRight: () => void;
  rotateClockwise: () => void;
  rotateCounterClockwise: () => void;
  softDrop: () => void;
  hardDrop: () => void;
  holdBlock: () => void;
  useSkill: (key: SkillKey) => void;
};

const toStatusState = (status: GameStatus) => ({
  status,
  clearDelayMs: status === "levelClear" ? LEVEL_CLEAR_DELAY_MS : 0,
});

const createRunStartState = () => ({
  ...createInitialGameData(),
  ...toStatusState("levelIntro"),
  speedMs: START_SPEED_MS,
});

export const useGameStore = create<GameStore>((set, get) => ({
  ...createRunStartState(),
  startGame: () => {
    trackPerformanceSync("game.startGame", () => {
      const bridge = getGameEngineBridge();

      if (bridge) {
        bridge.startGame();
        return;
      }

      set(createRunStartState());
    });
  },
  startLevel: () => {
    trackPerformanceSync("game.startLevel", () => {
      const bridge = getGameEngineBridge();

      if (bridge) {
        bridge.startLevel();
        return;
      }

      const state = get();
      let base: GameData = state;

      if (state.active) {
        base = createInitialGameData(
          state.level,
          state.score,
          state.lines,
          state.skillUses,
        );
      }

      if (state.status === "failed") {
        base = createInitialGameData();
      }

      const spawned = spawnNextBlock(base);

      set({
        ...spawned.next,
        ...toStatusState(spawned.failed ? "failed" : "playing"),
        speedMs: getSpeedMs(spawned.next.level),
      });
    });
  },
  continueAfterClear: () => {
    trackPerformanceSync("game.continueAfterClear", () => {
      const bridge = getGameEngineBridge();

      if (bridge) {
        bridge.continueAfterClear();
        return;
      }

      const state = get();

      if (state.status !== "levelClear") {
        return;
      }

      const nextLevel = Math.min(20, state.level + 1);
      const nextData = createInitialGameData(
        nextLevel,
        state.score,
        state.lines,
        state.skillUses,
      );

      set({
        ...nextData,
        targetScore: LEVEL_TARGET_SCORES[nextLevel] ?? null,
        ...toStatusState("levelIntro"),
        speedMs: getSpeedMs(nextLevel),
      });
    });
  },
  resetGame: () => {
    trackPerformanceSync("game.resetGame", () => {
      const bridge = getGameEngineBridge();

      if (bridge) {
        bridge.resetGame();
        return;
      }

      set(createRunStartState());
    });
  },
  resetRun: () => {
    trackPerformanceSync("game.resetRun", () => {
      const bridge = getGameEngineBridge();

      if (bridge) {
        bridge.resetRun();
        return;
      }

      set(createRunStartState());
    });
  },
  togglePause: () => {
    trackPerformanceSync("game.togglePause", () => {
      const bridge = getGameEngineBridge();

      if (bridge) {
        bridge.togglePause();
        return;
      }

      set((state) => {
        if (state.helpOpen) {
          return { ...state, helpOpen: false };
        }

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
  toggleHelp: () => {
    trackPerformanceSync("game.toggleHelp", () => {
      const bridge = getGameEngineBridge();

      if (bridge) {
        bridge.toggleHelp();
        return;
      }

      set((state) => ({
        ...state,
        helpOpen: !state.helpOpen,
        status:
          !state.helpOpen && state.status === "playing"
            ? "paused"
            : state.status,
      }));
    });
  },
  tick: () => {
    trackPerformanceSync(
      "game.tick",
      () => {
        const bridge = getGameEngineBridge();

        if (bridge) {
          bridge.tick();
          return;
        }

        const state = get();

        if (state.status !== "playing") {
          return;
        }

        const obstacleResult = tickObstacles(state, state.speedMs);

        if (obstacleResult.status !== "playing") {
          set({
            ...obstacleResult.next,
            ...toStatusState(obstacleResult.status),
            speedMs: getSpeedMs(obstacleResult.next.level),
          });
          return;
        }

        const result = stepDown(obstacleResult.next);

        set({
          ...result.next,
          ...toStatusState(result.status),
          speedMs: getSpeedMs(result.next.level),
        });
      },
      { kind: "sample", thresholdMs: 0 },
    );
  },
  tickSkillCooldowns: () => {
    trackPerformanceSync("game.tickSkillCooldowns", () => {
      const bridge = getGameEngineBridge();

      if (bridge) {
        bridge.tickSkillCooldowns();
        return;
      }

      const state = get();

      if (state.status !== "playing") {
        return;
      }

      const nextSkillCooldowns = reduceSkillCooldowns(
        state.skillCooldowns,
        COOLDOWN_TICK_MS,
      );

      set({
        ...state,
        skillCooldowns: nextSkillCooldowns,
        skillCooldownMax: reduceSkillCooldownMax(
          nextSkillCooldowns,
          state.skillCooldownMax,
        ),
      });
    });
  },
  moveLeft: () => {
    trackPerformanceSync("game.moveLeft", () => {
      const bridge = getGameEngineBridge();

      if (bridge) {
        bridge.moveLeft();
        return;
      }

      const state = get();

      if (state.status !== "playing") {
        return;
      }

      set({ ...state, ...moveHorizontal(state, -1) });
    });
  },
  moveRight: () => {
    trackPerformanceSync("game.moveRight", () => {
      const bridge = getGameEngineBridge();

      if (bridge) {
        bridge.moveRight();
        return;
      }

      const state = get();

      if (state.status !== "playing") {
        return;
      }

      set({ ...state, ...moveHorizontal(state, 1) });
    });
  },
  rotateClockwise: () => {
    trackPerformanceSync("game.rotateClockwise", () => {
      const bridge = getGameEngineBridge();

      if (bridge) {
        bridge.rotateClockwise();
        return;
      }

      const state = get();

      if (state.status !== "playing") {
        return;
      }

      set({ ...state, ...rotateActiveBlock(state, 1) });
    });
  },
  rotateCounterClockwise: () => {
    trackPerformanceSync("game.rotateCounterClockwise", () => {
      const bridge = getGameEngineBridge();

      if (bridge) {
        bridge.rotateCounterClockwise();
        return;
      }

      const state = get();

      if (state.status !== "playing") {
        return;
      }

      set({ ...state, ...rotateActiveBlock(state, -1) });
    });
  },
  softDrop: () => {
    trackPerformanceSync("game.softDrop", () => {
      const bridge = getGameEngineBridge();

      if (bridge) {
        bridge.softDrop();
        return;
      }

      const state = get();

      if (state.status !== "playing") {
        return;
      }

      const result = stepDown(state);

      set({
        ...result.next,
        ...toStatusState(result.status),
        speedMs: getSpeedMs(result.next.level),
      });
    });
  },
  hardDrop: () => {
    trackPerformanceSync("game.hardDrop", () => {
      const bridge = getGameEngineBridge();

      if (bridge) {
        bridge.hardDrop();
        return;
      }

      const state = get();

      if (state.status !== "playing") {
        return;
      }

      const result = applyHardDrop(state);

      set({
        ...result.next,
        ...toStatusState(result.status),
        speedMs: getSpeedMs(result.next.level),
      });
    });
  },
  holdBlock: () => {
    trackPerformanceSync("game.holdBlock", () => {
      const bridge = getGameEngineBridge();

      if (bridge) {
        bridge.holdBlock();
        return;
      }

      const state = get();

      if (state.status !== "playing") {
        return;
      }

      const result = applyHoldBlock(state);

      set({
        ...result.next,
        ...toStatusState(result.status),
        speedMs: getSpeedMs(result.next.level),
      });
    });
  },
  useSkill: (key) => {
    trackPerformanceSync(`game.useSkill.${key}`, () => {
      const bridge = getGameEngineBridge();

      if (bridge) {
        bridge.useSkill(key);
        return;
      }

      const state = get();

      if (state.status !== "playing") {
        return;
      }

      const skilled = applySkill(state, key);
      const status =
        skilled.targetScore !== null && skilled.score >= skilled.targetScore
          ? "levelClear"
          : "playing";

      set({
        ...skilled,
        ...toStatusState(status),
        speedMs: getSpeedMs(skilled.level),
      });
    });
  },
}));
