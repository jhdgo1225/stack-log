import { useGameStore } from "@/entities/game";

import { usePauseGame } from "../model/usePauseGame";

import { useMeasuredHandler } from "@/shared/lib/performance/useMeasuredHandler";
import { Button } from "@/shared/ui/Button";

type PauseButtonProps = {
  className?: string;
};

export const PauseButton = ({ className }: PauseButtonProps) => {
  const status = useGameStore((state) => state.status);
  const { togglePause } = usePauseGame();

  const handleClick = useMeasuredHandler("ui.pauseButton", togglePause);

  return (
    <Button
      type="button"
      variant="outline"
      className={className}
      onClick={handleClick}>
      {status === "paused" ? "Resume" : "Pause"}
    </Button>
  );
};
