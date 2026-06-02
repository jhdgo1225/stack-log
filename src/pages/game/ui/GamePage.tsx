import { useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useShallow } from "zustand/shallow";

import { useScoreStore } from "@/entities/score";
import { useGameStore } from "@/entities/game";
import { PauseButton } from "@/features/pause-game";
import { RestartButton } from "@/features/restart-game";
import { StartGameButton } from "@/features/start-game";
import { APP_ROUTES } from "@/shared/config/routes";
import { useKeyBindings } from "@/shared/lib/useKeyBindings";
import { useRafInterval } from "@/shared/lib/useRafInterval";
import { GameCanvas } from "@/widgets/gameCanvas/ui/GameCanvas";
import { GameHud } from "@/widgets/gameHud/ui/GameHud";

export const GamePage = () => {
  const navigate = useNavigate();
  const setBestScore = useScoreStore((state) => state.setBestScore);
  const score = useGameStore((state) => state.score);

  const hasSavedScore = useRef(false);

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

  useEffect(() => {
    if (status === "over" && !hasSavedScore.current) {
      setBestScore(score);
      hasSavedScore.current = true;
    }

    if (status === "playing") {
      hasSavedScore.current = false;
    }
  }, [score, setBestScore, status]);

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
                    onAfterRestart={() => navigate(APP_ROUTES.game)}
                  />
                  <button
                    type="button"
                    className="text-link"
                    onClick={() => navigate(APP_ROUTES.result)}>
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
            <button type="button" onClick={moveLeft}>
              Move left
            </button>
            <button type="button" onClick={moveRight}>
              Move right
            </button>
            <button type="button" onClick={softDrop}>
              Soft drop
            </button>
            <button type="button" onClick={hardDrop}>
              Hard drop
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};
