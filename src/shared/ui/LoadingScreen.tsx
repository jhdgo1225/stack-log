import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";

import { usePerformanceTrace } from "@/shared/lib/performance/usePerformanceTrace";
import * as styles from "./LoadingScreen.css";

type Sparkle = {
  id: number;
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
};

type LoadingScreenProps = {
  onFinish?: () => void;
};

const SPLASH_CLOSE_START_MS = 2500;
const SPLASH_FINISH_MS = 3200;
const SPARKLE_COUNT = 80;

export function LoadingScreen({ onFinish }: LoadingScreenProps) {
  usePerformanceTrace("ui.loadingScreen");

  const [isClosing, setIsClosing] = useState(false);

  const sparkles = useMemo<Sparkle[]>(
    () =>
      Array.from({ length: SPARKLE_COUNT }, (_, index) => ({
        id: index,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 2.5,
        duration: Math.random() * 2 + 1.5,
      })),
    [],
  );

  useEffect(() => {
    if (!onFinish) {
      return undefined;
    }

    const closeTimerId = window.setTimeout(() => {
      setIsClosing(true);
    }, SPLASH_CLOSE_START_MS);

    const finishTimerId = window.setTimeout(() => {
      onFinish();
    }, SPLASH_FINISH_MS);

    return () => {
      window.clearTimeout(closeTimerId);
      window.clearTimeout(finishTimerId);
    };
  }, [onFinish]);

  return (
    <section
      className={styles.splashScreen}
      data-closing={isClosing}
      aria-label="스플래시 화면">
      <div className={styles.backgroundGlow} aria-hidden="true" />

      <div className={styles.sparkles} aria-hidden="true">
        {sparkles.map((sparkle) => (
          <span
            key={sparkle.id}
            className={styles.sparkle}
            style={{
              left: `${sparkle.left}%`,
              top: `${sparkle.top}%`,
              width: `${sparkle.size}px`,
              height: `${sparkle.size}px`,
              "--sparkle-delay": `${sparkle.delay}s`,
              "--sparkle-duration": `${sparkle.duration}s`,
            } as CSSProperties}
          />
        ))}
      </div>

      <div className={styles.logoWrap}>
        <div className={styles.logoAura} aria-hidden="true" />

        <img
          className={styles.logo}
          src="/assets/main/stack-log-logo.png"
          alt="Stack Log"
          draggable={false}
        />

        <div className={styles.floorLight} aria-hidden="true" />

        <img
          className={styles.reflection}
          src="/assets/main/stack-log-logo.png"
          alt=""
          aria-hidden="true"
          draggable={false}
        />
      </div>
    </section>
  );
}
