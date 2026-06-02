import { style } from "@vanilla-extract/css";

const paleSurface = "#f1f1f1";

export const modalOverlay = style({
  position: "fixed",
  inset: 0,
  zIndex: 20,
  display: "grid",
  placeItems: "center",
  padding: "clamp(18px, 4vw, 48px)",
  background: "rgba(0, 0, 0, 0.22)",
});

export const modal = style({
  position: "relative",
  width: "min(100%, var(--character-select-modal-width, 900px))",
  maxHeight: "min(78vh, 760px)",
  display: "grid",
  gridTemplateRows: "auto minmax(0, 1fr)",
  gap: "clamp(22px, 3vh, 34px)",
  padding:
    "clamp(34px, 5vw, 64px) clamp(38px, 6vw, 86px) clamp(28px, 4vw, 42px)",
  borderRadius: 12,
  background: "var(--character-select-modal-bg, #fff)",
  boxShadow: "0 22px 50px rgba(18, 18, 18, 0.18)",
});

export const modalSearchRow = style({
  justifySelf: "center",
  width: "min(100%, 360px)",
  display: "grid",
  gridTemplateColumns: "1fr 74px",
  gap: 12,
});

export const searchInput = style({
  minWidth: 0,
  height: 44,
  padding: "0 14px",
  border: 0,
  borderRadius: 6,
  background: "var(--character-select-modal-input-bg, #f1f1f1)",
  color: "#111",
  fontSize: 17,
  fontWeight: 700,
  selectors: {
    "&:focus-visible": {
      outline: "3px solid var(--character-select-modal-outline, #1497ff)",
      outlineOffset: 2,
    },
  },
});

export const searchButton = style({
  height: 44,
  border: 0,
  borderRadius: 6,
  background: "var(--character-select-modal-input-bg, #f1f1f1)",
  color: "#111",
  fontSize: 17,
  fontWeight: 800,
  cursor: "pointer",
  selectors: {
    "&:hover": {
      background: paleSurface,
      filter: "brightness(0.98)",
    },
    "&:focus-visible": {
      outline: "3px solid var(--character-select-modal-outline, #1497ff)",
      outlineOffset: 2,
    },
  },
});

export const closeButton = style({
  position: "absolute",
  top: "clamp(20px, 3vw, 34px)",
  right: "clamp(22px, 3.5vw, 44px)",
  width: 42,
  height: 42,
  padding: 0,
  border: 0,
  background: "transparent",
  color: "#17181d",
  fontSize: 44,
  fontWeight: 400,
  lineHeight: 0.8,
  cursor: "pointer",
  selectors: {
    "&:focus-visible": {
      outline: "3px solid var(--character-select-modal-outline, #1497ff)",
      borderRadius: 4,
    },
  },
});

export const modalGridWrap = style({
  minHeight: 0,
  overflowY: "auto",
  paddingRight: 18,
  scrollbarWidth: "thin",
  scrollbarColor: "#d9d9d9 transparent",
  selectors: {
    "&::-webkit-scrollbar": {
      width: 12,
    },
    "&::-webkit-scrollbar-thumb": {
      borderRadius: 999,
      background: "#d9d9d9",
    },
  },
  "@media": {
    "(max-width: 460px)": {
      paddingRight: 10,
    },
  },
});

export const emptyState = style({
  minHeight: 180,
  display: "grid",
  placeItems: "center",
  color: "#333",
  fontSize: 18,
  fontWeight: 700,
  textAlign: "center",
});
