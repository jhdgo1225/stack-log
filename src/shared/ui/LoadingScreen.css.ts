import { globalStyle, keyframes, style } from "@vanilla-extract/css";

const logoIntro = keyframes({
  from: {
    opacity: 0,
    transform: "translateY(42px) scale(0.92)",
    filter: "blur(14px)",
  },
  to: {
    opacity: 1,
    transform: "translateY(0) scale(1)",
    filter: "blur(0)",
  },
});

const logoOutro = keyframes({
  from: {
    opacity: 1,
    transform: "translateY(0) scale(1)",
    filter: "blur(0)",
  },
  to: {
    opacity: 0,
    transform: "translateY(48px) scale(0.94)",
    filter: "blur(14px)",
  },
});

const sparkleTwinkle = keyframes({
  "0%": {
    opacity: 0,
    transform: "scale(0.4)",
  },
  "45%": {
    opacity: 0.9,
    transform: "scale(1)",
  },
  "55%": {
    opacity: 1,
    transform: "scale(1.45)",
  },
  "100%": {
    opacity: 0,
    transform: "scale(0.4)",
  },
});

const auraPulse = keyframes({
  "0%": {
    opacity: 0.7,
    transform: "translate(-50%, -50%) scale(0.98)",
  },
  "50%": {
    opacity: 1,
    transform: "translate(-50%, -50%) scale(1.04)",
  },
  "100%": {
    opacity: 0.7,
    transform: "translate(-50%, -50%) scale(0.98)",
  },
});

const backgroundPulse = keyframes({
  "0%": {
    opacity: 0.65,
  },
  "50%": {
    opacity: 1,
  },
  "100%": {
    opacity: 0.65,
  },
});

const logoFloat = keyframes({
  "0%": {
    transform: "translateY(0)",
  },
  "50%": {
    transform: "translateY(-8px)",
  },
  "100%": {
    transform: "translateY(0)",
  },
});

export const splashScreen = style({
  position: "fixed",
  inset: 0,
  overflow: "hidden",
  zIndex: 9999,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  opacity: 1,
  transition: "opacity 700ms ease !important",
  background:
    "radial-gradient(circle at 28% 48%, rgba(0, 255, 180, 0.18), transparent 28%), radial-gradient(circle at 55% 48%, rgba(0, 120, 255, 0.22), transparent 34%), radial-gradient(circle at 76% 46%, rgba(195, 70, 255, 0.24), transparent 34%), linear-gradient(180deg, #020204 0%, #030308 55%, #000000 100%)",

  selectors: {
    '&[data-closing="true"]': {
      opacity: 0,
      pointerEvents: "none",
    },
  },
});

export const backgroundGlow = style({
  position: "absolute",
  left: "50%",
  top: "55%",
  width: "90vw",
  height: "28vh",
  transform: "translate(-50%, -50%)",
  background:
    "linear-gradient(90deg, rgba(0, 229, 255, 0.02), rgba(0, 145, 255, 0.3), rgba(173, 69, 255, 0.34), rgba(255, 53, 224, 0.05))",
  filter: "blur(28px)",
  opacity: 0.9,
  animation: `${backgroundPulse} 2.8s ease-in-out infinite !important`,
});

export const sparkles = style({
  position: "absolute",
  inset: 0,
  pointerEvents: "none",
});

export const sparkle = style({
  position: "absolute",
  borderRadius: "999px",
  background: "#ffffff",
  boxShadow:
    "0 0 6px rgba(255, 255, 255, 0.9), 0 0 14px rgba(80, 180, 255, 0.75), 0 0 24px rgba(183, 80, 255, 0.5)",
  opacity: 0,
  animation: `${sparkleTwinkle} var(--sparkle-duration) ease-in-out var(--sparkle-delay) infinite !important`,
  transformOrigin: "center center",
});

globalStyle(`${sparkles} > span:nth-child(3n)`, {
  background: "#62e8ff",
  boxShadow:
    "0 0 8px rgba(98, 232, 255, 0.95), 0 0 18px rgba(98, 232, 255, 0.65)",
});

globalStyle(`${sparkles} > span:nth-child(4n)`, {
  background: "#be65ff",
  boxShadow:
    "0 0 8px rgba(190, 101, 255, 0.95), 0 0 18px rgba(190, 101, 255, 0.65)",
});

globalStyle(`${sparkles} > span:nth-child(5n)`, {
  background: "#fff064",
  boxShadow:
    "0 0 8px rgba(255, 240, 100, 0.95), 0 0 18px rgba(255, 240, 100, 0.65)",
});

export const logoWrap = style({
  position: "relative",
  width: "min(84vw, 1280px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  animation: `${logoIntro} 900ms cubic-bezier(0.16, 1, 0.3, 1) both !important`,
  willChange: "opacity, transform, filter",

  selectors: {
    [`${splashScreen}[data-closing="true"] &`]: {
      animation: `${logoOutro} 700ms ease-in both !important`,
    },
  },

  "@media": {
    "(max-width: 768px)": {
      width: "92vw",
    },
  },
});

export const logoAura = style({
  position: "absolute",
  width: "92%",
  height: "42%",
  top: "42%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  background:
    "radial-gradient(circle at 26% 50%, rgba(80, 255, 95, 0.32), transparent 23%), radial-gradient(circle at 48% 50%, rgba(65, 205, 255, 0.35), transparent 30%), radial-gradient(circle at 72% 50%, rgba(190, 85, 255, 0.36), transparent 30%)",
  filter: "blur(30px)",
  opacity: 0.95,
  animation: `${auraPulse} 2.2s ease-in-out infinite !important`,
  pointerEvents: "none",

  selectors: {
    [`${splashScreen}[data-closing="true"] &`]: {
      opacity: 0,
      transition: "opacity 500ms ease",
    },
  },
});

export const logo = style({
  position: "relative",
  width: "100%",
  maxHeight: "44vh",
  objectFit: "contain",
  filter:
    "drop-shadow(0 0 10px rgba(80, 200, 255, 0.45)) drop-shadow(0 0 22px rgba(177, 77, 255, 0.35))",
  userSelect: "none",
  animation: `${logoFloat} 2.6s ease-in-out infinite !important`,

  "@media": {
    "(max-width: 768px)": {
      maxHeight: "32vh",
    },
  },
});

export const floorLight = style({
  position: "absolute",
  left: "50%",
  bottom: "-7%",
  width: "72%",
  height: "8px",
  transform: "translateX(-50%)",
  background:
    "linear-gradient(90deg, transparent, rgba(0, 213, 255, 0.75), rgba(168, 75, 255, 0.8), transparent)",
  filter: "blur(8px)",
  opacity: 0.9,

  selectors: {
    [`${splashScreen}[data-closing="true"] &`]: {
      opacity: 0,
      transition: "opacity 500ms ease",
    },
  },
});

export const reflection = style({
  position: "absolute",
  top: "58%",
  width: "100%",
  maxHeight: "34vh",
  objectFit: "contain",
  transform: "scaleY(-1)",
  opacity: 0.16,
  filter: "blur(3px)",
  WebkitMaskImage:
    "linear-gradient(to bottom, rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.18), transparent)",
  maskImage:
    "linear-gradient(to bottom, rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.18), transparent)",
  userSelect: "none",
  pointerEvents: "none",

  selectors: {
    [`${splashScreen}[data-closing="true"] &`]: {
      opacity: 0,
      transition: "opacity 500ms ease",
    },
  },

  "@media": {
    "(max-width: 768px)": {
      top: "56%",
      maxHeight: "24vh",
    },
  },
});
