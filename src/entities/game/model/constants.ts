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
  1: 10000,
  2: 25000,
  3: 40000,
  4: 60000,
  5: 85000,
  6: 100000,
  7: 125000,
  8: 160000,
  9: 200000,
  10: 250000,
  11: 300000,
  12: 350000,
  13: 400000,
  14: 450000,
  15: 500000,
  16: 625000,
  17: 750000,
  18: 875000,
  19: 1000000,
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
