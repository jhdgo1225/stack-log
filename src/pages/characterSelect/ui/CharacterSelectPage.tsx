import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { Character, CharacterSkill } from "@/entities/character";
import {
  CHARACTER_LIST,
  getCharacterFaceSrc,
  getCharacterSkillSrc,
  useCharacterStore,
} from "@/entities/character";
import { useStartGame } from "@/features/start-game";
import { APP_ROUTES } from "@/shared/config/routes";
import { classNames } from "@/shared/lib/classNames";
import { startPageTransition } from "@/shared/lib/performance/performanceTelemetry";
import { useMeasuredHandler } from "@/shared/lib/performance/useMeasuredHandler";
import { usePageTransitionTrace } from "@/shared/lib/performance/usePageTransitionTrace";
import { usePerformanceTrace } from "@/shared/lib/performance/usePerformanceTrace";
import { BackButton } from "@/shared/ui/BackButton";
import { CharacterSelectModal } from "@/widgets/characterSelectModal";
import { SkillVideoModal } from "@/widgets/skillVideoModal";

import * as styles from "./CharacterSelectPage.css";

const CAROUSEL_PREV_ICON = "/assets/icons/chevron_backward.svg";
const CAROUSEL_NEXT_ICON = "/assets/icons/chevron_forward.svg";

const visibleCharacters = CHARACTER_LIST.slice(0, 6);
const defaultThemeGradient =
  "linear-gradient(90deg, #4BB9FF 0%, #8A5DFF 50%, #FF4DDC 100%)";

const UNAVAILABLE_CHARACTER_IDS = ["bron", "aria"];

const CHARACTER_PREVIEW_STYLE: Record<
  string,
  {
    scale: number;
    translateY: number;
    mobileScale?: number;
    mobileTranslateY?: number;
  }
> = {
  may: { scale: 1, translateY: 0, mobileScale: 1, mobileTranslateY: 0 },
  bron: {
    scale: 1,
    translateY: 0,
    mobileScale: 1,
    mobileTranslateY: 0,
  },
  aria: {
    scale: 1.01,
    translateY: 0,
    mobileScale: 1.01,
    mobileTranslateY: 0,
  },
};

type KeyboardGuideModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const KEYBOARD_GUIDE_ITEMS = [
  { keyName: "←", description: "왼쪽 이동" },
  { keyName: "→", description: "오른쪽 이동" },
  { keyName: "A", description: "90도 반시계 방향 회전" },
  { keyName: "D", description: "90도 시계 방향 회전" },
  { keyName: "S", description: "소프트 드롭" },
  { keyName: "Space", description: "하드 드롭" },
  { keyName: "Shift", description: "홀드" },
  { keyName: "Q / W / E", description: "일반 스킬" },
  { keyName: "R", description: "필살기" },
  { keyName: "ESC", description: "일시정지" },
  { keyName: "F1", description: "도움말", helper: "단축키, 스킬 설명 확인" },
];

function KeyboardGuideModal({ isOpen, onClose }: KeyboardGuideModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      role="presentation"
      onMouseDown={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "grid",
        placeItems: "center",
        padding: 24,
        background: "rgba(0,0,0,0.58)",
        backdropFilter: "blur(8px)",
      }}>
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="keyboard-guide-title"
        onMouseDown={(event) => event.stopPropagation()}
        style={{
          width: "min(100%, 560px)",
          maxHeight: "88dvh",
          overflow: "hidden",
          display: "grid",
          gridTemplateRows: "auto minmax(0, 1fr) auto",
          borderRadius: 24,
          background: "#fff",
          border: "4px solid #111",
          boxShadow: "0 28px 70px rgba(0,0,0,0.34)",
        }}>
        <div
          style={{
            display: "flex",
            alignItems: "start",
            justifyContent: "space-between",
            gap: 16,
            padding: "24px 26px 18px",
            borderBottom: "1px solid #e8e8e8",
          }}>
          <div>
            <span
              style={{
                display: "inline-flex",
                marginBottom: 4,
                color: "#3f628f",
                fontSize: 13,
                fontWeight: 900,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}>
              Input System
            </span>

            <h2
              id="keyboard-guide-title"
              style={{
                margin: 0,
                color: "#111",
                fontSize: "clamp(28px, 3vw, 42px)",
                fontWeight: 900,
                lineHeight: 1.08,
                letterSpacing: "-0.04em",
              }}>
              키보드 조작법
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="키보드 조작법 닫기"
            style={{
              width: 42,
              height: 42,
              flex: "0 0 auto",
              display: "grid",
              placeItems: "center",
              padding: 0,
              border: 0,
              borderRadius: 999,
              background: "#111",
              color: "#fff",
              fontSize: 30,
              fontWeight: 700,
              lineHeight: 1,
              cursor: "pointer",
            }}>
            ×
          </button>
        </div>

        <div
          style={{
            minHeight: 0,
            overflowY: "auto",
            display: "grid",
            gap: 10,
            padding: "20px 26px 22px",
          }}>
          {KEYBOARD_GUIDE_ITEMS.map((item) => (
            <div
              key={item.keyName}
              style={{
                display: "grid",
                gridTemplateColumns: "118px minmax(0, 1fr)",
                alignItems: "center",
                gap: 16,
                padding: "12px 14px",
                borderRadius: 16,
                background: "#f8f8f8",
                border: "1px solid #e5e5e5",
              }}>
              <kbd
                style={{
                  minHeight: 42,
                  display: "inline-grid",
                  placeItems: "center",
                  padding: "7px 12px",
                  borderRadius: 12,
                  background: "linear-gradient(180deg, #ffffff, #ececec)",
                  border: "1px solid #d9d9d9",
                  boxShadow:
                    "inset 0 -3px 0 rgba(0,0,0,0.12), 0 6px 12px rgba(0,0,0,0.1)",
                  color: "#111",
                  fontSize: 20,
                  fontWeight: 900,
                  lineHeight: 1,
                  whiteSpace: "nowrap",
                }}>
                {item.keyName}
              </kbd>

              <div
                style={{
                  minWidth: 0,
                  display: "grid",
                  gap: 3,
                  color: "#111",
                }}>
                <strong
                  style={{
                    fontSize: 18,
                    fontWeight: 900,
                    lineHeight: 1.25,
                    letterSpacing: "-0.03em",
                  }}>
                  {item.description}
                </strong>

                {item.helper ? (
                  <span
                    style={{
                      color: "#555",
                      fontSize: 13,
                      fontWeight: 700,
                      lineHeight: 1.35,
                    }}>
                    {item.helper}
                  </span>
                ) : null}
              </div>
            </div>
          ))}
        </div>

        <p
          style={{
            margin: 0,
            padding: "15px 26px 20px",
            borderTop: "1px solid #e8e8e8",
            color: "#444",
            fontSize: 14,
            fontWeight: 800,
            lineHeight: 1.45,
            textAlign: "center",
          }}>
          게임 중 <kbd>F1</kbd>을 누르면 조작법을 다시 확인할 수 있습니다.
        </p>
      </section>
    </div>
  );
}

export function CharacterSelectPage() {
  usePerformanceTrace("page.characterSelect");
  usePageTransitionTrace("character-select");

  const navigate = useNavigate();
  const { startGame } = useStartGame();
  const selectCharacter = useCharacterStore((state) => state.selectCharacter);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSkillVideoOpen, setIsSkillVideoOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [isKeyboardGuideOpen, setIsKeyboardGuideOpen] = useState(false);

  const handleOpenKeyboardGuide = () => {
    setIsKeyboardGuideOpen(true);
  };

  const handleCloseKeyboardGuide = () => {
    setIsKeyboardGuideOpen(false);
  };

  const selectedCharacter =
    CHARACTER_LIST.find((character) => character.id === selectedCharacterId) ??
    null;

  const selectedSkill =
    selectedCharacter?.skills.find((skill) => skill.id === selectedSkillId) ??
    selectedCharacter?.skills[0] ??
    null;

  const isSelectedCharacterUnavailable =
    selectedCharacter !== null &&
    UNAVAILABLE_CHARACTER_IDS.includes(selectedCharacter.id);

  const isStartButtonDisabled =
    !selectedCharacter || isSelectedCharacterUnavailable;

  const modalCharacters = useMemo(() => {
    const keyword = search.trim().toLocaleLowerCase();

    if (!keyword) {
      return CHARACTER_LIST;
    }

    return CHARACTER_LIST.filter((character) =>
      character.name.toLocaleLowerCase().includes(keyword),
    );
  }, [search]);

  const handleBack = useMeasuredHandler("ui.characterSelect.back", () => {
    startPageTransition("character-select", "main");
    void navigate(APP_ROUTES.MAIN);
  });

  const handleStart = useMeasuredHandler("ui.characterSelect.start", () => {
    if (!selectedCharacter || isSelectedCharacterUnavailable) {
      return;
    }

    selectCharacter(selectedCharacter.id);
    startGame();
    startPageTransition("character-select", "game");
    void navigate(APP_ROUTES.GAME);
  });

  const handleSelectCharacter = (character: Character) => {
    setSelectedCharacterId(character.id);
    selectCharacter(character.id);
    setSelectedSkillId(character.skills[0]?.id ?? "");
  };

  const handleModalSelectCharacter = (character: Character) => {
    handleSelectCharacter(character);
    setIsModalOpen(false);
    setSearch("");
  };

  const handleOpenSkillVideo = () => {
    if (!selectedSkill) {
      return;
    }

    setIsSkillVideoOpen(true);
  };

  const handleCloseSkillVideo = () => {
    setIsSkillVideoOpen(false);
  };

  const themeStyle = {
    "--character-theme": selectedCharacter
      ? characterTheme(selectedCharacter)
      : defaultThemeGradient,
    "--character-accent": selectedCharacter
      ? selectedCharacter.color
      : "#8A5DFF",
    "--character-bg-accent": selectedCharacter
      ? selectedCharacter.backgroundColor
      : "#4BB9FF",
    "--character-soft": selectedCharacter
      ? `color-mix(in srgb, ${selectedCharacter.color} 18%, #ffffff)`
      : "rgba(255, 255, 255, 0.86)",
  } as CSSProperties;

  return (
    <main
      className={styles.page}
      style={themeStyle}
      aria-label="캐릭터 선택 화면">
      <div
        style={{
          width: "min(100%, 1280px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          justifySelf: "center",
          zIndex: 2,
        }}>
        <BackButton
          className={styles.backButton}
          icon={
            <img
              className={styles.backButtonIcon}
              src="/assets/icons/arrow_back.svg"
              alt=""
              aria-hidden="true"
              draggable={false}
            />
          }
          style={
            {
              "--back-button-bg": "var(--character-soft)",
              "--back-button-hover-bg": "#f6f6f6",
              "--back-button-outline": "#1497ff",
            } as CSSProperties
          }
          onClick={handleBack}
        />

        <button
          type="button"
          onClick={handleOpenKeyboardGuide}
          aria-label="키보드 조작법 보기"
          style={{
            minHeight: 42,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "8px 16px",
            border: "2px solid #111",
            borderRadius: 999,
            background: "#fff",
            color: "#111",
            fontSize: 15,
            fontWeight: 900,
            cursor: "pointer",
            boxShadow: "0 8px 18px rgba(0,0,0,0.12)",
          }}>
          <span
            aria-hidden="true"
            style={{
              minWidth: 34,
              minHeight: 24,
              display: "inline-grid",
              placeItems: "center",
              padding: "2px 8px",
              borderRadius: 7,
              background: "#111",
              color: "#fff",
              fontSize: 13,
              fontWeight: 900,
            }}>
            F1
          </span>
          <span>조작법</span>
        </button>
      </div>

      <section className={styles.topSelectArea} aria-label="캐릭터 선택">
        <h1 className={styles.title}>캐릭터 선택</h1>
        <div className={styles.carouselColumn}>
          <div className={styles.carouselShell}>
            <button
              type="button"
              className={styles.arrowButton}
              aria-label="이전 캐릭터 선택 항목">
              <img
                className={styles.arrowButtonIcon}
                src={CAROUSEL_PREV_ICON}
                alt=""
                aria-hidden="true"
                draggable={false}
              />
            </button>
            <div className={styles.carouselCards}>
              {visibleCharacters.map((character) => (
                <CharacterCard
                  key={character.id}
                  character={character}
                  useFace
                  showName={false}
                  isSelected={
                    selectedCharacter !== null &&
                    character.id === selectedCharacter.id
                  }
                  onClick={() => handleSelectCharacter(character)}
                />
              ))}
            </div>
            <button
              type="button"
              className={styles.arrowButton}
              aria-label="다음 캐릭터 선택 항목">
              <img
                className={styles.arrowButtonIcon}
                src={CAROUSEL_NEXT_ICON}
                alt=""
                aria-hidden="true"
                draggable={false}
              />
            </button>
          </div>

          <button
            type="button"
            className={styles.openModalButton}
            onClick={() => setIsModalOpen(true)}>
            전체 확인
            <span className={styles.chevronDown} aria-hidden="true" />
          </button>
        </div>
      </section>

      <section className={styles.detailArea} aria-label="선택한 캐릭터 정보">
        <div className={styles.characterPreview}>
          {selectedCharacter?.imageSrc ? (
            <img
              className={styles.characterImage}
              src={selectedCharacter.imageSrc}
              alt={`${selectedCharacter.name} 캐릭터`}
              draggable={false}
              style={getCharacterPreviewStyle(selectedCharacter.id)}
            />
          ) : selectedCharacter ? (
            <div className={styles.largePlaceholder}>
              <span>{selectedCharacter.name}</span>
            </div>
          ) : (
            <div className={styles.emptyCharacterPreview}>
              <span>?</span>
            </div>
          )}
        </div>

        <div className={styles.infoColumn}>
          <div className={styles.nameRow}>
            <span>이름</span>
            <strong>{selectedCharacter?.name ?? "-"}</strong>
          </div>
          <div className={styles.personalityRow}>
            <span>개성</span>
            <strong>{selectedCharacter?.personality ?? "선택 전"}</strong>
          </div>
          <div className={styles.skillRow}>
            <span>스킬</span>
            <div className={styles.skillSlots}>
              {renderSkillSlotItems(
                selectedCharacter,
                selectedSkill?.id ?? null,
                setSelectedSkillId,
              )}
            </div>
          </div>

          {selectedSkill ? (
            <SkillInfo
              skill={selectedSkill}
              onOpenVideo={handleOpenSkillVideo}
            />
          ) : (
            <EmptySkillInfo />
          )}
        </div>
      </section>

      <div className={styles.startButtonArea}>
        <button
          type="button"
          className={classNames(
            styles.startButton,
            isStartButtonDisabled && styles.startButtonDisabled,
          )}
          onClick={handleStart}
          aria-label="게임 시작"
          disabled={isStartButtonDisabled}>
          <img
            className={styles.startButtonImage}
            src="/assets/main/game-start-btn.png"
            alt=""
            draggable={false}
          />
        </button>

        {isSelectedCharacterUnavailable ? (
          <p className={styles.unavailableMessage}>
            해당 캐릭터는 이용할 수 없습니다.
          </p>
        ) : null}
      </div>

      <CharacterSelectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        searchValue={search}
        onSearchChange={setSearch}
        hasResults={modalCharacters.length > 0}
        style={
          {
            "--character-select-modal-bg": "#fff",
            "--character-select-modal-input-bg": "#f1f1f1",
            "--character-select-modal-outline": "#1497ff",
            "--character-select-modal-width": "900px",
          } as CSSProperties
        }>
        <div className={styles.modalGrid}>
          {modalCharacters.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              useFace
              showName
              isSelected={
                selectedCharacter !== null &&
                character.id === selectedCharacter.id
              }
              onClick={() => handleModalSelectCharacter(character)}
            />
          ))}
        </div>
      </CharacterSelectModal>

      <SkillVideoModal
        isOpen={isSkillVideoOpen}
        character={selectedCharacter}
        skill={selectedSkill}
        onClose={handleCloseSkillVideo}
      />

      <KeyboardGuideModal
        isOpen={isKeyboardGuideOpen}
        onClose={handleCloseKeyboardGuide}
      />
    </main>
  );
}

function getCharacterPreviewStyle(characterId: string): CSSProperties {
  const preset = CHARACTER_PREVIEW_STYLE[characterId] ?? {
    scale: 1,
    translateY: 0,
    mobileScale: 1,
    mobileTranslateY: 0,
  };

  return {
    "--preview-scale": String(preset.scale),
    "--preview-translate-y": `${preset.translateY}px`,
    "--preview-mobile-scale": String(preset.mobileScale ?? preset.scale),
    "--preview-mobile-translate-y": `${preset.mobileTranslateY ?? preset.translateY}px`,
  } as CSSProperties;
}

function EmptySkillInfo() {
  return (
    <article className={classNames(styles.skillInfo, styles.emptySkillInfo)}>
      <strong>캐릭터를 선택해 주세요</strong>
      <p>캐릭터를 선택하면 이름, 개성, 스킬 정보가 이곳에 표시됩니다.</p>
    </article>
  );
}

function characterTheme(character: Character) {
  return `linear-gradient(90deg, ${character.color} 0%, ${character.backgroundColor} 100%)`;
}

type CharacterCardProps = {
  character: Character;
  useFace?: boolean;
  showName?: boolean;
  isSelected: boolean;
  onClick: () => void;
};

function CharacterCard({
  character,
  useFace = false,
  showName = false,
  isSelected,
  onClick,
}: CharacterCardProps) {
  const isModalCard = showName;

  return (
    <button
      type="button"
      className={classNames(
        styles.characterCard,
        isModalCard ? styles.characterModalCard : styles.characterCarouselCard,
        isSelected &&
          (isModalCard
            ? styles.characterModalCardSelected
            : styles.selectedCharacterCard),
      )}
      style={getCharacterCardStyle(isModalCard, character)}
      onClick={onClick}
      aria-label={`${character.name} 선택`}
      aria-pressed={isSelected}>
      {character.imageSrc ? (
        <img
          className={
            useFace
              ? isModalCard
                ? styles.characterModalFaceImage
                : styles.characterCarouselFaceImage
              : styles.cardImage
          }
          src={useFace ? getCharacterFaceSrc(character.id) : character.imageSrc}
          alt=""
          draggable={false}
        />
      ) : (
        <span className={styles.cardPlaceholderText}>{character.name}</span>
      )}
      {showName ? (
        <span className={styles.characterCardLabel}>{character.name}</span>
      ) : null}
    </button>
  );
}

function renderSkillSlotItems(
  character: Character | null,
  selectedSkillId: string | null,
  onSelectSkill: (skillId: string) => void,
) {
  if (!character) {
    return Array.from({ length: 5 }).map((_, index) => (
      <span
        key={`unselected-${index}`}
        className={styles.emptySkillSlot}
        aria-hidden="true"
      />
    ));
  }

  return character.skills.map((skill, index) => (
    <button
      key={skill.id}
      type="button"
      className={classNames(
        styles.skillSlot,
        skill.id === selectedSkillId && styles.selectedSkillSlot,
      )}
      aria-label={`${skill.name} 스킬 선택`}
      aria-pressed={skill.id === selectedSkillId}
      onClick={() => onSelectSkill(skill.id)}>
      <img
        className={styles.skillSlotImage}
        src={getCharacterSkillSrc(character.id, skill.type)}
        alt=""
        aria-hidden="true"
        draggable={false}
      />
      <span className={styles.skillSlotIndex}>
        {String(index + 1).padStart(2, "0")}
      </span>
    </button>
  ));
}

function getCharacterCardStyle(isModalCard: boolean, character: Character) {
  if (!isModalCard) {
    return undefined;
  }

  return {
    "--character-accent": character.color,
    "--character-fill": character.color,
  } as CSSProperties;
}

function SkillInfo({
  skill,
  onOpenVideo,
}: {
  skill: CharacterSkill;
  onOpenVideo: () => void;
}) {
  return (
    <article className={styles.skillInfo}>
      <div className={styles.skillInfoTop}>
        <div className={styles.skillType}>
          <img
            className={styles.skillTypeImage}
            src={getCharacterSkillSrc(
              selectedCharacterIdForSkill(skill),
              skill.type,
            )}
            alt=""
            aria-hidden="true"
            draggable={false}
          />
          <span>{skill.type}</span>
          <strong>{skill.name}</strong>
        </div>
        <div className={styles.videoControl}>
          <span>설명 영상</span>
          <button
            type="button"
            className={styles.videoControlButton}
            onClick={onOpenVideo}
            aria-label={`${skill.name} 설명 영상`}>
            <img
              className={styles.videoControlIcon}
              src="/assets/icons/cam.svg"
              alt=""
              aria-hidden="true"
              draggable={false}
            />
          </button>
        </div>
      </div>

      <div className={styles.skillDescription}>
        <strong className={styles.descriptionTitle}>설명</strong>
        <p className={styles.descriptionBody}>{skill.description}</p>
      </div>

      <ul className={styles.skillDetails}>
        {skill.detailLines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>

      {skill.cooldowns.length > 0 ? (
        <div className={styles.cooldownArea}>
          <strong className={styles.cooldownTitle}>쿨타임</strong>
          <div className={styles.cooldownGrid}>
            {skill.cooldowns.map((cooldown) => (
              <div key={cooldown.level} className={styles.cooldownItem}>
                <span className={styles.cooldownValue}>{cooldown.value}</span>
                <small className={styles.cooldownLevel}>{cooldown.level}</small>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </article>
  );
}

function selectedCharacterIdForSkill(skill: CharacterSkill) {
  const character = CHARACTER_LIST.find((item) =>
    item.skills.some((itemSkill) => itemSkill.id === skill.id),
  );

  return character?.id ?? "may";
}
