import { Suspense } from "react";

import { AppRouter } from "./routes/AppRouter";

import { usePerformanceTelemetry } from "@/shared/lib/performance/usePerformanceTelemetry";
import { LoadingScreen } from "@/shared/ui/LoadingScreen";

export const App = () => (
  <>
    <TelemetryBoundary />
    <Suspense fallback={<LoadingScreen />}>
      <AppRouter />
    </Suspense>
    {/* {import.meta.env.DEV ? <PerformancePanel /> : null} */}
  </>
);

const TelemetryBoundary = () => {
  usePerformanceTelemetry();

  return null;
};

export default App;
