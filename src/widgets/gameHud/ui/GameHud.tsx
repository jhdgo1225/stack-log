import type { GameStatus } from "@/entities/game";

type GameHudProps = {
  score: number;
  targetScore: number | null;
  level: number;
  lines: number;
  combo: number;
  status: GameStatus;
  speedMs: number;
};

const formatNumber = (value: number) => value.toLocaleString("ko-KR");

export const GameHud = ({
  score,
  targetScore,
  level,
  lines,
  combo,
  status,
  speedMs,
}: GameHudProps) => {
  const statusLabel =
    status === "playing"
      ? "Playing"
      : status === "paused"
        ? "Paused"
        : status === "levelClear"
          ? "Level clear"
          : status === "failed"
            ? "Failed"
            : "Ready";

  return (
    <section className="game-hud" aria-label="Game status">
      <div className="game-score-card">
        <span className="stat-label">LEVEL {level}</span>
        <strong className="stat-value">{formatNumber(score)}</strong>
        <span className="stat-note">
          목표 {targetScore === null ? "SURVIVE" : formatNumber(targetScore)}
        </span>
      </div>
      <div className="game-stat-grid">
        <div className="stat-card">
          <span className="stat-label">Lines</span>
          <strong className="stat-value">{lines}</strong>
        </div>
        <div className="stat-card">
          <span className="stat-label">Combo</span>
          <strong className="stat-value">{combo >= 2 ? combo : "-"}</strong>
        </div>
        <div className="stat-card">
          <span className="stat-label">Drop</span>
          <strong className="stat-value">{(speedMs / 1000).toFixed(2)}s</strong>
        </div>
        <div className="stat-card stat-card--status" aria-live="polite">
          <span className="stat-label">Status</span>
          <strong className="stat-value">{statusLabel}</strong>
        </div>
      </div>
    </section>
  );
};
