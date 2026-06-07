import { useEffect, useMemo, useState } from "react";

import { getCharacterMainThemeSrc } from "@/entities/character";
import { usePageTransitionTrace } from "@/shared/lib/performance/usePageTransitionTrace";
import { usePerformanceTrace } from "@/shared/lib/performance/usePerformanceTrace";
import { MainMenu } from "@/widgets/mainMenu/ui/MainMenu";
import * as styles from "./MainPage.css";

type Scene = {
  id: "may" | "bron" | "aria";
  name: string;
  image: string;
  imagePosition: string;
};

const SCENE_DURATION_MS = 7000;

const scenes: Scene[] = [
  {
    id: "may",
    name: "MAY",
    image: getCharacterMainThemeSrc("may"),
    imagePosition: "42% 62%",
  },
  {
    id: "bron",
    name: "BRON",
    image: getCharacterMainThemeSrc("bron"),
    imagePosition: "44% 58%",
  },
  {
    id: "aria",
    name: "ARIA",
    image: getCharacterMainThemeSrc("aria"),
    imagePosition: "46% 58%",
  },
];

export function MainPage() {
  usePerformanceTrace("page.main");
  usePageTransitionTrace("main");

  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);

  const activeScene = scenes[activeIndex];
  const animationKey = useMemo(
    () => `${activeScene.id}-${activeIndex}`,
    [activeIndex, activeScene.id],
  );

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setActiveIndex((currentIndex) => {
        setPrevIndex(currentIndex);
        return (currentIndex + 1) % scenes.length;
      });
    }, SCENE_DURATION_MS);

    return () => {
      window.clearInterval(timerId);
    };
  }, []);

  useEffect(() => {
    if (prevIndex === null) {
      return undefined;
    }

    const timerId = window.setTimeout(() => {
      setPrevIndex((currentPrevIndex) =>
        currentPrevIndex === prevIndex ? null : currentPrevIndex,
      );
    }, 1200);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [prevIndex]);

  return (
    <main className={styles.mainPage} aria-label="메인 화면">
      <div className={styles.sceneLayer} aria-hidden="true">
        {scenes.map((scene, index) => {
          const isActive = index === activeIndex;
          const isPrev = index === prevIndex;

          return (
            <div
              key={scene.id}
              className={styles.scene}
              data-active={isActive}
              data-leaving={isPrev}
              aria-hidden={!isActive}
            >
              <div
                className={styles.sceneBackdrop}
                style={{
                  backgroundImage: `url(${scene.image})`,
                  backgroundPosition: scene.imagePosition,
                }}
                aria-hidden="true"
              />
              <img
                className={styles.sceneImage}
                src={scene.image}
                alt={`${scene.name} 메인 테마 배경`}
                draggable={false}
                style={{ objectPosition: scene.imagePosition }}
              />
            </div>
          );
        })}
      </div>

      <div className={styles.darkOverlay} aria-hidden="true" />
      <div className={styles.lightOverlay} aria-hidden="true" />
      <div
        key={`sweep-${animationKey}`}
        className={styles.sweepLight}
        aria-hidden="true"
      />

      <section className={styles.content}>
        <MainMenu />
      </section>

      <div
        className={styles.progressContent}
        key={`content-${animationKey}`}
        aria-hidden="true"
      >
        <div className={styles.progressTrack}>
          <div
            key={`progress-${animationKey}`}
            className={styles.progressBar}
          />
        </div>
      </div>
    </main>
  );
}
