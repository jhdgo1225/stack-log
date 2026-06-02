import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  LINES_PER_LEVEL,
  MIN_SPEED_MS,
  SCORE_PER_LINE,
  SPEED_STEP_MS,
  START_SPEED_MS,
} from "./constants";
import type { ActiveBlock, Board, GameData, Point } from "./types";

const EMPTY_CELL: 0 = 0;
const FILLED_CELL: 1 = 1;

export const createEmptyBoard = (
  width = BOARD_WIDTH,
  height = BOARD_HEIGHT,
): Board =>
  Array.from({ length: height }, () =>
    Array.from({ length: width }, () => EMPTY_CELL),
  );

export const createInitialGameData = (): GameData => ({
  board: createEmptyBoard(),
  active: null,
  score: 0,
  lines: 0,
  level: 1,
});

const isInsideBoard = (board: Board, point: Point) =>
  point.x >= 0 &&
  point.x < board[0].length &&
  point.y >= 0 &&
  point.y < board.length;

const isCellFree = (board: Board, point: Point) =>
  isInsideBoard(board, point) && board[point.y][point.x] === EMPTY_CELL;

export const canPlaceBlock = (board: Board, point: Point) =>
  isCellFree(board, point);

export const spawnBlock = (board: Board) => {
  const spawnPoint: ActiveBlock = {
    x: Math.floor(board[0].length / 2),
    y: 0,
  };

  return {
    active: spawnPoint,
    isValid: canPlaceBlock(board, spawnPoint),
  };
};

export const mergeActiveBlock = (board: Board, active: ActiveBlock) => {
  const nextBoard = board.map((row) => row.slice());
  nextBoard[active.y][active.x] = FILLED_CELL;
  return nextBoard;
};

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

export const getLevel = (lines: number) =>
  Math.max(1, Math.floor(lines / LINES_PER_LEVEL) + 1);

export const getSpeedMs = (level: number) =>
  Math.max(MIN_SPEED_MS, START_SPEED_MS - (level - 1) * SPEED_STEP_MS);

export const stepDown = (state: GameData) => {
  if (!state.active) {
    const spawn = spawnBlock(state.board);

    return {
      next: {
        ...state,
        active: spawn.isValid ? spawn.active : null,
      },
      locked: false,
      gameOver: !spawn.isValid,
    };
  }

  const nextPoint: ActiveBlock = {
    x: state.active.x,
    y: state.active.y + 1,
  };

  if (canPlaceBlock(state.board, nextPoint)) {
    return {
      next: {
        ...state,
        active: nextPoint,
      },
      locked: false,
      gameOver: false,
    };
  }

  const merged = mergeActiveBlock(state.board, state.active);
  const { board: clearedBoard, clearedLines } = clearFullRows(merged);
  const nextLines = state.lines + clearedLines;
  const nextScore = state.score + clearedLines * SCORE_PER_LINE;
  const nextLevel = getLevel(nextLines);
  const spawn = spawnBlock(clearedBoard);

  return {
    next: {
      ...state,
      board: clearedBoard,
      active: spawn.isValid ? spawn.active : null,
      lines: nextLines,
      score: nextScore,
      level: nextLevel,
    },
    locked: true,
    gameOver: !spawn.isValid,
  };
};

export const moveHorizontal = (state: GameData, deltaX: number) => {
  if (!state.active) {
    return state;
  }

  const nextPoint: ActiveBlock = {
    x: state.active.x + deltaX,
    y: state.active.y,
  };

  if (!canPlaceBlock(state.board, nextPoint)) {
    return state;
  }

  return {
    ...state,
    active: nextPoint,
  };
};

export const hardDrop = (state: GameData) => {
  let nextState = state;
  let result = stepDown(nextState);

  while (!result.locked && !result.gameOver) {
    nextState = result.next;
    result = stepDown(nextState);
  }

  return result;
};

export const getRenderBoard = (board: Board, active: ActiveBlock | null) => {
  if (!active) {
    return board;
  }

  const nextBoard = board.map((row) => row.slice());

  if (
    active.y >= 0 &&
    active.y < nextBoard.length &&
    active.x >= 0 &&
    active.x < nextBoard[0].length
  ) {
    nextBoard[active.y][active.x] = FILLED_CELL;
  }

  return nextBoard;
};
