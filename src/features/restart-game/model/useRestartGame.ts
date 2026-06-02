import { useGameStore } from "@/entities/game";

export const useRestartGame = () => {
  const startGame = useGameStore((state) => state.startGame);

  return {
    restartGame: () => startGame(),
  };
};
