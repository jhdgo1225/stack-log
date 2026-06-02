import { useEffect, useRef } from "react";

import { trackPerformanceSync } from "./performanceTelemetry";

type AnyHandler<TArgs extends unknown[] = unknown[], TResult = void> = (
  ...args: TArgs
) => TResult;

export const useMeasuredHandler = <
  TArgs extends unknown[] = unknown[],
  TResult = void,
>(
  label: string,
  handler: AnyHandler<TArgs, TResult>,
) => {
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  return (...args: TArgs) =>
    trackPerformanceSync(label, () => handlerRef.current(...args));
};
