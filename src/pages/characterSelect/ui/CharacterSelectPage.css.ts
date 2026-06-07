import { globalStyle, style } from "@vanilla-extract/css";

const paleSurface = "#f1f1f1";

export const page = style({
  position: "relative",
  width: "100vw",
  height: "100dvh",
  overflowX: "hidden",
  overflowY: "hidden",
  display: "grid",
  gridTemplateRows: "auto auto auto auto",
  justifyItems: "center",
  alignContent: "start",
  gap: "clamp(6px, 0.7vh, 10px)",
  padding: "12px clamp(14px, 3vw, 48px) 8px",
  border: "4px solid transparent",
  borderImage: "var(--character-theme) 1",
  background:
    "linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.96)), var(--character-theme)",
  color: "#050505",
  fontFamily: '"Noto Sans KR", "Space Grotesk", sans-serif',
  "@media": {
    "(max-width: 1024px)": {
      height: "auto",
      minHeight: "100dvh",
      overflowY: "auto",
      padding: "16px 14px 20px",
      gap: 12,
    },
  },
});

export const backButton = style({
  justifySelf: "start",
});

export const backButtonIcon = style({
  width: 18,
  height: 18,
  display: "block",
  objectFit: "contain",
  pointerEvents: "none",
  userSelect: "none",
});

export const topSelectArea = style({
  width: "min(100%, 1280px)",
  display: "grid",
  gridTemplateColumns: "172px minmax(0, 1fr)",
  alignItems: "center",
  gap: "clamp(8px, 1vw, 14px)",
  marginTop: 0,
  "@media": {
    "(max-width: 860px)": {
      gridTemplateColumns: "1fr",
      justifyItems: "center",
      gap: 10,
      marginTop: 0,
    },
    "(max-width: 1024px)": {
      width: "min(100%, 980px)",
    },
  },
});

export const carouselColumn = style({
  display: "grid",
  justifyItems: "center",
  alignItems: "center",
  gap: 0,
  "@media": {
    "(max-width: 1024px)": {
      width: "100%",
    },
  },
});

export const title = style({
  justifySelf: "center",
  alignSelf: "center",
  fontSize: "clamp(22px, 1.8vw, 28px)",
  fontWeight: 900,
  letterSpacing: 0,
  whiteSpace: "nowrap",
  textAlign: "center",
  "@media": {
    "(max-width: 1024px)": {
      fontSize: "clamp(22px, 2.6vw, 30px)",
    },
  },
});

export const carouselShell = style({
  width: "100%",
  minHeight: "clamp(68px, 6vw, 84px)",
  display: "grid",
  gridTemplateColumns: "30px minmax(0, 1fr) 30px",
  alignItems: "center",
  gap: "clamp(4px, 0.5vw, 8px)",
  padding: "6px 8px",
  borderRadius: 12,
  background:
    "linear-gradient(#f8f8f8, #f8f8f8) padding-box, var(--character-theme) border-box",
  border: "3px solid transparent",
  boxShadow:
    "0 10px 26px color-mix(in srgb, var(--character-accent) 16%, transparent)",
  "@media": {
    "(max-width: 860px)": {
      gridTemplateColumns: "36px minmax(0, 1fr) 36px",
      padding: 10,
    },
    "(max-width: 1024px)": {
      minHeight: "clamp(64px, 6.2vw, 78px)",
      gap: 8,
      padding: "6px 8px",
    },
  },
});

export const carouselCards = style({
  display: "grid",
  gridTemplateColumns: "repeat(6, minmax(48px, 1fr))",
  gap: "clamp(6px, 0.7vw, 12px)",
  alignItems: "center",
  "@media": {
    "(max-width: 960px)": {
      gridTemplateColumns: "repeat(5, minmax(58px, 1fr))",
    },
    "(max-width: 720px)": {
      gridTemplateColumns: "repeat(4, minmax(52px, 1fr))",
    },
    "(max-width: 600px)": {
      gridTemplateColumns: "repeat(3, minmax(52px, 1fr))",
    },
  },
});

export const arrowButton = style({
  width: "100%",
  height: 32,
  border: 0,
  background: "transparent",
  display: "grid",
  placeItems: "center",
  lineHeight: 1,
  cursor: "pointer",
  selectors: {
    "&:hover": {
      color: "#000",
    },
    "&:focus-visible": {
      outline: "3px solid #1497ff",
      borderRadius: 6,
    },
  },
  "@media": {
    "(max-width: 1024px)": {
      height: 42,
    },
  },
});

export const arrowButtonIcon = style({
  width: "clamp(18px, 1.5vw, 24px)",
  height: "clamp(18px, 1.5vw, 24px)",
  display: "block",
  objectFit: "contain",
  pointerEvents: "none",
  userSelect: "none",
  "@media": {
    "(max-width: 1024px)": {
      width: 28,
      height: 28,
    },
  },
});

export const characterCard = style({
  position: "relative",
  aspectRatio: "1 / 1",
  width: "100%",
  minWidth: 0,
  display: "grid",
  overflow: "hidden",
  cursor: "pointer",
  selectors: {
    "&:focus-visible": {
      outline: "3px solid #1497ff",
      outlineOffset: 3,
    },
  },
  "@media": {
    "(max-width: 1024px)": {
      padding: 4,
      gap: 4,
    },
  },
});

export const characterCarouselCard = style({
  placeItems: "center",
  background: paleSurface,
  border: "2px solid transparent",
  borderRadius: 6,
  selectors: {
    "&:hover": {
      filter: "brightness(0.97)",
    },
  },
});

export const characterModalCard = style({
  alignContent: "center",
  justifyItems: "center",
  gap: 10,
  padding: 12,
  border: "3px solid transparent",
  borderRadius: 7,
  background:
    "linear-gradient(145deg, rgba(255,255,255,0.76), rgba(255,255,255,0.9)), var(--character-fill)",
  color: "#111",
  fontWeight: 900,
  transition: "transform 140ms ease, border-color 140ms ease",
  selectors: {
    "&:hover": {
      transform: "translateY(-2px)",
      borderColor: "var(--character-accent)",
      boxShadow:
        "0 10px 18px color-mix(in srgb, var(--character-accent) 18%, transparent)",
    },
  },
});

export const characterModalCardSelected = style({
  borderColor: "#111",
  boxShadow:
    "0 10px 20px color-mix(in srgb, var(--character-accent) 20%, transparent)",
});

export const selectedCharacterCard = style({
  border: "3px solid var(--character-bg-accent)",
  background: "var(--character-soft)",
  boxShadow:
    "0 0 0 3px color-mix(in srgb, var(--character-accent) 25%, transparent)",
});

export const cardImage = style({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  objectPosition: "center top",
  transform: "scale(1.08)",
  pointerEvents: "none",
  userSelect: "none",
});

export const characterCarouselFaceImage = style({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  objectPosition: "center",
  transform: "scale(1.08)",
  pointerEvents: "none",
  userSelect: "none",
});

export const characterModalFaceImage = style({
  width: "54%",
  aspectRatio: "1",
  objectFit: "cover",
  objectPosition: "center",
  boxShadow:
    "0 8px 14px rgba(0,0,0,0.08), 0 0 0 7px color-mix(in srgb, var(--character-accent) 8%, transparent)",
  pointerEvents: "none",
  userSelect: "none",
});

export const characterCardLabel = style({
  maxWidth: "100%",
  color: "#111",
  fontSize: "clamp(11px, 0.92vw, 14px)",
  fontWeight: 900,
  textAlign: "center",
  overflowWrap: "anywhere",
  "@media": {
    "(max-width: 1024px)": {
      fontSize: 12,
    },
  },
});

export const cardPlaceholderText = style({
  maxWidth: "100%",
  padding: "0 6px",
  color: "#555",
  fontSize: "clamp(13px, 1vw, 16px)",
  fontWeight: 800,
  textAlign: "center",
  overflowWrap: "anywhere",
});

export const openModalButton = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  minWidth: "clamp(118px, 7vw, 150px)",
  minHeight: "clamp(34px, 2.8vh, 40px)",
  padding: "3px 14px",
  border: 0,
  borderRadius: 12,
  background: "var(--character-theme)",
  color: "#fff",
  fontSize: "clamp(15px, 1.15vw, 18px)",
  fontWeight: 900,
  cursor: "pointer",
  transform: "translateY(-1px)",
  boxShadow:
    "0 8px 18px color-mix(in srgb, var(--character-accent) 28%, transparent)",
  selectors: {
    "&:hover": {
      filter: "brightness(1.04)",
    },
    "&:focus-visible": {
      outline: "3px solid #1497ff",
      outlineOffset: 4,
    },
  },
});

export const chevronDown = style({
  width: 0,
  height: 0,
  borderLeft: "7px solid transparent",
  borderRight: "7px solid transparent",
  borderTop: "8px solid #fff",
});

export const detailArea = style({
  width: "fit-content",
  maxWidth: "min(100%, 1240px)",
  display: "flex",
  flexDirection: "row",
  alignItems: "start",
  gap: "clamp(30px, 1.5vw, 30px)",
  marginTop: -6,
  marginLeft: "auto",
  marginRight: "auto",
  "@media": {
    "(max-width: 960px)": {
      width: "100%",
      maxWidth: "min(100%, 980px)",
      gap: 40,
    },
    "(max-width: 860px)": {
      flexDirection: "column",
      alignItems: "center",
      gap: 40,
    },
  },
});

export const characterPreview = style({
  width: 264,
  height: 400,
  aspectRatio: "33 / 50",
  minHeight: 400,
  flex: "0 0 264px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "10px 10px 8px",
  boxSizing: "border-box",
  borderRadius: 14,
  background:
    "linear-gradient(rgba(255,255,255,0.66), rgba(255,255,255,0.78)) padding-box, var(--character-theme) border-box",
  border: "3px solid transparent",
  overflow: "hidden",
  "@media": {
    "(max-width: 960px)": {
      width: 260,
      height: 392,
      aspectRatio: "65 / 98",
      minHeight: 392,
      flexBasis: 260,
    },
    "(max-width: 860px)": {
      width: "min(100%, 360px)",
      flex: "0 0 auto",
      height: "clamp(300px, 78vw, 392px)",
      aspectRatio: "65 / 98",
      minHeight: "clamp(300px, 78vw, 392px)",
    },
  },
});

export const characterImage = style({
  width: "100%",
  height: "100%",
  maxWidth: "100%",
  maxHeight: "100%",
  objectFit: "contain",
  objectPosition: "center bottom",
  userSelect: "none",
  pointerEvents: "none",
  display: "block",
  transform:
    "translateY(var(--preview-translate-y, 0px)) scale(var(--preview-scale, 1))",
  transformOrigin: "center bottom",
  "@media": {
    "(max-width: 860px)": {
      transform:
        "translateY(var(--preview-mobile-translate-y, var(--preview-translate-y, 0px))) scale(var(--preview-mobile-scale, var(--preview-scale, 1)))",
    },
  },
});

export const largePlaceholder = style({
  width: "100%",
  height: "100%",
  display: "grid",
  placeItems: "center",
  borderRadius: 0,
  background: "transparent",
  border: 0,
  color: "var(--character-bg-accent)",
  fontSize: 28,
  fontWeight: 900,
});

export const emptyCharacterPreview = style({
  width: "100%",
  height: "100%",
  display: "grid",
  placeItems: "center",
  border: 0,
  borderRadius: 0,
  background: "transparent",
  color: "color-mix(in srgb, var(--character-accent) 64%, #111)",
  fontSize: "clamp(64px, 8vw, 104px)",
  fontWeight: 900,
  boxShadow: "none",
});

export const infoColumn = style({
  width: "100%",
  maxWidth: 720,
  minWidth: 0,
  flex: "1 1 720px",
  display: "grid",
  gridTemplateRows: "auto auto auto minmax(0, 1fr)",
  alignContent: "start",
  gap: "clamp(16px, 0.9vh, 20px)",
  minHeight: 348,
  alignSelf: "start",
  "@media": {
    "(min-width: 961px)": {
      width: "640px",
      maxWidth: "640px",
      minWidth: "640px",
      flex: "0 0 640px",
      height: 400,
      minHeight: 400,
      gridTemplateRows: "auto auto auto minmax(0, 1fr)",
      gap: 18,
    },
    "(max-width: 960px)": {
      flex: "1 1 auto",
      maxWidth: "none",
      minHeight: 392,
    },
    "(max-width: 860px)": {
      minHeight: "clamp(300px, 78vw, 392px)",
    },
  },
});

export const nameRow = style({
  display: "grid",
  gridTemplateColumns: "92px 1fr",
  alignItems: "center",
  gap: 8,
  fontSize: "clamp(21px, 1.8vw, 26px)",
  fontWeight: 900,
  lineHeight: 1.05,
  letterSpacing: 0,
  "@media": {
    "(min-width: 961px)": {
      gridTemplateColumns: "104px 1fr",
      gap: 16,
      fontSize: "clamp(26px, 2vw, 32px)",
      lineHeight: 1.08,
    },
    "(max-width: 960px)": {
      fontSize: "clamp(24px, 3vw, 34px)",
    },
    "(max-width: 560px)": {
      gridTemplateColumns: "86px 1fr",
      gap: 12,
    },
  },
});

export const personalityRow = style({
  display: "grid",
  gridTemplateColumns: "92px 1fr",
  alignItems: "center",
  gap: 8,
  fontSize: "clamp(15px, 1.2vw, 19px)",
  fontWeight: 900,
  lineHeight: 1.1,
  letterSpacing: 0,
  "@media": {
    "(min-width: 961px)": {
      gridTemplateColumns: "104px 1fr",
      gap: 16,
      fontSize: "clamp(18px, 1.45vw, 22px)",
      lineHeight: 1.2,
    },
    "(max-width: 960px)": {
      fontSize: "clamp(17px, 2.2vw, 24px)",
    },
    "(max-width: 560px)": {
      gridTemplateColumns: "86px 1fr",
      gap: 12,
    },
  },
});

export const skillRow = style({
  display: "grid",
  gridTemplateColumns: "92px 1fr",
  alignItems: "start",
  gap: 8,
  fontSize: "clamp(15px, 1.2vw, 19px)",
  fontWeight: 900,
  lineHeight: 1.1,
  letterSpacing: 0,
  "@media": {
    "(min-width: 961px)": {
      gridTemplateColumns: "104px 1fr",
      gap: 16,
      fontSize: "clamp(18px, 1.45vw, 22px)",
      lineHeight: 1.2,
    },
    "(max-width: 960px)": {
      fontSize: "clamp(17px, 2.2vw, 24px)",
    },
    "(max-width: 560px)": {
      gridTemplateColumns: "86px 1fr",
      gap: 12,
    },
  },
});

export const skillSlots = style({
  display: "grid",
  gridTemplateColumns: "repeat(5, clamp(34px, 3vw, 48px))",
  gap: "clamp(5px, 0.45vw, 8px)",
  alignItems: "center",
  "@media": {
    "(min-width: 961px)": {
      gridTemplateColumns: "repeat(5, clamp(48px, 3.4vw, 58px))",
      gap: 10,
    },
    "(max-width: 960px)": {
      gridTemplateColumns: "repeat(5, clamp(34px, 5vw, 46px))",
      gap: 8,
    },
    "(max-width: 560px)": {
      gridTemplateColumns: "repeat(5, minmax(36px, 1fr))",
      gap: 8,
    },
  },
});

export const skillSlot = style({
  position: "relative",
  display: "grid",
  placeItems: "center",
  aspectRatio: "1 / 1",
  width: "100%",
  padding: 0,
  border: "2px solid transparent",
  borderRadius: 6,
  background:
    "linear-gradient(#f1f1f1, #f1f1f1) padding-box, var(--character-theme) border-box",
  color: "var(--character-bg-accent)",
  fontSize: "clamp(12px, 0.9vw, 15px)",
  fontWeight: 900,
  cursor: "pointer",
  selectors: {
    "&:focus-visible": {
      outline: "3px solid #1497ff",
      outlineOffset: 3,
    },
  },
  "@media": {
    "(min-width: 961px)": {
      borderRadius: 8,
      fontSize: "clamp(13px, 0.95vw, 16px)",
    },
    "(max-width: 960px)": {
      fontSize: 13,
    },
  },
});

export const skillSlotImage = style({
  width: "74%",
  height: "74%",
  objectFit: "cover",
  objectPosition: "center",
  pointerEvents: "none",
  userSelect: "none",
  "@media": {
    "(max-width: 960px)": {
      width: "70%",
      height: "70%",
    },
  },
});

export const skillSlotIndex = style({
  position: "absolute",
  right: 3,
  bottom: 2,
  minWidth: 18,
  padding: "1px 4px",
  borderRadius: 999,
  background: "rgba(255,255,255,0.82)",
  color: "var(--character-bg-accent)",
  fontSize: 10,
  fontWeight: 900,
  lineHeight: 1,
  textAlign: "center",
  "@media": {
    "(min-width: 961px)": {
      right: 4,
      bottom: 3,
      minWidth: 20,
      fontSize: 11,
    },
    "(max-width: 960px)": {
      minWidth: 16,
      fontSize: 9,
    },
  },
});

export const selectedSkillSlot = style({
  border: "3px solid var(--character-bg-accent)",
  background:
    "linear-gradient(var(--character-soft), var(--character-soft)) padding-box, var(--character-theme) border-box",
  boxShadow:
    "0 0 0 3px color-mix(in srgb, var(--character-accent) 20%, transparent)",
});

export const emptySkillSlot = style({
  aspectRatio: "1 / 1",
  width: "100%",
  border: "2px dashed color-mix(in srgb, var(--character-accent) 34%, #d9d9d9)",
  borderRadius: 6,
  background:
    "linear-gradient(rgba(255,255,255,0.62), rgba(255,255,255,0.74)), #f1f1f1",
});

export const skillInfo = style({
  width: "100%",
  minHeight: 0,
  maxHeight: "auto",
  boxSizing: "border-box",
  overflowY: "auto",
  overflowX: "hidden",
  display: "grid",
  gap: 6,
  marginTop: 2,
  padding: "10px 12px",
  borderRadius: 12,
  background:
    "linear-gradient(color-mix(in srgb, var(--character-accent) 8%, #f0f0f0), #f0f0f0)",
  border:
    "2px solid color-mix(in srgb, var(--character-accent) 26%, transparent)",
  color: "#050505",
  "@media": {
    "(min-width: 961px)": {
      alignContent: "start",
      height: "100%",
      gap: 14,
      marginTop: 0,
      padding: "18px 22px 20px",
    },
    "(max-width: 960px)": {
      height: "100%",
      maxHeight: "none",
      overflowY: "auto",
      overflowX: "hidden",
    },
  },
});

export const emptySkillInfo = style({
  minWidth: 0,
  minHeight: 0,
  boxSizing: "border-box",
  display: "grid",
  alignContent: "center",
  justifyItems: "start",
  gap: 6,
  padding: "10px 12px",
  border: "2px dashed color-mix(in srgb, var(--character-accent) 36%, #d9d9d9)",
  borderRadius: 12,
  background:
    "linear-gradient(rgba(255,255,255,0.68), rgba(255,255,255,0.88)), var(--character-theme)",
  color: "#111",
  "@media": {
    "(min-width: 961px)": {
      height: "100%",
      minHeight: 0,
      alignContent: "center",
      gap: 10,
      padding: "18px 22px 20px",
    },
    "(max-width: 960px)": {
      height: "100%",
      minHeight: 0,
    },
  },
});

export const skillInfoTop = style({
  display: "flex",
  minWidth: 0,
  alignItems: "flex-start",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: 6,
  "@media": {
    "(min-width: 961px)": {
      gap: 12,
      marginBottom: 2,
    },
    "(max-width: 960px)": {
      gap: 8,
    },
  },
});

export const skillType = style({
  display: "flex",
  minWidth: 0,
  alignItems: "center",
  gap: 4,
  flexWrap: "wrap",
  fontSize: "clamp(18px, 1.35vw, 22px)",
  fontWeight: 900,
  lineHeight: 1.15,
  "@media": {
    "(min-width: 961px)": {
      gap: 9,
      fontSize: "clamp(20px, 1.55vw, 25px)",
      lineHeight: 1.15,
    },
    "(max-width: 960px)": {
      gap: 8,
      fontSize: "clamp(18px, 2.4vw, 24px)",
    },
  },
});

export const skillTypeImage = style({
  width: 34,
  height: 34,
  borderRadius: 10,
  objectFit: "cover",
  objectPosition: "center",
  flex: "0 0 auto",
  pointerEvents: "none",
  userSelect: "none",
  boxShadow: "0 10px 16px rgba(0,0,0,0.1)",
  "@media": {
    "(min-width: 961px)": {
      width: 48,
      height: 48,
      borderRadius: 12,
    },
    "(max-width: 960px)": {
      width: 40,
      height: 40,
    },
  },
});

export const videoControlIcon = style({
  width: 20,
  height: 20,
  display: "block",
  objectFit: "contain",
  pointerEvents: "none",
  userSelect: "none",
});

export const videoControl = style({
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  flexShrink: 0,
  fontSize: "clamp(12px, 0.78vw, 14px)",
  fontWeight: 700,
  whiteSpace: "nowrap",
  "@media": {
    "(min-width: 961px)": {
      gap: 8,
      fontSize: "clamp(12px, 0.92vw, 15px)",
    },
    "(max-width: 960px)": {
      gap: 6,
      fontSize: 13,
    },
  },
});

export const videoControlButton = style({
  width: 38,
  height: 38,
  display: "grid",
  placeItems: "center",
  padding: 0,
  border: 0,
  borderRadius: 999,
  background:
    "linear-gradient(135deg, var(--character-accent), var(--character-bg-accent))",
  boxShadow:
    "0 10px 18px color-mix(in srgb, var(--character-accent) 24%, transparent)",
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
  "@media": {
    "(min-width: 961px)": {
      width: 42,
      height: 42,
    },
  },
});

export const skillDescription = style({
  minWidth: 0,
  display: "grid",
  gap: 4,
  fontSize: "13px",
  lineHeight: 1.45,
  "@media": {
    "(min-width: 961px)": {
      gap: 8,
      fontSize: "14px",
      lineHeight: 1.42,
    },
    "(max-width: 960px)": {
      gap: 6,
      fontSize: 14,
      lineHeight: 1.45,
    },
  },
});

export const descriptionTitle = style({
  fontSize: "clamp(18px, 1.45vw, 22px)",
  fontWeight: 900,
  lineHeight: 1.12,
  "@media": {
    "(min-width: 961px)": {
      fontSize: "clamp(22px, 1.65vw, 26px)",
      lineHeight: 1.12,
    },
  },
});

export const descriptionBody = style({
  margin: 0,
  color: "#050505",
  overflowWrap: "anywhere",
  fontSize: "inherit",
  lineHeight: "inherit",
  "@media": {
    "(min-width: 961px)": {
      fontSize: "14px",
      lineHeight: 1.42,
    },
  },
});

export const skillDetails = style({
  display: "grid",
  gap: 2,
  margin: 0,
  paddingLeft: 18,
  minWidth: 0,
  color: "#111",
  fontSize: "13px",
  lineHeight: 1.45,
  "@media": {
    "(min-width: 961px)": {
      gap: 5,
      marginTop: -1,
      paddingLeft: 22,
      fontSize: "14px",
      lineHeight: 1.42,
    },
    "(max-width: 960px)": {
      gap: 4,
      fontSize: 13,
      lineHeight: 1.45,
    },
  },
});

export const cooldownArea = style({
  minWidth: 0,
  display: "grid",
  gap: 4,
  "@media": {
    "(min-width: 961px)": {
      gap: 10,
      paddingTop: 2,
    },
    "(max-width: 960px)": {
      gap: 8,
    },
  },
});

export const cooldownTitle = style({
  fontSize: "clamp(18px, 1.45vw, 22px)",
  fontWeight: 900,
  lineHeight: 1.12,
  "@media": {
    "(min-width: 961px)": {
      fontSize: "clamp(22px, 1.65vw, 26px)",
      lineHeight: 1.12,
    },
  },
});

export const cooldownGrid = style({
  minWidth: 0,
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(40px, 1fr))",
  gap: 3,
  "@media": {
    "(min-width: 961px)": {
      gridTemplateColumns: "repeat(auto-fit, minmax(62px, 1fr))",
      gap: 8,
    },
    "(max-width: 960px)": {
      gridTemplateColumns: "repeat(auto-fit, minmax(46px, 1fr))",
    },
  },
});

export const cooldownItem = style({
  display: "grid",
  gap: 2,
  justifyItems: "center",
  minWidth: 0,
  color: "#050505",
  "@media": {
    "(min-width: 961px)": {
      gap: 6,
    },
    "(max-width: 960px)": {
      gap: 2,
    },
  },
});

export const cooldownValue = style({
  fontSize: "clamp(14px, 1vw, 16px)",
  fontWeight: 500,
  lineHeight: 1.15,
  whiteSpace: "nowrap",
  "@media": {
    "(min-width: 961px)": {
      fontSize: "clamp(15px, 1.05vw, 18px)",
    },
  },
});

export const cooldownLevel = style({
  fontSize: "clamp(11px, 0.82vw, 13px)",
  color: "#050505",
  lineHeight: 1.1,
  whiteSpace: "nowrap",
  "@media": {
    "(min-width: 961px)": {
      fontSize: "clamp(12px, 0.9vw, 14px)",
    },
  },
});

export const startButtonArea = style({
  display: "grid",
  justifyItems: "center",
  gap: 8,
  "@media": {
    "(max-width: 960px)": {},
  },
});

export const startButton = style({
  width: "clamp(150px, 12vw, 188px)",
  padding: 0,
  border: 0,
  background: "transparent",
  cursor: "pointer",
  transform: "translateZ(0)",
  transition: "transform 140ms ease, filter 140ms ease",
  selectors: {
    "&:hover": {
      transform: "translateY(-2px) scale(1.01)",
      filter: "brightness(1.05)",
    },
    "&:active": {
      transform: "translateY(1px) scale(0.98)",
      filter: "brightness(0.96)",
    },
    "&:focus-visible": {
      outline: "3px solid #1497ff",
      outlineOffset: 6,
      borderRadius: "999px",
    },
  },
  "@media": {
    "(max-width: 960px)": {
      width: "clamp(170px, 24vw, 220px)",
    },
  },
});

export const startButtonDisabled = style({
  cursor: "not-allowed",
  filter: "grayscale(0.55) opacity(0.58)",
  selectors: {
    "&:hover": {
      transform: "translateZ(0)",
      filter: "grayscale(0.55) opacity(0.58)",
    },
    "&:active": {
      transform: "translateZ(0)",
    },
  },
});

export const startButtonImage = style({
  display: "block",
  width: "100%",
  height: "auto",
  pointerEvents: "none",
  userSelect: "none",
  "@media": {
    "(max-width: 960px)": {
      width: "100%",
    },
  },
});

export const unavailableMessage = style({
  margin: 0,
  color: "#d92d20",
  fontSize: "clamp(13px, 1vw, 15px)",
  fontWeight: 900,
  lineHeight: 1.3,
  textAlign: "center",
});

export const modalGrid = style({
  display: "grid",
  gridTemplateColumns: "repeat(5, minmax(120px, 1fr))",
  alignContent: "start",
  gap: "clamp(14px, 2vw, 24px)",
  "@media": {
    "(max-width: 780px)": {
      gridTemplateColumns: "repeat(3, minmax(110px, 1fr))",
    },
    "(max-width: 460px)": {
      gridTemplateColumns: "repeat(2, minmax(100px, 1fr))",
      gap: 12,
    },
  },
});

globalStyle(`${nameRow} strong`, {
  font: "inherit",
});

globalStyle(`${personalityRow} strong`, {
  font: "inherit",
});

globalStyle(`${skillType} strong`, {
  font: "inherit",
});

globalStyle(`${videoControl} button`, {
  width: 50,
  height: 34,
  display: "grid",
  placeItems: "center",
  border: 0,
  borderRadius: 6,
  background: "#fff",
  cursor: "pointer",
});

globalStyle(`${videoControl} button:focus-visible`, {
  outline: "3px solid #1497ff",
  outlineOffset: 3,
});

globalStyle(`${emptySkillInfo} strong`, {
  fontSize: "clamp(24px, 2vw, 34px)",
  fontWeight: 900,
});

globalStyle(`${emptySkillInfo} p`, {
  maxWidth: 420,
  margin: 0,
  color: "#333",
  fontSize: "clamp(16px, 1.1vw, 19px)",
  fontWeight: 700,
  lineHeight: 1.45,
  overflowWrap: "anywhere",
});
