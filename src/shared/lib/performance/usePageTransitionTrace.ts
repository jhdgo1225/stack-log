import { useEffect } from "react";

import { completePageTransition } from "./performanceTelemetry";

export const usePageTransitionTrace = (pageKey: string) => {
  useEffect(() => {
    completePageTransition(pageKey);
  }, [pageKey]);
};
