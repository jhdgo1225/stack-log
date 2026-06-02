import { useNavigate } from "react-router-dom";

import { useStartGame } from "../model/useStartGame";

import { APP_ROUTES } from "@/shared/config/routes";
import { Button } from "@/shared/ui/Button";

type StartGameButtonProps = {
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  onAfterStart?: () => void;
};

export const StartGameButton = ({
  label = "Start game",
  size = "lg",
  className,
  onAfterStart,
}: StartGameButtonProps) => {
  const navigate = useNavigate();
  const { startGame } = useStartGame();

  const handleClick = () => {
    startGame();
    onAfterStart?.();
    navigate(APP_ROUTES.GAME);
  };

  return (
    <Button
      type="button"
      size={size}
      className={className}
      onClick={handleClick}>
      {label}
    </Button>
  );
};
