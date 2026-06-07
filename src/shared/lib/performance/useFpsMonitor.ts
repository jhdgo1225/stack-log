import { useEffect, useRef } from "react";

import {
  markPerformanceSample,
  recordPerformanceMetric,
} from "./performanceTelemetry";

type UseFpsMonitorOptions = {
  label?: string;
};

export const useFpsMonitor = (
  isEnabled: boolean,
  options: UseFpsMonitorOptions = {},
) => {
  const label = options.label ?? "gameplay";
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(0);
  const minFpsRef = useRef(Number.POSITIVE_INFINITY);

  useEffect(() => {
    if (!isEnabled) {
      return undefined;
    }

    let frameId = 0;
    let alive = true;
    let windowStart = performance.now();

    const sample = (time: number) => {
      if (!alive) {
        return;
      }

      if (lastTimeRef.current === 0) {
        lastTimeRef.current = time;
      }

      frameCountRef.current += 1;
      const elapsed = time - windowStart;

      if (elapsed >= 1000) {
        const fps = (frameCountRef.current * 1000) / elapsed;
        minFpsRef.current = Math.min(minFpsRef.current, fps);

        recordPerformanceMetric(`fps.${label}.average`, fps, "latest");
        recordPerformanceMetric(`fps.${label}.min`, minFpsRef.current, "latest");
        markPerformanceSample(`fps.${label}`, fps, "fps");

        if (fps < 50) {
          markPerformanceSample(`fps-drop.${label}`, fps, "fps", "below target");
        }

        frameCountRef.current = 0;
        windowStart = time;
      }

      frameId = window.requestAnimationFrame(sample);
    };

    frameId = window.requestAnimationFrame(sample);

    return () => {
      alive = false;
      window.cancelAnimationFrame(frameId);

      const elapsed = performance.now() - windowStart;
      if (elapsed > 0 && frameCountRef.current > 0) {
        const fps = (frameCountRef.current * 1000) / elapsed;
        recordPerformanceMetric(`fps.${label}.average`, fps, "latest");
        minFpsRef.current = Math.min(minFpsRef.current, fps);
        recordPerformanceMetric(`fps.${label}.min`, minFpsRef.current, "latest");
      }
    };
  }, [isEnabled, label]);
};
