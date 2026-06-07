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
  getMayPassiveCooldownMs,
  getMeltCandidateCells,
  getSkillBlockScore,
  getSpeedMs,
  hardDrop as applyHardDrop,
  holdBlock as applyHoldBlock,
  meltBoardBlockAt,
  meltBoardCellsAt,
  meltRandomBoardBlock,
  moveHorizontal,
  reduceSkillCooldownMax,
  reduceSkillCooldowns,
  rotateActiveBlock,
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
const COOLDOWN_TICK_MS = 250;

type MayPassiveMeltTarget = NonNullable<
  ReturnType<typeof meltRandomBoardBlock>["target"]
>;
type MayMeltEffectTarget = Pick<MayPassiveMeltTarget, "x" | "y">;
type FallingOverlayCell = {
  from: Point;
  to: Point;
  startedAtMs: number;
  durationMs: number;
};

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
    skillCooldownMax: state.skillCooldownMax,
    mayPassiveCooldownRemainingMs: state.mayPassiveCooldownRemainingMs,
    mayPrimedQDepth: state.mayPrimedQDepth,
    mayUltimateRemainingMs: state.mayUltimateRemainingMs,
    mayUltimateCastNonce: state.mayUltimateCastNonce,
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
  private mayActive1TargetKeys = new Set<string>();
  private mayActive2ConsumedKeys = new Set<string>();
  private mayActive3Primed = false;
  private mayUltimateRemainingMs = 0;
  private onMayUltimateCastEffect?: () => void;
  private onMayPassiveEffect?: (
    target: MayPassiveMeltTarget,
    applyGravity: () => MayPassiveMeltTarget | null,
    onComplete?: () => void,
  ) => void;
  private onMayMultiMeltEffect?: (
    targets: MayMeltEffectTarget[],
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
    onMayMultiMeltEffect?: (
      targets: MayMeltEffectTarget[],
      applyGravity: () => MayPassiveMeltTarget | null,
      onComplete?: () => void,
    ) => void,
    onMayUltimateCastEffect?: () => void,
  ) {
    this.state = initialState;
    this.mayUltimateRemainingMs = initialState.mayUltimateRemainingMs;
    this.onMayPassiveEffect = onMayPassiveEffect;
    this.onMayMultiMeltEffect = onMayMultiMeltEffect;
    this.onMayUltimateCastEffect = onMayUltimateCastEffect;
    this.emit();
  }

  get snapshot() {
    return this.state;
  }

  getMayActive2IndicatorTargets() {
    return this.mayActive1Targets.filter((target) => {
      const key = this.getPointKey(target);

      return !this.mayActive2ConsumedKeys.has(key) && target.y >= HIDDEN_ROWS;
    });
  }

  private getRememberedMayActive1Targets() {
    return this.mayActive1Targets.filter(
      (target) => !this.mayActive2ConsumedKeys.has(this.getPointKey(target)),
    );
  }

  private getMayActive1CandidateCells() {
    const activeColumns = new Set(
      (this.state.active ? getAbsoluteCells(this.state.active) : []).map(
        (cell) => cell.x,
      ),
    );
    const excludedKeys = this.getRememberedMayActive1Keys();

    return this.state.board.flatMap((row, y) =>
      row.flatMap((cell, x) =>
        cell !== 0 &&
        y >= HIDDEN_ROWS &&
        !activeColumns.has(x) &&
        !excludedKeys.has(this.getPointKey({ x, y }))
          ? [{ x, y }]
          : [],
      ),
    );
  }

  private pickBestMayActive1Target(candidates: Point[], depth: number) {
    const rememberedColumns = new Set(
      this.getRememberedMayActive1Targets().map((target) => target.x),
    );

    return (
      candidates
        .map((candidate) => ({
          point: candidate,
          targets: this.getMayActive1Cells(candidate, depth),
          result: meltBoardCellsAt(
            this.state,
            this.getMayActive1Cells(candidate, depth),
          ),
        }))
        .filter((candidate) => candidate.result.target !== null)
        .sort((left, right) => {
          const leftMoved = left.result.target?.movedCells.length ?? 0;
          const rightMoved = right.result.target?.movedCells.length ?? 0;
          const leftCleared = left.targets.length;
          const rightCleared = right.targets.length;
          const leftRemembered = rememberedColumns.has(left.point.x) ? 1 : 0;
          const rightRemembered = rememberedColumns.has(right.point.x) ? 1 : 0;

          return (
            rightMoved - leftMoved ||
            rightCleared - leftCleared ||
            rightRemembered - leftRemembered ||
            right.point.y - left.point.y ||
            left.point.x - right.point.x
          );
        })[0]?.point ?? null
    );
  }

  private getMayActive1Target(depth = 0) {
    const candidates = this.getMayActive1CandidateCells();

    if (candidates.length === 0) {
      return null;
    }

    return this.pickBestMayActive1Target(candidates, depth);
  }

  update(deltaMs: number) {
    if (this.state.status === "playing") {
      this.tickObstacleTiming(deltaMs);
      this.gravityAccumulatorMs += deltaMs;
      this.cooldownAccumulatorMs += deltaMs;
      this.tickMayUltimate(deltaMs);
      this.tickMayPassive(deltaMs);

      while (this.cooldownAccumulatorMs >= COOLDOWN_TICK_MS) {
        this.cooldownAccumulatorMs -= COOLDOWN_TICK_MS;
        this.tickSkillCooldowns(COOLDOWN_TICK_MS);
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
      mayPassiveCooldownRemainingMs:
        !spawned.failed && getCurrentCharacter().id === "may"
          ? getMayPassiveCooldownMs(spawned.next.level)
          : 0,
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

  tickSkillCooldowns = (elapsedMs = COOLDOWN_TICK_MS) => {
    if (this.state.status !== "playing") {
      return;
    }

    const nextSkillCooldowns = reduceSkillCooldowns(
      this.state.skillCooldowns,
      elapsedMs,
    );

    this.setState({
      ...this.state,
      skillCooldowns: nextSkillCooldowns,
      skillCooldownMax: reduceSkillCooldownMax(
        nextSkillCooldowns,
        this.state.skillCooldownMax,
      ),
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
    this.mayActive1TargetKeys = new Set<string>();
    this.mayActive2ConsumedKeys = new Set<string>();
    this.mayActive3Primed = false;
    this.mayUltimateRemainingMs = 0;
  }

  private getRememberedMayActive1Keys() {
    return new Set(
      this.mayActive1Targets
        .map((target) => this.getPointKey(target))
        .filter((key) => !this.mayActive2ConsumedKeys.has(key)),
    );
  }

  private rememberMayActive1Target(target: Point) {
    const key = this.getPointKey(target);

    if (this.mayActive1TargetKeys.has(key)) {
      return;
    }

    this.mayActive2ConsumedKeys.delete(key);
    this.mayActive1TargetKeys.add(key);
    this.mayActive1Targets.push(target);
  }

  private consumeMayActive1Targets(targets: Point[]) {
    if (targets.length === 0) {
      return;
    }

    const consumedKeys = new Set(
      targets.map((target) => this.getPointKey(target)),
    );

    targets.forEach((target) => {
      this.mayActive2ConsumedKeys.add(this.getPointKey(target));
    });
    this.mayActive1Targets = this.mayActive1Targets.filter((target) => {
      const key = this.getPointKey(target);

      if (!consumedKeys.has(key)) {
        return true;
      }

      this.mayActive1TargetKeys.delete(key);
      return false;
    });
  }

  private tickMayUltimate(deltaMs: number) {
    if (this.mayUltimateRemainingMs <= 0) {
      return;
    }

    this.mayUltimateRemainingMs = Math.max(
      0,
      this.mayUltimateRemainingMs - deltaMs,
    );

    const roundedRemainingMs =
      this.mayUltimateRemainingMs > 0
        ? Math.ceil(this.mayUltimateRemainingMs / 100) * 100
        : 0;

    if (roundedRemainingMs !== this.state.mayUltimateRemainingMs) {
      this.setState({
        ...this.state,
        mayUltimateRemainingMs: roundedRemainingMs,
      });
    }
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

  private getMayActive1Cells(target: Point, depth: number) {
    return Array.from({ length: depth + 1 }, (_, index) => ({
      x: target.x,
      y: target.y - index,
    })).filter(
      (cell) => cell.y >= 0 && this.state.board[cell.y]?.[cell.x] !== 0,
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

    const cooldownMs = getMayPassiveCooldownMs(this.state.level);
    const hasPassiveTarget = this.hasMayPassiveTarget();

    if (!hasPassiveTarget) {
      this.syncMayPassiveCooldownState(cooldownMs);
      return;
    }

    this.mayPassiveAccumulatorMs += deltaMs;
    this.syncMayPassiveCooldownState(cooldownMs);

    if (this.mayPassiveAccumulatorMs < cooldownMs) {
      return;
    }

    this.mayPassiveAccumulatorMs -= cooldownMs;
    this.syncMayPassiveCooldownState(cooldownMs);
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

  private hasMayPassiveTarget() {
    return getMeltCandidateCells(this.state).length > 0;
  }

  private syncMayPassiveCooldownState(cooldownMs: number) {
    const remainingMs = Math.max(0, cooldownMs - this.mayPassiveAccumulatorMs);
    const roundedRemainingMs =
      remainingMs > 0 ? Math.ceil(remainingMs / 100) * 100 : 0;

    if (roundedRemainingMs === this.state.mayPassiveCooldownRemainingMs) {
      return;
    }

    this.setState({
      ...this.state,
      mayPassiveCooldownRemainingMs: roundedRemainingMs,
    });
  }

  private useMayActive1() {
    if (this.state.skillCooldowns.Q > 0 || this.isMayMeltRunning) {
      return;
    }

    const useCount = getMayActive1TargetCount(this.state.level);
    const active3Depth = this.mayActive3Primed
      ? getMayActive3Depth(this.state.level)
      : 0;
    const firstTarget = this.getMayActive1Target(active3Depth);

    if (!firstTarget) {
      return;
    }

    this.isMayMeltRunning = true;
    window.setTimeout(() => {
      if (this.isMayMeltRunning) {
        this.finishMayMeltRun();
      }
    }, 12000);
    this.mayActive3Primed = false;
    const nextCooldownMs = this.getMaySkillCooldownMs(
      "Q",
      getMayActive1CooldownMs(this.state.level),
    );

    this.setState({
      ...this.state,
      skillCooldowns: {
        ...this.state.skillCooldowns,
        Q: nextCooldownMs,
      },
      skillCooldownMax: {
        ...this.state.skillCooldownMax,
        Q: nextCooldownMs,
      },
      mayPrimedQDepth: null,
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

  private applySkillRemovalScore(nextState: GameData, removedCount: number) {
    const nextScore = nextState.score + getSkillBlockScore(removedCount);
    const nextStatus =
      nextState.targetScore !== null && nextScore >= nextState.targetScore
        ? "levelClear"
        : ("playing" as const);

    this.setState({
      ...nextState,
      score: nextScore,
      status: nextStatus,
      speedMs: this.state.speedMs,
      clearDelayMs: nextStatus === "levelClear" ? LEVEL_CLEAR_DELAY_MS : 0,
    });
  }

  private playMayActive1Step(index: number, total: number, depth: number) {
    if (index >= total || this.state.status !== "playing") {
      this.finishMayMeltRun();
      return;
    }

    const target = this.getMayActive1Target(depth);

    if (!target) {
      this.finishMayMeltRun();
      return;
    }

    const resolvedTargets = this.getMayActive1Cells(target, depth);
    const preview = meltBoardCellsAt(this.state, resolvedTargets);

    if (!preview.target) {
      this.finishMayMeltRun();
      return;
    }

    const playEffect =
      depth > 0 && preview.target.movedCells.length >= 0
        ? this.onMayMultiMeltEffect
        : null;

    playEffect?.(
      resolvedTargets,
      () => {
        if (this.state.status !== "playing") {
          return null;
        }

        const actualTargets = resolvedTargets.filter(
          (cell) => this.state.board[cell.y]?.[cell.x] !== 0,
        );

        if (actualTargets.length === 0) {
          return null;
        }

        const latestResult = meltBoardCellsAt(this.state, actualTargets);

        if (!latestResult.target) {
          return null;
        }

        this.applySkillRemovalScore(latestResult.next, actualTargets.length);
        this.rememberMayActive1Target(target);

        return latestResult.target;
      },
      () => {
        this.playMayActive1Step(index + 1, total, depth);
      },
    );

    if (!playEffect) {
      this.onMayPassiveEffect?.(
        preview.target,
        () => {
          if (this.state.status !== "playing") {
            return null;
          }

          const actualTargets = resolvedTargets.filter(
            (cell) => this.state.board[cell.y]?.[cell.x] !== 0,
          );

          if (actualTargets.length === 0) {
            return null;
          }

          const latestResult = meltBoardCellsAt(this.state, actualTargets);

          if (!latestResult.target) {
            return null;
          }

          this.applySkillRemovalScore(latestResult.next, actualTargets.length);
          this.rememberMayActive1Target(target);

          return latestResult.target;
        },
        () => {
          this.playMayActive1Step(index + 1, total, depth);
        },
      );
    }
  }

  private useMayActive2() {
    if (this.state.skillCooldowns.W > 0 || this.isMayMeltRunning) {
      return;
    }

    const targets = this.mayActive1Targets.filter((target) => {
      const key = this.getPointKey(target);

      return (
        !this.mayActive2ConsumedKeys.has(key) &&
        this.state.board[target.y]?.[target.x] !== 0
      );
    });

    if (targets.length === 0) {
      return;
    }

    const uniqueTargets = targets.filter((target, index) => {
      const key = this.getPointKey(target);

      return (
        targets.findIndex(
          (candidate) => this.getPointKey(candidate) === key,
        ) === index
      );
    });
    const preview = meltBoardCellsAt(this.state, uniqueTargets);

    if (!preview.target) {
      return;
    }

    this.isMayMeltRunning = true;
    window.setTimeout(() => {
      if (this.isMayMeltRunning) {
        this.finishMayMeltRun();
      }
    }, 12000);
    const nextCooldownMs = this.getMaySkillCooldownMs(
      "W",
      getMayActive2CooldownMs(this.state.level),
    );

    this.setState({
      ...this.state,
      skillCooldowns: {
        ...this.state.skillCooldowns,
        W: nextCooldownMs,
      },
      skillCooldownMax: {
        ...this.state.skillCooldownMax,
        W: nextCooldownMs,
      },
      skillUses: {
        ...this.state.skillUses,
        W: this.state.skillUses.W + 1,
      },
    });
    this.onMayMultiMeltEffect?.(
      uniqueTargets,
      () => {
        if (this.state.status !== "playing") {
          return null;
        }

        const latestTargets = uniqueTargets.filter(
          (target) => this.state.board[target.y]?.[target.x] !== 0,
        );

        if (latestTargets.length === 0) {
          return null;
        }

        const latestResult = meltBoardCellsAt(this.state, latestTargets);

        if (!latestResult.target) {
          return null;
        }

        this.applySkillRemovalScore(latestResult.next, latestTargets.length);
        this.consumeMayActive1Targets(latestTargets);

        return latestResult.target;
      },
      () => {
        this.finishMayMeltRun();
      },
    );
  }

  private useMayActive3() {
    if (
      this.state.skillCooldowns.E > 0 ||
      this.isMayMeltRunning ||
      this.mayActive3Primed
    ) {
      return;
    }

    this.mayActive3Primed = true;
    const nextDepth = getMayActive3Depth(this.state.level);
    const nextCooldownMs = this.getMaySkillCooldownMs(
      "E",
      getMayActive3CooldownMs(this.state.level),
    );

    this.setState({
      ...this.state,
      skillCooldowns: {
        ...this.state.skillCooldowns,
        E: nextCooldownMs,
      },
      skillCooldownMax: {
        ...this.state.skillCooldownMax,
        E: nextCooldownMs,
      },
      mayPrimedQDepth: nextDepth,
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
        Q: 0,
        W: 0,
        E: 0,
        R: MAY_ULTIMATE_COOLDOWN_MS,
      },
      skillCooldownMax: {
        ...this.state.skillCooldownMax,
        Q: 0,
        W: 0,
        E: 0,
        R: MAY_ULTIMATE_COOLDOWN_MS,
      },
      mayUltimateRemainingMs: MAY_ULTIMATE_DURATION_MS,
      mayUltimateCastNonce: this.state.mayUltimateCastNonce + 1,
      skillUses: {
        ...this.state.skillUses,
        R: this.state.skillUses.R + 1,
      },
    });
    this.onMayUltimateCastEffect?.();
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
  private ultimateAuraGraphics!: Phaser.GameObjects.Graphics;
  private mayIndicatorGraphics!: Phaser.GameObjects.Graphics;
  private blockContainer!: Phaser.GameObjects.Container;
  private passiveEffectContainer!: Phaser.GameObjects.Container;
  private ultimateEffectContainer!: Phaser.GameObjects.Container;
  private passiveEffectHiddenCells = new Set<string>();
  private fallingOverlayCells: FallingOverlayCell[] = [];
  private blockSprites: Phaser.GameObjects.Image[] = [];
  private obstaclePreviewSprites: Phaser.GameObjects.Image[] = [];
  private fallingOverlaySprites: Phaser.GameObjects.Image[] = [];
  private visibleBlockSpriteCount = 0;
  private visibleObstaclePreviewSpriteCount = 0;
  private visibleFallingOverlaySpriteCount = 0;
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
      (target, applyGravity, onComplete) => {
        this.playMayPassiveEffect(target, applyGravity, onComplete);
      },
      (targets, applyGravity, onComplete) => {
        this.playMayMultiMeltEffect(targets, applyGravity, onComplete);
      },
      () => {
        this.playMayUltimateCastEffect();
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
    this.ultimateAuraGraphics = this.add.graphics();
    this.mayIndicatorGraphics = this.add.graphics();
    this.blockContainer = this.add.container(0, 0);
    this.passiveEffectContainer = this.add.container(0, 0);
    this.ultimateEffectContainer = this.add.container(0, 0);
    this.ultimateAuraGraphics.setDepth(9);
    this.mayIndicatorGraphics.setDepth(15);
    this.ultimateEffectContainer.setDepth(18);
    this.passiveEffectContainer.setDepth(20);

    this.input.keyboard?.on("keydown-LEFT", () => this.engine.moveLeft());
    this.input.keyboard?.on("keydown-RIGHT", () => this.engine.moveRight());
    this.input.keyboard?.on("keydown-DOWN", () => this.engine.softDrop());
    this.input.keyboard?.on("keydown-S", () => this.engine.softDrop());
    this.input.keyboard?.on("keydown-SPACE", () => this.engine.hardDrop());
    this.input.keyboard?.on("keydown-A", () =>
      this.engine.rotateCounterClockwise(),
    );
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
    this.ultimateAuraGraphics.clear();
    this.mayIndicatorGraphics.clear();
    this.visibleBlockSpriteCount = 0;
    this.visibleObstaclePreviewSpriteCount = 0;
    this.visibleFallingOverlaySpriteCount = 0;

    const hiddenBoardCellKeys = new Set(this.passiveEffectHiddenCells);

    this.fallingOverlayCells.forEach((cell) => {
      hiddenBoardCellKeys.add(this.getBoardCellKey(cell.to.x, cell.to.y));
    });

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
          if (hiddenBoardCellKeys.has(boardCellKey)) {
            return;
          }

          this.drawBoardBlockSprite(
            x + cellSize / 2,
            y + cellSize / 2,
            cellSize,
            cell === 4 ? 0.92 : cell === 3 ? 0.96 : 1,
          );
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

        this.drawBoardBlockSprite(
          x + cellSize / 2,
          y + cellSize / 2,
          cellSize,
          0.28,
        );
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

          this.drawBoardBlockSprite(
            x + cellSize / 2,
            y + cellSize / 2,
            cellSize,
            0.96,
            true,
          );
        });
      });
    }

    this.renderMayUltimateAura(
      boardPanelX,
      boardPanelY,
      boardPanelWidth,
      boardPanelHeight,
    );
    this.drawMayActive2Indicators();
    this.drawFallingOverlaySprites();

    this.hideUnusedBoardBlockSprites();
    this.hideUnusedObstaclePreviewSprites();
    this.hideUnusedFallingOverlaySprites();
  }

  private drawBoardBlockSprite(
    centerX: number,
    centerY: number,
    cellSize: number,
    alpha: number,
    isObstaclePreview = false,
  ) {
    const image = isObstaclePreview
      ? this.getObstaclePreviewSprite()
      : this.getBoardBlockSprite();
    const inset = Math.max(1, Math.floor(cellSize * 0.06));

    image.setPosition(centerX, centerY);
    image.setDisplaySize(cellSize - inset * 2, cellSize - inset * 2);
    image.setAlpha(alpha);
    image.setVisible(true);
  }

  private getBoardBlockSprite() {
    const existing = this.blockSprites[this.visibleBlockSpriteCount];

    if (existing) {
      this.visibleBlockSpriteCount += 1;
      existing.setTexture(this.blockTextureKey);
      return existing;
    }

    const image = this.add.image(0, 0, this.blockTextureKey);
    this.blockContainer.add(image);
    this.blockSprites.push(image);
    this.visibleBlockSpriteCount += 1;

    return image;
  }

  private hideUnusedBoardBlockSprites() {
    for (
      let index = this.visibleBlockSpriteCount;
      index < this.blockSprites.length;
      index += 1
    ) {
      this.blockSprites[index].setVisible(false);
    }
  }

  private getObstaclePreviewSprite() {
    const existing =
      this.obstaclePreviewSprites[this.visibleObstaclePreviewSpriteCount];

    if (existing) {
      this.visibleObstaclePreviewSpriteCount += 1;
      existing.setTexture(this.blockTextureKey);
      return existing;
    }

    const image = this.add.image(0, 0, this.blockTextureKey);
    this.blockContainer.add(image);
    this.obstaclePreviewSprites.push(image);
    this.visibleObstaclePreviewSpriteCount += 1;

    return image;
  }

  private hideUnusedObstaclePreviewSprites() {
    for (
      let index = this.visibleObstaclePreviewSpriteCount;
      index < this.obstaclePreviewSprites.length;
      index += 1
    ) {
      this.obstaclePreviewSprites[index].setVisible(false);
    }
  }

  private getFallingOverlaySprite() {
    const existing =
      this.fallingOverlaySprites[this.visibleFallingOverlaySpriteCount];

    if (existing) {
      this.visibleFallingOverlaySpriteCount += 1;
      existing.setTexture(this.blockTextureKey);
      return existing;
    }

    const image = this.add.image(0, 0, this.blockTextureKey);
    this.passiveEffectContainer.add(image);
    this.fallingOverlaySprites.push(image);
    this.visibleFallingOverlaySpriteCount += 1;

    return image;
  }

  private hideUnusedFallingOverlaySprites() {
    for (
      let index = this.visibleFallingOverlaySpriteCount;
      index < this.fallingOverlaySprites.length;
      index += 1
    ) {
      this.fallingOverlaySprites[index].setVisible(false);
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

  private getMayActive2IndicatorTargets() {
    return this.engine.getMayActive2IndicatorTargets();
  }

  private drawMayActive2Indicators() {
    const targets = this.getMayActive2IndicatorTargets();

    if (targets.length === 0) {
      return;
    }

    const pulse = 0.66 + Math.sin(this.time.now / 330) * 0.14;
    const auraPulse = 0.5 + Math.sin(this.time.now / 220) * 0.5;
    const fillAlpha = 0.07 + pulse * 0.05;
    const glowAlpha = 0.12 + pulse * 0.09;
    const auraAlpha = 0.07 + auraPulse * 0.09;
    const outerRingAlpha = 0.52 + pulse * 0.16;
    const innerRingAlpha = 0.34 + pulse * 0.14;
    const dotAlpha = 0.48 + pulse * 0.12;

    targets.forEach((target) => {
      const { x, y, cellSize } = this.getVisibleCellPosition(
        target.x,
        target.y,
      );
      const inset = Math.max(1.8, cellSize * 0.1);
      const innerInset = Math.max(3.5, cellSize * 0.17);
      const dotRadius = Math.max(3, cellSize * 0.095);
      const glowRadius = Math.max(dotRadius * 2.5, cellSize * 0.26);
      const auraRadius = glowRadius + cellSize * (0.12 + auraPulse * 0.18);
      const centerX = x + cellSize / 2;
      const centerY = y + cellSize / 2;

      this.mayIndicatorGraphics.fillStyle(0xff92d2, auraAlpha);
      this.mayIndicatorGraphics.fillCircle(centerX, centerY, auraRadius);

      this.mayIndicatorGraphics.fillStyle(0xffd8ee, fillAlpha);
      this.mayIndicatorGraphics.fillRoundedRect(
        x + innerInset,
        y + innerInset,
        cellSize - innerInset * 2,
        cellSize - innerInset * 2,
        Math.max(4, cellSize * 0.12),
      );

      this.mayIndicatorGraphics.fillStyle(0xff72b8, glowAlpha);
      this.mayIndicatorGraphics.fillCircle(centerX, centerY, glowRadius);
      this.mayIndicatorGraphics.lineStyle(
        Math.max(1.8, cellSize * 0.072),
        0xfff4fb,
        outerRingAlpha,
      );
      this.mayIndicatorGraphics.strokeRoundedRect(
        x + inset,
        y + inset,
        cellSize - inset * 2,
        cellSize - inset * 2,
        Math.max(4, cellSize * 0.14),
      );
      this.mayIndicatorGraphics.lineStyle(
        Math.max(1.2, cellSize * 0.045),
        0xff98cf,
        innerRingAlpha,
      );
      this.mayIndicatorGraphics.strokeRoundedRect(
        x + innerInset,
        y + innerInset,
        cellSize - innerInset * 2,
        cellSize - innerInset * 2,
        Math.max(4, cellSize * 0.1),
      );
      this.mayIndicatorGraphics.fillStyle(0xfff4fb, dotAlpha);
      this.mayIndicatorGraphics.fillCircle(centerX, centerY, dotRadius);
    });
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

  private queueFallingOverlay(cells: Array<{ from: Point; to: Point }>) {
    const startedAtMs = this.time.now;

    this.fallingOverlayCells.push(
      ...cells.map((cell) => ({
        ...cell,
        startedAtMs,
        durationMs: MAY_PASSIVE_DROP_MS,
      })),
    );
  }

  private drawFallingOverlaySprites() {
    if (this.fallingOverlayCells.length === 0) {
      return;
    }

    const now = this.time.now;

    this.fallingOverlayCells = this.fallingOverlayCells.filter((cell) => {
      const progress = clamp01((now - cell.startedAtMs) / cell.durationMs);
      const easedProgress = Phaser.Math.Easing.Cubic.Out(progress);
      const start = this.getVisibleCellPosition(cell.from.x, cell.from.y);
      const end = this.getVisibleCellPosition(cell.to.x, cell.to.y);
      const sprite = this.getFallingOverlaySprite();
      const inset = Math.max(1, Math.floor(start.cellSize * 0.06));

      sprite.setPosition(
        start.x + start.cellSize / 2,
        start.y + start.cellSize / 2 + (end.y - start.y) * easedProgress,
      );
      sprite.setDisplaySize(
        start.cellSize - inset * 2,
        start.cellSize - inset * 2,
      );
      sprite.setAlpha(1 - progress * 0.02);
      sprite.setVisible(true);

      return progress < 1;
    });
  }

  private renderMayUltimateAura(
    boardPanelX: number,
    boardPanelY: number,
    boardPanelWidth: number,
    boardPanelHeight: number,
  ) {
    const remainingMs = this.engine.snapshot.mayUltimateRemainingMs;

    if (remainingMs <= 0) {
      return;
    }

    const pulse = 0.5 + Math.sin(this.time.now / 280) * 0.5;
    const progress = clamp01(remainingMs / MAY_ULTIMATE_DURATION_MS);
    const outerAlpha = 0.08 + pulse * 0.06;
    const innerAlpha = 0.16 + pulse * 0.08;
    const borderAlpha = 0.2 + progress * 0.12 + pulse * 0.08;
    const inset = uiPx(3);

    this.ultimateAuraGraphics.fillStyle(0xff9bd4, outerAlpha);
    this.ultimateAuraGraphics.fillRoundedRect(
      boardPanelX - uiPx(4),
      boardPanelY - uiPx(4),
      boardPanelWidth + uiPx(8),
      boardPanelHeight + uiPx(8),
      uiPx(18),
    );
    this.ultimateAuraGraphics.fillStyle(0xfff1fa, innerAlpha);
    this.ultimateAuraGraphics.fillRoundedRect(
      boardPanelX + inset,
      boardPanelY + inset,
      boardPanelWidth - inset * 2,
      boardPanelHeight - inset * 2,
      uiPx(14),
    );
    this.ultimateAuraGraphics.lineStyle(uiPx(2), 0xffeff9, borderAlpha);
    this.ultimateAuraGraphics.strokeRoundedRect(
      boardPanelX - uiPx(1),
      boardPanelY - uiPx(1),
      boardPanelWidth + uiPx(2),
      boardPanelHeight + uiPx(2),
      uiPx(16),
    );
  }

  private playMayUltimateCastEffect() {
    const metrics = this.getBoardMetrics(this.scale.width, this.scale.height);
    const boardPanelX = metrics.boardX - BOARD_PADDING;
    const boardPanelY = metrics.boardY - BOARD_PADDING;
    const boardPanelWidth = metrics.boardWidth + BOARD_PADDING * 2;
    const boardPanelHeight = metrics.boardHeight + BOARD_PADDING * 2;
    const centerX = boardPanelX + boardPanelWidth / 2;
    const centerY = boardPanelY + boardPanelHeight / 2;
    const ring = this.add.graphics();
    const flare = this.add.graphics();

    this.ultimateEffectContainer.add([flare, ring]);

    this.tweens.addCounter({
      from: 0,
      to: 1,
      duration: 760,
      ease: "Sine.easeOut",
      onUpdate: (tween) => {
        const progress = tween.getValue() ?? 1;
        const ringWidth = boardPanelWidth * (0.4 + progress * 0.82);
        const ringHeight = boardPanelHeight * (0.32 + progress * 0.78);

        flare.clear();
        flare.fillStyle(0xfff2fa, 0.2 * (1 - progress));
        flare.fillRoundedRect(
          boardPanelX,
          boardPanelY,
          boardPanelWidth,
          boardPanelHeight,
          uiPx(16),
        );
        flare.fillStyle(0xff9ad3, 0.12 * (1 - progress * 0.6));
        flare.fillEllipse(centerX, centerY, ringWidth * 0.9, ringHeight * 0.9);

        ring.clear();
        ring.lineStyle(uiPx(5), 0xfffbff, 0.68 * (1 - progress));
        ring.strokeEllipse(centerX, centerY, ringWidth, ringHeight);
        ring.lineStyle(uiPx(2.5), 0xff9fd3, 0.54 * (1 - progress * 0.7));
        ring.strokeEllipse(
          centerX,
          centerY,
          ringWidth * 1.14,
          ringHeight * 1.1,
        );
      },
      onComplete: () => {
        flare.destroy();
        ring.destroy();
      },
    });

    for (let index = 0; index < 18; index += 1) {
      const sparkle = this.add.circle(
        centerX + randomRange(-boardPanelWidth * 0.22, boardPanelWidth * 0.22),
        centerY +
          randomRange(-boardPanelHeight * 0.16, boardPanelHeight * 0.16),
        randomRange(uiPx(2), uiPx(5)),
        0xffeff9,
        0.8,
      );

      this.ultimateEffectContainer.add(sparkle);
      this.tweens.add({
        targets: sparkle,
        x:
          sparkle.x +
          randomRange(-boardPanelWidth * 0.18, boardPanelWidth * 0.18),
        y:
          sparkle.y +
          randomRange(-boardPanelHeight * 0.28, boardPanelHeight * 0.28),
        alpha: 0,
        scale: randomRange(1.2, 1.8),
        duration: randomRange(520, 980),
        ease: "Sine.easeOut",
        delay: index * 14,
        onComplete: () => {
          sparkle.destroy();
        },
      });
    }
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
          this.getBoardCellKey(cell.to.x, cell.to.y),
        ),
      ]);

      gravityKeys.forEach((key) => this.passiveEffectHiddenCells.add(key));
      this.queueFallingOverlay(appliedTarget.movedCells);

      const revealDelayMs =
        appliedTarget.movedCells.length === 0 ? 80 : MAY_PASSIVE_DROP_MS;

      this.time.delayedCall(revealDelayMs, () => {
        gravityKeys.forEach((key) => this.passiveEffectHiddenCells.delete(key));
        onComplete?.();
      });
    });
  }

  private playMayMultiMeltEffect(
    targets: MayMeltEffectTarget[],
    applyGravity: () => MayPassiveMeltTarget | null,
    onComplete?: () => void,
  ) {
    const targetKeys = targets.map((target) =>
      this.getBoardCellKey(target.x, target.y),
    );

    targetKeys.forEach((key) => this.passiveEffectHiddenCells.add(key));
    this.playMayColumnMeltEffect(targets);
    targets.forEach((target) => {
      this.playMeltSprite(target);
      this.playMeltBubbles(target);
    });

    this.time.delayedCall(MAY_PASSIVE_EFFECT_MS + 40, () => {
      const appliedTarget = applyGravity();

      if (!appliedTarget) {
        targetKeys.forEach((key) => this.passiveEffectHiddenCells.delete(key));
        onComplete?.();
        return;
      }

      const gravityKeys = new Set<string>([
        ...targetKeys,
        ...appliedTarget.movedCells.map((cell) =>
          this.getBoardCellKey(cell.to.x, cell.to.y),
        ),
      ]);

      gravityKeys.forEach((key) => this.passiveEffectHiddenCells.add(key));
      this.queueFallingOverlay(appliedTarget.movedCells);

      const revealDelayMs =
        appliedTarget.movedCells.length === 0 ? 80 : MAY_PASSIVE_DROP_MS;

      this.time.delayedCall(revealDelayMs, () => {
        gravityKeys.forEach((key) => this.passiveEffectHiddenCells.delete(key));
        onComplete?.();
      });
    });
  }

  private playMayColumnMeltEffect(targets: MayMeltEffectTarget[]) {
    const sortedTargets = [...targets].sort((left, right) => right.y - left.y);

    if (
      sortedTargets.length < 2 ||
      !sortedTargets.every((target) => target.x === sortedTargets[0].x)
    ) {
      return;
    }

    const start = this.getVisibleCellPosition(
      sortedTargets[0].x,
      sortedTargets[0].y,
    );
    const end = this.getVisibleCellPosition(
      sortedTargets[sortedTargets.length - 1].x,
      sortedTargets[sortedTargets.length - 1].y,
    );
    const stream = this.add.graphics();
    const centerX = start.x + start.cellSize / 2;
    const topY = end.y + end.cellSize * 0.18;
    const bottomY = start.y + start.cellSize * 0.82;
    const streamWidth = Math.max(8, start.cellSize * 0.34);

    this.passiveEffectContainer.add(stream);

    this.tweens.addCounter({
      from: 0,
      to: 1,
      duration: MAY_PASSIVE_EFFECT_MS,
      ease: "Sine.easeInOut",
      onUpdate: (tween) => {
        const progress = tween.getValue() ?? 1;
        const frontY = bottomY - (bottomY - topY) * progress;

        stream.clear();
        stream.fillStyle(0xff9fd2, 0.2 + (1 - progress) * 0.12);
        stream.fillRoundedRect(
          centerX - streamWidth * 0.72,
          frontY,
          streamWidth * 1.44,
          bottomY - frontY + start.cellSize * 0.18,
          streamWidth,
        );
        stream.fillStyle(0xff5cae, 0.34 + (1 - progress) * 0.16);
        stream.fillRoundedRect(
          centerX - streamWidth / 2,
          frontY,
          streamWidth,
          bottomY - frontY + start.cellSize * 0.14,
          streamWidth,
        );
        stream.fillStyle(0xffeff9, 0.88 - progress * 0.3);
        stream.fillCircle(centerX, frontY, Math.max(5, streamWidth * 0.58));
      },
      onComplete: () => {
        stream.destroy();
      },
    });
  }

  private playMeltSprite(target: MayMeltEffectTarget) {
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

  private playMeltBubbles(target: MayMeltEffectTarget) {
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
