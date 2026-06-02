import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { APP_ROUTES } from "@/shared/config/routes";
import { MainPage } from "@/pages/main";
import { GamePage } from "@/pages/game";
import { ResultPage } from "@/pages/result";

function ProfileFallbackPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#f8f8ff",
        color: "#222",
        fontSize: "24px",
        fontWeight: 700,
      }}>
      프로필 화면은 다음 단계에서 구현 예정입니다.
    </main>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={APP_ROUTES.MAIN} element={<MainPage />} />
        <Route path={APP_ROUTES.GAME} element={<GamePage />} />
        <Route path={APP_ROUTES.RESULT} element={<ResultPage />} />
        <Route path={APP_ROUTES.PROFILE} element={<ProfileFallbackPage />} />
        <Route path="*" element={<Navigate to={APP_ROUTES.MAIN} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
