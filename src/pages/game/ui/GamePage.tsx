import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useShallow } from "zustand/shallow";

import {
  CHARACTER_LIST,
  getCharacterBlockSrc,
  getCharacterGamePlayThemeSrc,
  getCharacterSkillSrc,
  useCharacterStore,
} from "@/entities/character";
import type { BagSlot, BlockDefinition, SkillKey } from "@/entities/game";
import { BOARD_WIDTH, HIDDEN_ROWS, useGameStore } from "@/entities/game";
import { useGameRecordStore } from "@/entities/gameRecord";
import { useScoreStore } from "@/entities/score";
import { APP_ROUTES } from "@/shared/config/routes";
import { startPageTransition } from "@/shared/lib/performance/performanceTelemetry";
import { useFpsMonitor } from "@/shared/lib/performance/useFpsMonitor";
import { useMeasuredHandler } from "@/shared/lib/performance/useMeasuredHandler";
import { usePageTransitionTrace } from "@/shared/lib/performance/usePageTransitionTrace";
import { usePerformanceTrace } from "@/shared/lib/performance/usePerformanceTrace";
import { useKeyBindings } from "@/shared/lib/useKeyBindings";
import { Button } from "@/shared/ui/Button";
import { GameCanvas } from "@/widgets/gameCanvas/ui/GameCanvas";
import "./game.css.ts";

const pauseIconSrc = "/assets/icons/pause.svg";
const resumeIconSrc = "/assets/icons/play-filled.svg";
const settingsIconSrc = "/assets/icons/settings.svg";
const exitIconSrc = "/assets/icons/exit.svg";

const skillKeys: SkillKey[] = ["Q", "W", "E", "R"];
const skillLabels = ["패시브", "Q", "W", "E", "R"];
const failureOverlayDelayMs = 1100;
const failureFallbackBlockCount = 80;
const failurePileColumns = BOARD_WIDTH;

const formatNumber = (value: number) => value.toLocaleString("ko-KR");

const getMiniShape = (definition: BlockDefinition | null) => {
  if (!definition) {
    return {
      cells: [],
      cols: 1,
      rows: 1,
    };
  }

  const minX = Math.min(...definition.cells.map((cell) => cell.x));
  const minY = Math.min(...definition.cells.map((cell) => cell.y));
  const cells = definition.cells.map((cell) => ({
    x: cell.x - minX,
    y: cell.y - minY,
  }));

  return {
    cells,
    cols: Math.max(...cells.map((cell) => cell.x)) + 1,
    rows: Math.max(...cells.map((cell) => cell.y)) + 1,
  };
};

const MiniBlock = ({
  definition,
  label,
  isMuted = false,
  style,
}: {
  definition: BlockDefinition | null;
  label?: string;
  isMuted?: boolean;
  style?: CSSProperties;
}) => {
  const shape = getMiniShape(definition);

  return (
    <div className="mini-block" data-muted={isMuted} style={style}>
      {label ? <span className="mini-block-label">{label}</span> : null}
      <div
        className="mini-block-grid"
        style={
          {
            "--mini-rows": shape.rows,
            "--mini-cols": shape.cols,
          } as CSSProperties
        }
      >
        {shape.cells.map((cell, index) => (
          <span
            key={`${cell.x}-${cell.y}-${index}`}
            style={
              {
                "--mini-cell-x": cell.x + 1,
                "--mini-cell-y": cell.y + 1,
              } as CSSProperties
            }
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  );
};

const SkillSlotIcon = ({
  src,
  alt,
  label,
  cooldownSeconds,
  cooldownProgress,
  primedLabel,
  timerTone = "cooldown",
}: {
  src: string;
  alt: string;
  label: string;
  cooldownSeconds?: number;
  cooldownProgress?: number;
  primedLabel?: string;
  timerTone?: "cooldown" | "ultimate";
}) => {
  return (
    <div className="skill-icon-shell">
      <img className="skill-icon-image" src={src} alt={alt} draggable={false} />
      {cooldownSeconds !== undefined ? (
        <span
          className="skill-icon-timer"
          aria-hidden="true"
          data-tone={timerTone}
          style={
            {
              "--cooldown-progress": cooldownProgress ?? 0,
            } as CSSProperties
          }
        >
          <span className="skill-icon-timer-value">{cooldownSeconds}</span>
        </span>
      ) : null}
      {primedLabel ? (
        <span className="skill-icon-prime-badge" aria-hidden="true">
          {primedLabel}
        </span>
      ) : null}
      <span className="skill-key">{label}</span>
    </div>
  );
};

const BagPreview = ({ bag }: { bag: BagSlot[] }) => {
  const availableSlots = bag.filter((slot) => !slot.used);

  return (
    <section className="bag-preview" aria-label="8 block bag">
      {availableSlots.map((slot) => (
        <MiniBlock
          key={slot.id}
          definition={slot.definition}
          label={slot.definition.label}
        />
      ))}
    </section>
  );
};

const HelpModal = ({ onClose }: { onClose: () => void }) => {
  const selectedCharacterId = useCharacterStore((state) => state.selectedId);
  const character =
    CHARACTER_LIST.find((item) => item.id === selectedCharacterId) ??
    CHARACTER_LIST[0];

  if (!character) {
    return null;
  }

  return (
    <div className="help-backdrop" role="dialog" aria-modal="true">
      <div className="help-panel">
        <header className="help-header">
          <div>
            <span className="stat-label">F1 Help</span>
            <h2>조작과 스킬</h2>
          </div>
          <button type="button" className="icon-button" onClick={onClose}>
            X
          </button>
        </header>
        <div className="help-grid">
          <section>
            <h3>Controls</h3>
            <p>←/→ 이동, A/D 회전, S 소프트 드롭, Space 하드 드롭</p>
            <p>Shift 홀드, Q/W/E/R 스킬, ESC 일시정지</p>
          </section>
          <section>
            <h3>{character.name} Skills</h3>
            {character.skills.map((skill, index) => (
              <p key={skill.id} className="help-skill-item">
                <img
                  className="help-skill-icon"
                  src={getCharacterSkillSrc(character.id, skill.type)}
                  alt=""
                  aria-hidden="true"
                  draggable={false}
                />
                <span>
                  {skillLabels[index] ?? skill.type} · {skill.name}:{" "}
                  {skill.description}
                </span>
              </p>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
};

const getDeterministicJitter = (index: number, salt: number) => {
  const value = Math.sin((index + 1) * 12.9898 + salt * 78.233) * 43758.5453;

  return value - Math.floor(value);
};

const getFailureRenderBlocks = (blocks: Array<{ x: number; y: number }>) => {
  if (blocks.length > 0) {
    return blocks.slice(0, 120);
  }

  return Array.from({ length: failureFallbackBlockCount }, (_, index) => ({
    x: index % BOARD_WIDTH,
    y: HIDDEN_ROWS + Math.floor(index / BOARD_WIDTH),
  }));
};

const getFailurePileSlot = (index: number) => {
  const row = Math.floor(index / failurePileColumns);
  const col = (index * 7 + row * 5) % failurePileColumns;
  const rowDrift = row % 2 === 0 ? 0 : 0.16;

  return {
    x: col + 0.5 + rowDrift,
    y: 20.35 - row * 1.04,
  };
};

const FailurePhysicsPile = ({
  blocks,
}: {
  blocks: Array<{ x: number; y: number }>;
}) => {
  const visibleBlocks = useMemo(() => getFailureRenderBlocks(blocks), [blocks]);

  return (
    <div className="failure-pile" aria-hidden="true">
      {visibleBlocks.map((block, index) => {
        const visibleY = block.y - HIDDEN_ROWS;
        const slot = getFailurePileSlot(index);
        const burstX = (getDeterministicJitter(index, 1) - 0.5) * 7.5;
        const liftY = -3.8 - getDeterministicJitter(index, 2) * 4.5;
        const midX = (block.x + 0.5 + slot.x) / 2 + burstX * 0.22;
        const midY = Math.min(19.2, Math.max(0.2, (visibleY + slot.y) / 2 + 3));

        return (
          <span
            key={`${block.x}-${block.y}-${index}`}
            style={
              {
                "--start-x": block.x + 0.5,
                "--start-y": visibleY + 0.5,
                "--lift-x": block.x + 0.5 + burstX,
                "--lift-y": visibleY + liftY,
                "--mid-x": midX,
                "--mid-y": midY,
                "--final-x": slot.x,
                "--final-y": slot.y,
                "--spin-a": `${((index % 9) - 4) * 18}deg`,
                "--spin-b": `${((index % 11) - 5) * -24}deg`,
                "--spin-final": `${((index % 7) - 3) * 1.3}deg`,
                "--fall-delay": `${Math.min(index * 12, 420)}ms`,
              } as CSSProperties
            }
          />
        );
      })}
    </div>
  );
};

export const GamePage = () => {
  usePerformanceTrace("page.game");
  usePageTransitionTrace("game");
  const navigate = useNavigate();
  const setBestScore = useScoreStore((state) => state.setBestScore);
  const selectedCharacterId = useCharacterStore((state) => state.selectedId);
  const addRecord = useGameRecordStore((state) => state.addRecord);
  const selectedCharacter =
    CHARACTER_LIST.find((character) => character.id === selectedCharacterId) ??
    CHARACTER_LIST[0];
  const characterThemeStyle = {
    "--character-color": selectedCharacter?.color ?? "#ff99cc",
    "--character-bg": selectedCharacter?.backgroundColor ?? "#c46496",
    "--character-theme-image": selectedCharacter
      ? `url(${getCharacterGamePlayThemeSrc(selectedCharacter.id)})`
      : "none",
    "--character-block-image": selectedCharacter
      ? `url(${getCharacterBlockSrc(selectedCharacter.id)})`
      : "none",
  } as CSSProperties;

  const hasSavedScore = useRef(false);
  const runStartedAtRef = useRef<number | null>(null);
  const comboToastTimerRef = useRef<number | null>(null);
  const [visibleCombo, setVisibleCombo] = useState<number | null>(null);
  const [showFailureOverlay, setShowFailureOverlay] = useState(false);
  const [isUltimateCasting, setIsUltimateCasting] = useState(false);
  const ultimateCastTimerRef = useRef<number | null>(null);

  const {
    bag,
    heldBlock,
    status,
    level,
    score,
    targetScore,
    combo,
    skillCooldowns,
    skillCooldownMax,
    mayPrimedQDepth,
    mayUltimateRemainingMs,
    mayUltimateCastNonce,
    skillUses,
    helpOpen,
    failureBlocks,
    startLevel,
    resetRun,
    moveLeft,
    moveRight,
    rotateClockwise,
    rotateCounterClockwise,
    softDrop,
    hardDrop,
    holdBlock,
    useSkill: activateSkill,
    togglePause,
    toggleHelp,
  } = useGameStore(
    useShallow((state) => ({
      bag: state.bag,
      heldBlock: state.heldBlock,
      status: state.status,
      level: state.level,
      score: state.score,
      targetScore: state.targetScore,
      combo: state.combo,
      skillCooldowns: state.skillCooldowns,
      skillCooldownMax: state.skillCooldownMax,
      mayPrimedQDepth: state.mayPrimedQDepth,
      mayUltimateRemainingMs: state.mayUltimateRemainingMs,
      mayUltimateCastNonce: state.mayUltimateCastNonce,
      skillUses: state.skillUses,
      helpOpen: state.helpOpen,
      failureBlocks: state.failureBlocks,
      startLevel: state.startLevel,
      resetRun: state.resetRun,
      moveLeft: state.moveLeft,
      moveRight: state.moveRight,
      rotateClockwise: state.rotateClockwise,
      rotateCounterClockwise: state.rotateCounterClockwise,
      softDrop: state.softDrop,
      hardDrop: state.hardDrop,
      holdBlock: state.holdBlock,
      useSkill: state.useSkill,
      togglePause: state.togglePause,
      toggleHelp: state.toggleHelp,
    })),
  );

  useFpsMonitor(status === "playing", { label: "gameplay" });

  useEffect(() => {
    if (combo < 2) {
      return undefined;
    }

    setVisibleCombo(combo);

    if (comboToastTimerRef.current !== null) {
      window.clearTimeout(comboToastTimerRef.current);
    }

    comboToastTimerRef.current = window.setTimeout(() => {
      setVisibleCombo(null);
      comboToastTimerRef.current = null;
    }, 1200);

    return undefined;
  }, [combo]);

  useEffect(
    () => () => {
      if (comboToastTimerRef.current !== null) {
        window.clearTimeout(comboToastTimerRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    if (status !== "failed") {
      setShowFailureOverlay(false);

      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setShowFailureOverlay(true);
    }, failureOverlayDelayMs);

    return () => window.clearTimeout(timeoutId);
  }, [status]);

  useKeyBindings(
    {
      ArrowLeft: () => moveLeft(),
      ArrowRight: () => moveRight(),
      ArrowDown: () => softDrop(),
      KeyS: () => softDrop(),
      Space: () => hardDrop(),
      KeyA: () => rotateCounterClockwise(),
      KeyD: () => rotateClockwise(),
      ShiftLeft: () => holdBlock(),
      ShiftRight: () => holdBlock(),
      KeyQ: () => activateSkill("Q"),
      KeyW: () => activateSkill("W"),
      KeyE: () => activateSkill("E"),
      KeyR: () => activateSkill("R"),
      Escape: () => togglePause(),
      F1: () => toggleHelp(),
      Enter: () => {
        if (status === "levelIntro") {
          startLevel();
        }
      },
    },
    true,
  );

  const handleViewResults = useMeasuredHandler("ui.game.viewResults", () => {
    startPageTransition("game", "result");
    void navigate(APP_ROUTES.RESULT);
  });

  const handleActivateSkill = useMeasuredHandler(
    "ui.game.activateSkill",
    (key: SkillKey) => {
      activateSkill(key);
    },
  );

  useEffect(() => {
    if (status === "playing" && runStartedAtRef.current === null) {
      runStartedAtRef.current = Date.now();
    }

    if (status === "failed" && !hasSavedScore.current) {
      const endedAt = Date.now();
      const startedAt = runStartedAtRef.current ?? endedAt;

      setBestScore(score);
      addRecord({
        id: `${endedAt}-${Math.random().toString(36).slice(2, 9)}`,
        characterId: selectedCharacterId,
        score,
        level,
        playDurationMs: Math.max(0, endedAt - startedAt),
        startedAt: new Date(startedAt).toISOString(),
        endedAt: new Date(endedAt).toISOString(),
        skillUses,
      });
      hasSavedScore.current = true;
      runStartedAtRef.current = null;
    }

    if (status === "playing") {
      hasSavedScore.current = false;
    }
  }, [
    addRecord,
    level,
    score,
    selectedCharacterId,
    setBestScore,
    skillUses,
    status,
  ]);

  useEffect(() => {
    if (mayUltimateCastNonce <= 0) {
      return undefined;
    }

    setIsUltimateCasting(true);

    if (ultimateCastTimerRef.current !== null) {
      window.clearTimeout(ultimateCastTimerRef.current);
    }

    ultimateCastTimerRef.current = window.setTimeout(() => {
      setIsUltimateCasting(false);
      ultimateCastTimerRef.current = null;
    }, 900);

    return () => {
      if (ultimateCastTimerRef.current !== null) {
        window.clearTimeout(ultimateCastTimerRef.current);
        ultimateCastTimerRef.current = null;
      }
    };
  }, [mayUltimateCastNonce]);

  const skillCooldownViews = skillKeys.map((key) => {
    const remainingMs = skillCooldowns[key];
    const maxMs = skillCooldownMax[key];

    if (remainingMs <= 0 || maxMs <= 0) {
      return null;
    }

    return {
      key,
      remainingSeconds: Math.max(1, Math.ceil(remainingMs / 1000)),
      progress: Math.max(0, Math.min(1, 1 - remainingMs / maxMs)),
    };
  });

  const isUltimateActive = mayUltimateRemainingMs > 0;
  const ultimateRemainingSeconds = isUltimateActive
    ? Math.max(1, Math.ceil(mayUltimateRemainingMs / 1000))
    : undefined;
  const ultimateProgress = isUltimateActive
    ? Math.max(
        0,
        Math.min(1, 1 - mayUltimateRemainingMs / 15000),
      )
    : undefined;

  const skillSlotItems = selectedCharacter.skills.map((skill, index) => {
    const isPassive = index === 0;
    const activeKey = skillKeys[index - 1];
    const isPrimedQ =
      selectedCharacter.id === "may" &&
      activeKey === "Q" &&
      mayPrimedQDepth !== null;
    const isUltimateSkillActive =
      selectedCharacter.id === "may" &&
      activeKey === "R" &&
      isUltimateActive;
    const cooldownView = !isPassive
      ? skillCooldownViews.find((item) => item?.key === activeKey)
      : null;

    const sharedContent = (
      <SkillSlotIcon
        src={getCharacterSkillSrc(selectedCharacter.id, skill.type)}
        alt=""
        label={skillLabels[index] ?? skill.type}
        cooldownSeconds={
          isUltimateSkillActive
            ? ultimateRemainingSeconds
            : cooldownView?.remainingSeconds
        }
        cooldownProgress={
          isUltimateSkillActive ? ultimateProgress : cooldownView?.progress
        }
        primedLabel={isPrimedQ ? `↓+${mayPrimedQDepth}` : undefined}
        timerTone={isUltimateSkillActive ? "ultimate" : "cooldown"}
      />
    );

    if (isPassive) {
      return (
        <div
          key={skill.id}
          className="skill-slot skill-slot--passive"
          data-ready="true"
        >
          {sharedContent}
        </div>
      );
    }

    return (
      <button
        key={skill.id}
        type="button"
        className="skill-slot"
        data-ready={skillCooldowns[activeKey] <= 0}
        data-primed={isPrimedQ}
        data-ultimate={isUltimateSkillActive}
        onClick={() => handleActivateSkill(activeKey)}
      >
        {sharedContent}
      </button>
    );
  });

  const overlay = useMemo(() => {
    if (status === "levelIntro") {
      return (
        <div className="game-overlay game-overlay--intro" role="status">
          <span className="level-kicker">NEXT STAGE</span>
          <strong>LEVEL {level}</strong>
          <span>
            목표 {targetScore === null ? "SURVIVE" : formatNumber(targetScore)}
          </span>
          <Button type="button" variant="primary" onClick={startLevel}>
            Start level
          </Button>
        </div>
      );
    }

    if (status === "paused") {
      return (
        <div className="game-overlay" role="status">
          <strong>PAUSED</strong>
          <Button type="button" variant="primary" onClick={togglePause}>
            Resume
          </Button>
        </div>
      );
    }

    if (status === "levelClear") {
      return (
        <div className="game-overlay game-overlay--clear" role="status">
          <strong>LEVEL {level}</strong>
          <span>통과</span>
        </div>
      );
    }

    if (status === "failed" && showFailureOverlay) {
      return (
        <div className="game-overlay game-overlay--failed" role="status">
          <strong>LEVEL {level}</strong>
          <span>실패</span>
          <div className="game-overlay-actions">
            <Button type="button" variant="primary" onClick={resetRun}>
              Retry from level 1
            </Button>
            <button
              type="button"
              className="text-link"
              onClick={handleViewResults}
            >
              View results
            </button>
          </div>
        </div>
      );
    }

    return null;
  }, [
    handleViewResults,
    level,
    resetRun,
    showFailureOverlay,
    startLevel,
    status,
    targetScore,
    togglePause,
  ]);

  return (
    <div className="page page-game" style={characterThemeStyle}>
      <div className="game-playfield">
        <div className="game-topbar">
          <div className="topbar-actions" aria-label="Game actions">
            <button
              type="button"
              className="icon-button icon-button--pause"
              aria-label={status === "paused" ? "재개" : "중지"}
              onClick={togglePause}
            >
              <img
                src={status === "paused" ? resumeIconSrc : pauseIconSrc}
                alt=""
                aria-hidden="true"
                className="icon-button__icon"
                draggable={false}
              />
            </button>
            <button
              type="button"
              className="icon-button icon-button--settings"
              aria-label="설정"
              onClick={toggleHelp}
            >
              <img
                src={settingsIconSrc}
                alt=""
                aria-hidden="true"
                className="icon-button__icon"
                draggable={false}
              />
            </button>
            <button
              type="button"
              className="icon-button icon-button--exit"
              aria-label="나가기"
              onClick={() => void navigate(APP_ROUTES.MAIN)}
            >
              <img
                src={exitIconSrc}
                alt=""
                aria-hidden="true"
                className="icon-button__icon"
                draggable={false}
              />
            </button>
          </div>
        </div>

        <main className="game-core">
          <aside className="game-left-rail" aria-label="Character and skills">
            <div
              className={[
                "character-orbit",
                isUltimateActive ? "character-orbit--ultimate-active" : "",
                isUltimateCasting ? "character-orbit--ultimate-cast" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {selectedCharacter?.imageSrc ? (
                <img
                  src={selectedCharacter.imageSrc}
                  alt={selectedCharacter.name}
                  className="game-character"
                />
              ) : null}
            </div>

            <div className="skill-slots" aria-label="Skills">
              {skillSlotItems}
            </div>
          </aside>

          <section className="board-stack" aria-label="Play area">
            <div className="game-status-strip" aria-label="Game status">
              <span>LEVEL {level}</span>
              <strong>{formatNumber(score)}</strong>
              <span>
                목표{" "}
                {targetScore === null ? "SURVIVE" : formatNumber(targetScore)}
              </span>
            </div>
            {isUltimateActive ? (
              <div className="ultimate-status-badge" role="status">
                <span className="ultimate-status-label">궁극기 활성</span>
                <strong>{ultimateRemainingSeconds}s</strong>
                <span className="ultimate-status-progress" aria-hidden="true">
                  <span
                    className="ultimate-status-progress-bar"
                    style={
                      {
                        "--ultimate-progress": ultimateProgress ?? 0,
                      } as CSSProperties
                    }
                  />
                </span>
              </div>
            ) : null}
            {status === "failed" ? (
              <FailurePhysicsPile blocks={failureBlocks} />
            ) : (
              <GameCanvas
                isUltimateActive={isUltimateActive}
                isUltimateCasting={isUltimateCasting}
              />
            )}
            {visibleCombo !== null ? (
              <div className="combo-toast" role="status">
                {visibleCombo} COMBO
              </div>
            ) : null}
            {overlay}
          </section>

          <aside className="game-right-rail" aria-label="Next blocks and hold">
            <div className="hold-panel">
              <MiniBlock definition={heldBlock} label="HOLD" />
              <span>보관함</span>
            </div>
            <BagPreview bag={bag} />
          </aside>
        </main>
      </div>
      {helpOpen ? <HelpModal onClose={toggleHelp} /> : null}
    </div>
  );
};
