import { globalStyle, style } from "@vanilla-extract/css";

const paleSurface = "#f1f1f1";

export const page = style({
  position: "relative",
  width: "100vw",
  minHeight: "100dvh",
  overflowX: "hidden",
  display: "grid",
  gridTemplateRows: "auto auto 1fr auto",
  justifyItems: "center",
  alignContent: "start",
  gap: "clamp(14px, 1.8vh, 24px)",
  padding: "clamp(28px, 4vh, 50px) clamp(18px, 5vw, 150px) 24px",
  border: "4px solid transparent",
  borderImage: "var(--character-theme) 1",
  background:
    "linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.96)), var(--character-theme)",
  color: "#050505",
  fontFamily: '"Noto Sans KR", "Space Grotesk", sans-serif',
});

export const backButton = style({
  justifySelf: "start",
});

export const topSelectArea = style({
  width: "min(100%, 1380px)",
  display: "grid",
  gridTemplateColumns: "220px minmax(0, 1fr)",
  alignItems: "center",
  gap: "clamp(16px, 3vw, 48px)",
  marginTop: "clamp(18px, 3vh, 48px)",
  "@media": {
    "(max-width: 860px)": {
      gridTemplateColumns: "1fr",
      justifyItems: "center",
      gap: 14,
      marginTop: 10,
    },
  },
});

export const carouselColumn = style({
  display: "grid",
  justifyItems: "center",
  alignItems: "center",
  gap: 0,
});

export const title = style({
  justifySelf: "center",
  alignSelf: "center",
  fontSize: "clamp(26px, 2.2vw, 34px)",
  fontWeight: 900,
  letterSpacing: 0,
  whiteSpace: "nowrap",
  textAlign: "center",
});

export const carouselShell = style({
  width: "100%",
  minHeight: "clamp(130px, 13vw, 200px)",
  display: "grid",
  gridTemplateColumns: "54px minmax(0, 1fr) 54px",
  alignItems: "center",
  gap: "clamp(8px, 1.2vw, 18px)",
  padding: "clamp(14px, 2vw, 26px)",
  borderRadius: 12,
  background:
    "linear-gradient(#f8f8f8, #f8f8f8) padding-box, var(--character-theme) border-box",
  border: "3px solid transparent",
  boxShadow: "0 10px 26px color-mix(in srgb, var(--character-accent) 16%, transparent)",
  "@media": {
    "(max-width: 860px)": {
      gridTemplateColumns: "40px minmax(0, 1fr) 40px",
      padding: 12,
    },
  },
});

export const carouselCards = style({
  display: "grid",
  gridTemplateColumns: "repeat(6, minmax(70px, 1fr))",
  gap: "clamp(10px, 1.8vw, 32px)",
  alignItems: "center",
  "@media": {
    "(max-width: 980px)": {
      gridTemplateColumns: "repeat(3, minmax(68px, 1fr))",
    },
    "(max-width: 520px)": {
      gridTemplateColumns: "repeat(2, minmax(68px, 1fr))",
    },
  },
});

export const arrowButton = style({
  width: "100%",
  height: 72,
  border: 0,
  background: "transparent",
  color: "#1b1b20",
  fontSize: "clamp(58px, 5vw, 76px)",
  fontWeight: 700,
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
});

export const characterCard = style({
  position: "relative",
  aspectRatio: "1 / 1",
  width: "100%",
  minWidth: 0,
  overflow: "hidden",
  display: "grid",
  placeItems: "center",
  padding: 0,
  border: "2px solid transparent",
  borderRadius: 6,
  background: paleSurface,
  cursor: "pointer",
  selectors: {
    "&:hover": {
      filter: "brightness(0.97)",
    },
    "&:focus-visible": {
      outline: "3px solid #1497ff",
      outlineOffset: 3,
    },
  },
});

export const selectedCharacterCard = style({
  border: "3px solid var(--character-bg-accent)",
  background: "var(--character-soft)",
  boxShadow: "0 0 0 3px color-mix(in srgb, var(--character-accent) 25%, transparent)",
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
  gap: 12,
  minWidth: "clamp(140px, 10vw, 190px)",
  minHeight: "clamp(44px, 4vh, 56px)",
  padding: "8px 18px",
  border: 0,
  borderRadius: 12,
  background: "var(--character-theme)",
  color: "#fff",
  fontSize: "clamp(20px, 1.7vw, 26px)",
  fontWeight: 900,
  cursor: "pointer",
  transform: "translateY(-6px)",
  boxShadow: "0 8px 18px color-mix(in srgb, var(--character-accent) 28%, transparent)",
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
  borderLeft: "10px solid transparent",
  borderRight: "10px solid transparent",
  borderTop: "12px solid #fff",
});

export const detailArea = style({
  width: "min(100%, 1140px)",
  display: "grid",
  gridTemplateColumns: "minmax(260px, 0.82fr) minmax(360px, 1fr)",
  alignItems: "start",
  gap: "clamp(30px, 5vw, 90px)",
  marginTop: "clamp(8px, 1vh, 18px)",
  "@media": {
    "(max-width: 920px)": {
      gridTemplateColumns: "1fr",
      alignItems: "center",
      justifyItems: "center",
      gap: 18,
    },
  },
});

export const characterPreview = style({
  width: "min(100%, 300px)",
  height: "clamp(190px, 25vw, 310px)",
  display: "grid",
  alignItems: "end",
  justifyItems: "center",
  alignSelf: "start",
  "@media": {
    "(max-width: 920px)": {
      width: "min(100%, 410px)",
      height: "clamp(320px, 48vh, 560px)",
      alignSelf: "center",
    },
  },
});

export const characterImage = style({
  width: "100%",
  height: "100%",
  objectFit: "contain",
  objectPosition: "center bottom",
  userSelect: "none",
  pointerEvents: "none",
});

export const largePlaceholder = style({
  width: "min(86vw, 360px)",
  height: "min(70vw, 520px)",
  display: "grid",
  placeItems: "center",
  borderRadius: 10,
  background:
    "linear-gradient(var(--character-soft), var(--character-soft)) padding-box, var(--character-theme) border-box",
  border: "3px solid transparent",
  color: "var(--character-bg-accent)",
  fontSize: 28,
  fontWeight: 900,
});

export const emptyCharacterPreview = style({
  width: "min(86vw, 300px)",
  height: "min(70vw, 310px)",
  display: "grid",
  placeItems: "center",
  border: "3px dashed transparent",
  borderRadius: 12,
  background:
    "linear-gradient(rgba(255,255,255,0.74), rgba(255,255,255,0.9)) padding-box, var(--character-theme) border-box",
  color: "color-mix(in srgb, var(--character-accent) 64%, #111)",
  fontSize: "clamp(64px, 8vw, 104px)",
  fontWeight: 900,
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.9), 0 16px 28px color-mix(in srgb, var(--character-accent) 13%, transparent)",
});

export const infoColumn = style({
  width: "100%",
  maxWidth: 640,
  minWidth: 0,
  display: "grid",
  gap: "clamp(16px, 2vh, 24px)",
});

export const nameRow = style({
  display: "grid",
  gridTemplateColumns: "120px 1fr",
  alignItems: "center",
  gap: 22,
  fontSize: "clamp(34px, 3.4vw, 54px)",
  fontWeight: 900,
  lineHeight: 1.05,
  letterSpacing: 0,
  "@media": {
    "(max-width: 560px)": {
      gridTemplateColumns: "86px 1fr",
      gap: 12,
    },
  },
});

export const personalityRow = style({
  display: "grid",
  gridTemplateColumns: "120px 1fr",
  alignItems: "center",
  gap: 22,
  fontSize: "clamp(25px, 2.5vw, 38px)",
  fontWeight: 900,
  lineHeight: 1.1,
  letterSpacing: 0,
  "@media": {
    "(max-width: 560px)": {
      gridTemplateColumns: "86px 1fr",
      gap: 12,
    },
  },
});

export const skillRow = style({
  display: "grid",
  gridTemplateColumns: "120px 1fr",
  alignItems: "center",
  gap: 22,
  fontSize: "clamp(25px, 2.5vw, 38px)",
  fontWeight: 900,
  lineHeight: 1.1,
  letterSpacing: 0,
  "@media": {
    "(max-width: 560px)": {
      gridTemplateColumns: "86px 1fr",
      gap: 12,
    },
  },
});

export const skillSlots = style({
  display: "grid",
  gridTemplateColumns: "repeat(5, clamp(48px, 5vw, 72px))",
  gap: "clamp(12px, 2vw, 28px)",
  alignItems: "center",
  "@media": {
    "(max-width: 560px)": {
      gridTemplateColumns: "repeat(5, minmax(36px, 1fr))",
      gap: 8,
    },
  },
});

export const skillSlot = style({
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
  fontSize: "clamp(13px, 1.1vw, 17px)",
  fontWeight: 900,
  cursor: "pointer",
  selectors: {
    "&:focus-visible": {
      outline: "3px solid #1497ff",
      outlineOffset: 3,
    },
  },
});

export const selectedSkillSlot = style({
  border: "3px solid var(--character-bg-accent)",
  background:
    "linear-gradient(var(--character-soft), var(--character-soft)) padding-box, var(--character-theme) border-box",
  boxShadow: "0 0 0 3px color-mix(in srgb, var(--character-accent) 20%, transparent)",
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
  minWidth: 0,
  maxHeight: "clamp(260px, 30vh, 360px)",
  overflowY: "auto",
  overflowX: "hidden",
  display: "grid",
  gap: 18,
  padding: "clamp(22px, 2.4vw, 34px)",
  borderRadius: 12,
  background:
    "linear-gradient(color-mix(in srgb, var(--character-accent) 8%, #f0f0f0), #f0f0f0)",
  border: "2px solid color-mix(in srgb, var(--character-accent) 26%, transparent)",
  color: "#050505",
});

export const emptySkillInfo = style({
  minWidth: 0,
  minHeight: "clamp(220px, 26vh, 320px)",
  display: "grid",
  alignContent: "center",
  justifyItems: "start",
  gap: 14,
  padding: "clamp(22px, 2.4vw, 34px)",
  border: "2px dashed color-mix(in srgb, var(--character-accent) 36%, #d9d9d9)",
  borderRadius: 12,
  background:
    "linear-gradient(rgba(255,255,255,0.68), rgba(255,255,255,0.88)), var(--character-theme)",
  color: "#111",
});

export const skillInfoTop = style({
  display: "flex",
  minWidth: 0,
  alignItems: "flex-start",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: 16,
});

export const skillType = style({
  display: "flex",
  minWidth: 0,
  alignItems: "center",
  gap: 20,
  flexWrap: "wrap",
  fontSize: "clamp(28px, 2.2vw, 40px)",
  fontWeight: 900,
  lineHeight: 1.15,
});

export const videoControl = style({
  display: "inline-flex",
  alignItems: "center",
  gap: 12,
  flexShrink: 0,
  fontSize: "clamp(14px, 1vw, 18px)",
  fontWeight: 700,
  whiteSpace: "nowrap",
});

export const skillDescription = style({
  minWidth: 0,
  display: "grid",
  gap: 12,
  fontSize: "clamp(15px, 1.1vw, 18px)",
  lineHeight: 1.45,
});

export const skillDetails = style({
  display: "grid",
  gap: 8,
  margin: 0,
  paddingLeft: 18,
  minWidth: 0,
  color: "#111",
  fontSize: "clamp(14px, 1vw, 17px)",
  lineHeight: 1.45,
});

export const cooldownArea = style({
  minWidth: 0,
  display: "grid",
  gap: 12,
});

export const cooldownGrid = style({
  minWidth: 0,
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(54px, 1fr))",
  gap: 8,
});

export const cooldownItem = style({
  display: "grid",
  gap: 4,
  justifyItems: "center",
  minWidth: 0,
  color: "#050505",
});

export const startButton = style({
  width: "clamp(230px, 20vw, 320px)",
  alignSelf: "end",
  padding: 0,
  border: 0,
  background: "transparent",
  cursor: "pointer",
  transform: "translateZ(0)",
  transition: "transform 140ms ease, filter 140ms ease",
  selectors: {
    "&:hover": {
      transform: "translateY(-3px) scale(1.02)",
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
});

export const modalGrid = style({
  display: "grid",
  gridTemplateColumns: "repeat(5, minmax(92px, 1fr))",
  alignContent: "start",
  gap: "clamp(14px, 2vw, 24px)",
  "@media": {
    "(max-width: 780px)": {
      gridTemplateColumns: "repeat(3, minmax(82px, 1fr))",
    },
    "(max-width: 460px)": {
      gridTemplateColumns: "repeat(2, minmax(78px, 1fr))",
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
  width: 62,
  height: 38,
  display: "grid",
  placeItems: "center",
  border: 0,
  borderRadius: 6,
  background: "#fff",
  cursor: "pointer",
});

globalStyle(`${videoControl} button span`, {
  position: "relative",
  width: 22,
  height: 16,
  display: "block",
  borderRadius: 3,
  background: "#202326",
});

globalStyle(`${videoControl} button span::after`, {
  content: "",
  position: "absolute",
  top: 3,
  right: -9,
  width: 0,
  height: 0,
  borderTop: "5px solid transparent",
  borderBottom: "5px solid transparent",
  borderLeft: "10px solid #202326",
});

globalStyle(`${videoControl} button:focus-visible`, {
  outline: "3px solid #1497ff",
  outlineOffset: 3,
});

globalStyle(`${skillDescription} strong`, {
  fontSize: "clamp(20px, 1.7vw, 26px)",
  fontWeight: 900,
});

globalStyle(`${skillDescription} p`, {
  margin: 0,
  color: "#050505",
  overflowWrap: "anywhere",
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

globalStyle(`${cooldownArea} > strong`, {
  fontSize: "clamp(20px, 1.7vw, 26px)",
  fontWeight: 900,
});

globalStyle(`${cooldownItem} span`, {
  fontSize: "clamp(13px, 1vw, 17px)",
  fontWeight: 500,
  whiteSpace: "nowrap",
});

globalStyle(`${cooldownItem} small`, {
  fontSize: "clamp(11px, 0.8vw, 14px)",
  color: "#050505",
  whiteSpace: "nowrap",
});
