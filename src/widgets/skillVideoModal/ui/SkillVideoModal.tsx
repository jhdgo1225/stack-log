import type { CSSProperties } from "react";
import { useEffect } from "react";

import type { Character, CharacterSkill } from "@/entities/character";

import * as styles from "./SkillVideoModal.css";

type SkillVideoModalProps = {
  isOpen: boolean;
  character: Character | null;
  skill: CharacterSkill | null;
  onClose: () => void;
};

export function SkillVideoModal({
  isOpen,
  character,
  skill,
  onClose,
}: SkillVideoModalProps) {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !character || !skill) {
    return null;
  }

  const video = skill.video;
  const accentStyle = {
    "--skill-video-accent": character.color,
  } as CSSProperties;

  return (
    <div className={styles.overlay} role="presentation" onMouseDown={onClose}>
      <section
        className={styles.modal}
        style={accentStyle}
        role="dialog"
        aria-modal="true"
        aria-label={`${character.name} ${skill.name} 설명 영상`}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="스킬 설명 영상 닫기"
        >
          ×
        </button>

        <header className={styles.header}>
          <span className={styles.eyebrow}>{character.name} 스킬 설명</span>
          <h2 className={styles.title}>{skill.name}</h2>
          <p className={styles.description}>
            {video?.description ?? skill.description}
          </p>
        </header>

        <div className={styles.frame}>
          {video?.src ? (
            <video
              className={styles.video}
              src={video.src}
              poster={video.posterSrc}
              controls
              playsInline
              preload="metadata"
            />
          ) : (
            <div className={styles.placeholder}>
              <div className={styles.placeholderInner}>
                <span className={styles.placeholderBadge}>
                  VIDEO READY SLOT
                </span>
                <strong className={styles.placeholderTitle}>
                  녹화한 스킬 설명 영상을 여기에 연결할 수 있습니다.
                </strong>
                <p className={styles.placeholderDescription}>
                  나중에 `skill.video.src`에 파일 경로만 넣으면 이 자리에서 바로
                  재생됩니다.
                </p>
              </div>
            </div>
          )}
        </div>

        <footer className={styles.footer}>
          <p className={styles.helperText}>
            {video?.src
              ? "영상 컨트롤로 재생, 일시정지, 탐색이 가능합니다."
              : "현재는 영상 슬롯만 준비되어 있습니다."}
          </p>
          <button
            type="button"
            className={styles.footerCloseButton}
            onClick={onClose}
          >
            닫기
          </button>
        </footer>
      </section>
    </div>
  );
}
