import { useGameStore } from "@/entities/game";

export const usePauseGame = () => {
  const togglePause = useGameStore((state) => state.togglePause);

  return { togglePause };
};
