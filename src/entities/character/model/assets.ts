const CHARACTER_ASSET_BASE = "/assets/characters";

const skillTypeToAssetSlug = (type: string) => {
  switch (type) {
    case "패시브":
      return "passive";
    case "액티브 1":
      return "active1";
    case "액티브 2":
      return "active2";
    case "액티브 3":
      return "active3";
    case "필살기":
      return "ultimate";
    default:
      return "passive";
  }
};

export const getCharacterImageSrc = (characterId: string) =>
  `${CHARACTER_ASSET_BASE}/${characterId}.png`;

export const getCharacterFaceSrc = (characterId: string) =>
  `${CHARACTER_ASSET_BASE}/${characterId}-face.png`;

export const getCharacterSymbolSrc = (characterId: string) =>
  `${CHARACTER_ASSET_BASE}/${characterId}-symbol.png`;

export const getCharacterSkillSrc = (
  characterId: string,
  skillType: string,
) => `${CHARACTER_ASSET_BASE}/${characterId}-skill-${skillTypeToAssetSlug(skillType)}.png`;

export const getCharacterMainThemeSrc = (characterId: string) =>
  `${CHARACTER_ASSET_BASE}/${characterId}-main-theme.webp`;

export const getCharacterGamePlayThemeSrc = (characterId: string) =>
  `${CHARACTER_ASSET_BASE}/${characterId}-game-play-theme.png`;

export const getCharacterBlockSrc = (characterId: string) =>
  `${CHARACTER_ASSET_BASE}/${characterId}-block.png`;
