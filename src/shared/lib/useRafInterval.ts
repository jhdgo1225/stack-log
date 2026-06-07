import { useEffect, useRef } from "react";

export const useRafInterval = (
  callback: () => void,
  delayMs: number | null,
  isRunning: boolean,
) => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!isRunning || delayMs === null) {
      return undefined;
    }

    let frameId = 0;
    let lastTime = performance.now();

    const loop = (time: number) => {
      const delta = time - lastTime;

      if (delta >= delayMs) {
        lastTime = time;
        callbackRef.current();
      }

      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(frameId);
  }, [delayMs, isRunning]);
};
