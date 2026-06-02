import { useNavigate } from "react-router-dom";

import { useGameStore } from "@/entities/game";
import { useScoreStore } from "@/entities/score";
import { RestartButton } from "@/features/restart-game";
import { APP_ROUTES } from "@/shared/config/routes";

export const ResultPage = () => {
  const navigate = useNavigate();
  const score = useGameStore((state) => state.score);
  const lines = useGameStore((state) => state.lines);
  const level = useGameStore((state) => state.level);
  const bestScore = useScoreStore((state) => state.bestScore);

  return (
    <div className="page page-result">
      <section className="panel result-panel">
        <h1>Run complete</h1>
        <p className="result-subtitle">
          Review the tempo and set your next run.
        </p>
        <div className="result-grid">
          <div className="stat-block">
            <span className="stat-label">Final score</span>
            <strong className="stat-value">{score}</strong>
          </div>
          <div className="stat-block">
            <span className="stat-label">Best score</span>
            <strong className="stat-value">{bestScore}</strong>
          </div>
          <div className="stat-block">
            <span className="stat-label">Lines cleared</span>
            <strong className="stat-value">{lines}</strong>
          </div>
          <div className="stat-block">
            <span className="stat-label">Top level</span>
            <strong className="stat-value">{level}</strong>
          </div>
        </div>
        <div className="result-actions">
          <RestartButton
            label="Play again"
            onAfterRestart={() => navigate(APP_ROUTES.game)}
          />
          <button
            type="button"
            className="text-link"
            onClick={() => navigate(APP_ROUTES.main)}>
            Back to home
          </button>
        </div>
      </section>
    </div>
  );
};
