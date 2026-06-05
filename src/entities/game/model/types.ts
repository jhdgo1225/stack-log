export type GameStatus =
  | "levelIntro"
  | "playing"
  | "paused"
  | "levelClear"
  | "failed";

export type Cell = 0 | 1 | 2 | 3 | 4;

export type Board = Cell[][];

export type Point = {
  x: number;
  y: number;
};

export type BlockKind =
  | "single"
  | "line2"
  | "line3"
  | "line4"
  | "line4Vertical"
  | "corner"
  | "square";

export type BlockDefinition = {
  id: string;
  kind: BlockKind;
  label: string;
  cells: Point[];
};

export type BagSlot = {
  id: string;
  definition: BlockDefinition;
  used: boolean;
};

export type ActiveBlock = {
  id: string;
  definition: BlockDefinition;
  position: Point;
  rotation: number;
  cells: Point[];
};

export type SkillKey = "Q" | "W" | "E" | "R";

export type SkillCooldowns = Record<SkillKey, number>;

export type SkillUses = Record<SkillKey, number>;

export type ObstacleRule = {
  intervalMs: number;
  blocks: Array<{
    kind: BlockKind;
    count: number;
  }>;
};

export type TickResult = {
  next: GameData;
  locked: boolean;
  status: GameStatus;
};

export type GameData = {
  board: Board;
  active: ActiveBlock | null;
  bag: BagSlot[];
  heldBlock: BlockDefinition | null;
  canHold: boolean;
  score: number;
  lines: number;
  level: number;
  combo: number;
  maxCombo: number;
  targetScore: number | null;
  skillCooldowns: SkillCooldowns;
  skillUses: SkillUses;
  obstacleElapsedMs: number;
  obstacleWarningMs: number;
  obstaclePreviewBlocks: Point[][];
  helpOpen: boolean;
  failureBlocks: Point[];
};
