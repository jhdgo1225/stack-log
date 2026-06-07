import { style } from "@vanilla-extract/css";

export const mainPage = style({
  position: "relative",

  width: "100vw",
  height: "100dvh",
  minHeight: "100vh",

  overflow: "hidden",
  background: "#dff5ff",
});

export const background = style({
  position: "absolute",
  inset: 0,
  backgroundColor: "#dff5ff",
});

export const backgroundLayerGroup = style({
  position: "absolute",
  inset: 0,
  overflow: "hidden",
  zIndex: 0,
});

export const backgroundLayer = style({
  position: "absolute",
  inset: 0,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center center",
  backgroundSize: "cover",
  transitionProperty: "opacity, transform",
  transitionDuration: "650ms",
  transitionTimingFunction: "ease",
  opacity: 0,
  transform: "scale(1.02)",

  selectors: {
    '&[data-visible="true"]': {
      opacity: 1,
      transform: "scale(1)",
    },
  },

  "@media": {
    "(max-width: 1024px)": {
      backgroundPosition: "center center",
      backgroundSize: "cover",
    },
  },
});

export const backgroundOverlay = style({
  position: "absolute",
  inset: 0,
  background:
    "linear-gradient(180deg, rgba(255, 250, 245, 0.12) 0%, rgba(28, 20, 13, 0.08) 42%, rgba(14, 11, 9, 0.38) 100%)",
});

export const content = style({
  position: "relative",
  zIndex: 1,

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
