import type { Character } from "./types";

const mayCooldowns = [
  { level: "lv1", value: "10초" },
  { level: "lv2", value: "9.8초" },
  { level: "lv3", value: "9.6초" },
  { level: "lv4", value: "9.4초" },
  { level: "lv5", value: "9.2초" },
  { level: "lv6", value: "9초" },
  { level: "lv7", value: "8.8초" },
  { level: "lv8", value: "8.6초" },
  { level: "lv9", value: "8.4초" },
  { level: "lv10", value: "8.2초" },
  { level: "lv11", value: "8초" },
];

export const CHARACTER_LIST: Character[] = [
  {
    id: "may",
    name: "메이",
    tagline: "부드러운 리듬 컨트롤",
    trait: "안정적인 플레이",
    color: "#FF99CC",
    backgroundColor: "#C46496",
    imageSrc: "/assets/characters/may.png",
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
        detailLines: [
          "발동 조건: 쿨타임 10초",
          "성장: 레벨 1 증가마다 0.2초 감소, 최대 2초까지 감소",
        ],
        cooldowns: mayCooldowns,
      },
      {
        id: "may-precise-dissolve",
        type: "액티브 1",
        name: "끈적 용해",
        description:
          "목표 맵 위 유리하게 플레이할 수 있는 블록 위치를 자동으로 선택합니다.",
        detailLines: [
          "쿨타임: 15초",
          "성장: 레벨 1 증가마다 0.5초 감소, 최대 8초",
          "추가 효과: 레벨 10부터 블록 위치 3개 선정",
        ],
        cooldowns: [
          { level: "base", value: "15초" },
          { level: "max", value: "8초" },
        ],
      },
      {
        id: "may-residual-dissolve",
        type: "액티브 2",
        name: "잔류 용해",
        description:
          "액티브 1을 통해 녹인 블록 위치에 다른 블록이 있는 경우 해당 스킬을 발동해야 녹입니다.",
        detailLines: [
          "쿨타임: 30초",
          "제한: 액티브 2 스킬 이후 본 스킬로 그 위치를 다시 녹일 수 없음",
          "성장: 레벨 1 증가마다 1초 감소, 최대 10초",
        ],
        cooldowns: [
          { level: "base", value: "30초" },
          { level: "max", value: "10초" },
        ],
      },
      {
        id: "may-deep-dissolve",
        type: "액티브 3",
        name: "심층 용해",
        description:
          "액티브 1 스킬을 3번 사용한 뒤 발동 가능한 스킬입니다. 사용 시 다음 액티브 1은 블록 위치의 아래 2칸까지 녹일 수 있습니다.",
        detailLines: [
          "쿨타임: 15초",
          "효과: 다음 액티브 1 스킬의 용해 범위를 아래 2칸까지 확장",
          "성장: 레벨 1 증가마다 0.2초 감소, 최대 2초",
          "레벨 5: 액티브 1을 4번 사용해야 발동 / 아래 3칸",
          "레벨 10: 액티브 1을 5번 사용해야 발동 / 아래 4칸",
        ],
        cooldowns: [
          { level: "base", value: "15초" },
          { level: "max", value: "13초" },
        ],
      },
      {
        id: "may-dissolve-accel",
        type: "필살기",
        name: "용해 가속",
        description:
          "지속시간 동안 액티브 1, 액티브 2, 액티브 3 스킬의 쿨타임을 절반으로 줄입니다.",
        detailLines: [
          "쿨타임: 60초",
          "지속시간: 15초",
          "효과: 용해 계열 액티브 스킬의 회전율을 크게 높임",
        ],
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
        detailLines: [
          "발동 조건: 10줄 제거",
          "효과: 1-일자에서 폭탄이 터지면 인접한 블록을 모두 제거",
          "성장: 레벨 1 증가마다 발동 조건 1줄씩 증가",
        ],
        cooldowns: [{ level: "condition", value: "10줄" }],
      },
      {
        id: "bron-delayed-bomb",
        type: "액티브 1",
        name: "지연 기폭탄",
        description:
          "제거가 시급한 열 근처에 가장 많은 수의 블록을 터뜨릴 수 있는 위치에 폭탄을 심습니다.",
        detailLines: [
          "쿨타임: 20초",
          "효과: 3초 뒤 폭탄이 터지면서 인접한 블록을 모두 제거",
          "성장: 레벨 1 증가마다 쿨타임 0.5초 감소, 최대 5초 감소",
        ],
        cooldowns: [
          { level: "base", value: "20초" },
          { level: "max", value: "15초" },
        ],
      },
      {
        id: "bron-blast-amplify",
        type: "액티브 2",
        name: "폭발 증폭",
        description:
          "쿨타임이 지날 때마다 1회 누적됩니다. 누적 횟수만큼 액티브 1로 심은 폭탄의 범위가 증가합니다.",
        detailLines: [
          "쿨타임: 10초",
          "효과: 최대 3회까지 누적",
          "성장: 레벨 5 -> 쿨타임 8초, 레벨 10 -> 쿨타임 6초",
        ],
        cooldowns: [
          { level: "base", value: "10초" },
          { level: "lv5", value: "8초" },
          { level: "lv10", value: "6초" },
        ],
      },
      {
        id: "bron-instant-detonation",
        type: "액티브 3",
        name: "즉시 기폭",
        description: "액티브 1 스킬의 폭발 대기 시간을 없앱니다.",
        detailLines: [
          "쿨타임: 30초",
          "효과: 설치한 폭탄을 즉시 터뜨려 위험 구간을 빠르게 정리",
          "성장: 레벨 1 증가마다 쿨타임 0.5초 감소, 최대 5초 감소",
        ],
        cooldowns: [
          { level: "base", value: "30초" },
          { level: "max", value: "25초" },
        ],
      },
      {
        id: "bron-bomb-convert",
        type: "필살기",
        name: "폭탄 전환",
        description: "맵에 요소 중 하나인 낙하 블록들의 폭탄으로 바꿉니다.",
        detailLines: [
          "쿨타임: 90초",
          "성장: 레벨 5 -> 쿨타임 80초, 레벨 10 -> 쿨타임 70초",
        ],
        cooldowns: [
          { level: "base", value: "90초" },
          { level: "lv5", value: "80초" },
          { level: "lv10", value: "70초" },
        ],
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
        detailLines: [
          "쿨타임: 10초",
          "레벨 1씩 증가 -> 쿨타임 0.2초씩 감소, 최대 2초 감소",
          "레벨 3씩 증가 무작위 제거 블록 1개씩 증가, 최대 6개 제거",
        ],
        cooldowns: [
          { level: "base", value: "10초" },
          { level: "max", value: "8초" },
        ],
      },
      {
        id: "aria-seed-spread",
        type: "액티브 2",
        name: "씨앗 확산",
        description:
          "개나리가 있는 블록의 상하좌우에 개나리 씨앗을 심습니다.",
        detailLines: [
          "쿨타임: 20초",
          "레벨 1씩 증가 -> 쿨타임 1초씩 감소, 최대 10초 감소",
        ],
        cooldowns: [
          { level: "base", value: "20초" },
          { level: "max", value: "10초" },
        ],
      },
      {
        id: "aria-full-bloom",
        type: "액티브 3",
        name: "전면 개화",
        description: "개나리 씨앗이 있는 블록 모두 개나리로 재화합니다.",
        detailLines: [
          "쿨타임: 30초",
          "레벨 1씩 증가 -> 쿨타임 1초씩 감소, 최대 10초 감소",
        ],
        cooldowns: [
          { level: "base", value: "30초" },
          { level: "max", value: "20초" },
        ],
      },
      {
        id: "aria-hope-bloom",
        type: "필살기",
        name: "희망 만개",
        description:
          "개나리, 혹은 개나리 씨앗이 있는 블록을 모두 제거합니다. 없는 블록에는 개나리 씨앗을 심습니다.",
        detailLines: [
          "쿨타임: 90초",
          "레벨 5 -> 쿨타임 80초",
          "레벨 10 -> 쿨타임 70초",
        ],
        cooldowns: [
          { level: "base", value: "90초" },
          { level: "lv5", value: "80초" },
          { level: "lv10", value: "70초" },
        ],
      },
    ],
  },
];
