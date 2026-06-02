import { useEffect, useState } from "react";

import {
  getPerformanceSnapshot,
  startPerformanceTelemetry,
  subscribeToPerformanceTelemetry,
} from "./performanceTelemetry";

export const usePerformanceTelemetry = () => {
  useEffect(() => {
    startPerformanceTelemetry();
  }, []);
};

export const usePerformanceSnapshot = () => {
  const [snapshot, setSnapshot] = useState(() => getPerformanceSnapshot());

  useEffect(() => {
    startPerformanceTelemetry();
    setSnapshot(getPerformanceSnapshot());

    return subscribeToPerformanceTelemetry(() => {
      setSnapshot(getPerformanceSnapshot());
    });
  }, []);

  return snapshot;
};
