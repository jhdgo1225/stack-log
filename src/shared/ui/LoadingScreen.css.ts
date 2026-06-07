import { keyframes, style } from "@vanilla-extract/css";

const splashLogoEnter = keyframes({
  from: {
    opacity: 0,
    transform: "translateY(12px) scale(0.96)",
  },
  to: {
    opacity: 1,
    transform: "translateY(0) scale(1)",
  },
});

export const splashScreen = style({
  width: "100vw",
  height: "100dvh",
  minHeight: "100vh",
  overflow: "hidden",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  background: "#101116",
});

export const logo = style({
  width: "min(72vw, 920px)",
  height: "auto",

  userSelect: "none",
  pointerEvents: "none",

  animation: `${splashLogoEnter} 700ms ease-out both`,
});
