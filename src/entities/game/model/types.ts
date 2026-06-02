export type GameStatus = "idle" | "playing" | "paused" | "over";

export type Cell = 0 | 1;

export type Board = Cell[][];

export type Point = {
  x: number;
  y: number;
};

export type ActiveBlock = Point;

export type GameData = {
  board: Board;
  active: ActiveBlock | null;
  score: number;
  lines: number;
  level: number;
};
