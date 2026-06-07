import { getCharacterImageSrc } from "./assets";
import type { CharacterSkillCooldown } from "./types";
import type { Character } from "./types";

function formatSeconds(value: number) {
  const rounded = Math.round(value * 10) / 10;
  const display = Number.isInteger(rounded)
    ? String(rounded)
    : rounded.toFixed(1);
  return `${display}초`;
}

function createLinearCooldowns(
  startSeconds: number,
  endSeconds: number,
): CharacterSkillCooldown[] {
  const steps = 10;
  const delta = (endSeconds - startSeconds) / steps;

  return Array.from({ length: 11 }, (_, index) => ({
    level: `lv${index + 1}`,
    value: formatSeconds(startSeconds + delta * index),
  }));
}

function createMilestoneCooldowns(
  lv1Seconds: number,
  lv5Seconds: number,
  lv10Seconds: number,
): CharacterSkillCooldown[] {
  return [
    { level: "lv1", value: formatSeconds(lv1Seconds) },
    { level: "lv5", value: formatSeconds(lv5Seconds) },
    { level: "lv10", value: formatSeconds(lv10Seconds) },
  ];
}

const mayCooldowns = createLinearCooldowns(10, 8);

export const CHARACTER_LIST: Character[] = [
  {
    id: "may",
    name: "메이",
    tagline: "부드러운 리듬 컨트롤",
    trait: "안정적인 플레이",
    color: "#FF99CC",
    backgroundColor: "#C46496",
    imageSrc: getCharacterImageSrc("may"),
    personality: "용해(溶解)",
    conceptBullets: [
      "분홍 계열 테마의 캐릭터",
      "녹이는 능력으로 블록을 무너뜨리고 흐름을 바꾸는 플레이 스타일",
      "전략적으로 블록 위치를 선택해 연쇄적인 낙하를 유도",
    ],
    skills: [
      {
        id: "may-erosion",
        type: "패시브",
        name: "침식",
        description:
          "블록을 랜덤으로 녹입니다. 녹은 블록의 자리에 위에 쌓여 있던 블록들이 내려옵니다.",
        detailLines: [],
        cooldowns: mayCooldowns,
      },
      {
        id: "may-precise-dissolve",
        type: "액티브 1",
        name: "끈적 용해",
        description:
          "목표 맵 위 유리하게 플레이할 수 있는 블록 위치를 자동으로 선택합니다.",
        detailLines: ["추가 효과: 레벨 10부터 블록 위치 3개 선정"],
        cooldowns: createLinearCooldowns(15, 8),
      },
      {
        id: "may-residual-dissolve",
        type: "액티브 2",
        name: "잔류 용해",
        description:
          "액티브 1을 통해 녹인 블록 위치에 다른 블록이 있는 경우 해당 스킬을 발동해야 녹입니다.",
        detailLines: [
          "제한: 액티브 2 스킬 이후 본 스킬로 그 위치를 다시 녹일 수 없음",
        ],
        cooldowns: createLinearCooldowns(30, 10),
      },
      {
        id: "may-deep-dissolve",
        type: "액티브 3",
        name: "심층 용해",
        description:
          "사용 시 다음 액티브 1 스킬의 용해 범위를 아래 2칸까지 확장합니다.",
        detailLines: ["레벨 5: 아래 3칸", "레벨 10: 아래 4칸"],
        cooldowns: createLinearCooldowns(15, 13),
      },
      {
        id: "may-dissolve-accel",
        type: "필살기",
        name: "용해 가속",
        description:
          "지속시간 동안 액티브 1, 액티브 2, 액티브 3 스킬의 쿨타임을 절반으로 줄입니다.",
        detailLines: [],
        cooldowns: [
          { level: "base", value: "60초" },
          { level: "duration", value: "15초" },
        ],
      },
    ],
  },
  {
    id: "bron",
    name: "브론",
    tagline: "강한 압박 돌파",
    trait: "빠른 판단 보상",
    color: "#FF3300",
    backgroundColor: "#FF6633",
    imageSrc: getCharacterImageSrc("bron"),
    personality: "폭발(爆發)",
    conceptBullets: [
      "빨강 계열 테마의 캐릭터",
      "폭발 능력으로 블록을 제거하며 위기를 빠르게 정리하는 플레이 스타일",
      "시급한 열 주변을 공략해 연쇄적인 제거 흐름을 만듭니다",
    ],
    skills: [
      {
        id: "bron-emergency-blast",
        type: "패시브",
        name: "긴급 폭파",
        description:
          "제거가 시급한 열 근처에 가장 많은 수의 블록을 터뜨릴 수 있는 위험의 폭탄을 던집니다.",
        detailLines: [],
        cooldowns: [{ level: "condition", value: "10줄" }],
      },
      {
        id: "bron-delayed-bomb",
        type: "액티브 1",
        name: "지연 기폭탄",
        description:
          "제거가 시급한 열 근처에 가장 많은 수의 블록을 터뜨릴 수 있는 위치에 폭탄을 심습니다.",
        detailLines: ["효과: 3초 뒤 폭탄이 터지면서 인접한 블록을 모두 제거"],
        cooldowns: createLinearCooldowns(20, 15),
      },
      {
        id: "bron-blast-amplify",
        type: "액티브 2",
        name: "폭발 증폭",
        description:
          "쿨타임이 지날 때마다 1회 누적됩니다. 누적 횟수만큼 액티브 1로 심은 폭탄의 범위가 증가합니다.",
        detailLines: ["효과: 최대 3회까지 누적"],
        cooldowns: createMilestoneCooldowns(10, 8, 6),
      },
      {
        id: "bron-instant-detonation",
        type: "액티브 3",
        name: "즉시 기폭",
        description: "액티브 1 스킬의 폭발 대기 시간을 없앱니다.",
        detailLines: [
          "효과: 설치한 폭탄을 즉시 터뜨려 위험 구간을 빠르게 정리",
        ],
        cooldowns: createLinearCooldowns(30, 25),
      },
      {
        id: "bron-bomb-convert",
        type: "필살기",
        name: "폭탄 전환",
        description: "맵에 요소 중 하나인 낙하 블록들의 폭탄으로 바꿉니다.",
        detailLines: ["효과: 낙하 블록 주변 최대 2칸 범위 이내 블록 제거"],
        cooldowns: createMilestoneCooldowns(90, 80, 70),
      },
    ],
  },
  {
    id: "aria",
    name: "아리아",
    tagline: "선명한 집중 유지",
    trait: "후반 안정성",
    color: "#FFDF3E",
    backgroundColor: "#948000",
    imageSrc: getCharacterImageSrc("aria"),
    personality: "희망(希望)",
    conceptBullets: [
      "개나리의 희망을 품은 봄 테마 캐릭터",
      "씨앗을 심고 개화를 퍼뜨리며 필드를 정리하는 플레이 스타일",
      "희망의 연쇄 개화로 전략적인 제거 흐름을 만듭니다",
    ],
    skills: [
      {
        id: "aria-seed-of-hope",
        type: "패시브",
        name: "희망 파종",
        description: "무작위 블록에 개나리를 심습니다.",
        detailLines: [
          "발동 조건: 3줄 제거",
          "개나리가 심긴 블록은 후속 개화 스킬의 중심점이 됩니다",
        ],
        cooldowns: [{ level: "condition", value: "3줄" }],
      },
      {
        id: "aria-harvest",
        type: "액티브 1",
        name: "개나리 수확",
        description: "개나리가 있는 무작위 블록 3개를 제거합니다.",
        detailLines: ["lv4: 4개 제거", "lv7: 5개 제거", "lv10: 6개 제거"],
        cooldowns: createLinearCooldowns(10, 8),
      },
      {
        id: "aria-seed-spread",
        type: "액티브 2",
        name: "씨앗 확산",
        description: "개나리가 있는 블록의 상하좌우에 개나리 씨앗을 심습니다.",
        detailLines: [],
        cooldowns: createLinearCooldowns(20, 10),
      },
      {
        id: "aria-full-bloom",
        type: "액티브 3",
        name: "전면 개화",
        description: "개나리 씨앗이 있는 블록 모두 개나리로 재화합니다.",
        detailLines: [],
        cooldowns: createLinearCooldowns(30, 20),
      },
      {
        id: "aria-hope-bloom",
        type: "필살기",
        name: "희망 만개",
        description:
          "개나리, 혹은 개나리 씨앗이 있는 블록을 모두 제거합니다. 없는 블록에는 개나리 씨앗을 심습니다.",
        detailLines: [],
        cooldowns: createMilestoneCooldowns(90, 80, 70),
      },
    ],
  },
];
