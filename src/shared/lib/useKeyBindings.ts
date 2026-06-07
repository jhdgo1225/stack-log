import { useEffect, useRef } from "react";

import { trackPerformanceSync } from "./performance/performanceTelemetry";

export type KeyBindingMap = Record<string, (event: KeyboardEvent) => void>;

export const useKeyBindings = (bindings: KeyBindingMap, isEnabled = true) => {
  const bindingsRef = useRef(bindings);

  useEffect(() => {
    bindingsRef.current = bindings;
  }, [bindings]);

  useEffect(() => {
    if (!isEnabled) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const tagName = target?.tagName;

      if (
        tagName === "INPUT" ||
        tagName === "TEXTAREA" ||
        tagName === "SELECT"
      ) {
        return;
      }

      const action =
        bindingsRef.current[event.code] ?? bindingsRef.current[event.key];

      if (!action) {
        return;
      }

      event.preventDefault();
      trackPerformanceSync(`key:${event.code || event.key}`, () => action(event));
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isEnabled]);
};
