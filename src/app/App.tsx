import { Suspense, useEffect, useRef, useState } from "react";

import { AppRouter } from "./routes/AppRouter";

import { getCharacterMainThemeSrc } from "@/entities/character";
import {
  setLcpExclusionDuration,
} from "@/shared/lib/performance/performanceTelemetry";
import { usePerformanceTelemetry } from "@/shared/lib/performance/usePerformanceTelemetry";
import { LoadingScreen } from "@/shared/ui/LoadingScreen";

export const App = () => {
  usePerformanceTelemetry();
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const [isSplashFinished, setIsSplashFinished] = useState(false);
  const [isInitialThemeReady, setIsInitialThemeReady] = useState(false);
  const [isInitialThemePainted, setIsInitialThemePainted] = useState(false);
  const splashStartedAtRef = useRef(performance.now());

  useEffect(() => {
    splashStartedAtRef.current = performance.now();
  }, []);

  useEffect(() => {
    const themeImage = new Image();
    const handleReady = () => {
      setIsInitialThemeReady(true);
    };

    themeImage.addEventListener("load", handleReady, { once: true });
    themeImage.addEventListener("error", handleReady, { once: true });
    themeImage.src = getCharacterMainThemeSrc("may");

    if (themeImage.complete) {
      handleReady();
    }

    return () => {
      themeImage.removeEventListener("load", handleReady);
      themeImage.removeEventListener("error", handleReady);
    };
  }, []);

  useEffect(() => {
    if (!isInitialThemeReady) {
      return;
    }

    let firstFrameId = 0;
    let secondFrameId = 0;

    firstFrameId = window.requestAnimationFrame(() => {
      secondFrameId = window.requestAnimationFrame(() => {
        setIsInitialThemePainted(true);
      });
    });

    return () => {
      window.cancelAnimationFrame(firstFrameId);
      window.cancelAnimationFrame(secondFrameId);
    };
  }, [isInitialThemeReady]);

  useEffect(() => {
    if (!isSplashVisible || !isSplashFinished || !isInitialThemeReady) {
      return;
    }

    setIsSplashVisible(false);
    setLcpExclusionDuration(performance.now() - splashStartedAtRef.current);
  }, [
    isInitialThemePainted,
    isInitialThemeReady,
    isSplashFinished,
    isSplashVisible,
  ]);

  return (
    <>
      {isSplashVisible ? (
        <LoadingScreen onFinish={() => setIsSplashFinished(true)} />
      ) : (
        <Suspense fallback={<LoadingScreen />}>
          <AppRouter />
        </Suspense>
      )}

      {/* {import.meta.env.DEV ? <PerformancePanel /> : null} */}
    </>
  );
};

export default App;
