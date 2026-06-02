import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { GamePage } from "@/pages/game";
import { MainPage } from "@/pages/main";
import { ProfilePage } from "@/pages/profile";
import { ResultPage } from "@/pages/result";
import { APP_ROUTES } from "@/shared/config/routes";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={APP_ROUTES.MAIN} element={<MainPage />} />
        <Route path={APP_ROUTES.GAME} element={<GamePage />} />
        <Route path={APP_ROUTES.RESULT} element={<ResultPage />} />
        <Route path={APP_ROUTES.PROFILE} element={<ProfilePage />} />
        <Route path="*" element={<Navigate to={APP_ROUTES.MAIN} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
