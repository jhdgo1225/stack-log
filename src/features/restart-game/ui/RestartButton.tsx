import { useRestartGame } from "../model/useRestartGame";

import { Button } from "@/shared/ui/Button";

type RestartButtonProps = {
  label?: string;
  className?: string;
  onAfterRestart?: () => void;
};

export const RestartButton = ({
  label = "Restart",
  className,
  onAfterRestart,
}: RestartButtonProps) => {
  const { restartGame } = useRestartGame();

  const handleClick = () => {
    restartGame();
    onAfterRestart?.();
  };

  return (
    <Button
      type="button"
      variant="outline"
      className={className}
      onClick={handleClick}>
      {label}
    </Button>
  );
};
