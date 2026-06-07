import { style } from "@vanilla-extract/css";

export const mainMenu = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",

  gap: "clamp(12px, 2.2vh, 24px)",
});

export const button = style({
  width: "320px",

  padding: 0,
  border: 0,
  background: "transparent",

  cursor: "pointer",

  transform: "translateZ(0)",

  transitionProperty: "transform, filter",
  transitionDuration: "140ms",
  transitionTimingFunction: "ease",

  selectors: {
    "&:hover": {
      transform: "translateY(-3px) scale(1.02)",
      filter: "brightness(1.06)",
    },

    "&:active": {
      transform: "translateY(1px) scale(0.98)",
      filter: "brightness(0.96)",
    },

    "&:focus-visible": {
      outline: "3px solid rgba(255, 255, 255, 0.95)",
      outlineOffset: "6px",
      borderRadius: "999px",
    },
  },

  "@media": {
    "(max-width: 1024px)": {
      width: "260px",
    },

    "(max-width: 640px)": {
      width: "min(58vw, 220px)",
    },
  },
});

export const buttonImage = style({
  display: "block",

  width: "100%",
  height: "auto",

  userSelect: "none",
  pointerEvents: "none",
});
