import { useEffect, useRef, useState } from "react";

import {
  getCharacterMainThemeSrc,
} from "@/entities/character";
import {
  completePageTransition,
  setLcpExclusionDuration,
} from "@/shared/lib/performance/performanceTelemetry";
import { usePerformanceTrace } from "@/shared/lib/performance/usePerformanceTrace";
import { LoadingScreen } from "@/shared/ui/LoadingScreen";
import { MainMenu } from "@/widgets/mainMenu/ui/MainMenu";
import * as styles from "./MainPage.css";

const SPLASH_DURATION_MS = 2000;
const MAIN_THEME_SEQUENCE = ["may", "bron", "aria"] as const;
const MAIN_THEME_TRANSITION_MS = 650;
const MIN_THEME_HOLD_MS = 5000;
const MAX_THEME_HOLD_MS = 7000;

const getRandomHoldDuration = () =>
  MIN_THEME_HOLD_MS +
  Math.floor(Math.random() * (MAX_THEME_HOLD_MS - MIN_THEME_HOLD_MS + 1));

export function MainPage() {
  usePerformanceTrace("page.main");
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const [themeIndex, setThemeIndex] = useState(0);
  const [nextThemeIndex, setNextThemeIndex] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const splashStartedAtRef = useRef(performance.now());
  const holdTimerRef = useRef<number | null>(null);
  const transitionTimerRef = useRef<number | null>(null);

  const currentThemeId = MAIN_THEME_SEQUENCE[themeIndex];
  const incomingThemeId =
    nextThemeIndex !== null ? MAIN_THEME_SEQUENCE[nextThemeIndex] : null;

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setIsSplashVisible(false);
    }, SPLASH_DURATION_MS);

    return () => {
      window.clearTimeout(timerId);
    };
  }, []);

  useEffect(() => {
    if (isSplashVisible) {
      return undefined;
    }

    const scheduleNextTheme = () => {
      holdTimerRef.current = window.setTimeout(() => {
        holdTimerRef.current = null;
        const nextIndex = (themeIndex + 1) % MAIN_THEME_SEQUENCE.length;
        setNextThemeIndex(nextIndex);
        setIsTransitioning(true);

        transitionTimerRef.current = window.setTimeout(() => {
          transitionTimerRef.current = null;
          setThemeIndex(nextIndex);
          setNextThemeIndex(null);
          setIsTransitioning(false);
        }, MAIN_THEME_TRANSITION_MS);
      }, getRandomHoldDuration());
    };

    scheduleNextTheme();

    return () => {
      if (holdTimerRef.current !== null) {
        window.clearTimeout(holdTimerRef.current);
        holdTimerRef.current = null;
      }

      if (transitionTimerRef.current !== null) {
        window.clearTimeout(transitionTimerRef.current);
        transitionTimerRef.current = null;
      }
    };
  }, [isSplashVisible, themeIndex]);

  useEffect(() => {
    if (isSplashVisible) {
      return;
    }

    const splashDurationMs = performance.now() - splashStartedAtRef.current;
    setLcpExclusionDuration(splashDurationMs);
    completePageTransition("main");
  }, [isSplashVisible]);

  if (isSplashVisible) {
    return <LoadingScreen />;
  }

  return (
    <main className={styles.mainPage} aria-label="메인 화면">
      <div className={styles.background} aria-hidden="true" />
      <div className={styles.backgroundLayerGroup} aria-hidden="true">
        <div
          className={styles.backgroundLayer}
          style={{
            backgroundImage: `url(${getCharacterMainThemeSrc(currentThemeId)})`,
          }}
          data-visible={!isTransitioning}
        />
        {incomingThemeId ? (
          <div
            className={styles.backgroundLayer}
            style={{
              backgroundImage: `url(${getCharacterMainThemeSrc(incomingThemeId)})`,
            }}
            data-visible={isTransitioning}
          />
        ) : null}
        <div className={styles.backgroundOverlay} />
      </div>

      <section className={styles.content}>
        <MainMenu />
      </section>
    </main>
  );
}
