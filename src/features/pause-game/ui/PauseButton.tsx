import { useGameStore } from "@/entities/game";

import { usePauseGame } from "../model/usePauseGame";

import { Button } from "@/shared/ui/Button";

type PauseButtonProps = {
  className?: string;
};

export const PauseButton = ({ className }: PauseButtonProps) => {
  const status = useGameStore((state) => state.status);
  const { togglePause } = usePauseGame();

  return (
    <Button
      type="button"
      variant="outline"
      className={className}
      onClick={togglePause}>
      {status === "paused" ? "Resume" : "Pause"}
    </Button>
  );
};
