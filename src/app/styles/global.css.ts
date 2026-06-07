import { globalStyle } from "@vanilla-extract/css";

const bg = "#f6efe5";
const ink = "#1a1713";
const muted = "#514f4c";
const line = "#e2d7c8";
const accent = "#ff7a45";
const accent2 = "#1ca79b";
const accent3 = "#1b4f72";
const surface = "#ffffff";
const shadowSoft = "0 10px 22px rgba(38, 29, 18, 0.12)";
const radiusMd = "18px";
const fontSans = '"Space Grotesk", "Noto Sans KR", sans-serif';
const fontMono = '"IBM Plex Mono", ui-monospace, monospace';

globalStyle(":root", {
  fontFamily: fontSans,
  color: ink,
  backgroundColor: bg,
  textRendering: "optimizeLegibility",
  WebkitFontSmoothing: "antialiased",
  scrollBehavior: "smooth",
});

globalStyle("*", {
  boxSizing: "border-box",
});

globalStyle("body", {
  margin: 0,
  minHeight: "100vh",
  background:
    "radial-gradient(circle at top left, #fff3e1 0%, transparent 55%), radial-gradient(circle at 20% 70%, #ffe2d2 0%, transparent 50%), linear-gradient(135deg, #f6efe5 0%, #fdf9f4 100%)",
});

globalStyle("a", {
  color: "inherit",
  textDecoration: "none",
});

globalStyle("a:hover", {
  color: accent3,
});

globalStyle("button", {
  font: "inherit",
});

globalStyle("h1, h2, h3", {
  margin: 0,
  letterSpacing: "-0.02em",
});

globalStyle("h1", {
  fontSize: "clamp(2.6rem, 3.5vw, 3.8rem)",
});

globalStyle("h2", {
  fontSize: "clamp(1.4rem, 2vw, 2rem)",
});

globalStyle("p", {
  margin: 0,
  color: muted,
});

globalStyle("ul", {
  margin: 0,
  paddingLeft: 18,
  color: muted,
  display: "grid",
  gap: 8,
});

globalStyle("#root", {
  minHeight: "100vh",
});

globalStyle(".page", {
  display: "grid",
  gap: 32,
});

globalStyle(".text-link", {
  fontWeight: 600,
  color: accent3,
  background: "transparent",
  border: "none",
  cursor: "pointer",
});

globalStyle(".stat-block", {
  display: "grid",
  gap: 4,
});

globalStyle(".stat-label", {
  fontSize: "0.85rem",
  color: muted,
});

globalStyle(".stat-value", {
  fontSize: "1.4rem",
  fontWeight: 700,
  color: ink,
});

globalStyle(".keycap", {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "6px 12px",
  borderRadius: 12,
  border: `1px solid ${line}`,
  background: "#fff",
  fontFamily: fontMono,
  fontSize: "0.8rem",
});

globalStyle(".panel", {
  background: surface,
  borderRadius: radiusMd,
  padding: 20,
  boxShadow: shadowSoft,
  display: "grid",
  gap: 14,
});

globalStyle(".panel-header", {
  display: "grid",
  gap: 6,
});

globalStyle(".panel-subtitle", {
  fontSize: "0.95rem",
});

globalStyle(".character-grid", {
  display: "grid",
  gap: 12,
});

globalStyle(".character-card", {
  background: "#fff",
  borderRadius: radiusMd,
  border: `1px solid ${line}`,
  padding: 16,
  display: "grid",
  gap: 6,
  textAlign: "left",
  cursor: "pointer",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
  boxShadow: "inset 0 0 0 1px transparent",
});

globalStyle(".character-card--selected", {
  borderColor: "var(--accent)",
  boxShadow: "0 10px 20px color-mix(in srgb, var(--accent) 30%, transparent)",
  transform: "translateY(-2px)",
});

globalStyle(".character-card::before", {
  content: '""',
  width: "100%",
  height: 4,
  borderRadius: 999,
  background: "var(--accent)",
  marginBottom: 6,
});

globalStyle(".character-name", {
  fontWeight: 700,
});

globalStyle(".character-tagline", {
  color: muted,
});

globalStyle(".character-trait", {
  fontSize: "0.85rem",
  color: accent3,
});

globalStyle(".settings-panel", {
  display: "inline-flex",
  gap: 10,
  alignItems: "center",
});

globalStyle(".toggle-chip", {
  borderRadius: 999,
  border: `1px solid ${line}`,
  padding: "6px 12px",
  background: "#fff",
  cursor: "pointer",
  fontWeight: 600,
});

globalStyle(".toggle-switch", {
  display: "inline-flex",
  alignItems: "center",
  gap: 10,
  fontSize: "0.9rem",
});

globalStyle(".toggle-switch input", {
  accentColor: accent2,
});

globalStyle(".ui-button", {
  borderRadius: 999,
  padding: "10px 18px",
  border: "none",
  cursor: "pointer",
  fontWeight: 600,
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
});

globalStyle(".ui-button--primary", {
  background: `linear-gradient(135deg, ${accent}, #ffb282)`,
  color: "#fff",
  boxShadow: shadowSoft,
});

globalStyle(".ui-button--outline", {
  background: "#fff",
  border: `1px solid ${line}`,
  color: ink,
});

globalStyle(".ui-button--ghost", {
  background: "transparent",
  color: ink,
});

globalStyle(".ui-button--lg", {
  fontSize: "1rem",
  padding: "12px 22px",
});

globalStyle(".ui-button--sm", {
  fontSize: "0.85rem",
  padding: "6px 14px",
});

globalStyle(".ui-button:hover", {
  transform: "translateY(-1px)",
});

globalStyle("*", {
  "@media": {
    "(prefers-reduced-motion: reduce)": {
      animationDuration: "0.01ms !important",
      animationIterationCount: "1 !important",
      transitionDuration: "0.01ms !important",
      scrollBehavior: "auto",
    },
  },
});
