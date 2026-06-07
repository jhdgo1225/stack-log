import type { BlockKind, ObstacleRule } from "./types";

export const BOARD_WIDTH = 12;
export const BOARD_HEIGHT = 25;
export const HIDDEN_ROWS = 4;
export const VISIBLE_ROWS = BOARD_HEIGHT - HIDDEN_ROWS;
export const START_SPEED_MS = 2000;
export const MIN_SPEED_MS = 750;
export const SPEED_STEP_MS = 75;
export const SKILL_SCORE = 200;
export const LEVEL_CLEAR_DELAY_MS = 5000;
export const OBSTACLE_WARNING_MS = 3000;
export const OBSTACLE_FALL_ROW_MS = 100;
export const OBSTACLE_FALL_START_ROWS = VISIBLE_ROWS + 1;
export const OBSTACLE_FALL_DURATION_MS =
  OBSTACLE_FALL_START_ROWS * OBSTACLE_FALL_ROW_MS;

export const LEVEL_TARGET_SCORES: Record<number, number | null> = {
  1: 2000,
  2: 4000,
  3: 6000,
  4: 8000,
  5: 10000,
  6: 12500,
  7: 15000,
  8: 17500,
  9: 20000,
  10: 23000,
  11: 26000,
  12: 29000,
  13: 32000,
  14: 35000,
  15: 40000,
  16: 45000,
  17: 50000,
  18: 55000,
  19: 60000,
  20: null,
};

const obstacle = (
  intervalMs: number,
  blocks: Array<{ kind: BlockKind; count: number }>,
): ObstacleRule => ({ intervalMs, blocks });

export const OBSTACLE_RULES: Record<number, ObstacleRule> = {
  1: obstacle(10000, [{ kind: "single", count: 1 }]),
  2: obstacle(9000, [{ kind: "single", count: 2 }]),
  3: obstacle(9000, [
    { kind: "single", count: 1 },
    { kind: "line2", count: 1 },
  ]),
  4: obstacle(9000, [
    { kind: "single", count: 2 },
    { kind: "line2", count: 1 },
  ]),
  5: obstacle(9000, [
    { kind: "single", count: 4 },
    { kind: "line2", count: 1 },
  ]),
  6: obstacle(9000, [
    { kind: "single", count: 4 },
    { kind: "line2", count: 2 },
  ]),
  7: obstacle(9000, [
    { kind: "line2", count: 2 },
    { kind: "line3", count: 2 },
  ]),
  8: obstacle(8000, [
    { kind: "line2", count: 2 },
    { kind: "square", count: 2 },
  ]),
  9: obstacle(8000, [
    { kind: "line2", count: 2 },
    { kind: "corner", count: 2 },
  ]),
  10: obstacle(8000, [
    { kind: "line2", count: 3 },
    { kind: "corner", count: 3 },
  ]),
  11: obstacle(8000, [
    { kind: "line2", count: 3 },
    { kind: "corner", count: 3 },
    { kind: "line3", count: 1 },
  ]),
  12: obstacle(8000, [
    { kind: "line2", count: 3 },
    { kind: "corner", count: 4 },
    { kind: "line3", count: 1 },
  ]),
  13: obstacle(8000, [
    { kind: "line3", count: 2 },
    { kind: "line4", count: 1 },
    { kind: "corner", count: 3 },
  ]),
  14: obstacle(8000, [
    { kind: "line3", count: 2 },
    { kind: "line4", count: 1 },
    { kind: "corner", count: 3 },
  ]),
  15: obstacle(8000, [
    { kind: "line3", count: 3 },
    { kind: "corner", count: 2 },
    { kind: "square", count: 1 },
  ]),
  16: obstacle(7000, [
    { kind: "line3", count: 1 },
    { kind: "line4Vertical", count: 1 },
    { kind: "corner", count: 1 },
    { kind: "square", count: 1 },
  ]),
  17: obstacle(7000, [
    { kind: "line3", count: 2 },
    { kind: "line4Vertical", count: 1 },
    { kind: "corner", count: 1 },
    { kind: "square", count: 1 },
  ]),
  18: obstacle(6000, [
    { kind: "line3", count: 1 },
    { kind: "line4Vertical", count: 1 },
    { kind: "corner", count: 1 },
    { kind: "square", count: 1 },
  ]),
  19: obstacle(6000, [
    { kind: "line3", count: 2 },
    { kind: "line4Vertical", count: 1 },
    { kind: "corner", count: 1 },
    { kind: "square", count: 1 },
  ]),
  20: obstacle(5000, [
    { kind: "line3", count: 1 },
    { kind: "line4Vertical", count: 1 },
    { kind: "corner", count: 1 },
    { kind: "square", count: 1 },
  ]),
};
