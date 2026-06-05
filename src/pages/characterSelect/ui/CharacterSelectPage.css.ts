import { globalStyle, style } from "@vanilla-extract/css";

const paleSurface = "#f1f1f1";

export const page = style({
  position: "relative",
  width: "100vw",
  height: "100dvh",
  overflowX: "hidden",
  overflowY: "hidden",
  display: "grid",
  gridTemplateRows: "auto auto 1fr auto",
  justifyItems: "center",
  alignContent: "start",
  gap: "clamp(10px, 1.2vh, 18px)",
  padding: "clamp(18px, 2.5vh, 30px) clamp(16px, 4vw, 96px) 16px",
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
  width: "min(100%, 1380px)",
  display: "grid",
  gridTemplateColumns: "220px minmax(0, 1fr)",
  alignItems: "center",
  gap: "clamp(12px, 2vw, 28px)",
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
  fontSize: "clamp(26px, 2.2vw, 34px)",
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
  minHeight: "clamp(104px, 10vw, 148px)",
  display: "grid",
  gridTemplateColumns: "44px minmax(0, 1fr) 44px",
  alignItems: "center",
  gap: "clamp(6px, 1vw, 12px)",
  padding: "clamp(10px, 1.4vw, 18px)",
  borderRadius: 12,
  background:
    "linear-gradient(#f8f8f8, #f8f8f8) padding-box, var(--character-theme) border-box",
  border: "3px solid transparent",
  boxShadow: "0 10px 26px color-mix(in srgb, var(--character-accent) 16%, transparent)",
  "@media": {
    "(max-width: 860px)": {
      gridTemplateColumns: "36px minmax(0, 1fr) 36px",
      padding: 10,
    },
    "(max-width: 1024px)": {
      minHeight: "clamp(92px, 9vw, 120px)",
      gap: 8,
      padding: "8px 10px",
    },
  },
});

export const carouselCards = style({
  display: "grid",
  gridTemplateColumns: "repeat(6, minmax(70px, 1fr))",
  gap: "clamp(10px, 1.8vw, 32px)",
  alignItems: "center",
  "@media": {
    "(max-width: 1024px)": {
      gridTemplateColumns: "repeat(3, minmax(58px, 1fr))",
      gap: 8,
    },
    "(max-width: 980px)": {
      gridTemplateColumns: "repeat(3, minmax(58px, 1fr))",
    },
    "(max-width: 520px)": {
      gridTemplateColumns: "repeat(2, minmax(52px, 1fr))",
    },
  },
});

export const arrowButton = style({
  width: "100%",
  height: 54,
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
  width: "clamp(28px, 2.8vw, 40px)",
  height: "clamp(28px, 2.8vw, 40px)",
  display: "block",
  objectFit: "contain",
  pointerEvents: "none",
  userSelect: "none",
  "@media": {
    "(max-width: 1024px)": {
      width: 24,
      height: 24,
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
      padding: 6,
      gap: 6,
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
  gap: "clamp(18px, 3vw, 40px)",
  marginTop: 0,
  "@media": {
    "(max-width: 920px)": {
      gridTemplateColumns: "1fr",
      alignItems: "center",
      justifyItems: "center",
      gap: 12,
    },
    "(max-width: 1024px)": {
      width: "min(100%, 980px)",
      gap: 14,
    },
  },
});

export const characterPreview = style({
  width: "min(100%, 300px)",
  height: "clamp(150px, 18vw, 210px)",
  display: "grid",
  alignItems: "end",
  justifyItems: "center",
  alignSelf: "start",
  "@media": {
    "(max-width: 920px)": {
      width: "min(100%, 410px)",
      height: "clamp(200px, 28vh, 320px)",
      alignSelf: "center",
    },
    "(max-width: 1024px)": {
      width: "min(100%, 380px)",
      height: "clamp(190px, 26vh, 280px)",
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
  transform: "translateY(var(--preview-translate-y, 0px)) scale(var(--preview-scale, 1))",
  transformOrigin: "center bottom",
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
  gap: "clamp(10px, 1.4vh, 16px)",
  "@media": {
    "(max-width: 1024px)": {
      maxWidth: 860,
    },
  },
});

export const nameRow = style({
  display: "grid",
  gridTemplateColumns: "120px 1fr",
  alignItems: "center",
  gap: 22,
  fontSize: "clamp(26px, 2.6vw, 38px)",
  fontWeight: 900,
  lineHeight: 1.05,
  letterSpacing: 0,
  "@media": {
    "(max-width: 1024px)": {
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
  gridTemplateColumns: "120px 1fr",
  alignItems: "center",
  gap: 22,
  fontSize: "clamp(18px, 1.8vw, 26px)",
  fontWeight: 900,
  lineHeight: 1.1,
  letterSpacing: 0,
  "@media": {
    "(max-width: 1024px)": {
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
  gridTemplateColumns: "120px 1fr",
  alignItems: "center",
  gap: 22,
  fontSize: "clamp(18px, 1.8vw, 26px)",
  fontWeight: 900,
  lineHeight: 1.1,
  letterSpacing: 0,
  "@media": {
    "(max-width: 1024px)": {
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
  gridTemplateColumns: "repeat(5, clamp(40px, 4vw, 58px))",
  gap: "clamp(8px, 1.2vw, 16px)",
  alignItems: "center",
  "@media": {
    "(max-width: 1024px)": {
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
  fontSize: "clamp(13px, 1.1vw, 17px)",
  fontWeight: 900,
  cursor: "pointer",
  selectors: {
    "&:focus-visible": {
      outline: "3px solid #1497ff",
      outlineOffset: 3,
    },
  },
  "@media": {
    "(max-width: 1024px)": {
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
    "(max-width: 1024px)": {
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
    "(max-width: 1024px)": {
      minWidth: 16,
      fontSize: 9,
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
  maxHeight: "clamp(180px, 24vh, 260px)",
  overflowY: "auto",
  overflowX: "hidden",
  display: "grid",
  gap: 12,
  padding: "clamp(16px, 2vw, 24px)",
  borderRadius: 12,
  background:
    "linear-gradient(color-mix(in srgb, var(--character-accent) 8%, #f0f0f0), #f0f0f0)",
  border: "2px solid color-mix(in srgb, var(--character-accent) 26%, transparent)",
  color: "#050505",
  "@media": {
    "(max-width: 1024px)": {
      maxHeight: "none",
    },
  },
});

export const emptySkillInfo = style({
  minWidth: 0,
  minHeight: "clamp(170px, 20vh, 220px)",
  display: "grid",
  alignContent: "center",
  justifyItems: "start",
  gap: 10,
  padding: "clamp(16px, 2vw, 24px)",
  border: "2px dashed color-mix(in srgb, var(--character-accent) 36%, #d9d9d9)",
  borderRadius: 12,
  background:
    "linear-gradient(rgba(255,255,255,0.68), rgba(255,255,255,0.88)), var(--character-theme)",
  color: "#111",
  "@media": {
    "(max-width: 1024px)": {
      minHeight: "unset",
    },
  },
});

export const skillInfoTop = style({
  display: "flex",
  minWidth: 0,
  alignItems: "flex-start",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: 16,
  "@media": {
    "(max-width: 1024px)": {
      gap: 10,
    },
  },
});

export const skillType = style({
  display: "flex",
  minWidth: 0,
  alignItems: "center",
  gap: 12,
  flexWrap: "wrap",
  fontSize: "clamp(28px, 2.2vw, 40px)",
  fontWeight: 900,
  lineHeight: 1.15,
  "@media": {
    "(max-width: 1024px)": {
      gap: 10,
      fontSize: "clamp(22px, 2.4vw, 32px)",
    },
  },
});

export const skillTypeImage = style({
  width: 48,
  height: 48,
  borderRadius: 10,
  objectFit: "cover",
  objectPosition: "center",
  flex: "0 0 auto",
  pointerEvents: "none",
  userSelect: "none",
  boxShadow: "0 10px 16px rgba(0,0,0,0.1)",
  "@media": {
    "(max-width: 1024px)": {
      width: 42,
      height: 42,
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
  fontSize: "clamp(14px, 1vw, 18px)",
  fontWeight: 700,
  whiteSpace: "nowrap",
  "@media": {
    "(max-width: 1024px)": {
      gap: 6,
      fontSize: 14,
    },
  },
});

export const skillDescription = style({
  minWidth: 0,
  display: "grid",
  gap: 8,
  fontSize: "clamp(13px, 0.95vw, 16px)",
  lineHeight: 1.35,
  "@media": {
    "(max-width: 1024px)": {
      gap: 6,
      fontSize: 13,
    },
  },
});

export const skillDetails = style({
  display: "grid",
  gap: 6,
  margin: 0,
  paddingLeft: 18,
  minWidth: 0,
  color: "#111",
  fontSize: "clamp(12px, 0.95vw, 15px)",
  lineHeight: 1.35,
  "@media": {
    "(max-width: 1024px)": {
      gap: 4,
      fontSize: 12,
    },
  },
});

export const cooldownArea = style({
  minWidth: 0,
  display: "grid",
  gap: 12,
  "@media": {
    "(max-width: 1024px)": {
      gap: 8,
    },
  },
});

export const cooldownGrid = style({
  minWidth: 0,
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(54px, 1fr))",
  gap: 8,
  "@media": {
    "(max-width: 1024px)": {
      gridTemplateColumns: "repeat(auto-fit, minmax(48px, 1fr))",
    },
  },
});

export const cooldownItem = style({
  display: "grid",
  gap: 4,
  justifyItems: "center",
  minWidth: 0,
  color: "#050505",
  "@media": {
    "(max-width: 1024px)": {
      gap: 2,
    },
  },
});

export const startButton = style({
  width: "clamp(190px, 16vw, 250px)",
  alignSelf: "end",
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
    "(max-width: 1024px)": {
      width: "clamp(170px, 24vw, 220px)",
      alignSelf: "center",
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
    "(max-width: 1024px)": {
      width: "100%",
    },
  },
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
