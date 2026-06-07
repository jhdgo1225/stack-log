import { style } from "@vanilla-extract/css";

export const overlay = style({
  position: "fixed",
  inset: 0,
  zIndex: 30,
  display: "grid",
  placeItems: "center",
  padding: "clamp(18px, 4vw, 40px)",
  background: "rgba(7, 10, 18, 0.54)",
  backdropFilter: "blur(8px)",
});

export const modal = style({
  position: "relative",
  width: "min(100%, 920px)",
  display: "grid",
  gap: "clamp(18px, 2vw, 24px)",
  padding: "clamp(20px, 3vw, 32px)",
  borderRadius: 20,
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(247,247,247,0.96))",
  boxShadow: "0 28px 70px rgba(0, 0, 0, 0.28)",
});

export const closeButton = style({
  position: "absolute",
  top: 14,
  right: 14,
  width: 42,
  height: 42,
  border: 0,
  borderRadius: 999,
  background: "rgba(17, 17, 17, 0.08)",
  color: "#111",
  fontSize: 24,
  cursor: "pointer",
  selectors: {
    "&:hover": {
      background: "rgba(17, 17, 17, 0.14)",
    },
    "&:focus-visible": {
      outline: "3px solid #1497ff",
      outlineOffset: 2,
    },
  },
});

export const header = style({
  display: "grid",
  gap: 6,
  paddingRight: 44,
});

export const eyebrow = style({
  fontSize: 14,
  fontWeight: 800,
  color: "color-mix(in srgb, var(--skill-video-accent, #1497ff) 74%, #111)",
});

export const title = style({
  margin: 0,
  fontSize: "clamp(24px, 2.4vw, 34px)",
  fontWeight: 900,
  color: "#111",
  lineHeight: 1.1,
});

export const description = style({
  margin: 0,
  fontSize: "clamp(14px, 1.2vw, 17px)",
  lineHeight: 1.5,
  color: "#333",
});

export const frame = style({
  position: "relative",
  aspectRatio: "16 / 9",
  width: "100%",
  overflow: "hidden",
  borderRadius: 18,
  background:
    "linear-gradient(135deg, color-mix(in srgb, var(--skill-video-accent, #1497ff) 26%, #ffffff), #0c1322 82%)",
  boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.18)",
});

export const video = style({
  width: "100%",
  height: "100%",
  display: "block",
  background: "#000",
});

export const placeholder = style({
  width: "100%",
  height: "100%",
  display: "grid",
  placeItems: "center",
  padding: 24,
  textAlign: "center",
  color: "#fff",
});

export const placeholderInner = style({
  display: "grid",
  gap: 10,
  maxWidth: 420,
});

export const placeholderBadge = style({
  justifySelf: "center",
  padding: "8px 14px",
  borderRadius: 999,
  background: "rgba(255,255,255,0.14)",
  fontSize: 13,
  fontWeight: 800,
  letterSpacing: "0.04em",
});

export const placeholderTitle = style({
  fontSize: "clamp(22px, 2.2vw, 30px)",
  fontWeight: 900,
  lineHeight: 1.15,
});

export const placeholderDescription = style({
  margin: 0,
  fontSize: "clamp(14px, 1.2vw, 16px)",
  lineHeight: 1.5,
  color: "rgba(255,255,255,0.84)",
});

export const footer = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  flexWrap: "wrap",
});

export const helperText = style({
  margin: 0,
  fontSize: 13,
  color: "#555",
});

export const footerCloseButton = style({
  minWidth: 104,
  height: 44,
  padding: "0 18px",
  border: 0,
  borderRadius: 999,
  background: "var(--skill-video-accent, #1497ff)",
  color: "#fff",
  fontSize: 15,
  fontWeight: 800,
  cursor: "pointer",
  selectors: {
    "&:hover": {
      filter: "brightness(1.05)",
    },
    "&:focus-visible": {
      outline: "3px solid #1497ff",
      outlineOffset: 2,
    },
  },
});
