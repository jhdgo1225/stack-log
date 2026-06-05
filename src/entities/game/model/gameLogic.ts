import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  HIDDEN_ROWS,
  LEVEL_TARGET_SCORES,
  MIN_SPEED_MS,
  OBSTACLE_WARNING_MS,
  OBSTACLE_RULES,
  SKILL_SCORE,
  SPEED_STEP_MS,
  START_SPEED_MS,
} from "./constants";
import type {
  ActiveBlock,
  BagSlot,
  BlockDefinition,
  BlockKind,
  Board,
  Cell,
  GameData,
  GameStatus,
  Point,
  SkillCooldowns,
  SkillKey,
  SkillUses,
  TickResult,
} from "./types";

const EMPTY_CELL: Cell = 0;
const LOCKED_CELL: Cell = 1;
const ACTIVE_CELL: Cell = 2;
const OBSTACLE_CELL: Cell = 3;
const SKILL_CELL: Cell = 4;
const SKILL_COOLDOWN_MS: Record<SkillKey, number> = {
  Q: 15000,
  W: 30000,
  E: 15000,
  R: 60000,
};
const JLSTZ_KICKS: Record<string, Point[]> = {
  "0>1": [
    { x: 0, y: 0 },
    { x: -1, y: 0 },
    { x: -1, y: -1 },
    { x: 0, y: 2 },
    { x: -1, y: 2 },
  ],
  "1>0": [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 0, y: -2 },
    { x: 1, y: -2 },
  ],
  "1>2": [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 0, y: -2 },
    { x: 1, y: -2 },
  ],
  "2>1": [
    { x: 0, y: 0 },
    { x: -1, y: 0 },
    { x: -1, y: -1 },
    { x: 0, y: 2 },
    { x: -1, y: 2 },
  ],
  "2>3": [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: -1 },
    { x: 0, y: 2 },
    { x: 1, y: 2 },
  ],
  "3>2": [
    { x: 0, y: 0 },
    { x: -1, y: 0 },
    { x: -1, y: 1 },
    { x: 0, y: -2 },
    { x: -1, y: -2 },
  ],
  "3>0": [
    { x: 0, y: 0 },
    { x: -1, y: 0 },
    { x: -1, y: 1 },
    { x: 0, y: -2 },
    { x: -1, y: -2 },
  ],
  "0>3": [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: -1 },
    { x: 0, y: 2 },
    { x: 1, y: 2 },
  ],
};
const LINE_KICKS: Record<string, Point[]> = {
  "0>1": [
    { x: 0, y: 0 },
    { x: -2, y: 0 },
    { x: 1, y: 0 },
    { x: -2, y: 1 },
    { x: 1, y: -2 },
  ],
  "1>0": [
    { x: 0, y: 0 },
    { x: 2, y: 0 },
    { x: -1, y: 0 },
    { x: 2, y: -1 },
    { x: -1, y: 2 },
  ],
  "1>2": [
    { x: 0, y: 0 },
    { x: -1, y: 0 },
    { x: 2, y: 0 },
    { x: -1, y: -2 },
    { x: 2, y: 1 },
  ],
  "2>1": [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: -2, y: 0 },
    { x: 1, y: 2 },
    { x: -2, y: -1 },
  ],
  "2>3": [
    { x: 0, y: 0 },
    { x: 2, y: 0 },
    { x: -1, y: 0 },
    { x: 2, y: -1 },
    { x: -1, y: 2 },
  ],
  "3>2": [
    { x: 0, y: 0 },
    { x: -2, y: 0 },
    { x: 1, y: 0 },
    { x: -2, y: 1 },
    { x: 1, y: -2 },
  ],
  "3>0": [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: -2, y: 0 },
    { x: 1, y: 2 },
    { x: -2, y: -1 },
  ],
  "0>3": [
    { x: 0, y: 0 },
    { x: -1, y: 0 },
    { x: 2, y: 0 },
    { x: -1, y: -2 },
    { x: 2, y: 1 },
  ],
};

const baseDefinitions: Array<Omit<BlockDefinition, "id">> = [
  { kind: "single", label: "1", cells: [{ x: 0, y: 0 }] },
  {
    kind: "line2",
    label: "2",
    cells: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
    ],
  },
  {
    kind: "line3",
    label: "3",
    cells: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
    ],
  },
  {
    kind: "line4",
    label: "4",
    cells: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 3, y: 0 },
    ],
  },
  {
    kind: "line4Vertical",
    label: "1x4",
    cells: [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
      { x: 0, y: 3 },
    ],
  },
  {
    kind: "corner",
    label: "L",
    cells: [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ],
  },
  {
    kind: "square",
    label: "O",
    cells: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ],
  },
];

const bagKinds: BlockKind[] = [
  "single",
  "single",
  "line2",
  "line2",
  "line3",
  "line4",
  "corner",
  "square",
];

const emptyCooldowns = (): SkillCooldowns => ({
  Q: 0,
  W: 0,
  E: 0,
  R: 0,
});

const emptySkillUses = (): SkillUses => ({
  Q: 0,
  W: 0,
  E: 0,
  R: 0,
});

const randomInt = (maxExclusive: number, rng = Math.random) =>
  Math.floor(rng() * maxExclusive);

export const createEmptyBoard = (
  width = BOARD_WIDTH,
  height = BOARD_HEIGHT,
): Board =>
  Array.from({ length: height }, () =>
    Array.from({ length: width }, () => EMPTY_CELL),
  );

export const getBlockDefinition = (kind: BlockKind, id: string = kind) => {
  const base = baseDefinitions.find((definition) => definition.kind === kind);

  if (!base) {
    throw new Error(`Unknown block kind: ${kind}`);
  }

  return {
    ...base,
    id,
    cells: base.cells.map((cell) => ({ ...cell })),
  };
};

const shuffle = <T>(items: T[], rng = Math.random) => {
  const next = [...items];

  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInt(index + 1, rng);
    const current = next[index];
    next[index] = next[swapIndex];
    next[swapIndex] = current;
  }

  return next;
};

export const createBag = (rng = Math.random): BagSlot[] =>
  shuffle(bagKinds, rng).map((kind, index) => ({
    id: `${kind}-${index}-${Math.round(rng() * 100000)}`,
    definition: getBlockDefinition(kind, `${kind}-${index}`),
    used: false,
  }));

export const createInitialGameData = (
  level = 1,
  score = 0,
  lines = 0,
  skillUses = emptySkillUses(),
): GameData => ({
  board: createEmptyBoard(),
  active: null,
  bag: createBag(),
  heldBlock: null,
  canHold: true,
  score,
  lines,
  level,
  combo: 0,
  maxCombo: 0,
  targetScore: LEVEL_TARGET_SCORES[level] ?? null,
  skillCooldowns: emptyCooldowns(),
  skillUses,
  obstacleElapsedMs: 0,
  obstacleWarningMs: 0,
  obstaclePreviewBlocks: [],
  helpOpen: false,
  failureBlocks: [],
});

const normalizeCells = (cells: Point[]) => {
  const minX = Math.min(...cells.map((cell) => cell.x));
  const minY = Math.min(...cells.map((cell) => cell.y));

  return cells
    .map((cell) => ({ x: cell.x - minX, y: cell.y - minY }))
    .sort((a, b) => a.y - b.y || a.x - b.x);
};

const rotateCells = (cells: Point[], direction: 1 | -1) =>
  normalizeCells(
    cells.map((cell) =>
      direction === 1 ? { x: cell.y, y: -cell.x } : { x: -cell.y, y: cell.x },
    ),
  );

const getRotationCells = (definition: BlockDefinition, rotation: number) => {
  let cells = definition.cells.map((cell) => ({ ...cell }));

  for (let index = 0; index < rotation; index += 1) {
    cells = rotateCells(cells, 1);
  }

  return cells;
};

const getKickTable = (kind: BlockKind) =>
  kind === "line4" || kind === "line4Vertical" ? LINE_KICKS : JLSTZ_KICKS;

const getCollisionCorrectionKicks = (
  kind: BlockKind,
  fromRotation: number,
  toRotation: number,
) => {
  if (kind === "square") {
    return [{ x: 0, y: 0 }];
  }

  return (
    getKickTable(kind)[`${fromRotation}>${toRotation}`] ?? [{ x: 0, y: 0 }]
  );
};

const getSize = (cells: Point[]) => ({
  width: Math.max(...cells.map((cell) => cell.x)) + 1,
  height: Math.max(...cells.map((cell) => cell.y)) + 1,
});

export const getAbsoluteCells = (active: ActiveBlock) =>
  active.cells.map((cell) => ({
    x: active.position.x + cell.x,
    y: active.position.y + cell.y,
  }));

const isInsideBoard = (point: Point) =>
  point.x >= 0 &&
  point.x < BOARD_WIDTH &&
  point.y >= 0 &&
  point.y < BOARD_HEIGHT;

export const canPlaceCells = (board: Board, cells: Point[]) =>
  cells.every(
    (cell) => isInsideBoard(cell) && board[cell.y][cell.x] === EMPTY_CELL,
  );

export const canPlaceActive = (board: Board, active: ActiveBlock) =>
  canPlaceCells(board, getAbsoluteCells(active));

const createActiveBlock = (
  definition: BlockDefinition,
  rng = Math.random,
): ActiveBlock => {
  const size = getSize(definition.cells);
  const maxX = Math.max(1, Math.min(10, BOARD_WIDTH - size.width));
  const spawnX = Math.min(maxX, Math.max(1, randomInt(10, rng) + 1));

  return {
    id: `${definition.id}-${Date.now()}-${Math.round(rng() * 10000)}`,
    definition,
    position: { x: spawnX, y: HIDDEN_ROWS },
    rotation: 0,
    cells: definition.cells.map((cell) => ({ ...cell })),
  };
};

export const takeNextBlock = (bag: BagSlot[], rng = Math.random) => {
  const sourceBag = bag.some((slot) => !slot.used) ? bag : createBag(rng);
  const nextIndex = sourceBag.findIndex((slot) => !slot.used);
  const nextSlot = sourceBag[nextIndex];

  return {
    bag: sourceBag.map((slot, index) =>
      index === nextIndex ? { ...slot, used: true } : slot,
    ),
    definition: nextSlot.definition,
  };
};

export const spawnNextBlock = (state: GameData, rng = Math.random) => {
  const draw = takeNextBlock(state.bag, rng);
  const active = createActiveBlock(draw.definition, rng);

  return {
    next: {
      ...state,
      bag: draw.bag,
      active: canPlaceActive(state.board, active) ? active : null,
      canHold: true,
    },
    failed: !canPlaceActive(state.board, active),
  };
};

const mergeCells = (board: Board, cells: Point[], cellType: Cell) => {
  const nextBoard = board.map((row) => row.slice());

  cells.forEach((cell) => {
    if (isInsideBoard(cell)) {
      nextBoard[cell.y][cell.x] = cellType;
    }
  });

  return nextBoard;
};

export const mergeActiveBlock = (board: Board, active: ActiveBlock) =>
  mergeCells(board, getAbsoluteCells(active), LOCKED_CELL);

export const clearFullRows = (board: Board) => {
  const remainingRows = board.filter((row) =>
    row.some((cell) => cell === EMPTY_CELL),
  );
  const clearedLines = board.length - remainingRows.length;
  const emptyRow = Array.from({ length: board[0].length }, () => EMPTY_CELL);
  const filledRows = Array.from({ length: clearedLines }, () => [...emptyRow]);

  return {
    board: [...filledRows, ...remainingRows],
    clearedLines,
  };
};

export const getScoreForLines = (clearedLines: number) => {
  if (clearedLines === 1) {
    return 100;
  }

  if (clearedLines === 2) {
    return 200;
  }

  if (clearedLines === 3) {
    return 500;
  }

  if (clearedLines >= 4) {
    return 1000 + (clearedLines - 4) * 200;
  }

  return 0;
};

const hasHiddenBlocks = (board: Board) =>
  board
    .slice(0, HIDDEN_ROWS)
    .some((row) => row.some((cell) => cell !== EMPTY_CELL));

const getFailureBlocks = (board: Board) =>
  board.flatMap((row, y) =>
    row.flatMap((cell, x) => (cell === EMPTY_CELL ? [] : [{ x, y }])),
  );

const applyLineScore = (
  state: GameData,
  board: Board,
  clearedLines: number,
) => {
  if (clearedLines === 0) {
    return {
      ...state,
      board,
      combo: 0,
    };
  }

  const nextCombo = state.combo + 1;
  const comboScore = nextCombo >= 2 ? 200 * (nextCombo - 1) : 0;

  return {
    ...state,
    board,
    lines: state.lines + clearedLines,
    score: state.score + getScoreForLines(clearedLines) + comboScore,
    combo: nextCombo,
    maxCombo: Math.max(state.maxCombo, nextCombo),
  };
};

const getStatusAfterScore = (state: GameData): GameStatus => {
  if (state.targetScore !== null && state.score >= state.targetScore) {
    return "levelClear";
  }

  return "playing";
};

export const getSpeedMs = (level: number) =>
  Math.max(MIN_SPEED_MS, START_SPEED_MS - (level - 1) * SPEED_STEP_MS);

export const stepDown = (state: GameData, rng = Math.random): TickResult => {
  if (!state.active) {
    const spawned = spawnNextBlock(state, rng);

    return {
      next: spawned.next,
      locked: false,
      status: spawned.failed ? "failed" : "playing",
    };
  }

  const movedActive = {
    ...state.active,
    position: {
      x: state.active.position.x,
      y: state.active.position.y + 1,
    },
  };

  if (canPlaceActive(state.board, movedActive)) {
    return {
      next: {
        ...state,
        active: movedActive,
      },
      locked: false,
      status: "playing",
    };
  }

  const merged = mergeActiveBlock(state.board, state.active);
  const { board: clearedBoard, clearedLines } = clearFullRows(merged);
  const scored = applyLineScore(
    {
      ...state,
      active: null,
    },
    clearedBoard,
    clearedLines,
  );

  if (hasHiddenBlocks(scored.board)) {
    return {
      next: {
        ...scored,
        failureBlocks: getFailureBlocks(scored.board),
      },
      locked: true,
      status: "failed",
    };
  }

  const scoredStatus = getStatusAfterScore(scored);

  if (scoredStatus === "levelClear") {
    return {
      next: scored,
      locked: true,
      status: scoredStatus,
    };
  }

  const spawned = spawnNextBlock(scored, rng);
  let next = spawned.next;

  if (spawned.failed) {
    next = {
      ...spawned.next,
      failureBlocks: getFailureBlocks(scored.board),
    };
  }

  return {
    next,
    locked: true,
    status: spawned.failed ? "failed" : "playing",
  };
};

export const moveHorizontal = (state: GameData, deltaX: number) => {
  if (!state.active) {
    return state;
  }

  const nextActive = {
    ...state.active,
    position: {
      x: state.active.position.x + deltaX,
      y: state.active.position.y,
    },
  };

  return canPlaceActive(state.board, nextActive)
    ? { ...state, active: nextActive }
    : state;
};

export const rotateActiveBlock = (state: GameData, direction: 1 | -1) => {
  if (!state.active) {
    return state;
  }

  const nextRotation = (state.active.rotation + direction + 4) % 4;
  const rotatedCells = getRotationCells(state.active.definition, nextRotation);
  const kicks = getCollisionCorrectionKicks(
    state.active.definition.kind,
    state.active.rotation,
    nextRotation,
  );

  for (const kick of kicks) {
    const candidate = {
      ...state.active,
      cells: rotatedCells,
      rotation: nextRotation,
      position: {
        x: state.active.position.x + kick.x,
        y: state.active.position.y + kick.y,
      },
    };

    if (canPlaceActive(state.board, candidate)) {
      return {
        ...state,
        active: candidate,
      };
    }
  }

  return state;
};

export const hardDrop = (state: GameData, rng = Math.random) => {
  let nextState = state;
  let result = stepDown(nextState, rng);
  let guard = BOARD_HEIGHT + HIDDEN_ROWS;

  while (!result.locked && result.status === "playing" && guard > 0) {
    nextState = result.next;
    result = stepDown(nextState, rng);
    guard -= 1;
  }

  return result;
};

export const holdBlock = (state: GameData, rng = Math.random) => {
  if (!state.active || !state.canHold) {
    return {
      next: state,
      status: "playing" as GameStatus,
    };
  }

  if (!state.heldBlock) {
    const nextWithoutActive = {
      ...state,
      active: null,
      heldBlock: state.active.definition,
      canHold: false,
    };
    const spawned = spawnNextBlock(nextWithoutActive, rng);

    return {
      next: {
        ...spawned.next,
        canHold: false,
      },
      status: spawned.failed
        ? ("failed" as GameStatus)
        : ("playing" as GameStatus),
    };
  }

  const active = createActiveBlock(state.heldBlock, rng);
  const nextState = {
    ...state,
    active: canPlaceActive(state.board, active) ? active : null,
    heldBlock: state.active.definition,
    canHold: false,
  };

  return {
    next: nextState,
    status: nextState.active
      ? ("playing" as GameStatus)
      : ("failed" as GameStatus),
  };
};

export const useSkill = (state: GameData, key: SkillKey) => {
  if (state.skillCooldowns[key] > 0) {
    return state;
  }

  return {
    ...state,
    score: state.score + SKILL_SCORE,
    skillCooldowns: {
      ...state.skillCooldowns,
      [key]: SKILL_COOLDOWN_MS[key],
    },
    skillUses: {
      ...state.skillUses,
      [key]: state.skillUses[key] + 1,
    },
  };
};

export const reduceSkillCooldowns = (
  cooldowns: SkillCooldowns,
  elapsedMs: number,
): SkillCooldowns => ({
  Q: Math.max(0, cooldowns.Q - elapsedMs),
  W: Math.max(0, cooldowns.W - elapsedMs),
  E: Math.max(0, cooldowns.E - elapsedMs),
  R: Math.max(0, cooldowns.R - elapsedMs),
});

const mergeObstacle = (
  board: Board,
  definition: BlockDefinition,
  rng = Math.random,
) => {
  const size = getSize(definition.cells);
  const x = randomInt(Math.max(1, BOARD_WIDTH - size.width + 1), rng);
  let y = 0;
  let cells = definition.cells.map((cell) => ({
    x: x + cell.x,
    y: y + cell.y,
  }));

  if (!canPlaceCells(board, cells)) {
    return {
      board,
      failed: true,
    };
  }

  while (
    canPlaceCells(
      board,
      definition.cells.map((cell) => ({
        x: x + cell.x,
        y: y + 1 + cell.y,
      })),
    )
  ) {
    y += 1;
    cells = definition.cells.map((cell) => ({
      x: x + cell.x,
      y: y + cell.y,
    }));
  }

  return {
    board: mergeCells(board, cells, OBSTACLE_CELL),
    failed: false,
    cells,
  };
};

const settleObstacleCells = (board: Board, cells: Point[]) => {
  if (cells.length === 0) {
    return null;
  }

  const minX = Math.min(...cells.map((cell) => cell.x));
  const minY = Math.min(...cells.map((cell) => cell.y));
  const normalizedCells = cells.map((cell) => ({
    x: cell.x - minX,
    y: cell.y - minY,
  }));

  let yOffset = 0;
  let settledCells = normalizedCells.map((cell) => ({
    x: minX + cell.x,
    y: yOffset + cell.y,
  }));

  if (!canPlaceCells(board, settledCells)) {
    return null;
  }

  while (
    canPlaceCells(
      board,
      normalizedCells.map((cell) => ({
        x: minX + cell.x,
        y: yOffset + 1 + cell.y,
      })),
    )
  ) {
    yOffset += 1;
    settledCells = normalizedCells.map((cell) => ({
      x: minX + cell.x,
      y: yOffset + cell.y,
    }));
  }

  return settledCells;
};

const getAdjustedObstaclePreviewBlocks = (
  board: Board,
  previewBlocks: Point[][],
) => {
  let previewBoard = board;
  const adjustedPreviewBlocks: Point[][] = [];

  for (const cells of previewBlocks) {
    const settledCells = settleObstacleCells(previewBoard, cells);

    if (!settledCells) {
      adjustedPreviewBlocks.push(cells);
      continue;
    }

    adjustedPreviewBlocks.push(settledCells);
    previewBoard = mergeCells(previewBoard, settledCells, OBSTACLE_CELL);
  }

  return adjustedPreviewBlocks;
};

const collectObstaclePreviewBlocks = (
  state: GameData,
  rng = Math.random,
): Point[][] => {
  const rule = OBSTACLE_RULES[state.level] ?? OBSTACLE_RULES[20];
  let nextBoard = state.board;
  const previewBlocks: Point[][] = [];

  for (const block of rule.blocks) {
    for (let count = 0; count < block.count; count += 1) {
      const merged = mergeObstacle(
        nextBoard,
        getBlockDefinition(block.kind, `obstacle-${block.kind}`),
        rng,
      );

      nextBoard = merged.board;
      if (merged.cells) {
        previewBlocks.push(merged.cells);
      }

      if (merged.failed || hasHiddenBlocks(nextBoard)) {
        return previewBlocks;
      }
    }
  }

  return previewBlocks;
};

const applyObstaclePlacements = (
  state: GameData,
  previewBlocks: Point[][],
) => {
  let nextBoard = state.board;
  for (const cells of previewBlocks) {
    const settledCells = settleObstacleCells(nextBoard, cells);

    if (!settledCells) {
      return {
        next: {
          ...state,
          board: nextBoard,
          failureBlocks: getFailureBlocks(nextBoard),
          obstaclePreviewBlocks: [],
        },
        status: "failed" as GameStatus,
      };
    }

    nextBoard = mergeCells(nextBoard, settledCells, OBSTACLE_CELL);

    if (hasHiddenBlocks(nextBoard)) {
      return {
        next: {
          ...state,
          board: nextBoard,
          failureBlocks: getFailureBlocks(nextBoard),
          obstaclePreviewBlocks: [],
        },
        status: "failed" as GameStatus,
      };
    }
  }

  const { board: clearedBoard, clearedLines } = clearFullRows(nextBoard);
  const scored = applyLineScore(state, clearedBoard, clearedLines);

  return {
    next: {
      ...scored,
      obstaclePreviewBlocks: [],
    },
    status: getStatusAfterScore(scored),
  };
};

export const tickObstacles = (
  state: GameData,
  elapsedMs: number,
  rng = Math.random,
) => {
  if (state.obstacleWarningMs > 0) {
    const nextWarningMs = Math.max(0, state.obstacleWarningMs - elapsedMs);
    const adjustedPreviewBlocks = getAdjustedObstaclePreviewBlocks(
      state.board,
      state.obstaclePreviewBlocks,
    );

    if (nextWarningMs > 0) {
      return {
        next: {
          ...state,
          obstacleWarningMs: nextWarningMs,
          obstaclePreviewBlocks: adjustedPreviewBlocks,
        },
        status: "playing" as GameStatus,
      };
    }

    return applyObstaclePlacements(
      {
        ...state,
        obstacleWarningMs: 0,
      },
      state.obstaclePreviewBlocks.length
        ? adjustedPreviewBlocks
        : collectObstaclePreviewBlocks(state, rng),
    );
  }

  const rule = OBSTACLE_RULES[state.level] ?? OBSTACLE_RULES[20];
  const elapsed = state.obstacleElapsedMs + elapsedMs;

  if (elapsed < rule.intervalMs) {
    return {
      next: {
        ...state,
        obstacleElapsedMs: elapsed,
      },
      status: "playing" as GameStatus,
    };
  }

  return {
    next: {
      ...state,
      obstacleElapsedMs: elapsed % rule.intervalMs,
      obstacleWarningMs: OBSTACLE_WARNING_MS,
      obstaclePreviewBlocks: collectObstaclePreviewBlocks(state, rng),
    },
    status: "playing" as GameStatus,
  };
};

export const getRenderBoard = (board: Board, active: ActiveBlock | null) => {
  const nextBoard = board.map((row) => row.slice());

  if (active) {
    getAbsoluteCells(active).forEach((cell) => {
      if (isInsideBoard(cell)) {
        nextBoard[cell.y][cell.x] = ACTIVE_CELL;
      }
    });
  }

  return nextBoard.slice(HIDDEN_ROWS);
};

export const getMiniBoard = (definition: BlockDefinition | null) => {
  if (!definition) {
    return createEmptyBoard(4, 4);
  }

  const miniBoard = createEmptyBoard(4, 4);
  const size = getSize(definition.cells);
  const offsetX = Math.max(0, Math.floor((4 - size.width) / 2));
  const offsetY = Math.max(0, Math.floor((4 - size.height) / 2));

  definition.cells.forEach((cell) => {
    miniBoard[cell.y + offsetY][cell.x + offsetX] = SKILL_CELL;
  });

  return miniBoard;
};
