import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { CHARACTER_LIST, useCharacterStore } from "@/entities/character";
import type { Character, CharacterSkill } from "@/entities/character";
import { useStartGame } from "@/features/start-game";
import { APP_ROUTES } from "@/shared/config/routes";
import { classNames } from "@/shared/lib/classNames";
import { startPageTransition } from "@/shared/lib/performance/performanceTelemetry";
import { useMeasuredHandler } from "@/shared/lib/performance/useMeasuredHandler";
import { usePageTransitionTrace } from "@/shared/lib/performance/usePageTransitionTrace";
import { usePerformanceTrace } from "@/shared/lib/performance/usePerformanceTrace";
import { BackButton } from "@/shared/ui/BackButton";
import { CharacterSelectModal } from "@/widgets/characterSelectModal";
import * as styles from "./CharacterSelectPage.css";

const visibleCharacters = CHARACTER_LIST.slice(0, 6);
const defaultThemeGradient =
  "linear-gradient(90deg, #4BB9FF 0%, #8A5DFF 50%, #FF4DDC 100%)";

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
  const [search, setSearch] = useState("");
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);

  const selectedCharacter =
    CHARACTER_LIST.find((character) => character.id === selectedCharacterId) ??
    null;

  const selectedSkill =
    selectedCharacter?.skills.find((skill) => skill.id === selectedSkillId) ??
    selectedCharacter?.skills[0] ??
    null;

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
    if (!selectedCharacter) {
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

  const themeStyle = {
    "--character-theme": selectedCharacter
      ? characterTheme(selectedCharacter)
      : defaultThemeGradient,
    "--character-accent": selectedCharacter ? selectedCharacter.color : "#8A5DFF",
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
      aria-label="캐릭터 선택 화면"
    >
      <BackButton
        className={styles.backButton}
        style={{
          "--back-button-bg": "var(--character-soft)",
          "--back-button-hover-bg": "#f6f6f6",
          "--back-button-outline": "#1497ff",
        } as CSSProperties}
        onClick={handleBack}
      />

      <section className={styles.topSelectArea} aria-label="캐릭터 선택">
        <h1 className={styles.title}>캐릭터 선택</h1>
        <div className={styles.carouselColumn}>
          <div className={styles.carouselShell}>
            <button
              type="button"
              className={styles.arrowButton}
              aria-label="이전 캐릭터 선택 항목"
            >
              ‹
            </button>
            <div className={styles.carouselCards}>
              {visibleCharacters.map((character) => (
                <CharacterCard
                  key={character.id}
                  character={character}
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
              aria-label="다음 캐릭터 선택 항목"
            >
              ›
            </button>
          </div>

          <button
            type="button"
            className={styles.openModalButton}
            onClick={() => setIsModalOpen(true)}
          >
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
              {selectedCharacter
                ? selectedCharacter.skills.map((skill, index) => (
                    <button
                      key={skill.id}
                      type="button"
                      className={classNames(
                        styles.skillSlot,
                        skill.id === selectedSkill?.id &&
                          styles.selectedSkillSlot,
                      )}
                      aria-label={`${skill.name} 스킬 선택`}
                      aria-pressed={skill.id === selectedSkill?.id}
                      onClick={() => setSelectedSkillId(skill.id)}
                    >
                      <span>{String(index + 1).padStart(2, "0")}</span>
                    </button>
                  ))
                : Array.from({ length: 5 }).map((_, index) => (
                    <span
                      key={`unselected-${index}`}
                      className={styles.emptySkillSlot}
                      aria-hidden="true"
                    />
                  ))}
            </div>
          </div>

          {selectedSkill ? (
            <SkillInfo skill={selectedSkill} />
          ) : (
            <EmptySkillInfo />
          )}
        </div>
      </section>

      <button
        type="button"
        className={classNames(
          styles.startButton,
          !selectedCharacter && styles.startButtonDisabled,
        )}
        onClick={handleStart}
        aria-label="게임 시작"
        disabled={!selectedCharacter}
      >
        <img
          className={styles.startButtonImage}
          src="/assets/main/game-start-btn.png"
          alt=""
          draggable={false}
        />
      </button>

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
        }
      >
        <div className={styles.modalGrid}>
          {modalCharacters.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              isSelected={
                selectedCharacter !== null &&
                character.id === selectedCharacter.id
              }
              onClick={() => handleModalSelectCharacter(character)}
            />
          ))}
        </div>
      </CharacterSelectModal>
    </main>
  );
}

function EmptySkillInfo() {
  return (
    <article className={styles.emptySkillInfo}>
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
  isSelected: boolean;
  onClick: () => void;
};

function CharacterCard({ character, isSelected, onClick }: CharacterCardProps) {
  return (
    <button
      type="button"
      className={classNames(
        styles.characterCard,
        isSelected && styles.selectedCharacterCard,
      )}
      onClick={onClick}
      aria-label={`${character.name} 선택`}
      aria-pressed={isSelected}
    >
      {character.imageSrc ? (
        <img
          className={styles.cardImage}
          src={character.imageSrc}
          alt=""
          draggable={false}
        />
      ) : (
        <span className={styles.cardPlaceholderText}>{character.name}</span>
      )}
    </button>
  );
}

function SkillInfo({ skill }: { skill: CharacterSkill }) {
  return (
    <article className={styles.skillInfo}>
      <div className={styles.skillInfoTop}>
        <div className={styles.skillType}>
          <span>{skill.type}</span>
          <strong>{skill.name}</strong>
        </div>
        <div className={styles.videoControl}>
          <span>설명 영상</span>
          <button type="button" aria-label={`${skill.name} 설명 영상`}>
            <span aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className={styles.skillDescription}>
        <strong>설명</strong>
        <p>{skill.description}</p>
      </div>

      <ul className={styles.skillDetails}>
        {skill.detailLines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>

      {skill.cooldowns.length > 0 ? (
        <div className={styles.cooldownArea}>
          <strong>쿨타임</strong>
          <div className={styles.cooldownGrid}>
            {skill.cooldowns.map((cooldown) => (
              <div key={cooldown.level} className={styles.cooldownItem}>
                <span>{cooldown.value}</span>
                <small>{cooldown.level}</small>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </article>
  );
}
