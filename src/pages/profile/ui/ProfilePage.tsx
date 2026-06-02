import { type CSSProperties, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { CHARACTER_LIST } from "@/entities/character";
import {
  type GameRecord,
  type SkillKey,
  useGameRecordStore,
} from "@/entities/gameRecord";
import { APP_ROUTES } from "@/shared/config/routes";
import { classNames } from "@/shared/lib/classNames";
import { startPageTransition } from "@/shared/lib/performance/performanceTelemetry";
import { useMeasuredHandler } from "@/shared/lib/performance/useMeasuredHandler";
import { usePageTransitionTrace } from "@/shared/lib/performance/usePageTransitionTrace";
import { usePerformanceTrace } from "@/shared/lib/performance/usePerformanceTrace";

import * as styles from "./ProfilePage.css";

type CharacterFilter = string;

type CharacterOption = {
  id: CharacterFilter;
  name: string;
  color: string;
  background?: string;
};

const PROFILE_NAME_KEY = "daker-may-profile-nickname";
const RECORDS_PER_PAGE = 10;
const PAGE_WINDOW_SIZE = 10;
const SKILL_KEYS: SkillKey[] = ["Q", "W", "E", "R"];
const LOGO_GRADIENT = "linear-gradient(90deg, #3DA8FF 0%, #FF4DDC 100%)";

const ALL_CHARACTER: CharacterOption = {
  id: "all",
  name: "전체",
  color: "#3DA8FF",
  background: LOGO_GRADIENT,
};

const SAMPLE_RECORDS: GameRecord[] = [
  createSampleRecord("may", 20, 1000000, "2026-07-08T14:23:23", 1223000, {
    Q: 100,
    W: 82,
    E: 70,
    R: 4,
  }),
  createSampleRecord("may", 6, 90000, "2026-07-05T02:24:40", 265000, {
    Q: 100,
    W: 82,
    E: 70,
    R: 4,
  }),
  createSampleRecord("may", 7, 102300, "2026-07-07T20:20:23", 340000, {
    Q: 100,
    W: 82,
    E: 70,
    R: 4,
  }),
  createSampleRecord("may", 7, 102300, "2026-07-05T00:00:02", 338000, {
    Q: 100,
    W: 82,
    E: 70,
    R: 4,
  }),
  createSampleRecord("may", 7, 104300, "2026-07-07T18:00:23", 359000, {
    Q: 100,
    W: 82,
    E: 70,
    R: 4,
  }),
  createSampleRecord("may", 7, 102300, "2026-07-04T20:20:40", 330000, {
    Q: 100,
    W: 82,
    E: 70,
    R: 4,
  }),
  createSampleRecord("may", 7, 102300, "2026-07-07T14:20:15", 340000, {
    Q: 100,
    W: 82,
    E: 70,
    R: 4,
  }),
  createSampleRecord("may", 7, 102300, "2026-07-03T21:23:40", 339000, {
    Q: 100,
    W: 82,
    E: 70,
    R: 4,
  }),
  createSampleRecord("may", 7, 102300, "2026-07-06T14:23:40", 340000, {
    Q: 100,
    W: 82,
    E: 70,
    R: 4,
  }),
  createSampleRecord("may", 7, 102300, "2026-07-02T15:30:50", 341000, {
    Q: 100,
    W: 82,
    E: 70,
    R: 4,
  }),
  createSampleRecord("bron", 8, 122000, "2026-07-01T11:45:10", 363000, {
    Q: 91,
    W: 76,
    E: 64,
    R: 5,
  }),
  createSampleRecord("aria", 5, 76000, "2026-06-30T19:12:00", 248000, {
    Q: 68,
    W: 55,
    E: 42,
    R: 2,
  }),
];

function createSampleRecord(
  characterId: string,
  level: number,
  score: number,
  startedAt: string,
  playDurationMs: number,
  skillUses: Record<SkillKey, number>,
): GameRecord {
  const endedAt = new Date(new Date(startedAt).getTime() + playDurationMs);

  return {
    id: `sample-${characterId}-${startedAt}`,
    characterId,
    level,
    score,
    playDurationMs,
    startedAt: new Date(startedAt).toISOString(),
    endedAt: endedAt.toISOString(),
    skillUses,
  };
}

function getStoredNickname() {
  if (typeof localStorage === "undefined") {
    return "아주멋진꼬마자동...";
  }

  return localStorage.getItem(PROFILE_NAME_KEY) ?? "아주멋진꼬마자동...";
}

function getCharacter(characterId: string) {
  return (
    CHARACTER_LIST.find((character) => character.id === characterId) ??
    CHARACTER_LIST[0]
  );
}

function formatDuration(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
  }

  return `${minutes}m ${seconds}s`;
}

function formatRecordDate(value: string) {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day}\n${hours}:${minutes}:${seconds}`;
}

function getMostPlayedCharacter(records: GameRecord[]) {
  const counts = new Map<string, number>();

  for (const record of records) {
    counts.set(record.characterId, (counts.get(record.characterId) ?? 0) + 1);
  }

  let mostPlayedId = CHARACTER_LIST[0]?.id ?? "may";
  let mostPlayedCount = -1;

  for (const character of CHARACTER_LIST) {
    const count = counts.get(character.id) ?? 0;

    if (count > mostPlayedCount) {
      mostPlayedId = character.id;
      mostPlayedCount = count;
    }
  }

  return getCharacter(mostPlayedId);
}

function getPageNumbers(totalPages: number, currentPage: number) {
  const groupStart =
    Math.floor((currentPage - 1) / PAGE_WINDOW_SIZE) * PAGE_WINDOW_SIZE + 1;
  const groupEnd = Math.min(totalPages, groupStart + PAGE_WINDOW_SIZE - 1);

  return Array.from(
    { length: groupEnd - groupStart + 1 },
    (_, index) => groupStart + index,
  );
}

export function ProfilePage() {
  usePerformanceTrace("page.profile");
  usePageTransitionTrace("profile");

  const navigate = useNavigate();
  const records = useGameRecordStore((state) => state.records);
  const [nickname, setNickname] = useState(getStoredNickname);
  const [draftNickname, setDraftNickname] = useState(nickname);
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<CharacterFilter>("may");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const displayRecords = useMemo(() => {
    const existingIds = new Set(records.map((record) => record.id));
    const samples = SAMPLE_RECORDS.filter(
      (record) => !existingIds.has(record.id),
    );

    return [...records, ...samples];
  }, [records]);

  const characterOptions: CharacterOption[] = useMemo(
    () => [
      ALL_CHARACTER,
      ...CHARACTER_LIST.map((character) => ({
        id: character.id,
        name: character.name,
        color: character.color,
      })),
    ],
    [],
  );

  const selectedOption =
    characterOptions.find((option) => option.id === selectedFilter) ??
    characterOptions[1] ??
    ALL_CHARACTER;
  const isCommonTheme = selectedFilter === "all";
  const accentColor = selectedOption.color;
  const accentFill = selectedOption.background ?? selectedOption.color;
  const surfaceBackground = isCommonTheme
    ? "#fff"
    : `linear-gradient(135deg, color-mix(in srgb, ${accentColor} 14%, #ffffff) 0%, #fff 34%, color-mix(in srgb, ${accentColor} 8%, #f7fbff) 100%)`;
  const panelBackground = isCommonTheme
    ? "#fff"
    : `color-mix(in srgb, ${accentColor} 7%, #fff)`;
  const borderGradient = isCommonTheme
    ? LOGO_GRADIENT.replace("90deg", "135deg")
    : `linear-gradient(135deg, ${accentColor} 0%, color-mix(in srgb, ${accentColor} 18%, #fff) 100%)`;
  const profileShadow = isCommonTheme
    ? "none"
    : `0 16px 30px color-mix(in srgb, ${accentColor} 16%, transparent)`;
  const profileSoftShadow = isCommonTheme
    ? "none"
    : `0 7px 16px color-mix(in srgb, ${accentColor} 18%, transparent)`;
  const profileRingShadow = isCommonTheme
    ? "0 12px 22px rgba(0,0,0,0.08)"
    : `0 12px 22px rgba(0,0,0,0.08), 0 0 0 8px color-mix(in srgb, ${accentColor} 8%, transparent)`;
  const selectedCharacterRecords = displayRecords.filter(
    (record) => record.characterId === selectedFilter,
  );
  const filteredRecords =
    selectedFilter === "all" ? displayRecords : selectedCharacterRecords;
  const currentPage = Math.min(
    page,
    Math.max(1, Math.ceil(filteredRecords.length / RECORDS_PER_PAGE)),
  );
  const totalPages = Math.max(
    1,
    Math.ceil(filteredRecords.length / RECORDS_PER_PAGE),
  );
  const pagedRecords = filteredRecords.slice(
    (currentPage - 1) * RECORDS_PER_PAGE,
    currentPage * RECORDS_PER_PAGE,
  );
  const mostPlayedCharacter = getMostPlayedCharacter(displayRecords);
  const totalPlayDuration = filteredRecords.reduce(
    (total, record) => total + record.playDurationMs,
    0,
  );
  const highestRecord = filteredRecords.reduce<GameRecord | null>(
    (best, record) =>
      best === null ||
      record.level > best.level ||
      (record.level === best.level && record.score > best.score)
        ? record
        : best,
    null,
  );
  const shortestRecord = filteredRecords.reduce<GameRecord | null>(
    (best, record) =>
      best === null || record.playDurationMs < best.playDurationMs
        ? record
        : best,
    null,
  );
  const maxCombo = filteredRecords.reduce(
    (best, record) => Math.max(best, record.skillUses.R),
    0,
  );
  const totalSkillUses = SKILL_KEYS.reduce(
    (totals, key) => ({
      ...totals,
      [key]: filteredRecords.reduce(
        (sum, record) => sum + record.skillUses[key],
        0,
      ),
    }),
    { Q: 0, W: 0, E: 0, R: 0 } as Record<SkillKey, number>,
  );
  const pageNumbers = getPageNumbers(totalPages, currentPage);
  const modalOptions = characterOptions.filter((option) =>
    option.name.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()),
  );

  const profileStyle = {
    "--profile-accent": accentColor,
    "--profile-accent-fill": accentFill,
    "--profile-surface-bg": surfaceBackground,
    "--profile-panel-bg": panelBackground,
    "--profile-border-gradient": borderGradient,
    "--profile-logo-gradient": LOGO_GRADIENT,
    "--profile-diagonal-logo-gradient": LOGO_GRADIENT.replace(
      "90deg",
      "135deg",
    ),
    "--profile-shadow": profileShadow,
    "--profile-soft-shadow": profileSoftShadow,
    "--profile-ring-shadow": profileRingShadow,
  } as CSSProperties;

  const handleBack = useMeasuredHandler("ui.profile.back", () => {
    startPageTransition("profile", "main");
    void navigate(APP_ROUTES.MAIN);
  });

  const handleSaveNickname = () => {
    const nextNickname = draftNickname.trim() || "아주멋진꼬마자동...";
    setNickname(nextNickname);
    setDraftNickname(nextNickname);
    setIsEditingNickname(false);
    localStorage.setItem(PROFILE_NAME_KEY, nextNickname);
  };

  const selectFilter = (option: CharacterOption) => {
    setSelectedFilter(option.id);
    setPage(1);
    setSearch("");
    setIsModalOpen(false);
  };

  return (
    <main
      className={styles.profilePage}
      style={profileStyle}
      aria-label="프로필 화면"
    >
      <div className={styles.shell}>
        <header className={styles.topBar}>
          <button
            type="button"
            className={styles.backButton}
            onClick={handleBack}
          >
            ← 뒤로 가기
          </button>

          <div
            className={styles.favorite}
            aria-label="가장 많이 플레이한 캐릭터"
          >
            <span className={styles.favoriteBadge}>
              가장 많이 플레이한 캐릭터
            </span>
            <strong className={styles.favoriteName}>
              <span
                className={styles.characterDot}
                style={{ background: mostPlayedCharacter.color }}
                aria-hidden="true"
              />
              {mostPlayedCharacter.name}
            </strong>
          </div>
        </header>

        <section className={styles.summaryGrid}>
          <article className={styles.profileCard} aria-label="프로필 영역">
            <div className={styles.profileAvatar} aria-hidden="true" />
            <div className={styles.nicknameRow}>
              <span className={styles.nicknameChip}>닉네임</span>
              {isEditingNickname ? (
                <input
                  className={styles.nicknameInput}
                  value={draftNickname}
                  maxLength={20}
                  autoFocus
                  onChange={(event) => setDraftNickname(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleSaveNickname();
                    }

                    if (event.key === "Escape") {
                      setDraftNickname(nickname);
                      setIsEditingNickname(false);
                    }
                  }}
                  aria-label="닉네임 입력"
                />
              ) : (
                <strong className={styles.nicknameText}>{nickname}</strong>
              )}
            </div>
            <button
              type="button"
              className={styles.smallButton}
              onClick={() => {
                if (isEditingNickname) {
                  handleSaveNickname();
                  return;
                }

                setDraftNickname(nickname);
                setIsEditingNickname(true);
              }}
            >
              {isEditingNickname ? "저장" : "변경"}
            </button>
          </article>

          <article className={styles.statsPanel} aria-label="총 통계">
            <div className={styles.selectorGroup}>
              <h1 className={styles.statsTitle}>총 통계</h1>
              <span className={styles.selectorLabel}>캐릭터 선택</span>
              <button
                type="button"
                className={styles.selectedCharacterButton}
                onClick={() => setIsModalOpen(true)}
              >
                <span
                  className={styles.compactCharacterDot}
                  aria-hidden="true"
                />
                {selectedOption.name}
              </button>
            </div>

            <div className={styles.statsList}>
              <div className={styles.statRow}>
                <span className={styles.statLabel}>플레이 수</span>
                <strong className={styles.statValue}>
                  {filteredRecords.length}회
                </strong>
              </div>
              <div className={styles.statRow}>
                <span className={styles.statLabel}>플레이시간</span>
                <strong className={styles.statValue}>
                  {formatDuration(totalPlayDuration)}
                </strong>
              </div>
              <div className={styles.statRow}>
                <span className={styles.statLabel}>최고 레벨/점수</span>
                <strong className={styles.statValue}>
                  Level {highestRecord?.level ?? 0} /{" "}
                  {highestRecord?.score ?? 0}점
                </strong>
              </div>
              <div className={styles.statRow}>
                <span className={styles.statLabel}>최단 게임 시간</span>
                <strong className={styles.statValue}>
                  {shortestRecord
                    ? formatDuration(shortestRecord.playDurationMs)
                    : "0m 0s"}
                </strong>
              </div>
              <div className={styles.statRow}>
                <span className={styles.statLabel}>최대 콤보</span>
                <strong className={styles.statValue}>{maxCombo}회</strong>
              </div>
              <div className={styles.skillRow}>
                <span className={styles.statLabel}>
                  스킬 사용 횟수
                  <p className={styles.skillHelp}>
                    {`스킬 이미지에 마우스 커서를\n올려서 확인하세요`}
                  </p>
                </span>
                <div className={styles.skillSlots}>
                  {SKILL_KEYS.map((skillKey) => (
                    <button
                      type="button"
                      key={skillKey}
                      className={styles.skillButton}
                      aria-label={`${skillKey} 스킬 사용 횟수 ${totalSkillUses[skillKey]}회`}
                    >
                      <span className={styles.skillIcon} aria-hidden="true" />
                      <span>{skillKey}</span>
                      <span className={styles.tooltip}>
                        {skillKey}: {totalSkillUses[skillKey]}회
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </article>
        </section>

        <h2 className={styles.sectionTitle}>게임 기록</h2>
        <section className={styles.recordGrid} aria-label="게임 기록 목록">
          {pagedRecords.map((record) => (
            <RecordCard key={record.id} record={record} />
          ))}
        </section>

        <nav className={styles.pagination} aria-label="게임 기록 페이지네이션">
          <button
            type="button"
            className={styles.pageButton}
            disabled={currentPage === 1}
            onClick={() => setPage(1)}
            aria-label="첫 페이지"
          >
            «
          </button>
          <button
            type="button"
            className={styles.pageButton}
            disabled={currentPage === 1}
            onClick={() => setPage(Math.max(1, currentPage - PAGE_WINDOW_SIZE))}
            aria-label="이전 수십 페이지"
          >
            ‹
          </button>
          {pageNumbers.map((pageNumber) => (
            <button
              type="button"
              key={pageNumber}
              className={classNames(
                styles.pageButton,
                pageNumber === currentPage && styles.pageButtonActive,
              )}
              onClick={() => setPage(pageNumber)}
              aria-current={pageNumber === currentPage ? "page" : undefined}
            >
              {pageNumber}
            </button>
          ))}
          <button
            type="button"
            className={styles.pageButton}
            disabled={currentPage === totalPages}
            onClick={() =>
              setPage(Math.min(totalPages, currentPage + PAGE_WINDOW_SIZE))
            }
            aria-label="다음 수십 페이지"
          >
            ›
          </button>
          <button
            type="button"
            className={styles.pageButton}
            disabled={currentPage === totalPages}
            onClick={() => setPage(totalPages)}
            aria-label="마지막 페이지"
          >
            »
          </button>
        </nav>
      </div>

      {isModalOpen ? (
        <div
          className={styles.modalBackdrop}
          role="presentation"
          onMouseDown={() => setIsModalOpen(false)}
        >
          <section
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-label="캐릭터 선택 모달"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className={styles.modalClose}
              onClick={() => setIsModalOpen(false)}
              aria-label="캐릭터 선택 모달 닫기"
            >
              ×
            </button>
            <div className={styles.searchRow}>
              <input
                className={styles.searchInput}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="에밀리"
                aria-label="캐릭터 검색"
              />
              <button type="button" className={styles.smallButton}>
                검색
              </button>
            </div>
            <div className={styles.modalGridWrap}>
              {modalOptions.length > 0 ? (
                <div className={styles.modalGrid}>
                  {modalOptions.map((option) => (
                    <button
                      type="button"
                      key={option.id}
                      className={classNames(
                        styles.characterCard,
                        option.id === selectedFilter &&
                          styles.characterCardSelected,
                      )}
                      style={
                        {
                          "--character-accent": option.color,
                          "--character-fill": option.background ?? option.color,
                        } as CSSProperties
                      }
                      onClick={() => selectFilter(option)}
                      aria-pressed={option.id === selectedFilter}
                    >
                      <span
                        className={styles.characterFaceSmall}
                        aria-hidden="true"
                      />
                      <span>{option.name}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>검색 결과가 없습니다.</div>
              )}
            </div>
          </section>
        </div>
      ) : null}
    </main>
  );
}

function RecordCard({ record }: { record: GameRecord }) {
  const character = getCharacter(record.characterId);

  return (
    <article
      className={styles.recordCard}
      style={{ "--record-accent": character.color } as CSSProperties}
      aria-label={`${character.name} 게임 기록`}
    >
      <div className={styles.recordFace} aria-hidden="true" />
      <div className={styles.recordMain}>
        <div className={styles.recordScoreLine}>
          <span>Level {record.level}</span>
          <span className={styles.recordDivider} aria-hidden="true" />
          <span>{record.score}점</span>
        </div>
        <div className={styles.recordSkills}>
          {SKILL_KEYS.map((skillKey) => (
            <span key={skillKey} className={styles.recordSkill}>
              <span className={styles.recordSkillIcon} aria-hidden="true" />
              {skillKey}: {record.skillUses[skillKey]}회
            </span>
          ))}
        </div>
      </div>
      <div className={styles.recordMeta}>
        <div className={styles.metaRow}>
          <span className={styles.metaBadge}>플레이시간</span>
          <span>{formatDuration(record.playDurationMs)}</span>
        </div>
        <div className={styles.metaRow}>
          <span className={styles.metaBadge}>게임일자</span>
          <span>{formatRecordDate(record.startedAt)}</span>
        </div>
      </div>
    </article>
  );
}
