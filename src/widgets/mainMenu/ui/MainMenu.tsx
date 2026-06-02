import { useNavigate } from "react-router-dom";
import { APP_ROUTES } from "@/shared/config/routes";
import * as styles from "./MainMenu.css";

export function MainMenu() {
  const navigate = useNavigate();

  const handleGameStart = () => {
    navigate(APP_ROUTES.GAME);
  };

  const handleProfile = () => {
    navigate(APP_ROUTES.PROFILE);
  };

  return (
    <nav className={styles.mainMenu} aria-label="메인 메뉴">
      <button
        type="button"
        className={styles.button}
        onClick={handleGameStart}
        aria-label="게임 시작">
        <img
          className={styles.buttonImage}
          src="/assets/main/game-start-btn.png"
          alt=""
          draggable={false}
        />
      </button>

      <button
        type="button"
        className={styles.button}
        onClick={handleProfile}
        aria-label="프로필">
        <img
          className={styles.buttonImage}
          src="/assets/main/profile-btn.png"
          alt=""
          draggable={false}
        />
      </button>
    </nav>
  );
}
