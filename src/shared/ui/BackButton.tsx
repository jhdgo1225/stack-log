import type { CSSProperties, ReactNode } from "react";

import { classNames } from "@/shared/lib/classNames";
import * as styles from "./BackButton.css";

type BackButtonProps = {
  onClick: () => void;
  label?: string;
  className?: string;
  style?: CSSProperties;
  icon?: ReactNode;
};

export function BackButton({
  onClick,
  label = "뒤로 가기",
  className,
  style,
  icon = "←",
}: BackButtonProps) {
  return (
    <button
      type="button"
      className={classNames(styles.backButton, className)}
      style={style}
      onClick={onClick}
    >
      <span aria-hidden="true">{icon}</span>
      {label}
    </button>
  );
}
