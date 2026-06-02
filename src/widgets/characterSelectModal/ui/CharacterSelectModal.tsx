import type { CSSProperties, ReactNode } from "react";

import * as styles from "./CharacterSelectModal.css";

type CharacterSelectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  searchButtonLabel?: string;
  emptyText?: string;
  children: ReactNode;
  hasResults: boolean;
  style?: CSSProperties;
};

export function CharacterSelectModal({
  isOpen,
  onClose,
  searchValue,
  onSearchChange,
  searchPlaceholder = "캐릭터 이름",
  searchButtonLabel = "검색",
  emptyText = "검색 결과가 없습니다.",
  children,
  hasResults,
  style,
}: CharacterSelectModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={styles.modalOverlay}
      role="presentation"
      onMouseDown={onClose}
    >
      <section
        className={styles.modal}
        style={style}
        role="dialog"
        aria-modal="true"
        aria-label="캐릭터 선택 모달"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className={styles.modalSearchRow}>
          <input
            className={styles.searchInput}
            type="search"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={searchPlaceholder}
            aria-label="캐릭터 검색"
          />
          <button type="button" className={styles.searchButton}>
            {searchButtonLabel}
          </button>
        </div>
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="캐릭터 선택 모달 닫기"
        >
          ×
        </button>
        <div className={styles.modalGridWrap}>
          {hasResults ? children : (
            <div className={styles.emptyState}>{emptyText}</div>
          )}
        </div>
      </section>
    </div>
  );
}
