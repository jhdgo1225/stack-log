import type { SkillKey } from "./types";

type GameEngineBridge = {
  startGame: () => void;
  startLevel: () => void;
  continueAfterClear: () => void;
  resetGame: () => void;
  resetRun: () => void;
  togglePause: () => void;
  toggleHelp: () => void;
  tick: () => void;
  tickSkillCooldowns: () => void;
  moveLeft: () => void;
  moveRight: () => void;
  rotateClockwise: () => void;
  rotateCounterClockwise: () => void;
  softDrop: () => void;
  hardDrop: () => void;
  holdBlock: () => void;
  useSkill: (key: SkillKey) => void;
};

let gameEngineBridge: GameEngineBridge | null = null;

export const setGameEngineBridge = (bridge: GameEngineBridge | null) => {
  gameEngineBridge = bridge;
};

export const getGameEngineBridge = () => gameEngineBridge;

