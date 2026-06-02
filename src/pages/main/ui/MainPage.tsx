import { useEffect, useState } from "react";
import { LoadingScreen } from "@/shared/ui/LoadingScreen";
import { MainMenu } from "@/widgets/mainMenu/ui/MainMenu";
import * as styles from "./MainPage.css";

const SPLASH_DURATION_MS = 2000;

export function MainPage() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setIsSplashVisible(false);
    }, SPLASH_DURATION_MS);

    return () => {
      window.clearTimeout(timerId);
    };
  }, []);

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
