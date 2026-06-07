import * as Phaser from "phaser";

import {
  CHARACTER_LIST,
  getCharacterBlockSrc,
  useCharacterStore,
} from "@/entities/character";
import {
  BOARD_WIDTH,
  HIDDEN_ROWS,
  LEVEL_CLEAR_DELAY_MS,
  OBSTACLE_FALL_DURATION_MS,
  OBSTACLE_FALL_START_ROWS,
  OBSTACLE_WARNING_MS,
  VISIBLE_ROWS,
  canPlaceCells,
  getAbsoluteCells,
  getRenderBoard,
  useGameStore,
} from "@/entities/game";
import { setGameEngineBridge } from "@/entities/game/model/gameBridge";
import {
  createInitialGameData,
  getSpeedMs,
  hardDrop as applyHardDrop,
  holdBlock as applyHoldBlock,
  moveHorizontal,
  reduceSkillCooldowns,
  rotateActiveBlock,
  spawnNextBlock,
  stepDown,
  tickObstacles,
  useSkill as applySkill,
} from "@/entities/game/model/gameLogic";
import type {
  ActiveBlock,
  Board,
  GameData,
  GameStatus,
  SkillKey,
} from "@/entities/game/model/types";
import type { GameRuntimeSnapshot } from "@/entities/game/model/gameStateSync";
import { syncGameStoreState } from "@/entities/game/model/gameStateSync";

const DISPLAY_SCALE = Math.max(1, window.devicePixelRatio || 1);
const uiPx = (value: number) => value * DISPLAY_SCALE;

const BOARD_PADDING = uiPx(12);

const hexToRgb = (hex: string) => {
  const normalized = hex.replace("#", "");
  const value = Number.parseInt(normalized, 16);

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
};

const rgbToInt = (r: number, g: number, b: number) =>
  (r << 16) | (g << 8) | b;

const getCurrentCharacter = () =>
  CHARACTER_LIST.find(
    (item) => item.id === useCharacterStore.getState().selectedId,
  ) ?? CHARACTER_LIST[0];

const mixHex = (left: string, right: string, amount: number) => {
  const a = hexToRgb(left);
  const b = hexToRgb(right);
  const t = Math.max(0, Math.min(1, amount));

  return rgbToInt(
    Math.round(a.r + (b.r - a.r) * t),
    Math.round(a.g + (b.g - a.g) * t),
    Math.round(a.b + (b.b - a.b) * t),
  );
};

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

const createSnapshot = (): GameRuntimeSnapshot => {
  const state = useGameStore.getState();

  return {
    board: state.board,
    active: state.active,
    bag: state.bag,
    heldBlock: state.heldBlock,
    canHold: state.canHold,
    score: state.score,
    lines: state.lines,
    level: state.level,
    combo: state.combo,
    maxCombo: state.maxCombo,
    targetScore: state.targetScore,
    skillCooldowns: state.skillCooldowns,
    skillUses: state.skillUses,
    obstacleElapsedMs: state.obstacleElapsedMs,
    obstacleWarningMs: state.obstacleWarningMs,
    obstacleFallMs: state.obstacleFallMs,
    obstaclePreviewBlocks: state.obstaclePreviewBlocks,
    helpOpen: state.helpOpen,
    failureBlocks: state.failureBlocks,
    status: state.status,
    speedMs: state.speedMs,
    clearDelayMs: state.clearDelayMs,
  };
};

class PhaserGameEngine {
  private state: GameRuntimeSnapshot;
  private gravityAccumulatorMs = 0;
  private cooldownAccumulatorMs = 0;
  private clearAccumulatorMs = 0;

  constructor(initialState: GameRuntimeSnapshot) {
    this.state = initialState;
    this.emit();
  }

  get snapshot() {
    return this.state;
  }

  update(deltaMs: number) {
    if (this.state.status === "playing") {
      this.tickObstacleTiming(deltaMs);
      this.gravityAccumulatorMs += deltaMs;
      this.cooldownAccumulatorMs += deltaMs;

      while (this.cooldownAccumulatorMs >= 1000) {
        this.cooldownAccumulatorMs -= 1000;
        this.tickSkillCooldowns();
      }

      while (
        this.state.status === "playing" &&
        this.gravityAccumulatorMs >= this.state.speedMs
      ) {
        this.gravityAccumulatorMs -= this.state.speedMs;
        this.tick();
      }

      return;
    }

    if (this.state.status === "levelClear") {
      this.clearAccumulatorMs += deltaMs;

      if (this.clearAccumulatorMs >= this.state.clearDelayMs) {
        this.continueAfterClear();
      }
    }
  }

  startGame = () => {
    this.gravityAccumulatorMs = 0;
    this.cooldownAccumulatorMs = 0;
    this.clearAccumulatorMs = 0;

    this.setState({
      ...createInitialGameData(),
      status: "levelIntro",
      speedMs: getSpeedMs(1),
      clearDelayMs: 0,
    });
  };

  startLevel = () => {
    const state = this.state;
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

    this.gravityAccumulatorMs = 0;
    this.cooldownAccumulatorMs = 0;
    this.clearAccumulatorMs = 0;

    this.setState({
      ...spawned.next,
      status: spawned.failed ? "failed" : "playing",
      speedMs: getSpeedMs(spawned.next.level),
      clearDelayMs: 0,
    });
  };

  continueAfterClear = () => {
    if (this.state.status !== "levelClear") {
      return;
    }

    const nextLevel = Math.min(20, this.state.level + 1);
    const nextData = createInitialGameData(
      nextLevel,
      this.state.score,
      this.state.lines,
      this.state.skillUses,
    );

    this.gravityAccumulatorMs = 0;
    this.cooldownAccumulatorMs = 0;
    this.clearAccumulatorMs = 0;

    this.setState({
      ...nextData,
      status: "levelIntro",
      speedMs: getSpeedMs(nextLevel),
      clearDelayMs: 0,
    });
  };

  resetGame = () => {
    this.startGame();
  };

  resetRun = () => {
    this.startGame();
  };

  togglePause = () => {
    if (this.state.helpOpen) {
      this.setState({
        ...this.state,
        helpOpen: false,
      });
      return;
    }

    if (this.state.status === "playing") {
      this.setState({
        ...this.state,
        status: "paused",
      });
      return;
    }

    if (this.state.status === "paused") {
      this.setState({
        ...this.state,
        status: "playing",
      });
    }
  };

  toggleHelp = () => {
    const nextHelpOpen = !this.state.helpOpen;

    this.setState({
      ...this.state,
      helpOpen: nextHelpOpen,
      status:
        nextHelpOpen && this.state.status === "playing"
          ? "paused"
          : this.state.status,
    });
  };

  tick = () => {
    if (this.state.status !== "playing") {
      return;
    }

    const result = stepDown(this.state);
    this.setFromLogicResult(result.next, result.status);
  };

  tickSkillCooldowns = () => {
    if (this.state.status !== "playing") {
      return;
    }

    this.setState({
      ...this.state,
      skillCooldowns: reduceSkillCooldowns(this.state.skillCooldowns, 1000),
    });
  };

  moveLeft = () => this.applyStateAction((state) => moveHorizontal(state, -1));
  moveRight = () => this.applyStateAction((state) => moveHorizontal(state, 1));
  rotateClockwise = () =>
    this.applyStateAction((state) => rotateActiveBlock(state, 1));
  rotateCounterClockwise = () =>
    this.applyStateAction((state) => rotateActiveBlock(state, -1));
  softDrop = () => this.applyTickAction((state) => stepDown(state));
  hardDrop = () => this.applyTickAction((state) => applyHardDrop(state));
  holdBlock = () => this.applyHoldAction((state) => applyHoldBlock(state));

  useSkill = (key: SkillKey) => {
    if (this.state.status !== "playing") {
      return;
    }

    const skilled = applySkill(this.state, key);
    const nextStatus =
      skilled.targetScore !== null && skilled.score >= skilled.targetScore
        ? "levelClear"
        : "playing";

    this.setState({
      ...skilled,
      status: nextStatus,
      speedMs: getSpeedMs(skilled.level),
      clearDelayMs: nextStatus === "levelClear" ? LEVEL_CLEAR_DELAY_MS : 0,
    });
  };

  private applyStateAction(action: (state: GameData) => GameData) {
    if (this.state.status !== "playing") {
      return;
    }

    this.setState({
      ...this.state,
      ...action(this.state),
    });
  }

  private applyTickAction(
    action: (state: GameData) => { next: GameData; status: GameStatus },
  ) {
    if (this.state.status !== "playing") {
      return;
    }

    const result = action(this.state);
    this.setFromLogicResult(result.next, result.status);
  }

  private applyHoldAction(
    action: (state: GameData) => { next: GameData; status: GameStatus },
  ) {
    if (this.state.status !== "playing") {
      return;
    }

    const result = action(this.state);
    this.setFromLogicResult(result.next, result.status);
  }

  private tickObstacleTiming(deltaMs: number) {
    if (this.state.status !== "playing") {
      return;
    }

    const obstacleResult = tickObstacles(this.state, deltaMs);

    if (obstacleResult.status !== "playing") {
      this.setFromLogicResult(obstacleResult.next, obstacleResult.status);
      return;
    }

    this.setState({
      ...obstacleResult.next,
      status: this.state.status,
      speedMs: this.state.speedMs,
      clearDelayMs: this.state.clearDelayMs,
    });
  }

  private setFromLogicResult(next: GameData, status: GameStatus) {
    this.gravityAccumulatorMs = 0;
    this.cooldownAccumulatorMs = 0;
    this.clearAccumulatorMs = 0;

    this.setState({
      ...next,
      status,
      speedMs: getSpeedMs(next.level),
      clearDelayMs: status === "levelClear" ? LEVEL_CLEAR_DELAY_MS : 0,
    });
  }

  private setState(next: GameRuntimeSnapshot) {
    this.state = next;
    this.emit();
  }

  private emit() {
    syncGameStoreState(this.state);
  }
}

export class GameScene extends Phaser.Scene {
  private engine!: PhaserGameEngine;
  private backgroundGraphics!: Phaser.GameObjects.Graphics;
  private warningGraphics!: Phaser.GameObjects.Graphics;
  private blockContainer!: Phaser.GameObjects.Container;
  private blockTextureKey = "character-block";

  preload() {
    const character = getCurrentCharacter();
    this.load.image(this.blockTextureKey, getCharacterBlockSrc(character.id));
  }

  constructor() {
    super("GameScene");
  }

  create() {
    this.engine = new PhaserGameEngine(createSnapshot());
    setGameEngineBridge({
      startGame: this.engine.startGame,
      startLevel: this.engine.startLevel,
      continueAfterClear: this.engine.continueAfterClear,
      resetGame: this.engine.resetGame,
      resetRun: this.engine.resetRun,
      togglePause: this.engine.togglePause,
      toggleHelp: this.engine.toggleHelp,
      tick: this.engine.tick,
      tickSkillCooldowns: this.engine.tickSkillCooldowns,
      moveLeft: this.engine.moveLeft,
      moveRight: this.engine.moveRight,
      rotateClockwise: this.engine.rotateClockwise,
      rotateCounterClockwise: this.engine.rotateCounterClockwise,
      softDrop: this.engine.softDrop,
      hardDrop: this.engine.hardDrop,
      holdBlock: this.engine.holdBlock,
      useSkill: this.engine.useSkill,
    });

    this.backgroundGraphics = this.add.graphics();
    this.warningGraphics = this.add.graphics();
    this.blockContainer = this.add.container(0, 0);

    this.input.keyboard?.on("keydown-LEFT", () => this.engine.moveLeft());
    this.input.keyboard?.on("keydown-RIGHT", () => this.engine.moveRight());
    this.input.keyboard?.on("keydown-DOWN", () => this.engine.softDrop());
    this.input.keyboard?.on("keydown-S", () => this.engine.softDrop());
    this.input.keyboard?.on("keydown-SPACE", () => this.engine.hardDrop());
    this.input.keyboard?.on("keydown-A", () => this.engine.rotateCounterClockwise());
    this.input.keyboard?.on("keydown-D", () => this.engine.rotateClockwise());
    this.input.keyboard?.on("keydown-SHIFT", () => this.engine.holdBlock());
    this.input.keyboard?.on("keydown-Q", () => this.engine.useSkill("Q"));
    this.input.keyboard?.on("keydown-W", () => this.engine.useSkill("W"));
    this.input.keyboard?.on("keydown-E", () => this.engine.useSkill("E"));
    this.input.keyboard?.on("keydown-R", () => this.engine.useSkill("R"));
    this.input.keyboard?.on("keydown-ESC", () => this.engine.togglePause());
    this.input.keyboard?.on("keydown-F1", () => this.engine.toggleHelp());
    this.input.keyboard?.on("keydown-ENTER", () => {
      if (this.engine.snapshot.status === "levelIntro") {
        this.engine.startLevel();
      }
    });

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      setGameEngineBridge(null);
    });
    this.events.once(Phaser.Scenes.Events.DESTROY, () => {
      setGameEngineBridge(null);
    });
  }

  update(_time: number, delta: number) {
    this.engine.update(delta);
    this.render();
  }

  private render() {
    const state = this.engine.snapshot;
    const { width, height } = this.scale;
    const character = getCurrentCharacter();

    const metrics = this.getBoardMetrics(width, height);
    const { boardX, boardY, cellSize, gap, boardWidth, boardHeight } = metrics;
    const boardPanelX = boardX - BOARD_PADDING;
    const boardPanelY = boardY - BOARD_PADDING;
    const boardPanelWidth = boardWidth + BOARD_PADDING * 2;
    const boardPanelHeight = boardHeight + BOARD_PADDING * 2;

    this.backgroundGraphics.clear();
    this.blockContainer.removeAll(true);

    this.backgroundGraphics.fillStyle(0xfaf7f4, 0.96);
    this.backgroundGraphics.fillRoundedRect(
      boardPanelX,
      boardPanelY,
      boardPanelWidth,
      boardPanelHeight,
      uiPx(14),
    );
    this.backgroundGraphics.lineStyle(
      uiPx(2),
      mixHex(character.backgroundColor, "#111111", 0.4),
      0.18,
    );
    this.backgroundGraphics.strokeRoundedRect(
      boardPanelX,
      boardPanelY,
      boardPanelWidth,
      boardPanelHeight,
      uiPx(14),
    );
    this.warningGraphics.clear();

    const renderBoard = getRenderBoard(state.board, state.active);
    const occupiedCellFill = 0xf5f1ea;

    renderBoard.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const x = boardX + colIndex * (cellSize + gap);
        const y = boardY + rowIndex * (cellSize + gap);
        const fill = cell === 0 ? 0xe8e2d8 : occupiedCellFill;
        const alpha = cell === 0 ? 0.48 : cell === 4 ? 0.94 : 1;

        this.backgroundGraphics.fillStyle(fill, alpha);
        this.backgroundGraphics.fillRoundedRect(x, y, cellSize, cellSize, uiPx(4));

        if (cell !== 0) {
          const image = this.add.image(
            x + cellSize / 2,
            y + cellSize / 2,
            this.blockTextureKey,
          );
          const inset = Math.max(1, Math.floor(cellSize * 0.06));
          image.setDisplaySize(cellSize - inset * 2, cellSize - inset * 2);
          image.setAlpha(cell === 4 ? 0.92 : cell === 3 ? 0.96 : 1);
          this.blockContainer.add(image);
        }
      });
    });

    const active = state.active;
    if (state.status === "playing" && active) {
      const ghost = this.getGhostCells(state.board, active);
      ghost.forEach((cell) => {
        const x = boardX + cell.x * (cellSize + gap);
        const y = boardY + cell.y * (cellSize + gap);
        this.backgroundGraphics.fillStyle(occupiedCellFill, 0.16);
        this.backgroundGraphics.fillRoundedRect(x, y, cellSize, cellSize, uiPx(4));
        this.backgroundGraphics.lineStyle(uiPx(2), 0xffffff, 0.36);
        this.backgroundGraphics.strokeRoundedRect(x, y, cellSize, cellSize, uiPx(4));

        const image = this.add.image(
          x + cellSize / 2,
          y + cellSize / 2,
          this.blockTextureKey,
        );
        const inset = Math.max(1, Math.floor(cellSize * 0.06));
        image.setDisplaySize(cellSize - inset * 2, cellSize - inset * 2);
        image.setAlpha(0.28);
        this.blockContainer.add(image);
      });
    }

    if (state.obstacleWarningMs > 0) {
      const warningProgress = clamp01(
        1 - state.obstacleWarningMs / OBSTACLE_WARNING_MS,
      );
      const warningPulse = 0.92 + Math.sin(this.time.now / 96) * 0.08;
      const topGlowHeight = uiPx(14 + warningPulse * 12);
      const topGlowAlpha = 0.24 + warningProgress * 0.2;

      this.warningGraphics.fillStyle(
        mixHex(character.color, "#ffffff", 0.22),
        topGlowAlpha,
      );
      this.warningGraphics.fillRoundedRect(
        boardPanelX + uiPx(0.5),
        boardPanelY + uiPx(0.5),
        boardPanelWidth - uiPx(1),
        topGlowHeight,
        uiPx(12),
      );
      this.warningGraphics.fillStyle(
        mixHex(character.color, "#ffffff", 0.08),
        0.22 + warningProgress * 0.18,
      );
      this.warningGraphics.fillRoundedRect(
        boardPanelX + uiPx(4),
        boardPanelY + uiPx(2),
        boardPanelWidth - uiPx(8),
        uiPx(8 + warningPulse * 6),
        uiPx(10),
      );
    } else if (state.obstaclePreviewBlocks.length > 0) {
      const fallProgress = clamp01(
        state.obstacleFallMs / OBSTACLE_FALL_DURATION_MS,
      );
      const fallOffsetRows = OBSTACLE_FALL_START_ROWS;

      state.obstaclePreviewBlocks.forEach((block) => {
        block.forEach((cell) => {
          const x = boardX + cell.x * (cellSize + gap);
          const targetVisibleY = cell.y - HIDDEN_ROWS;
          const animatedVisibleY =
            targetVisibleY - fallOffsetRows + fallOffsetRows * fallProgress;
          const y = boardY + animatedVisibleY * (cellSize + gap);

          this.backgroundGraphics.fillStyle(
            mixHex(character.color, "#ffffff", 0.08),
            0.18,
          );
          this.backgroundGraphics.fillRoundedRect(
            x,
            boardY + targetVisibleY * (cellSize + gap),
            cellSize,
            cellSize,
            uiPx(4),
          );
          this.backgroundGraphics.lineStyle(
            uiPx(2),
            mixHex(character.color, "#ffffff", 0.2),
            0.78,
          );
          this.backgroundGraphics.strokeRoundedRect(
            x,
            boardY + targetVisibleY * (cellSize + gap),
            cellSize,
            cellSize,
            uiPx(4),
          );

          const image = this.add.image(
            x + cellSize / 2,
            y + cellSize / 2,
            this.blockTextureKey,
          );
          const inset = Math.max(1, Math.floor(cellSize * 0.06));
          image.setDisplaySize(cellSize - inset * 2, cellSize - inset * 2);
          image.setAlpha(0.96);
          this.blockContainer.add(image);
        });
      });
    }
  }

  private getBoardMetrics(width: number, height: number) {
    const cols = BOARD_WIDTH;
    const rows = VISIBLE_ROWS;
    const gap = Math.max(2, Math.round(Math.min(width, height) * 0.01));
    const maxWidth = Math.max(1, width - BOARD_PADDING * 2);
    const maxHeight = Math.max(1, height - BOARD_PADDING * 2);
    const cellSize = Math.max(
      12,
      Math.floor(
        Math.min(
          (maxWidth - gap * (cols - 1)) / cols,
          (maxHeight - gap * (rows - 1)) / rows,
        ),
      ),
    );
    const boardWidth = cellSize * cols + gap * (cols - 1);
    const boardHeight = cellSize * rows + gap * (rows - 1);

    return {
      cellSize,
      gap,
      boardWidth,
      boardHeight,
      boardX: Math.floor((width - boardWidth) / 2),
      boardY: Math.floor((height - boardHeight) / 2),
    };
  }

  private getGhostCells(board: Board, active: ActiveBlock) {
    let ghostPosition = { ...active.position };

    while (
      canPlaceCells(
        board,
        getAbsoluteCells({
          ...active,
          position: { x: ghostPosition.x, y: ghostPosition.y + 1 },
        }),
      )
    ) {
      ghostPosition = {
        x: ghostPosition.x,
        y: ghostPosition.y + 1,
      };
    }

    return getAbsoluteCells({
      ...active,
      position: ghostPosition,
    }).map((cell) => ({
      x: cell.x,
      y: cell.y - HIDDEN_ROWS,
    }));
  }
}
