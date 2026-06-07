export type SkillKey = "Q" | "W" | "E" | "R";

export type SkillUses = Record<SkillKey, number>;

export type GameRecord = {
  id: string;
  characterId: string;
  score: number;
  level: number;
  playDurationMs: number;
  startedAt: string;
  endedAt: string;
  skillUses: SkillUses;
};
