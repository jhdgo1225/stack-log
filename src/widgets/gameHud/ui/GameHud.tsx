import type { GameStatus } from "@/entities/game";

type GameHudProps = {
  score: number;
  level: number;
  lines: number;
  status: GameStatus;
  speedMs: number;
};

export const GameHud = ({
  score,
  level,
  lines,
  status,
  speedMs,
}: GameHudProps) => {
  const statusLabel =
    status === "playing"
      ? "Playing"
      : status === "paused"
        ? "Paused"
        : status === "over"
          ? "Game over"
          : "Ready";

  return (
    <section className="game-hud" aria-label="Game status">
      <div className="stat-card">
        <span className="stat-label">Score</span>
        <strong className="stat-value">{score}</strong>
      </div>
      <div className="stat-card">
        <span className="stat-label">Level</span>
        <strong className="stat-value">{level}</strong>
      </div>
      <div className="stat-card">
        <span className="stat-label">Lines</span>
        <strong className="stat-value">{lines}</strong>
      </div>
      <div className="stat-card">
        <span className="stat-label">Drop speed</span>
        <strong className="stat-value">{speedMs}ms</strong>
      </div>
      <div className="stat-card stat-card--status" aria-live="polite">
        <span className="stat-label">Status</span>
        <strong className="stat-value">{statusLabel}</strong>
      </div>
    </section>
  );
};
