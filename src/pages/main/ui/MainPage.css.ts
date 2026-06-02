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

  backgroundImage: 'url("/assets/main/main-screen-background-wide.png")',
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center center",
  backgroundSize: "cover",

  "@media": {
    "(max-width: 1024px)": {
      backgroundImage: 'url("/assets/main/main-screen-background.png")',
    },
  },
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
