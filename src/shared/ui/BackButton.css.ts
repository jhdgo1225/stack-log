import { style } from "@vanilla-extract/css";

export const backButton = style({
  justifySelf: "start",
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  minHeight: 40,
  padding: "6px 14px",
  border: "1.5px solid var(--back-button-border, #111)",
  borderRadius: 8,
  background: "var(--back-button-bg, transparent)",
  color: "var(--back-button-color, #111)",
  fontSize: "var(--back-button-font-size, 20px)",
  fontWeight: 700,
  lineHeight: 1,
  cursor: "pointer",
  transition:
    "transform 140ms ease, background 140ms ease, box-shadow 140ms ease",
  selectors: {
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "var(--back-button-shadow, none)",
      background: "var(--back-button-hover-bg, var(--back-button-bg, transparent))",
    },
    "&:active": {
      transform: "translateY(0)",
    },
    "&:focus-visible": {
      outline: "3px solid var(--back-button-outline, #1497ff)",
      outlineOffset: 3,
    },
  },
});
