import { useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useShallow } from "zustand/shallow";

import { useCharacterStore } from "@/entities/character";
import { useGameStore } from "@/entities/game";
import { useGameRecordStore } from "@/entities/gameRecord";
import { useScoreStore } from "@/entities/score";
import { PauseButton } from "@/features/pause-game";
import { RestartButton } from "@/features/restart-game";
import { StartGameButton } from "@/features/start-game";
import { APP_ROUTES } from "@/shared/config/routes";
import { startPageTransition } from "@/shared/lib/performance/performanceTelemetry";
import { useFpsMonitor } from "@/shared/lib/performance/useFpsMonitor";
import { useMeasuredHandler } from "@/shared/lib/performance/useMeasuredHandler";
import { usePageTransitionTrace } from "@/shared/lib/performance/usePageTransitionTrace";
import { usePerformanceTrace } from "@/shared/lib/performance/usePerformanceTrace";
import { useKeyBindings } from "@/shared/lib/useKeyBindings";
import { useRafInterval } from "@/shared/lib/useRafInterval";
import { GameCanvas } from "@/widgets/gameCanvas/ui/GameCanvas";
import { GameHud } from "@/widgets/gameHud/ui/GameHud";

export const GamePage = () => {
  usePerformanceTrace("page.game");
  usePageTransitionTrace("game");
  const navigate = useNavigate();
  const setBestScore = useScoreStore((state) => state.setBestScore);
  const selectedCharacterId = useCharacterStore((state) => state.selectedId);
  const addRecord = useGameRecordStore((state) => state.addRecord);
  const score = useGameStore((state) => state.score);

  const hasSavedScore = useRef(false);
  const runStartedAtRef = useRef<number | null>(null);

  const {
    board,
    active,
    status,
    level,
    lines,
    speedMs,
    tick,
    moveLeft,
    moveRight,
    softDrop,
    hardDrop,
    togglePause,
  } = useGameStore(
    useShallow((state) => ({
      board: state.board,
      active: state.active,
      status: state.status,
      level: state.level,
      lines: state.lines,
      speedMs: state.speedMs,
      tick: state.tick,
      moveLeft: state.moveLeft,
      moveRight: state.moveRight,
      softDrop: state.softDrop,
      hardDrop: state.hardDrop,
      togglePause: state.togglePause,
    })),
  );

  useFpsMonitor(status === "playing", { label: "gameplay" });
  useRafInterval(() => tick(), speedMs, status === "playing");

  useKeyBindings(
    {
      ArrowLeft: () => moveLeft(),
      ArrowRight: () => moveRight(),
      ArrowDown: () => softDrop(),
      Space: () => hardDrop(),
      KeyP: () => togglePause(),
    },
    status !== "over",
  );

  const handleMoveLeft = useMeasuredHandler("ui.game.mobileLeft", moveLeft);
  const handleMoveRight = useMeasuredHandler("ui.game.mobileRight", moveRight);
  const handleSoftDrop = useMeasuredHandler("ui.game.mobileSoftDrop", softDrop);
  const handleHardDrop = useMeasuredHandler("ui.game.mobileHardDrop", hardDrop);
  const handleViewResults = useMeasuredHandler("ui.game.viewResults", () => {
    startPageTransition("game", "result");
    void navigate(APP_ROUTES.RESULT);
  });

  useEffect(() => {
    if (status === "playing" && runStartedAtRef.current === null) {
      runStartedAtRef.current = Date.now();
    }

    if (status === "over" && !hasSavedScore.current) {
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
        skillUses: {
          Q: 0,
          W: 0,
          E: 0,
          R: 0,
        },
      });
      hasSavedScore.current = true;
      runStartedAtRef.current = null;
    }

    if (status === "playing") {
      hasSavedScore.current = false;
    }
  }, [addRecord, level, score, selectedCharacterId, setBestScore, status]);

  const overlayMessage = useMemo(() => {
    if (status === "paused") {
      return "Paused";
    }

    if (status === "over") {
      return "Game over";
    }

    if (status === "idle") {
      return "Ready";
    }

    return "";
  }, [status]);

  return (
    <div className="page page-game">
      <div className="game-layout">
        <div className="game-stage">
          <GameCanvas board={board} active={active} />
          {overlayMessage ? (
            <div className="game-overlay" role="status">
              <p>{overlayMessage}</p>
              {status === "idle" ? <StartGameButton label="Start" /> : null}
              {status === "over" ? (
                <div className="game-overlay-actions">
                  <RestartButton
                    label="Play again"
                    onAfterRestart={() => void navigate(APP_ROUTES.GAME)}
                  />
                  <button
                    type="button"
                    className="text-link"
                    onClick={handleViewResults}
                  >
                    View results
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
        <aside className="game-sidebar">
          <GameHud
            score={score}
            level={level}
            lines={lines}
            status={status}
            speedMs={speedMs}
          />
          <div className="game-controls">
            <PauseButton />
            <RestartButton label="Restart run" />
          </div>
          <div className="game-mobile-controls" aria-label="Touch controls">
            <button type="button" onClick={handleMoveLeft}>
              Move left
            </button>
            <button type="button" onClick={handleMoveRight}>
              Move right
            </button>
            <button type="button" onClick={handleSoftDrop}>
              Soft drop
            </button>
            <button type="button" onClick={handleHardDrop}>
              Hard drop
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};
