import * as Phaser from "phaser";

import {
  CHARACTER_LIST,
  getCharacterBlockSrc,
  useCharacterStore,
} from "@/entities/character";
import {
  BOARD_WIDTH,
  canPlaceCells,
  getAbsoluteCells,
  getRenderBoard,
  HIDDEN_ROWS,
  LEVEL_CLEAR_DELAY_MS,
  OBSTACLE_FALL_DURATION_MS,
  OBSTACLE_FALL_START_ROWS,
  OBSTACLE_WARNING_MS,
  useGameStore,
  VISIBLE_ROWS,
} from "@/entities/game";
import { setGameEngineBridge } from "@/entities/game/model/gameBridge";
import {
  createInitialGameData,
  getMayActive1CooldownMs,
  getMayActive1TargetCount,
  getMayActive2CooldownMs,
  getMayActive3CooldownMs,
  getMayActive3Depth,
  getMayActive3RequiredUses,
  getMayPassiveCooldownMs,
  getSpeedMs,
  hardDrop as applyHardDrop,
  holdBlock as applyHoldBlock,
  meltBoardBlockAt,
  meltBoardCellsAt,
  meltRandomBoardBlock,
  moveHorizontal,
  reduceSkillCooldowns,
  rotateActiveBlock,
  selectBestMayActive1Target,
  spawnNextBlock,
  stepDown,
  tickObstacles,
  useSkill as applySkill,
} from "@/entities/game/model/gameLogic";
import type { GameRuntimeSnapshot } from "@/entities/game/model/gameStateSync";
import { syncGameStoreState } from "@/entities/game/model/gameStateSync";
import type {
  ActiveBlock,
  Board,
  GameData,
  GameStatus,
  SkillKey,
  Point,
} from "@/entities/game/model/types";

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

const rgbToInt = (r: number, g: number, b: number) => (r << 16) | (g << 8) | b;

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
const randomRange = (min: number, max: number) =>
  Phaser.Math.FloatBetween(min, max);

const MAY_PASSIVE_EFFECT_MS = 680;
const MAY_PASSIVE_DROP_MS = 360;
const MAY_ULTIMATE_DURATION_MS = 15000;
const MAY_ULTIMATE_COOLDOWN_MS = 60000;

type MayPassiveMeltTarget = NonNullable<
  ReturnType<typeof meltRandomBoardBlock>["target"]
>;

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
  private mayPassiveAccumulatorMs = 0;
  private isMayMeltRunning = false;
  private mayActive1Targets: Point[] = [];
  private mayActive2ConsumedKeys = new Set<string>();
  private mayActive1UsesSinceActive3 = 0;
  private mayActive3Primed = false;
  private mayUltimateRemainingMs = 0;
  private onMayPassiveEffect?: (
    target: MayPassiveMeltTarget,
    applyGravity: () => MayPassiveMeltTarget | null,
    onComplete?: () => void,
  ) => void;

  constructor(
    initialState: GameRuntimeSnapshot,
    onMayPassiveEffect?: (
      target: MayPassiveMeltTarget,
      applyGravity: () => MayPassiveMeltTarget | null,
      onComplete?: () => void,
    ) => void,
  ) {
    this.state = initialState;
    this.onMayPassiveEffect = onMayPassiveEffect;
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
      this.tickMayUltimate(deltaMs);
      this.tickMayPassive(deltaMs);

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
    this.mayPassiveAccumulatorMs = 0;
    this.isMayMeltRunning = false;
    this.resetMaySkillState();

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
    this.mayPassiveAccumulatorMs = 0;
    this.isMayMeltRunning = false;

    if (state.status === "failed") {
      this.resetMaySkillState();
    }

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
    this.mayPassiveAccumulatorMs = 0;
    this.isMayMeltRunning = false;

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

    if (getCurrentCharacter().id === "may") {
      if (key === "Q") {
        this.useMayActive1();
        return;
      }

      if (key === "W") {
        this.useMayActive2();
        return;
      }

      if (key === "E") {
        this.useMayActive3();
        return;
      }

      if (key === "R") {
        this.useMayUltimate();
        return;
      }
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

  private resetMaySkillState() {
    this.mayActive1Targets = [];
    this.mayActive2ConsumedKeys = new Set<string>();
    this.mayActive1UsesSinceActive3 = 0;
    this.mayActive3Primed = false;
    this.mayUltimateRemainingMs = 0;
  }

  private tickMayUltimate(deltaMs: number) {
    if (this.mayUltimateRemainingMs <= 0) {
      return;
    }

    this.mayUltimateRemainingMs = Math.max(
      0,
      this.mayUltimateRemainingMs - deltaMs,
    );
  }

  private isMayUltimateActive() {
    return this.mayUltimateRemainingMs > 0;
  }

  private getMaySkillCooldownMs(key: SkillKey, baseMs: number) {
    return key !== "R" && this.isMayUltimateActive()
      ? Math.ceil(baseMs / 2)
      : baseMs;
  }

  private getPointKey(point: Point) {
    return `${point.x}:${point.y}`;
  }

  private isPointInActiveColumn(point: Point) {
    if (!this.state.active) {
      return false;
    }

    return getAbsoluteCells(this.state.active).some(
      (cell) => cell.x === point.x,
    );
  }

  private getMayActive1Cells(target: Point, depth: number) {
    return Array.from({ length: depth + 1 }, (_, index) => ({
      x: target.x,
      y: target.y + index,
    })).filter(
      (cell) =>
        cell.y < this.state.board.length &&
        this.state.board[cell.y]?.[cell.x] !== 0,
    );
  }

  private tickMayPassive(deltaMs: number) {
    if (
      getCurrentCharacter().id !== "may" ||
      this.state.status !== "playing" ||
      this.isMayMeltRunning
    ) {
      return;
    }

    this.mayPassiveAccumulatorMs += deltaMs;
    const cooldownMs = getMayPassiveCooldownMs(this.state.level);

    if (this.mayPassiveAccumulatorMs < cooldownMs) {
      return;
    }

    if (
      this.state.obstacleWarningMs > 0 ||
      this.state.obstacleFallMs > 0 ||
      this.state.obstaclePreviewBlocks.length > 0
    ) {
      return;
    }

    this.mayPassiveAccumulatorMs -= cooldownMs;
    const result = meltRandomBoardBlock(this.state);

    if (!result.target) {
      return;
    }

    this.isMayMeltRunning = true;
    this.onMayPassiveEffect?.(
      result.target,
      () => {
        if (this.state.status !== "playing") {
          return null;
        }

        const latestResult = meltBoardBlockAt(this.state, result.target);

        if (!latestResult.target) {
          return null;
        }

        this.setState({
          ...latestResult.next,
          status: this.state.status,
          speedMs: this.state.speedMs,
          clearDelayMs: this.state.clearDelayMs,
        });

        return latestResult.target;
      },
      () => {
        this.isMayMeltRunning = false;
      },
    );
  }

  private useMayActive1() {
    if (this.state.skillCooldowns.Q > 0 || this.isMayMeltRunning) {
      return;
    }

    const firstTarget = selectBestMayActive1Target(this.state);

    if (!firstTarget) {
      return;
    }

    const useCount = getMayActive1TargetCount(this.state.level);
    const active3Depth = this.mayActive3Primed
      ? getMayActive3Depth(this.state.level)
      : 0;

    this.isMayMeltRunning = true;
    window.setTimeout(() => {
      if (this.isMayMeltRunning) {
        this.finishMayMeltRun();
      }
    }, 12000);
    this.mayActive3Primed = false;
    this.mayActive1UsesSinceActive3 += 1;
    this.setState({
      ...this.state,
      skillCooldowns: {
        ...this.state.skillCooldowns,
        Q: this.getMaySkillCooldownMs(
          "Q",
          getMayActive1CooldownMs(this.state.level),
        ),
      },
      skillUses: {
        ...this.state.skillUses,
        Q: this.state.skillUses.Q + 1,
      },
    });
    this.playMayActive1Step(0, useCount, active3Depth);
  }

  private finishMayMeltRun() {
    this.isMayMeltRunning = false;
  }

  private playMayActive1Step(index: number, total: number, depth: number) {
    if (index >= total || this.state.status !== "playing") {
      this.finishMayMeltRun();
      return;
    }

    const target = selectBestMayActive1Target(this.state);

    if (!target) {
      this.finishMayMeltRun();
      return;
    }

    const preview = meltBoardCellsAt(
      this.state,
      this.getMayActive1Cells(target, depth),
    );

    if (!preview.target) {
      this.finishMayMeltRun();
      return;
    }

    this.onMayPassiveEffect?.(
      preview.target,
      () => {
        if (this.state.status !== "playing") {
          return null;
        }

        const latestTarget = selectBestMayActive1Target(this.state);

        if (!latestTarget) {
          return null;
        }

        const latestResult = meltBoardCellsAt(
          this.state,
          this.getMayActive1Cells(latestTarget, depth),
        );

        if (!latestResult.target) {
          return null;
        }

        this.setState({
          ...latestResult.next,
          status: this.state.status,
          speedMs: this.state.speedMs,
          clearDelayMs: this.state.clearDelayMs,
        });
        this.mayActive1Targets.push({
          x: latestResult.target.x,
          y: latestResult.target.y,
        });

        return latestResult.target;
      },
      () => {
        this.playMayActive1Step(index + 1, total, depth);
      },
    );
  }

  private useMayActive2() {
    if (this.state.skillCooldowns.W > 0 || this.isMayMeltRunning) {
      return;
    }

    const targets = this.mayActive1Targets.filter((target) => {
      const key = this.getPointKey(target);

      return (
        !this.mayActive2ConsumedKeys.has(key) &&
        !this.isPointInActiveColumn(target) &&
        this.state.board[target.y]?.[target.x] !== 0
      );
    });

    if (targets.length === 0) {
      return;
    }

    this.isMayMeltRunning = true;
    window.setTimeout(() => {
      if (this.isMayMeltRunning) {
        this.finishMayMeltRun();
      }
    }, 12000);
    this.setState({
      ...this.state,
      skillCooldowns: {
        ...this.state.skillCooldowns,
        W: this.getMaySkillCooldownMs(
          "W",
          getMayActive2CooldownMs(this.state.level),
        ),
      },
      skillUses: {
        ...this.state.skillUses,
        W: this.state.skillUses.W + 1,
      },
    });
    this.playMayActive2Step(targets, 0);
  }

  private playMayActive2Step(targets: Point[], index: number) {
    if (index >= targets.length || this.state.status !== "playing") {
      this.finishMayMeltRun();
      return;
    }

    const target = targets[index];

    if (this.state.board[target.y]?.[target.x] === 0) {
      this.mayActive2ConsumedKeys.add(this.getPointKey(target));
      this.playMayActive2Step(targets, index + 1);
      return;
    }

    const preview = meltBoardBlockAt(this.state, target);

    if (!preview.target) {
      this.mayActive2ConsumedKeys.add(this.getPointKey(target));
      this.playMayActive2Step(targets, index + 1);
      return;
    }

    this.onMayPassiveEffect?.(
      preview.target,
      () => {
        if (this.state.status !== "playing") {
          return null;
        }

        const latestResult = meltBoardBlockAt(this.state, target);

        if (!latestResult.target) {
          return null;
        }

        this.setState({
          ...latestResult.next,
          status: this.state.status,
          speedMs: this.state.speedMs,
          clearDelayMs: this.state.clearDelayMs,
        });
        this.mayActive2ConsumedKeys.add(this.getPointKey(target));

        return latestResult.target;
      },
      () => {
        this.playMayActive2Step(targets, index + 1);
      },
    );
  }

  private useMayActive3() {
    if (
      this.state.skillCooldowns.E > 0 ||
      this.isMayMeltRunning ||
      this.mayActive3Primed ||
      this.mayActive1UsesSinceActive3 <
        getMayActive3RequiredUses(this.state.level)
    ) {
      return;
    }

    this.mayActive1UsesSinceActive3 = 0;
    this.mayActive3Primed = true;
    this.setState({
      ...this.state,
      skillCooldowns: {
        ...this.state.skillCooldowns,
        E: this.getMaySkillCooldownMs(
          "E",
          getMayActive3CooldownMs(this.state.level),
        ),
      },
      skillUses: {
        ...this.state.skillUses,
        E: this.state.skillUses.E + 1,
      },
    });
  }

  private useMayUltimate() {
    if (this.state.skillCooldowns.R > 0) {
      return;
    }

    this.mayUltimateRemainingMs = MAY_ULTIMATE_DURATION_MS;
    this.setState({
      ...this.state,
      skillCooldowns: {
        ...this.state.skillCooldowns,
        Q: Math.ceil(this.state.skillCooldowns.Q / 2),
        W: Math.ceil(this.state.skillCooldowns.W / 2),
        E: Math.ceil(this.state.skillCooldowns.E / 2),
        R: MAY_ULTIMATE_COOLDOWN_MS,
      },
      skillUses: {
        ...this.state.skillUses,
        R: this.state.skillUses.R + 1,
      },
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
  private passiveEffectContainer!: Phaser.GameObjects.Container;
  private passiveEffectHiddenCells = new Set<string>();
  private blockTextureKey = "character-block";

  preload() {
    const character = getCurrentCharacter();
    this.load.image(this.blockTextureKey, getCharacterBlockSrc(character.id));
  }

  constructor() {
    super("GameScene");
  }

  create() {
    this.engine = new PhaserGameEngine(
      createSnapshot(),
      (target, applyGravity) => {
        this.playMayPassiveEffect(target, applyGravity);
      },
    );
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
    this.passiveEffectContainer = this.add.container(0, 0);
    this.passiveEffectContainer.setDepth(20);

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
        this.backgroundGraphics.fillRoundedRect(
          x,
          y,
          cellSize,
          cellSize,
          uiPx(4),
        );

        if (cell !== 0) {
          const boardCellKey = this.getBoardCellKey(
            colIndex,
            rowIndex + HIDDEN_ROWS,
          );
          if (this.passiveEffectHiddenCells.has(boardCellKey)) {
            return;
          }

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
        this.backgroundGraphics.fillRoundedRect(
          x,
          y,
          cellSize,
          cellSize,
          uiPx(4),
        );
        this.backgroundGraphics.lineStyle(uiPx(2), 0xffffff, 0.36);
        this.backgroundGraphics.strokeRoundedRect(
          x,
          y,
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

  private getBoardCellKey(x: number, y: number) {
    return `${x}:${y}`;
  }

  private getVisibleCellPosition(x: number, y: number) {
    const metrics = this.getBoardMetrics(this.scale.width, this.scale.height);
    const visibleY = y - HIDDEN_ROWS;

    return {
      x: metrics.boardX + x * (metrics.cellSize + metrics.gap),
      y: metrics.boardY + visibleY * (metrics.cellSize + metrics.gap),
      cellSize: metrics.cellSize,
    };
  }

  private playMayPassiveEffect(
    target: MayPassiveMeltTarget,
    applyGravity: () => MayPassiveMeltTarget | null,
    onComplete?: () => void,
  ) {
    const targetKey = this.getBoardCellKey(target.x, target.y);

    this.passiveEffectHiddenCells.add(targetKey);

    this.playMeltSprite(target);
    this.playMeltBubbles(target);
    this.time.delayedCall(MAY_PASSIVE_EFFECT_MS + 40, () => {
      const appliedTarget = applyGravity();

      if (!appliedTarget) {
        this.passiveEffectHiddenCells.delete(targetKey);
        onComplete?.();
        return;
      }

      const gravityKeys = new Set<string>([
        targetKey,
        ...appliedTarget.movedCells.map((cell) =>
          this.getBoardCellKey(cell.from.x, cell.from.y),
        ),
        ...appliedTarget.movedCells.map((cell) =>
          this.getBoardCellKey(cell.to.x, cell.to.y),
        ),
      ]);

      gravityKeys.forEach((key) => this.passiveEffectHiddenCells.add(key));

      appliedTarget.movedCells.forEach((cell) =>
        this.playFallingClone(cell.from, cell.to),
      );

      const revealDelayMs =
        appliedTarget.movedCells.length === 0 ? 80 : MAY_PASSIVE_DROP_MS + 80;

      this.time.delayedCall(revealDelayMs, () => {
        gravityKeys.forEach((key) => this.passiveEffectHiddenCells.delete(key));
        onComplete?.();
      });
    });
  }

  private playMeltSprite(target: MayPassiveMeltTarget) {
    const { x, y, cellSize } = this.getVisibleCellPosition(target.x, target.y);
    const textureSize = Math.max(12, Math.round(cellSize));
    const textureKey = `may-passive-melt-${this.time.now}-${target.x}-${target.y}`;
    const canvasTexture = this.textures.createCanvas(
      textureKey,
      textureSize,
      textureSize,
    );

    if (!canvasTexture) {
      return;
    }

    const ctx = canvasTexture.getContext();
    const sourceImage = this.textures
      .get(this.blockTextureKey)
      .getSourceImage() as CanvasImageSource;
    const meltSprite = this.add.image(
      x + cellSize / 2,
      y + cellSize / 2,
      textureKey,
    );

    meltSprite.setDisplaySize(cellSize, cellSize);
    this.passiveEffectContainer.add(meltSprite);

    const drawFrame = (progress: number) => {
      const waveOffset = progress * 58;
      const meltY = progress * textureSize;

      ctx.clearRect(0, 0, textureSize, textureSize);
      ctx.save();
      ctx.beginPath();

      for (let px = 0; px <= textureSize; px += 2) {
        const wave =
          Math.sin((px + waveOffset) * 0.16) * 3 +
          Math.sin((px + waveOffset) * 0.31) * 1.5;
        const waveY = Phaser.Math.Clamp(meltY + wave, 0, textureSize);

        if (px === 0) {
          ctx.moveTo(px, waveY);
        } else {
          ctx.lineTo(px, waveY);
        }
      }

      ctx.lineTo(textureSize, textureSize);
      ctx.lineTo(0, textureSize);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(sourceImage, 0, 0, textureSize, textureSize);

      ctx.globalCompositeOperation = "source-atop";
      ctx.fillStyle = "rgba(255, 75, 164, 0.36)";
      ctx.fillRect(0, 0, textureSize, textureSize);
      ctx.globalCompositeOperation = "source-over";
      ctx.restore();

      if (progress < 0.96) {
        ctx.save();
        ctx.lineWidth = Math.max(2, textureSize * 0.05);
        ctx.strokeStyle = "rgba(255, 80, 165, 0.9)";
        ctx.beginPath();

        for (let px = 0; px <= textureSize; px += 2) {
          const wave =
            Math.sin((px + waveOffset) * 0.16) * 3 +
            Math.sin((px + waveOffset) * 0.31) * 1.5;
          const waveY = Phaser.Math.Clamp(meltY + wave, 0, textureSize);

          if (px === 0) {
            ctx.moveTo(px, waveY);
          } else {
            ctx.lineTo(px, waveY);
          }
        }

        ctx.stroke();
        ctx.restore();
      }

      ctx.save();
      ctx.globalAlpha = 1 - progress * 0.45;
      ctx.fillStyle = "rgba(255, 117, 190, 0.7)";

      for (let index = 0; index < 5; index += 1) {
        const dripX =
          textureSize * (0.16 + index * 0.17) +
          Math.sin(progress * 7 + index) * textureSize * 0.025;
        const dripTop = Math.max(0, meltY - textureSize * 0.08);
        const dripLength =
          textureSize *
          (0.18 + ((index * 11) % 5) * 0.035) *
          (0.4 + progress * 0.9);
        const dripWidth = Math.max(2, textureSize * (0.035 + index * 0.002));

        ctx.beginPath();
        ctx.roundRect(
          dripX - dripWidth / 2,
          dripTop,
          dripWidth,
          dripLength,
          dripWidth,
        );
        ctx.fill();
        ctx.beginPath();
        ctx.arc(dripX, dripTop + dripLength, dripWidth * 1.15, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let index = 0; index < 7; index += 1) {
        const bubbleProgress = (progress * 1.4 + index * 0.17) % 1;
        const bubbleX =
          textureSize * (0.12 + ((index * 19) % 72) / 100) +
          Math.sin(progress * 10 + index) * textureSize * 0.035;
        const bubbleY = Phaser.Math.Clamp(
          meltY + bubbleProgress * textureSize * 0.55,
          0,
          textureSize,
        );
        const radius = Math.max(1.5, textureSize * (0.028 + index * 0.002));

        ctx.beginPath();
        ctx.fillStyle = "rgba(255, 238, 250, 0.82)";
        ctx.arc(bubbleX, bubbleY, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.lineWidth = Math.max(1, radius * 0.32);
        ctx.strokeStyle = "rgba(255, 76, 169, 0.76)";
        ctx.stroke();
      }

      ctx.restore();
      canvasTexture.refresh();
    };

    drawFrame(0);
    this.tweens.addCounter({
      from: 0,
      to: 1,
      duration: MAY_PASSIVE_EFFECT_MS,
      ease: "Sine.easeIn",
      onUpdate: (tween) => {
        drawFrame(tween.getValue() ?? 1);
      },
      onComplete: () => {
        meltSprite.destroy();
        this.textures.remove(textureKey);
      },
    });
  }

  private playMeltBubbles(target: MayPassiveMeltTarget) {
    const { x, y, cellSize } = this.getVisibleCellPosition(target.x, target.y);
    const bubbleCount = 14;
    const streamCount = 3;

    for (let index = 0; index < streamCount; index += 1) {
      const stream = this.add.graphics();
      const streamX =
        x +
        cellSize * (0.18 + index * 0.2) +
        randomRange(-cellSize * 0.04, cellSize * 0.04);

      stream.lineStyle(cellSize * 0.045, 0xff5cae, 0.52);
      stream.beginPath();
      stream.moveTo(streamX, y + cellSize * 0.12);
      stream.lineTo(
        streamX + randomRange(-cellSize * 0.05, cellSize * 0.05),
        y + cellSize * randomRange(0.72, 1.05),
      );
      stream.strokePath();
      stream.setAlpha(0);
      this.passiveEffectContainer.add(stream);

      this.tweens.add({
        targets: stream,
        alpha: { from: 0, to: 0.95 },
        duration: 120,
        yoyo: true,
        hold: 260,
        delay: index * 38,
        ease: "Sine.easeOut",
        onComplete: () => {
          stream.destroy();
        },
      });
    }

    for (let index = 0; index < bubbleCount; index += 1) {
      this.time.delayedCall(index * 24, () => {
        const radius = randomRange(cellSize * 0.055, cellSize * 0.14);
        const bubble = this.add.circle(
          x + randomRange(cellSize * 0.08, cellSize * 0.92),
          y + randomRange(cellSize * 0.08, cellSize * 0.34),
          radius,
          0xffeff9,
          0.86,
        );

        bubble.setStrokeStyle(Math.max(1, cellSize * 0.025), 0xff4fa3, 0.72);
        this.passiveEffectContainer.add(bubble);

        this.tweens.add({
          targets: bubble,
          x: bubble.x + randomRange(-cellSize * 0.18, cellSize * 0.18),
          y: y + cellSize * randomRange(0.9, 1.35),
          alpha: 0,
          scale: randomRange(0.55, 1.25),
          duration: randomRange(420, 700),
          ease: "Sine.easeIn",
          onComplete: () => {
            bubble.destroy();
          },
        });
      });
    }
  }

  private playFallingClone(
    from: { x: number; y: number },
    to: { x: number; y: number },
  ) {
    const start = this.getVisibleCellPosition(from.x, from.y);
    const end = this.getVisibleCellPosition(to.x, to.y);
    const image = this.add.image(
      start.x + start.cellSize / 2,
      start.y + start.cellSize / 2,
      this.blockTextureKey,
    );
    const inset = Math.max(1, Math.floor(start.cellSize * 0.06));

    image.setDisplaySize(
      start.cellSize - inset * 2,
      start.cellSize - inset * 2,
    );
    this.passiveEffectContainer.add(image);
    this.tweens.add({
      targets: image,
      x: end.x + end.cellSize / 2,
      y: end.y + end.cellSize / 2,
      duration: MAY_PASSIVE_DROP_MS,
      ease: "Cubic.easeOut",
      onComplete: () => {
        image.destroy();
      },
    });
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
