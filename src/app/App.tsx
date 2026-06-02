import { Suspense } from "react";

import { AppRouter } from "./routes/AppRouter";

import { LoadingScreen } from "@/shared/ui/LoadingScreen";

export const App = () => (
  <Suspense fallback={<LoadingScreen />}>
    <AppRouter />
  </Suspense>
);

export default App;
