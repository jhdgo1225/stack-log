import { usePerformanceTrace } from "@/shared/lib/performance/usePerformanceTrace";
import * as styles from "./LoadingScreen.css";

export function LoadingScreen() {
  usePerformanceTrace("ui.loadingScreen");

  return (
    <section className={styles.splashScreen} aria-label="스플래시 화면">
      <img
        className={styles.logo}
        src="/assets/main/stack-log-logo.png"
        alt="Stack Log"
        draggable={false}
      />
    </section>
  );
}
