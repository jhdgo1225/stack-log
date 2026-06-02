import { keyframes, style } from "@vanilla-extract/css";

const modalIn = keyframes({
  from: { opacity: 0, transform: "translateY(12px) scale(0.98)" },
  to: { opacity: 1, transform: "translateY(0) scale(1)" },
});

export const profilePage = style({
  height: "100vh",
  overflow: "hidden",
  padding: "24px clamp(16px, 4vw, 64px) 18px",
  background: "var(--profile-surface-bg)",
  color: "#121212",
  "@media": {
    "(max-width: 960px)": {
      height: "auto",
      minHeight: "100vh",
      overflowY: "auto",
      padding: "18px 14px 24px",
    },
  },
});

export const shell = style({
  width: "min(1180px, 100%)",
  margin: "0 auto",
  position: "relative",
});

export const topBar = style({
  display: "grid",
  gridTemplateColumns: "1fr auto 1fr",
  alignItems: "start",
  gap: 18,
  marginBottom: 12,
  "@media": {
    "(max-width: 760px)": {
      gridTemplateColumns: "1fr",
    },
  },
});

export const backButton = style({
  justifySelf: "start",
});

export const favorite = style({
  justifySelf: "center",
  display: "grid",
  justifyItems: "center",
  gap: 6,
});

export const favoriteBadge = style({
  padding: "5px 10px",
  borderRadius: 6,
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.72), rgba(255,255,255,0.46)), var(--profile-accent-fill)",
  boxShadow: "var(--profile-soft-shadow)",
  fontSize: 14,
  fontWeight: 800,
});

export const favoriteName = style({
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  fontSize: 24,
  fontWeight: 800,
});

export const characterDot = style({
  width: 26,
  height: 26,
  borderRadius: "50%",
  background:
    "radial-gradient(circle at 35% 28%, rgba(255,255,255,0.8), transparent 34%), var(--profile-accent-fill)",
  boxShadow: "var(--profile-soft-shadow)",
});

export const compactCharacterDot = style({
  width: 18,
  height: 18,
  borderRadius: "50%",
  background:
    "radial-gradient(circle at 35% 28%, rgba(255,255,255,0.8), transparent 34%), var(--profile-accent-fill)",
  boxShadow: "var(--profile-soft-shadow)",
});

export const summaryGrid = style({
  display: "grid",
  gridTemplateColumns: "320px minmax(0, 1fr)",
  alignItems: "stretch",
  gap: 24,
  width: "min(1080px, 100%)",
  margin: "0 auto 10px",
  "@media": {
    "(max-width: 960px)": {
      gridTemplateColumns: "1fr",
      width: "min(560px, 100%)",
    },
  },
});

export const profileCard = style({
  minHeight: 230,
  display: "grid",
  alignContent: "center",
  justifyItems: "center",
  gap: 10,
  padding: 18,
  position: "relative",
  overflow: "hidden",
  border: "2px solid transparent",
  borderRadius: 10,
  background:
    "linear-gradient(var(--profile-panel-bg), var(--profile-panel-bg)) padding-box, var(--profile-border-gradient) border-box",
  boxShadow: "var(--profile-shadow), inset 0 1px 0 rgba(255,255,255,0.85)",
});

export const profileAvatar = style({
  width: 132,
  aspectRatio: "1",
  borderRadius: "50%",
  border: "8px solid transparent",
  background:
    "linear-gradient(145deg, #d9d9d9, #ececec) padding-box, var(--profile-border-gradient) border-box",
  boxShadow: "var(--profile-ring-shadow)",
});

export const nicknameRow = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  width: "100%",
  minWidth: 0,
});

export const nicknameChip = style({
  flex: "0 0 auto",
  padding: "5px 8px",
  borderRadius: 6,
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.72), rgba(255,255,255,0.48)), var(--profile-accent-fill)",
  fontSize: 14,
  fontWeight: 800,
});

export const nicknameText = style({
  minWidth: 0,
  maxWidth: 170,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: 17,
  fontWeight: 800,
});

export const nicknameInput = style({
  width: "min(180px, 100%)",
  padding: "7px 9px",
  border: "1px solid color-mix(in srgb, var(--profile-accent) 70%, #111)",
  borderRadius: 6,
  fontSize: 15,
  fontWeight: 700,
});

export const smallButton = style({
  minHeight: 34,
  padding: "6px 14px",
  border: 0,
  borderRadius: 6,
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.7), rgba(255,255,255,0.46)), var(--profile-accent-fill)",
  color: "#111",
  fontSize: 16,
  fontWeight: 800,
  cursor: "pointer",
  transition: "transform 140ms ease, filter 140ms ease",
  selectors: {
    "&:hover": {
      transform: "translateY(-1px)",
      filter: "brightness(0.98)",
    },
    "&:focus-visible": {
      outline: "3px solid var(--profile-accent)",
      outlineOffset: 3,
    },
  },
});

export const statsPanel = style({
  minHeight: 230,
  display: "grid",
  gridTemplateColumns: "150px minmax(0, 1fr)",
  gap: 16,
  padding: "18px 30px",
  border: "2px solid transparent",
  borderRadius: 10,
  background:
    "linear-gradient(var(--profile-panel-bg), var(--profile-panel-bg)) padding-box, var(--profile-border-gradient) border-box",
  boxShadow: "var(--profile-shadow), inset 0 1px 0 rgba(255,255,255,0.85)",
  "@media": {
    "(max-width: 620px)": {
      gridTemplateColumns: "1fr",
      padding: 22,
    },
  },
});

export const statsTitle = style({
  margin: 0,
  fontSize: 26,
  fontWeight: 900,
});

export const selectorGroup = style({
  display: "grid",
  alignContent: "start",
  gap: 13,
});

export const selectorLabel = style({
  fontSize: 16,
  fontWeight: 800,
});

export const selectedCharacterButton = style({
  justifySelf: "start",
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  minHeight: 36,
  padding: "6px 10px",
  border: 0,
  borderRadius: 8,
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.64), rgba(255,255,255,0.38)), var(--profile-accent-fill)",
  fontSize: 13,
  fontWeight: 800,
  cursor: "pointer",
  transition: "transform 140ms ease, box-shadow 140ms ease",
  selectors: {
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "var(--profile-soft-shadow)",
    },
    "&:focus-visible": {
      outline: "3px solid var(--profile-accent)",
      outlineOffset: 3,
    },
  },
});

export const statsList = style({
  display: "grid",
  gap: 10,
  alignContent: "start",
});

export const statRow = style({
  display: "grid",
  gridTemplateColumns: "130px minmax(0, 1fr)",
  alignItems: "center",
  gap: 16,
  fontSize: 16,
  "@media": {
    "(max-width: 540px)": {
      gridTemplateColumns: "1fr",
      gap: 4,
    },
  },
});

export const statLabel = style({
  fontWeight: 800,
});

export const statValue = style({
  fontWeight: 800,
});

export const skillRow = style({
  display: "grid",
  gridTemplateColumns: "130px minmax(0, 1fr)",
  gap: 16,
  alignItems: "start",
  "@media": {
    "(max-width: 540px)": {
      gridTemplateColumns: "1fr",
      gap: 8,
    },
  },
});

export const skillSlots = style({
  display: "flex",
  alignItems: "start",
  gap: 12,
  flexWrap: "nowrap",
  minWidth: 0,
});

export const skillButton = style({
  position: "relative",
  width: 38,
  display: "grid",
  justifyItems: "center",
  gap: 5,
  padding: 0,
  border: 0,
  background: "transparent",
  fontSize: 12,
  fontWeight: 800,
  cursor: "help",
  selectors: {
    "&:focus-visible": {
      outline: "3px solid var(--profile-accent)",
      outlineOffset: 5,
      borderRadius: 6,
    },
  },
});

export const skillIcon = style({
  width: 34,
  height: 34,
  borderRadius: 6,
  background: "#F0F0F0",
});

export const tooltip = style({
  position: "absolute",
  left: "50%",
  bottom: "calc(100% + 8px)",
  zIndex: 5,
  minWidth: 88,
  padding: "7px 9px",
  borderRadius: 5,
  background: "#D9D9D9",
  color: "#111",
  fontSize: 13,
  fontWeight: 800,
  transform: "translateX(-50%)",
  opacity: 0,
  pointerEvents: "none",
  transition: "opacity 120ms ease",
  selectors: {
    [`${skillButton}:hover &`]: {
      opacity: 1,
    },
    [`${skillButton}:focus-visible &`]: {
      opacity: 1,
    },
  },
});

export const skillHelp = style({
  alignSelf: "start",
  maxWidth: 155,
  color: "#6f6f6f",
  fontSize: 10,
  fontWeight: 700,
  lineHeight: 1.25,
  marginTop: 3,
  whiteSpace: "pre-line",
});

export const sectionTitle = style({
  width: "min(930px, 100%)",
  margin: "6px auto 6px",
  fontSize: 27,
  fontWeight: 900,
});

export const recordGrid = style({
  width: "min(940px, 100%)",
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "4px 14px",
  "@media": {
    "(max-width: 960px)": {
      gridTemplateColumns: "1fr",
      maxHeight: "min(560px, 62vh)",
      overflowY: "auto",
      paddingRight: 4,
    },
  },
});

export const recordCard = style({
  minHeight: 74,
  display: "grid",
  gridTemplateColumns: "66px minmax(0, 1fr) 150px",
  gap: 8,
  alignItems: "center",
  padding: "5px 12px 5px 8px",
  borderRadius: 6,
  background:
    "linear-gradient(100deg, color-mix(in srgb, var(--record-accent) 24%, #fff) 0%, rgba(255,255,255,0.98) 46%, color-mix(in srgb, var(--record-accent) 6%, #fff) 100%)",
  boxShadow:
    "0 7px 14px color-mix(in srgb, var(--record-accent) 10%, transparent), inset 0 1px 0 rgba(255,255,255,0.72)",
  transition: "transform 140ms ease, box-shadow 140ms ease",
  selectors: {
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 10px 18px rgba(0, 0, 0, 0.1)",
    },
  },
  "@media": {
    "(max-width: 560px)": {
      gridTemplateColumns: "72px minmax(0, 1fr)",
      alignItems: "start",
    },
  },
});

export const recordFace = style({
  width: 54,
  aspectRatio: "1",
  borderRadius: "50%",
  background:
    "linear-gradient(145deg, #d9d9d9, #eeeeee), radial-gradient(circle at 50% 42%, color-mix(in srgb, var(--record-accent) 18%, transparent), transparent 64%)",
  boxShadow:
    "0 6px 10px rgba(0,0,0,0.08), 0 0 0 5px color-mix(in srgb, var(--record-accent) 8%, transparent)",
  "@media": {
    "(max-width: 560px)": {
      width: 62,
    },
  },
});

export const recordMain = style({
  minWidth: 0,
  display: "grid",
  gap: 5,
});

export const recordScoreLine = style({
  minWidth: 0,
  display: "flex",
  alignItems: "center",
  gap: 9,
  fontSize: 17,
  fontWeight: 900,
  whiteSpace: "nowrap",
});

export const recordDivider = style({
  width: 1,
  height: 19,
  background: "var(--record-accent)",
});

export const recordSkills = style({
  display: "flex",
  gap: 7,
  flexWrap: "wrap",
});

export const recordSkill = style({
  display: "grid",
  justifyItems: "center",
  gap: 3,
  color: "#111",
  fontSize: 10,
  fontWeight: 800,
});

export const recordSkillIcon = style({
  width: 24,
  height: 24,
  borderRadius: 4,
  background:
    "linear-gradient(145deg, #d9d9d9, #efefef), linear-gradient(180deg, color-mix(in srgb, var(--record-accent) 8%, transparent), transparent)",
});

export const recordMeta = style({
  display: "grid",
  gap: 3,
  fontSize: 11,
  fontWeight: 800,
  lineHeight: 1.08,
  "@media": {
    "(max-width: 560px)": {
      gridColumn: "1 / -1",
      gridTemplateColumns: "1fr 1fr",
    },
  },
});

export const metaRow = style({
  display: "grid",
  gridTemplateColumns: "62px minmax(0, 1fr)",
  alignItems: "center",
  gap: 6,
});

export const metaBadge = style({
  justifySelf: "start",
  padding: "3px 6px",
  borderRadius: 7,
  background:
    "linear-gradient(180deg, color-mix(in srgb, var(--record-accent) 28%, #fff), color-mix(in srgb, var(--record-accent) 16%, #fff))",
  fontSize: 10,
});

export const pagination = style({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: 8,
  marginTop: 4,
  flexWrap: "wrap",
});

export const pageButton = style({
  minWidth: 28,
  height: 28,
  display: "grid",
  placeItems: "center",
  padding: 0,
  border: 0,
  borderRadius: "50%",
  background: "transparent",
  color: "#111",
  fontSize: 16,
  fontWeight: 900,
  cursor: "pointer",
  selectors: {
    "&:hover": {
      background: "#F0F0F0",
    },
    "&:disabled": {
      color: "#aaa",
      cursor: "not-allowed",
    },
    "&:focus-visible": {
      outline: "3px solid var(--profile-accent)",
      outlineOffset: 2,
    },
  },
});

export const pageButtonActive = style({
  background:
    "radial-gradient(circle at 34% 28%, rgba(255,255,255,0.7), transparent 34%), var(--profile-accent-fill)",
  boxShadow: "var(--profile-soft-shadow)",
});

export const modalBackdrop = style({
  position: "fixed",
  inset: 0,
  zIndex: 20,
  display: "grid",
  placeItems: "center",
  padding: 24,
  background: "rgba(0, 0, 0, 0.22)",
  backdropFilter: "grayscale(0.65)",
});

export const modal = style({
  position: "relative",
  width: "min(1020px, 100%)",
  maxHeight: "min(730px, 88vh)",
  display: "grid",
  gridTemplateRows: "auto minmax(0, 1fr)",
  gap: 24,
  padding: "30px 44px",
  borderRadius: 12,
  background: "#fff",
  animation: `${modalIn} 180ms ease`,
  "@media": {
    "(max-width: 720px)": {
      padding: "24px 18px",
    },
  },
});

export const modalClose = style({
  position: "absolute",
  top: 24,
  right: 28,
  width: 36,
  height: 36,
  border: 0,
  background: "transparent",
  color: "#111",
  fontSize: 34,
  lineHeight: 1,
  cursor: "pointer",
  selectors: {
    "&:focus-visible": {
      outline: "3px solid var(--profile-accent)",
      outlineOffset: 2,
      borderRadius: 4,
    },
  },
});

export const searchRow = style({
  display: "flex",
  justifyContent: "center",
  gap: 18,
  paddingRight: 52,
  "@media": {
    "(max-width: 560px)": {
      justifyContent: "start",
      gap: 10,
      paddingRight: 42,
    },
  },
});

export const searchInput = style({
  width: "min(280px, 100%)",
  minHeight: 46,
  padding: "8px 14px",
  border: 0,
  borderRadius: 2,
  background: "#F0F0F0",
  fontSize: 16,
  fontWeight: 800,
  selectors: {
    "&:focus-visible": {
      outline: "3px solid var(--profile-accent)",
      outlineOffset: 2,
    },
  },
});

export const modalGridWrap = style({
  minHeight: 0,
  overflowY: "auto",
  paddingRight: 18,
  scrollbarColor: "#D9D9D9 transparent",
});

export const modalGrid = style({
  display: "grid",
  gridTemplateColumns: "repeat(5, minmax(120px, 1fr))",
  gap: 18,
  "@media": {
    "(max-width: 960px)": {
      gridTemplateColumns: "repeat(3, minmax(110px, 1fr))",
    },
    "(max-width: 520px)": {
      gridTemplateColumns: "repeat(2, minmax(100px, 1fr))",
      gap: 12,
    },
  },
});

export const characterCard = style({
  aspectRatio: "1",
  display: "grid",
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
  cursor: "pointer",
  transition: "transform 140ms ease, border-color 140ms ease",
  selectors: {
    "&:hover": {
      transform: "translateY(-2px)",
      borderColor: "var(--character-accent)",
      boxShadow:
        "0 10px 18px color-mix(in srgb, var(--character-accent) 18%, transparent)",
    },
    "&:focus-visible": {
      outline: "3px solid var(--profile-accent)",
      outlineOffset: 3,
    },
  },
});

export const characterCardSelected = style({
  borderColor: "#111",
  boxShadow:
    "0 10px 20px color-mix(in srgb, var(--character-accent) 20%, transparent)",
});

export const characterFaceSmall = style({
  width: "54%",
  aspectRatio: "1",
  borderRadius: "50%",
  background:
    "radial-gradient(circle at 35% 28%, rgba(255,255,255,0.78), transparent 34%), var(--character-fill)",
  boxShadow:
    "0 8px 14px rgba(0,0,0,0.08), 0 0 0 7px color-mix(in srgb, var(--character-accent) 8%, transparent)",
});

export const emptyState = style({
  minHeight: 120,
  display: "grid",
  placeItems: "center",
  color: "#666",
  fontWeight: 800,
});
