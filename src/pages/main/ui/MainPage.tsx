import { useEffect, useRef, useState } from "react";

import {
  completePageTransition,
  setLcpExclusionDuration,
} from "@/shared/lib/performance/performanceTelemetry";
import { usePerformanceTrace } from "@/shared/lib/performance/usePerformanceTrace";
import { LoadingScreen } from "@/shared/ui/LoadingScreen";
import { MainMenu } from "@/widgets/mainMenu/ui/MainMenu";
import * as styles from "./MainPage.css";

const SPLASH_DURATION_MS = 2000;

export function MainPage() {
  usePerformanceTrace("page.main");
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const splashStartedAtRef = useRef(performance.now());

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

      <section className={styles.content}>
        <MainMenu />
      </section>
    </main>
  );
}
