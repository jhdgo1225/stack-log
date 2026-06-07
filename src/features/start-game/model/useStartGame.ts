import { useGameStore } from "@/entities/game";

export const useStartGame = () => {
  const startGame = useGameStore((state) => state.startGame);

  return { startGame };
};
