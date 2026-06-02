import type { CSSProperties } from "react";

import { usePerformanceSnapshot } from "@/shared/lib/performance/usePerformanceTelemetry";

const panelStyle: CSSProperties = {
  position: "fixed",
  right: 16,
  bottom: 16,
  width: "min(420px, calc(100vw - 32px))",
  maxHeight: "min(70vh, 680px)",
  overflow: "auto",
  zIndex: 9999,
  borderRadius: 18,
  border: "1px solid rgba(26, 23, 19, 0.14)",
  background: "rgba(18, 16, 14, 0.94)",
  color: "#f7f0e8",
  boxShadow: "0 18px 40px rgba(0, 0, 0, 0.28)",
  backdropFilter: "blur(14px)",
};

const sectionStyle: CSSProperties = {
  padding: 16,
  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
};

const badgeStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "4px 10px",
  borderRadius: 999,
  background: "rgba(255, 255, 255, 0.08)",
  fontSize: 12,
  letterSpacing: "0.03em",
  textTransform: "uppercase",
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 10,
};

const metricStyle: CSSProperties = {
  borderRadius: 14,
  background: "rgba(255, 255, 255, 0.06)",
  padding: 12,
  display: "grid",
  gap: 4,
};

const labelStyle: CSSProperties = {
  fontSize: 12,
  color: "rgba(247, 240, 232, 0.68)",
};

const valueStyle: CSSProperties = {
  fontSize: 18,
  fontWeight: 700,
  color: "#fff",
};

const listStyle: CSSProperties = {
  display: "grid",
  gap: 8,
};

const rowStyle: CSSProperties = {
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  gap: 12,
  padding: "8px 10px",
  borderRadius: 12,
  background: "rgba(255, 255, 255, 0.04)",
};

const titleStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const subStyle: CSSProperties = {
  fontSize: 12,
  color: "rgba(247, 240, 232, 0.7)",
  flexShrink: 0,
};

const formatMs = (value?: number) =>
  typeof value === "number" ? `${value.toFixed(1)}ms` : "n/a";

const formatFps = (value?: number) =>
  typeof value === "number" ? `${value.toFixed(1)}fps` : "n/a";

const formatMb = (value?: number) =>
  typeof value === "number" ? `${value.toFixed(1)}MB` : "n/a";

const getTopEntries = (
  entries: ReturnType<typeof usePerformanceSnapshot>["entries"],
  kind: "asset" | "component" | "interaction" | "transition",
) =>
  entries
    .filter((entry) => entry.kind === kind)
    .slice()
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

export const PerformancePanel = () => {
  const snapshot = usePerformanceSnapshot();
  const metrics = snapshot.metrics;
  const slowAssets = getTopEntries(snapshot.entries, "asset");
  const slowComponents = getTopEntries(snapshot.entries, "component");
  const slowInteractions = getTopEntries(snapshot.entries, "interaction");
  const slowTransitions = getTopEntries(snapshot.entries, "transition");
  const previousSnapshot = snapshot.history.at(-1);

  return (
    <aside style={panelStyle} aria-label="Performance telemetry panel">
      <div style={sectionStyle}>
        <div style={badgeStyle}>Performance telemetry</div>
        <h2 style={{ marginTop: 10, fontSize: 18 }}>Live session</h2>
        <p style={{ marginTop: 6, color: "rgba(247, 240, 232, 0.72)" }}>
          Browser vitals, component render times, asset load timings, and game
          loop samples are collected here.
        </p>
      </div>

      <div style={{ ...sectionStyle, display: "grid", gap: 12 }}>
        <div style={gridStyle}>
          <div style={metricStyle}>
            <span style={labelStyle}>Initial load</span>
            <strong style={valueStyle}>
              {formatMs(metrics["navigation.loadMs"])}
            </strong>
          </div>
          <div style={metricStyle}>
            <span style={labelStyle}>LCP (post-splash)</span>
            <strong style={valueStyle}>
              {formatMs(
                metrics["paint.lcpAdjustedMs"] ?? metrics["paint.lcpMs"],
              )}
            </strong>
          </div>
          <div style={metricStyle}>
            <span style={labelStyle}>CLS</span>
            <strong style={valueStyle}>
              {typeof metrics["vitals.cls"] === "number"
                ? metrics["vitals.cls"].toFixed(3)
                : "n/a"}
            </strong>
          </div>
          <div style={metricStyle}>
            <span style={labelStyle}>INP</span>
            <strong style={valueStyle}>
              {formatMs(metrics["vitals.inpMs"])}
            </strong>
          </div>
          <div style={metricStyle}>
            <span style={labelStyle}>Avg FPS</span>
            <strong style={valueStyle}>
              {formatFps(metrics["fps.gameplay.average"])}
            </strong>
          </div>
          <div style={metricStyle}>
            <span style={labelStyle}>Min FPS</span>
            <strong style={valueStyle}>
              {formatFps(metrics["fps.gameplay.min"])}
            </strong>
          </div>
          <div style={metricStyle}>
            <span style={labelStyle}>Peak memory</span>
            <strong style={valueStyle}>
              {formatMb(metrics["memory.peakMb"])}
            </strong>
          </div>
          <div style={metricStyle}>
            <span style={labelStyle}>Input delay</span>
            <strong style={valueStyle}>
              {formatMs(metrics["vitals.inputDelayMs"])}
            </strong>
          </div>
        </div>
      </div>

      <div style={sectionStyle}>
        <h3 style={{ marginBottom: 10, fontSize: 14 }}>Slow assets</h3>
        <div style={listStyle}>
          {slowAssets.length > 0 ? (
            slowAssets.map((entry) => (
              <div key={entry.id} style={rowStyle}>
                <span style={titleStyle}>{entry.label}</span>
                <span style={subStyle}>
                  {entry.value.toFixed(1)}
                  {entry.unit}
                </span>
              </div>
            ))
          ) : (
            <p style={{ color: "rgba(247, 240, 232, 0.6)" }}>
              No slow assets recorded yet.
            </p>
          )}
        </div>
      </div>

      <div style={sectionStyle}>
        <h3 style={{ marginBottom: 10, fontSize: 14 }}>Slow components</h3>
        <div style={listStyle}>
          {slowComponents.length > 0 ? (
            slowComponents.map((entry) => (
              <div key={entry.id} style={rowStyle}>
                <span style={titleStyle}>{entry.label}</span>
                <span style={subStyle}>
                  {entry.value.toFixed(1)}
                  {entry.unit}
                </span>
              </div>
            ))
          ) : (
            <p style={{ color: "rgba(247, 240, 232, 0.6)" }}>
              No slow components recorded yet.
            </p>
          )}
        </div>
      </div>

      <div style={sectionStyle}>
        <h3 style={{ marginBottom: 10, fontSize: 14 }}>Slow interactions</h3>
        <div style={listStyle}>
          {slowInteractions.length > 0 ? (
            slowInteractions.map((entry) => (
              <div key={entry.id} style={rowStyle}>
                <span style={titleStyle}>{entry.label}</span>
                <span style={subStyle}>
                  {entry.value.toFixed(1)}
                  {entry.unit}
                </span>
              </div>
            ))
          ) : (
            <p style={{ color: "rgba(247, 240, 232, 0.6)" }}>
              No slow interactions recorded yet.
            </p>
          )}
        </div>
      </div>

      <div style={sectionStyle}>
        <h3 style={{ marginBottom: 10, fontSize: 14 }}>Page transitions</h3>
        <div style={listStyle}>
          {slowTransitions.length > 0 ? (
            slowTransitions.map((entry) => (
              <div key={entry.id} style={rowStyle}>
                <span style={titleStyle}>{entry.label}</span>
                <span style={subStyle}>
                  {entry.value.toFixed(1)}
                  {entry.unit}
                </span>
              </div>
            ))
          ) : (
            <p style={{ color: "rgba(247, 240, 232, 0.6)" }}>
              No page transitions recorded yet.
            </p>
          )}
        </div>
      </div>

      <div style={{ ...sectionStyle, borderBottom: "none" }}>
        <h3 style={{ marginBottom: 10, fontSize: 14 }}>Previous session</h3>
        {previousSnapshot ? (
          <div style={listStyle}>
            <div style={rowStyle}>
              <span style={titleStyle}>Initial load</span>
              <span style={subStyle}>
                {formatMs(previousSnapshot.metrics["navigation.loadMs"])}
              </span>
            </div>
            <div style={rowStyle}>
              <span style={titleStyle}>LCP</span>
              <span style={subStyle}>
                {formatMs(
                  previousSnapshot.metrics["paint.lcpAdjustedMs"] ??
                    previousSnapshot.metrics["paint.lcpMs"],
                )}
              </span>
            </div>
            <div style={rowStyle}>
              <span style={titleStyle}>Avg FPS</span>
              <span style={subStyle}>
                {formatFps(previousSnapshot.metrics["fps.gameplay.average"])}
              </span>
            </div>
          </div>
        ) : (
          <p style={{ color: "rgba(247, 240, 232, 0.6)" }}>
            No previous session stored yet.
          </p>
        )}
      </div>
    </aside>
  );
};
