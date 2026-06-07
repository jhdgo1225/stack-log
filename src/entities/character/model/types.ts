export type Character = {
  id: string;
  name: string;
  tagline: string;
  trait: string;
  color: string;
  backgroundColor: string;
  imageSrc?: string;
  personality: string;
  conceptBullets: string[];
  skills: CharacterSkill[];
};

export type CharacterSkill = {
  id: string;
  type: string;
  name: string;
  description: string;
  detailLines: string[];
  cooldowns: CharacterSkillCooldown[];
  video?: CharacterSkillVideo;
};

export type CharacterSkillCooldown = {
  level: string;
  value: string;
};

export type CharacterSkillVideo = {
  src?: string;
  posterSrc?: string;
  description?: string;
};
