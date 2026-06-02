import { useEffect, useRef } from "react";

import { markPerformanceComponent } from "./performanceTelemetry";

type TraceOptions = {
  meta?: Record<string, string | number | boolean | null | undefined>;
};

export const usePerformanceTrace = (label: string, options: TraceOptions = {}) => {
  const startedAtRef = useRef(performance.now());
  startedAtRef.current = performance.now();

  useEffect(() => {
    markPerformanceComponent(label, startedAtRef.current, options.meta);
  });
};
