import { keyframes, style } from "@vanilla-extract/css";

const sceneEnter = keyframes({
  "0%": {
    opacity: 0,
    clipPath: "inset(0 100% 0 0)",
    transform: "scale(1.03) translateX(5.5%)",
    filter: "blur(12px)",
  },
  "100%": {
    opacity: 1,
    clipPath: "inset(0 0 0 0)",
    transform: "scale(1) translateX(0)",
    filter: "blur(0)",
  },
});

const sceneLeave = keyframes({
  "0%": {
    opacity: 1,
    clipPath: "inset(0 0 0 0)",
    transform: "scale(1) translateX(0)",
    filter: "blur(0)",
  },
  "100%": {
    opacity: 0,
    clipPath: "inset(0 0 0 10%)",
    transform: "scale(1.02) translateX(-3.5%)",
    filter: "blur(9px)",
  },
});

const sceneKenBurns = keyframes({
  "0%": {
    transform: "scale(1.01) translate3d(0, 0, 0)",
  },
  "100%": {
    transform: "scale(1.06) translate3d(1%, -0.65%, 0)",
  },
});

const sceneContentEnter = keyframes({
  "0%": {
    opacity: 0,
    transform: "translateY(24px)",
    filter: "blur(8px)",
  },
  "100%": {
    opacity: 1,
    transform: "translateY(0)",
    filter: "blur(0)",
  },
});

const sceneSweep = keyframes({
  "0%": {
    opacity: 0,
    transform: "translateX(-120%) skewX(-18deg)",
  },
  "18%": {
    opacity: 0.7,
  },
  "45%": {
    opacity: 0.25,
  },
  "100%": {
    opacity: 0,
    transform: "translateX(140%) skewX(-18deg)",
  },
});

const sceneProgress = keyframes({
  from: {
    transform: "scaleX(0)",
  },
  to: {
    transform: "scaleX(1)",
  },
});

const sceneGlowPulse = keyframes({
  "0%": {
    opacity: 0.35,
    transform: "scale(1)",
  },
  "50%": {
    opacity: 0.7,
    transform: "scale(1.08)",
  },
  "100%": {
    opacity: 0.35,
    transform: "scale(1)",
  },
});

export const mainPage = style({
  position: "relative",
  width: "100vw",
  height: "100dvh",
  minHeight: "100vh",
  overflow: "hidden",
  background: "#050505",
  color: "#ffffff",
});

export const sceneLayer = style({
  position: "absolute",
  inset: 0,
  overflow: "hidden",
});

export const scene = style({
  position: "absolute",
  inset: 0,
  opacity: 0,
  pointerEvents: "none",
  background: "#050505",
  overflow: "hidden",

  selectors: {
    '&[data-active="true"]': {
      opacity: 1,
      zIndex: 2,
      animation: `${sceneEnter} 1200ms cubic-bezier(0.22, 1, 0.36, 1) both !important`,
    },
    '&[data-leaving="true"]': {
      zIndex: 1,
      animation: `${sceneLeave} 1200ms cubic-bezier(0.22, 1, 0.36, 1) both !important`,
    },
  },
});

export const sceneBackdrop = style({
  position: "absolute",
  inset: "-4%",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  filter: "blur(22px) saturate(1.06)",
  transform: "scale(1.08)",
  opacity: 0.95,
});

export const sceneImage = style({
  position: "relative",
  zIndex: 1,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  objectPosition: "center",
  userSelect: "none",
  animation: `${sceneKenBurns} 7000ms ease-out both !important`,
});

export const darkOverlay = style({
  position: "absolute",
  inset: 0,
  zIndex: 3,
  pointerEvents: "none",
  background:
    "linear-gradient(90deg, rgba(0, 0, 0, 0.54) 0%, rgba(0, 0, 0, 0.26) 32%, rgba(0, 0, 0, 0.06) 62%, rgba(0, 0, 0, 0.14) 100%)",
});

export const lightOverlay = style({
  position: "absolute",
  inset: 0,
  zIndex: 4,
  pointerEvents: "none",
  background:
    "radial-gradient(circle at 68% 34%, rgba(255, 255, 255, 0.36), transparent 26%), radial-gradient(circle at 18% 80%, rgba(255, 255, 255, 0.16), transparent 28%)",
  mixBlendMode: "screen",
  animation: `${sceneGlowPulse} 4200ms ease-in-out infinite !important`,
});

export const sweepLight = style({
  position: "absolute",
  top: 0,
  left: 0,
  zIndex: 5,
  width: "46%",
  height: "100%",
  pointerEvents: "none",
  background:
    "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.12) 26%, rgba(255, 255, 255, 0.62) 50%, rgba(255, 255, 255, 0.12) 74%, transparent 100%)",
  filter: "blur(20px)",
  animation: `${sceneSweep} 1450ms cubic-bezier(0.22, 1, 0.36, 1) both !important`,
});

export const content = style({
  position: "relative",
  zIndex: 6,
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  paddingRight: "clamp(72px, 15vw, 320px)",

  "@media": {
    "(max-width: 1024px)": {
      justifyContent: "center",
      alignItems: "flex-end",
      paddingRight: 0,
      paddingBottom: "12vh",
    },
    "(max-width: 640px)": {
      paddingBottom: "9vh",
    },
  },
});

export const progressContent = style({
  position: "absolute",
  left: "clamp(28px, 7vw, 96px)",
  bottom: "clamp(42px, 10vh, 120px)",
  zIndex: 6,
  width: "min(520px, calc(100% - 48px))",
  animation: `${sceneContentEnter} 900ms cubic-bezier(0.22, 1, 0.36, 1) both`,

  "@media": {
    "(max-width: 1024px)": {
      left: "16px",
      right: "16px",
      top: "24px",
      bottom: "auto",
      width: "auto",
    },
    "(max-width: 640px)": {
      top: "18px",
      left: "14px",
      right: "14px",
    },
  },
});

export const progressTrack = style({
  position: "relative",
  width: "100%",
  maxWidth: "360px",
  height: "5px",
  overflow: "hidden",
  borderRadius: "999px",
  background: "rgba(255, 255, 255, 0.2)",
  boxShadow: "0 0 0 1px rgba(255, 255, 255, 0.08)",
});

export const progressBar = style({
  width: "100%",
  height: "100%",
  borderRadius: "inherit",
  background:
    "linear-gradient(90deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 244, 205, 0.96) 100%)",
  transformOrigin: "left center",
  animation: `${sceneProgress} 7000ms linear both !important`,
});
