type MetricUnit = "ms" | "fps" | "mb" | "count" | "ratio";

type MetricMode = "latest" | "max" | "min" | "sum";

export type PerformanceEntryKind =
  | "asset"
  | "component"
  | "interaction"
  | "transition"
  | "vital"
  | "sample";

export type PerformanceEntry = {
  id: string;
  kind: PerformanceEntryKind;
  label: string;
  value: number;
  unit: MetricUnit;
  timestamp: number;
  detail?: string;
  meta?: Record<string, string | number | boolean | null | undefined>;
};

export type PerformanceSnapshot = {
  sessionId: string;
  startedAt: number;
  updatedAt: number;
  metrics: Record<string, number>;
  entries: PerformanceEntry[];
  history: PerformanceSnapshot[];
};

type Listener = () => void;

type TrackOptions = {
  detail?: string;
  meta?: Record<string, string | number | boolean | null | undefined>;
  kind?: PerformanceEntryKind;
  unit?: MetricUnit;
  thresholdMs?: number;
};

type PageTransitionState = {
  from: string;
  to: string;
  startedAt: number;
};

const STORAGE_KEY = "daker-may-performance-telemetry";
const PAGE_TRANSITION_KEY = "daker-may-page-transition";
const MAX_ENTRIES = 120;
const MAX_HISTORY = 3;
const DEFAULT_THRESHOLD_MS = 50;
const COMPONENT_DUPLICATE_WINDOW_MS = 250;
const HISTORY_ENTRY_LIMIT = 40;

const now = () =>
  typeof performance !== "undefined" ? performance.now() : Date.now();

const createSessionId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `perf-${Math.random().toString(36).slice(2, 10)}-${Date.now()}`;
};

const isBrowser = typeof window !== "undefined";

const shouldLogEntry = (entry: PerformanceEntry) => {
  if (entry.kind === "sample") {
    return (
      entry.label === "cls" ||
      entry.label === "initial-load" ||
      entry.label.startsWith("first-") ||
      entry.label.startsWith("largest-contentful-paint") ||
      entry.label.startsWith("fps-drop") ||
      entry.value >= 100
    );
  }

  return entry.value >= 16;
};

const logSlowEntry = (entry: PerformanceEntry) => {
  if (!import.meta.env.DEV || !shouldLogEntry(entry)) {
    return;
  }

  const label = `[perf] ${entry.kind}:${entry.label}`;

  if (entry.detail) {
    console.info(label, `${entry.value.toFixed(1)}${entry.unit}`, entry.detail);
    return;
  }

  console.info(label, `${entry.value.toFixed(1)}${entry.unit}`);
};

const createEmptySnapshot = (): PerformanceSnapshot => ({
  sessionId: createSessionId(),
  startedAt: now(),
  updatedAt: now(),
  metrics: {},
  entries: [],
  history: [],
});

const safeReadSnapshot = (): PerformanceSnapshot | null => {
  if (!isBrowser) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<PerformanceSnapshot>;

    if (
      typeof parsed.sessionId !== "string" ||
      typeof parsed.startedAt !== "number" ||
      typeof parsed.updatedAt !== "number" ||
      typeof parsed.metrics !== "object" ||
      !Array.isArray(parsed.entries) ||
      !Array.isArray(parsed.history)
    ) {
      return null;
    }

    return {
      sessionId: parsed.sessionId,
      startedAt: parsed.startedAt,
      updatedAt: parsed.updatedAt,
      metrics: parsed.metrics as Record<string, number>,
      entries: parsed.entries as PerformanceEntry[],
      history: parsed.history as PerformanceSnapshot[],
    };
  } catch {
    return null;
  }
};

const safeWriteSnapshot = (snapshot: PerformanceSnapshot) => {
  if (!isBrowser) {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    // Ignore storage quota and serialization issues in dev telemetry.
  }
};

const safeReadPageTransition = (): PageTransitionState | null => {
  if (!isBrowser) {
    return null;
  }

  try {
    const raw = window.sessionStorage.getItem(PAGE_TRANSITION_KEY);

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<PageTransitionState>;

    if (
      typeof parsed.from !== "string" ||
      typeof parsed.to !== "string" ||
      typeof parsed.startedAt !== "number"
    ) {
      return null;
    }

    return {
      from: parsed.from,
      to: parsed.to,
      startedAt: parsed.startedAt,
    };
  } catch {
    return null;
  }
};

const safeWritePageTransition = (state: PageTransitionState | null) => {
  if (!isBrowser) {
    return;
  }

  try {
    if (state === null) {
      window.sessionStorage.removeItem(PAGE_TRANSITION_KEY);
      return;
    }

    window.sessionStorage.setItem(PAGE_TRANSITION_KEY, JSON.stringify(state));
  } catch {
    // Ignore session storage issues in telemetry.
  }
};

const summaryFromSnapshot = (snapshot: PerformanceSnapshot): PerformanceSnapshot => ({
  sessionId: snapshot.sessionId,
  startedAt: snapshot.startedAt,
  updatedAt: snapshot.updatedAt,
  metrics: snapshot.metrics,
  entries: snapshot.entries.slice(0, HISTORY_ENTRY_LIMIT),
  history: [],
});

const cloneSnapshot = (snapshot: PerformanceSnapshot): PerformanceSnapshot => ({
  sessionId: snapshot.sessionId,
  startedAt: snapshot.startedAt,
  updatedAt: snapshot.updatedAt,
  metrics: { ...snapshot.metrics },
  entries: snapshot.entries.slice(),
  history: snapshot.history.map((item) => ({
    sessionId: item.sessionId,
    startedAt: item.startedAt,
    updatedAt: item.updatedAt,
    metrics: { ...item.metrics },
    entries: item.entries.slice(),
    history: [],
  })),
});

class PerformanceTelemetryStore {
  private snapshot: PerformanceSnapshot;

  private listeners = new Set<Listener>();

  private persistTimer: number | null = null;

  private observersStarted = false;

  private trackId = 0;

  private lastComponentEntryAt = new Map<string, number>();

  private pendingPageTransition: PageTransitionState | null =
    safeReadPageTransition();

  private lcpExclusionMs = 0;

  constructor(initialSnapshot: PerformanceSnapshot) {
    this.snapshot = initialSnapshot;
  }

  subscribe = (listener: Listener) => {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  };

  getSnapshot = () => cloneSnapshot(this.snapshot);

  ensureStarted = () => {
    if (!isBrowser || this.observersStarted) {
      return;
    }

    this.observersStarted = true;
    this.observeNavigation();
    this.observePaint();
    this.observeLayoutShift();
    this.observeLargestContentfulPaint();
    this.observeEvents();
    this.observeResources();
    this.observeLongTasks();
    this.observeMemory();
    this.installLifecycleFlush();
  };

  recordMetric = (
    name: string,
    value: number,
    mode: MetricMode = "latest",
  ) => {
    const current = this.snapshot.metrics[name];

    if (mode === "max") {
      this.snapshot.metrics[name] = current === undefined ? value : Math.max(current, value);
    } else if (mode === "min") {
      this.snapshot.metrics[name] = current === undefined ? value : Math.min(current, value);
    } else if (mode === "sum") {
      this.snapshot.metrics[name] = (current ?? 0) + value;
    } else {
      this.snapshot.metrics[name] = value;
    }

    this.touch();
  };

  recordEntry = (entry: Omit<PerformanceEntry, "id" | "timestamp">) => {
    const fullEntry: PerformanceEntry = {
      ...entry,
      id: `${entry.kind}-${++this.trackId}`,
      timestamp: now(),
    };

    this.snapshot.entries = [...this.snapshot.entries, fullEntry].slice(-MAX_ENTRIES);
    this.snapshot.updatedAt = fullEntry.timestamp;
    this.pruneMetrics(fullEntry);
    logSlowEntry(fullEntry);
    this.touch();
  };

  trackSync = <T>(
    label: string,
    callback: () => T,
    options: TrackOptions = {},
  ): T => {
    const startedAt = now();
    const result = callback();
    const duration = now() - startedAt;
    const kind = options.kind ?? "interaction";
    const thresholdMs = options.thresholdMs ?? DEFAULT_THRESHOLD_MS;

    if (kind === "interaction" || duration >= thresholdMs) {
      this.recordEntry({
        kind,
        label,
        value: duration,
        unit: options.unit ?? "ms",
        detail: options.detail,
        meta: options.meta,
      });
    }

    return result;
  };

  markComponent = (
    label: string,
    startedAt: number,
    meta?: Record<string, string | number | boolean | null | undefined>,
  ) => {
    const duration = now() - startedAt;
    const lastRecordedAt = this.lastComponentEntryAt.get(label) ?? 0;

    if (now() - lastRecordedAt < COMPONENT_DUPLICATE_WINDOW_MS) {
      return;
    }

    this.lastComponentEntryAt.set(label, now());
    this.recordEntry({
      kind: "component",
      label,
      value: duration,
      unit: "ms",
      meta,
    });
    this.recordMetric(`component.${label}`, duration, "max");
  };

  markAsset = (
    label: string,
    duration: number,
    detail?: string,
    meta?: Record<string, string | number | boolean | null | undefined>,
  ) => {
    this.recordEntry({
      kind: "asset",
      label,
      value: duration,
      unit: "ms",
      detail,
      meta,
    });
    this.recordMetric("asset.slowestMs", duration, "max");
  };

  markInteraction = (
    label: string,
    duration: number,
    detail?: string,
    meta?: Record<string, string | number | boolean | null | undefined>,
  ) => {
    this.recordEntry({
      kind: "interaction",
      label,
      value: duration,
      unit: "ms",
      detail,
      meta,
    });
    this.recordMetric("interaction.slowestMs", duration, "max");
  };

  markSample = (
    label: string,
    value: number,
    unit: MetricUnit,
    detail?: string,
    meta?: Record<string, string | number | boolean | null | undefined>,
  ) => {
    this.recordEntry({
      kind: "sample",
      label,
      value,
      unit,
      detail,
      meta,
    });
  };

  setLcpExclusionDuration = (durationMs: number) => {
    this.lcpExclusionMs = Math.max(0, durationMs);
    this.recordMetric("paint.lcpExclusionMs", this.lcpExclusionMs, "latest");
    this.recomputeAdjustedLcp();
  };

  startPageTransition = (from: string, to: string) => {
    const state = {
      from,
      to,
      startedAt: now(),
    };

    this.pendingPageTransition = state;
    safeWritePageTransition(state);
  };

  completePageTransition = (to: string) => {
    const state = this.pendingPageTransition ?? safeReadPageTransition();

    if (!state || state.to !== to) {
      return null;
    }

    this.pendingPageTransition = null;
    safeWritePageTransition(null);

    const duration = now() - state.startedAt;
    const label = `${state.from} -> ${state.to}`;
    const metricKey = `transition.${state.from}.${state.to}Ms`;

    this.recordEntry({
      kind: "transition",
      label,
      value: duration,
      unit: "ms",
      detail: "page transition",
      meta: {
        from: state.from,
        to: state.to,
      },
    });
    this.recordMetric(metricKey, duration, "latest");
    this.recordMetric("transition.slowestMs", duration, "max");

    return duration;
  };

  private touch = () => {
    this.snapshot.updatedAt = now();
    this.schedulePersist();
    this.listeners.forEach((listener) => listener());
  };

  private schedulePersist = () => {
    if (!isBrowser) {
      return;
    }

    if (this.persistTimer !== null) {
      return;
    }

    this.persistTimer = window.setTimeout(() => {
      this.persistTimer = null;
      safeWriteSnapshot({
        ...this.snapshot,
        history: this.snapshot.history.slice(-MAX_HISTORY),
      });
    }, 300);
  };

  private pruneMetrics = (entry: PerformanceEntry) => {
    const { kind, label, value } = entry;

    if (kind === "component") {
      this.snapshot.metrics["component.slowestMs"] = Math.max(
        this.snapshot.metrics["component.slowestMs"] ?? 0,
        value,
      );
    }

    if (kind === "asset") {
      this.snapshot.metrics["asset.slowestMs"] = Math.max(
        this.snapshot.metrics["asset.slowestMs"] ?? 0,
        value,
      );
    }

    if (kind === "interaction") {
      this.snapshot.metrics["interaction.slowestMs"] = Math.max(
        this.snapshot.metrics["interaction.slowestMs"] ?? 0,
        value,
      );
    }

    if (label === "cls") {
      this.snapshot.metrics.cls = value;
    }
  };

  private recomputeAdjustedLcp = () => {
    const rawLcp = this.snapshot.metrics["paint.lcpMs"];

    if (typeof rawLcp !== "number") {
      return;
    }

    this.snapshot.metrics["paint.lcpAdjustedMs"] = Math.max(
      0,
      rawLcp - this.lcpExclusionMs,
    );
  };

  private observeNavigation = () => {
    const navigation = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;

    if (!navigation) {
      return;
    }

    const updateNavigationMetrics = () => {
      const nextNavigation =
        (performance.getEntriesByType("navigation")[0] as
          | PerformanceNavigationTiming
          | undefined) ?? navigation;

      this.recordMetric(
        "navigation.domContentLoadedMs",
        nextNavigation.domContentLoadedEventEnd - nextNavigation.startTime,
      );
      this.recordMetric(
        "navigation.loadMs",
        nextNavigation.loadEventEnd - nextNavigation.startTime,
      );
      this.recordMetric(
        "navigation.responseMs",
        nextNavigation.responseEnd - nextNavigation.startTime,
      );

      if (nextNavigation.loadEventEnd > 0) {
        this.markSample(
          "initial-load",
          nextNavigation.loadEventEnd - nextNavigation.startTime,
          "ms",
          "Navigation timing loadEventEnd - startTime",
        );
      }
    };

    updateNavigationMetrics();

    if (navigation.loadEventEnd === 0) {
      window.addEventListener("load", updateNavigationMetrics, { once: true });
    }
  };

  private observePaint = () => {
    if (typeof PerformanceObserver === "undefined") {
      return;
    }

    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.name === "first-paint") {
            this.recordMetric("paint.firstPaintMs", entry.startTime);
            this.markSample("first-paint", entry.startTime, "ms");
          }

          if (entry.name === "first-contentful-paint") {
            this.recordMetric("paint.fcpMs", entry.startTime);
            this.markSample("first-contentful-paint", entry.startTime, "ms");
          }
        });
      });

      observer.observe({ type: "paint", buffered: true });
    } catch {
      // Ignore unsupported observer types.
    }
  };

  private observeLargestContentfulPaint = () => {
    if (typeof PerformanceObserver === "undefined") {
      return;
    }

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries() as PerformanceEntryList;
        const lastEntry = entries[entries.length - 1] as unknown as {
          startTime: number;
          size?: number;
          element?: Element;
        } | null;

        if (!lastEntry) {
          return;
        }

        this.recordMetric("paint.lcpMs", lastEntry.startTime, "max");
        this.recomputeAdjustedLcp();
        this.markSample("largest-contentful-paint", lastEntry.startTime, "ms");
      });

      observer.observe({ type: "largest-contentful-paint", buffered: true });
    } catch {
      // Ignore unsupported observer types.
    }
  };

  private observeLayoutShift = () => {
    if (typeof PerformanceObserver === "undefined") {
      return;
    }

    let cumulativeLayoutShift = this.snapshot.metrics["vitals.cls"] ?? 0;

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as unknown as Array<{
          value: number;
          hadRecentInput: boolean;
        }>) {
          if (entry.hadRecentInput) {
            continue;
          }

          cumulativeLayoutShift += entry.value;
          this.recordMetric("vitals.cls", cumulativeLayoutShift, "latest");
          this.markSample("cls", cumulativeLayoutShift, "ratio");
        }
      });

      observer.observe({ type: "layout-shift", buffered: true });
    } catch {
      // Ignore unsupported observer types.
    }
  };

  private observeEvents = () => {
    if (typeof PerformanceObserver === "undefined") {
      return;
    }

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as unknown as Array<{
          name: string;
          duration: number;
          processingStart: number;
          startTime: number;
          interactionId?: number;
        }>) {
          if (!entry.interactionId) {
            continue;
          }

          const inputDelay = entry.processingStart - entry.startTime;
          this.recordMetric("vitals.inpMs", entry.duration, "max");
          this.recordMetric("vitals.inputDelayMs", inputDelay, "max");
          this.markInteraction(
            entry.name,
            entry.duration,
            `inputDelay=${inputDelay.toFixed(1)}ms`,
          );
        }
      });

      observer.observe({
        type: "event",
        buffered: true,
        durationThreshold: 16,
      } as PerformanceObserverInit);
    } catch {
      // Ignore unsupported observer types.
    }
  };

  private observeResources = () => {
    if (typeof PerformanceObserver === "undefined") {
      return;
    }

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as unknown as Array<{
          name: string;
          duration: number;
          initiatorType?: string;
          transferSize?: number;
        }>) {
          const duration = entry.duration;
          const type = entry.initiatorType ?? "resource";
          const label = `${type}:${this.shortenResourceName(entry.name)}`;
          const threshold = type === "img" || type === "font" ? 80 : 120;

          if (duration < threshold) {
            continue;
          }

          const sizeKb =
            typeof entry.transferSize === "number"
              ? `${(entry.transferSize / 1024).toFixed(1)}kb`
              : undefined;

          this.markAsset(label, duration, sizeKb, {
            initiatorType: type,
            transferSize: entry.transferSize ?? null,
            url: entry.name,
          });
        }
      });

      observer.observe({ type: "resource", buffered: true });
    } catch {
      // Ignore unsupported observer types.
    }
  };

  private observeLongTasks = () => {
    if (typeof PerformanceObserver === "undefined") {
      return;
    }

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as unknown as Array<{
          duration: number;
          name: string;
        }>) {
          this.markSample("longtask", entry.duration, "ms", entry.name);
          this.recordMetric("vitals.longtaskMs", entry.duration, "max");
        }
      });

      observer.observe({ type: "longtask", buffered: true });
    } catch {
      // Ignore unsupported observer types.
    }
  };

  private observeMemory = () => {
    if (!isBrowser) {
      return;
    }

    if (!("memory" in performance)) {
      return;
    }

    const sample = () => {
      const memory = (performance as Performance & {
        memory?: { usedJSHeapSize: number; jsHeapSizeLimit: number };
      }).memory;

      if (!memory) {
        return;
      }

      const usedMb = memory.usedJSHeapSize / 1024 / 1024;
      const limitMb = memory.jsHeapSizeLimit / 1024 / 1024;

      this.recordMetric("memory.usedMb", usedMb, "latest");
      this.recordMetric("memory.peakMb", usedMb, "max");
      this.recordMetric("memory.limitMb", limitMb, "latest");
      this.markSample("memory", usedMb, "mb", `${limitMb.toFixed(0)}mb limit`);
    };

    sample();
    window.setInterval(sample, 5000);
  };

  private installLifecycleFlush = () => {
    if (!isBrowser) {
      return;
    }

    window.addEventListener("pagehide", this.flush);
    window.addEventListener("beforeunload", this.flush);
  };

  private flush = () => {
    safeWriteSnapshot({
      ...this.snapshot,
      history: this.snapshot.history.slice(-MAX_HISTORY),
    });
  };

  private shortenResourceName = (name: string) => {
    try {
      const url = new URL(name);
      const pathname = url.pathname.split("/").filter(Boolean);
      return pathname.at(-1) ?? url.hostname;
    } catch {
      const parts = name.split("/").filter(Boolean);
      return parts.at(-1) ?? name;
    }
  };
}

const previousSnapshot = safeReadSnapshot();
const initialSnapshot = createEmptySnapshot();

if (previousSnapshot) {
  initialSnapshot.history = [
    summaryFromSnapshot(previousSnapshot),
    ...previousSnapshot.history.slice(0, MAX_HISTORY - 1),
  ].slice(0, MAX_HISTORY);
}

const globalPerformanceStore =
  (isBrowser
    ? ((window as Window & { __DAKER_MAY_PERF_STORE__?: PerformanceTelemetryStore })
        .__DAKER_MAY_PERF_STORE__ ??= new PerformanceTelemetryStore(initialSnapshot))
    : new PerformanceTelemetryStore(initialSnapshot));

export const performanceTelemetry = globalPerformanceStore;

export const getPerformanceSnapshot = () => performanceTelemetry.getSnapshot();

export const subscribeToPerformanceTelemetry = (listener: Listener) =>
  performanceTelemetry.subscribe(listener);

export const startPerformanceTelemetry = () => {
  performanceTelemetry.ensureStarted();
};

export const trackPerformanceSync = <T>(
  label: string,
  callback: () => T,
  options: TrackOptions = {},
): T => performanceTelemetry.trackSync(label, callback, options);

export const markPerformanceComponent = (
  label: string,
  startedAt: number,
  meta?: Record<string, string | number | boolean | null | undefined>,
) => performanceTelemetry.markComponent(label, startedAt, meta);

export const markPerformanceAsset = (
  label: string,
  duration: number,
  detail?: string,
  meta?: Record<string, string | number | boolean | null | undefined>,
) => performanceTelemetry.markAsset(label, duration, detail, meta);

export const markPerformanceInteraction = (
  label: string,
  duration: number,
  detail?: string,
  meta?: Record<string, string | number | boolean | null | undefined>,
) => performanceTelemetry.markInteraction(label, duration, detail, meta);

export const markPerformanceSample = (
  label: string,
  value: number,
  unit: MetricUnit,
  detail?: string,
  meta?: Record<string, string | number | boolean | null | undefined>,
) => performanceTelemetry.markSample(label, value, unit, detail, meta);

export const setLcpExclusionDuration = (durationMs: number) =>
  performanceTelemetry.setLcpExclusionDuration(durationMs);

export const startPageTransition = (from: string, to: string) =>
  performanceTelemetry.startPageTransition(from, to);

export const completePageTransition = (to: string) =>
  performanceTelemetry.completePageTransition(to);

export const recordPerformanceMetric = (
  name: string,
  value: number,
  mode: MetricMode = "latest",
) => performanceTelemetry.recordMetric(name, value, mode);
