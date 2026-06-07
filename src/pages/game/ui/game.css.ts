import { globalStyle, keyframes } from "@vanilla-extract/css";

const ink = "#1a1713";
const muted = "#514f4c";
const accent3 = "#1b4f72";
const shadow = "0 18px 30px rgba(38, 29, 18, 0.16)";
const shadowSoft = "0 10px 22px rgba(38, 29, 18, 0.12)";
const fontSans = '"Space Grotesk", "Noto Sans KR", sans-serif';
const fontMono = '"IBM Plex Mono", ui-monospace, monospace';

const obstaclePreviewPulse = keyframes({
  "0%, 100%": {
    opacity: 0.72,
    boxShadow:
      "0 0 0 2px color-mix(in srgb, var(--character-color) 66%, #111111), 0 0 0 5px rgba(255, 255, 255, 0.22), 0 0 16px color-mix(in srgb, var(--character-color) 48%, transparent), inset 0 0 0 2px rgba(0, 0, 0, 0.24)",
    transform:
      "translate(calc(var(--preview-x) * (var(--cell-size) + var(--cell-gap))), calc(var(--preview-y) * (var(--cell-size) + var(--cell-gap)))) scale(0.92)",
  },
  "50%": {
    opacity: 1,
    boxShadow:
      "0 0 0 3px #ffffff, 0 0 0 7px color-mix(in srgb, var(--character-color) 58%, transparent), 0 0 30px color-mix(in srgb, var(--character-color) 76%, transparent), inset 0 0 0 2px rgba(0, 0, 0, 0.34)",
    transform:
      "translate(calc(var(--preview-x) * (var(--cell-size) + var(--cell-gap))), calc(var(--preview-y) * (var(--cell-size) + var(--cell-gap)))) scale(1.22)",
  },
});

const comboToastPop = keyframes({
  "0%": {
    opacity: 0,
    transform: "translate(-50%, 8px) scale(0.94)",
  },
  "18%, 72%": {
    opacity: 1,
    transform: "translate(-50%, 0) scale(1)",
  },
  "100%": {
    opacity: 0,
    transform: "translate(-50%, -10px) scale(0.98)",
  },
});

const skillPrimePulse = keyframes({
  "0%, 100%": {
    boxShadow:
      "0 0 0 2px rgba(255, 206, 232, 0.95), 0 0 0 5px rgba(255, 126, 194, 0.42), 0 10px 18px rgba(38, 29, 18, 0.12)",
    transform: "scale(1)",
  },
  "50%": {
    boxShadow:
      "0 0 0 2px rgba(255, 242, 249, 1), 0 0 0 7px rgba(255, 126, 194, 0.5), 0 0 22px rgba(255, 126, 194, 0.28), 0 10px 18px rgba(38, 29, 18, 0.12)",
    transform: "scale(1.03)",
  },
});

const ultimateCastGlow = keyframes({
  "0%": {
    opacity: 0.2,
    transform: "scale(0.96)",
    filter:
      "drop-shadow(0 0 0 rgba(255, 168, 222, 0)) drop-shadow(0 0 0 rgba(255, 240, 249, 0))",
  },
  "35%": {
    opacity: 1,
    transform: "scale(1.03)",
    filter:
      "drop-shadow(0 0 18px rgba(255, 168, 222, 0.38)) drop-shadow(0 0 34px rgba(255, 240, 249, 0.34))",
  },
  "100%": {
    opacity: 1,
    transform: "scale(1)",
    filter:
      "drop-shadow(0 0 10px rgba(255, 168, 222, 0.22)) drop-shadow(0 0 20px rgba(255, 240, 249, 0.18))",
  },
});

const ultimateAuraPulse = keyframes({
  "0%, 100%": {
    boxShadow:
      "0 0 0 1px rgba(255, 244, 251, 0.55), 0 0 0 5px rgba(255, 167, 220, 0.18), 0 12px 24px rgba(38, 29, 18, 0.14)",
  },
  "50%": {
    boxShadow:
      "0 0 0 1px rgba(255, 250, 253, 0.74), 0 0 0 7px rgba(255, 167, 220, 0.26), 0 0 24px rgba(255, 194, 230, 0.18), 0 12px 24px rgba(38, 29, 18, 0.14)",
  },
});

const ultimateBadgePulse = keyframes({
  "0%, 100%": {
    boxShadow:
      "0 10px 20px rgba(82, 42, 67, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.55) inset",
    transform: "translateY(0)",
  },
  "50%": {
    boxShadow:
      "0 12px 24px rgba(82, 42, 67, 0.16), 0 0 0 1px rgba(255, 255, 255, 0.72) inset, 0 0 20px rgba(255, 180, 225, 0.18)",
    transform: "translateY(-1px)",
  },
});

const failureBlockCollapse = keyframes({
  "0%": {
    opacity: 1,
    transform:
      "translate(calc(11px + ((var(--start-x) - 0.5) * (var(--cell-size) + var(--cell-gap)))), calc(11px + ((var(--start-y) - 0.5) * (var(--cell-size) + var(--cell-gap))))) rotate(0deg) scale(1)",
  },
  "18%": {
    transform:
      "translate(calc(11px + ((var(--lift-x) - 0.5) * (var(--cell-size) + var(--cell-gap)))), calc(11px + ((var(--lift-y) - 0.5) * (var(--cell-size) + var(--cell-gap))))) rotate(var(--spin-a)) scale(1.02)",
  },
  "52%": {
    transform:
      "translate(calc(11px + ((var(--mid-x) - 0.5) * (var(--cell-size) + var(--cell-gap)))), calc(11px + ((var(--mid-y) - 0.5) * (var(--cell-size) + var(--cell-gap))))) rotate(var(--spin-b)) scale(1)",
  },
  "72%": {
    transform:
      "translate(calc(11px + ((var(--final-x) - 0.5) * (var(--cell-size) + var(--cell-gap)))), calc(11px + ((var(--final-y) - 0.5) * (var(--cell-size) + var(--cell-gap)) - (var(--cell-size) * 0.72)))) rotate(calc(var(--spin-final) * -1)) scale(0.98)",
  },
  "86%": {
    transform:
      "translate(calc(11px + ((var(--final-x) - 0.5) * (var(--cell-size) + var(--cell-gap)))), calc(11px + ((var(--final-y) - 0.5) * (var(--cell-size) + var(--cell-gap)) + (var(--cell-size) * 0.12)))) rotate(calc(var(--spin-final) * 1.25)) scale(1.01)",
  },
  "100%": {
    opacity: 1,
    transform:
      "translate(calc(11px + ((var(--final-x) - 0.5) * (var(--cell-size) + var(--cell-gap)))), calc(11px + ((var(--final-y) - 0.5) * (var(--cell-size) + var(--cell-gap))))) rotate(var(--spin-final)) scale(1)",
  },
});

globalStyle(".page-game", {
  height: "100dvh",
  minHeight: "100dvh",
  gap: 0,
  overflow: "hidden",
  vars: {
    "--cell-size": "28px",
    "--cell-gap": "3px",
    "--board-status-offset": "40px",
    "--visible-board-width":
      "calc((12 * var(--cell-size)) + (11 * var(--cell-gap)) + 22px)",
    "--visible-board-height":
      "calc((21 * var(--cell-size)) + (20 * var(--cell-gap)) + 22px)",
    "--game-board-height": "var(--visible-board-height)",
  },
});

globalStyle(".game-playfield", {
  height: "100%",
  minHeight: "100%",
  display: "grid",
  gridTemplateColumns: "1fr",
  gridTemplateRows: "1fr",
  alignContent: "center",
  alignItems: "center",
  gap: 0,
  padding:
    "clamp(12px, 2vh, 18px) clamp(14px, 3vw, 24px) clamp(12px, 2vh, 18px)",
  borderRadius: 0,
  background:
    "linear-gradient(180deg, rgba(255, 250, 246, 0.08) 0%, rgba(29, 24, 20, 0.12) 48%, rgba(16, 12, 10, 0.28) 100%), var(--character-theme-image, none)",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center center",
  backgroundSize: "cover",
  boxShadow: "none",
  position: "relative",
  overflow: "hidden",
});

globalStyle(".game-topbar", {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gridColumn: "1 / -1",
  position: "absolute",
  top: 8,
  left: "clamp(14px, 3vw, 24px)",
  right: "clamp(14px, 3vw, 24px)",
  minHeight: 0,
  zIndex: 2,
});

globalStyle(".topbar-actions", {
  display: "inline-flex",
  gap: 2,
  alignItems: "center",
  padding: "4px 6px",
  borderRadius: 8,
  background: "rgba(255, 255, 255, 0.9)",
  boxShadow: "0 8px 18px rgba(38, 29, 18, 0.12)",
  marginLeft: "auto",
  position: "absolute",
  top: 0,
  right: 0,
});

globalStyle(".icon-button", {
  width: 28,
  minWidth: 28,
  height: 28,
  minHeight: 28,
  display: "grid",
  placeItems: "center",
  border: "none",
  borderRadius: 6,
  background: "transparent",
  color: ink,
  fontWeight: 700,
  fontSize: "0.8rem",
  lineHeight: 1,
  cursor: "pointer",
});

globalStyle(".icon-button__icon", {
  width: 16,
  height: 16,
  objectFit: "contain",
  objectPosition: "center",
  pointerEvents: "none",
  userSelect: "none",
});

globalStyle(".icon-button:hover, .icon-button:focus-visible", {
  background: "rgba(26, 23, 19, 0.08)",
});

globalStyle(".level-kicker", {
  color: accent3,
  fontSize: "0.8rem",
  fontWeight: 700,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
});

globalStyle(".character-orbit", {
  display: "grid",
  justifyItems: "center",
  gap: 2,
  position: "relative",
  zIndex: 1,
  minHeight: 0,
  alignContent: "center",
  justifySelf: "center",
  width: "100%",
  margin: 0,
});

globalStyle(".character-orbit--ultimate-cast .game-character", {
  animation: `${ultimateCastGlow} 0.9s ease-out both`,
});

globalStyle(".character-orbit--ultimate-active .game-character", {
  animation: `${ultimateAuraPulse} 1.8s ease-in-out infinite`,
});

globalStyle(".game-character", {
  width: "clamp(134px, 12vw, 188px)",
  height: "clamp(186px, 22vh, 262px)",
  objectFit: "contain",
  filter:
    "drop-shadow(0 12px 18px color-mix(in srgb, var(--character-color) 38%, transparent))",
});

globalStyle(".bag-preview", {
  display: "grid",
  gridTemplateColumns: "minmax(0, 86px)",
  gap: "clamp(6px, 1.3vh, 12px)",
  justifyContent: "center",
  alignItems: "center",
  alignContent: "space-evenly",
  width: "100%",
  height: "100%",
  minHeight: 0,
  overflow: "hidden",
  padding: "clamp(10px, 1.6vh, 16px) 10px",
  border: "1px solid rgba(255, 255, 255, 0.36)",
  borderRadius: 10,
  background:
    "linear-gradient(180deg, rgba(16, 13, 11, 0.72), rgba(16, 13, 11, 0.52)), color-mix(in srgb, var(--character-bg) 30%, transparent)",
  boxShadow:
    "inset 0 0 0 1px rgba(255, 255, 255, 0.12), 0 12px 22px rgba(0, 0, 0, 0.16)",
  backdropFilter: "blur(3px)",
});

globalStyle(".bag-preview .mini-block", {
  position: "relative",
  transform: "none",
  transformOrigin: "center",
});

globalStyle(".bag-preview .mini-block-label", {
  display: "none",
});

globalStyle(".bag-preview .mini-block-grid", {
  background: "transparent",
  boxShadow: "none",
  gridTemplateColumns: "repeat(var(--mini-cols), 14px)",
  gridTemplateRows: "repeat(var(--mini-rows), 14px)",
  gap: 4,
  padding: "10px 0",
});

globalStyle(".bag-preview .mini-block-grid span", {
  width: 18,
  height: 18,
  borderRadius: 4,
});

globalStyle(".game-core", {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) auto minmax(0, 1fr)",
  gap: "clamp(6px, 1vw, 12px)",
  justifyContent: "center",
  alignItems: "start",
  alignContent: "start",
  alignSelf: "center",
  minHeight: 0,
  marginTop: 0,
  transform: "translateY(calc(var(--board-status-offset) / -2))",
});

globalStyle(".board-stack", {
  display: "grid",
  justifyItems: "center",
  gap: 6,
  position: "relative",
  minWidth: 0,
});

globalStyle(".game-left-rail, .game-right-rail", {
  display: "grid",
  alignContent: "start",
  justifyItems: "center",
  gap: 12,
  minWidth: 0,
  width: "fit-content",
  maxWidth: "100%",
  paddingTop: 0,
  marginTop: "var(--board-status-offset)",
  alignSelf: "start",
});

globalStyle(".game-left-rail", {
  gridTemplateRows: "auto auto",
  justifySelf: "end",
});

globalStyle(".game-right-rail", {
  gridTemplateRows: "auto minmax(0, 1fr)",
  height: "var(--game-board-height)",
  maxHeight: "var(--game-board-height)",
  justifySelf: "start",
});

globalStyle(".game-status-strip", {
  width: "100%",
  minHeight: 34,
  display: "grid",
  gridTemplateColumns: "1fr auto 1fr",
  alignItems: "center",
  gap: 12,
  color: accent3,
  fontFamily: fontMono,
  fontSize: "0.76rem",
  fontWeight: 700,
  letterSpacing: "0.02em",
  textTransform: "uppercase",
});

globalStyle(".game-status-strip strong", {
  color: ink,
  fontFamily: fontSans,
  fontSize: "1.35rem",
  lineHeight: 1,
});

globalStyle(".game-status-strip span:last-child", {
  justifySelf: "end",
  color: muted,
  textTransform: "none",
});

globalStyle(".combo-toast", {
  position: "absolute",
  top: 54,
  left: "50%",
  zIndex: 6,
  padding: "6px 12px",
  borderRadius: 8,
  background: "rgba(255, 255, 255, 0.9)",
  color: "var(--character-color)",
  fontSize: "1.25rem",
  fontWeight: 800,
  lineHeight: 1,
  textShadow: "0 1px 0 #fff",
  boxShadow: shadowSoft,
  transform: "translate(-50%, 0)",
  animation: `${comboToastPop} 1.2s ease both`,
});

globalStyle(".ultimate-status-badge", {
  position: "absolute",
  top: 40,
  left: "50%",
  zIndex: 7,
  minWidth: 148,
  display: "grid",
  gridTemplateColumns: "auto auto",
  alignItems: "center",
  gap: "4px 10px",
  padding: "7px 12px 8px",
  borderRadius: 999,
  background:
    "linear-gradient(180deg, rgba(255, 249, 252, 0.94), rgba(255, 231, 244, 0.92))",
  color: "#7b204e",
  boxShadow:
    "0 10px 20px rgba(82, 42, 67, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.55) inset",
  transform: "translateX(-50%)",
  animation: `${ultimateBadgePulse} 1.9s ease-in-out infinite`,
  backdropFilter: "blur(8px)",
});

globalStyle(".ultimate-status-label", {
  fontFamily: fontMono,
  fontSize: "0.62rem",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "color-mix(in srgb, #7b204e 82%, #ffffff)",
});

globalStyle(".ultimate-status-badge strong", {
  justifySelf: "end",
  fontFamily: fontSans,
  fontSize: "1rem",
  lineHeight: 1,
});

globalStyle(".ultimate-status-progress", {
  gridColumn: "1 / -1",
  display: "block",
  width: "100%",
  height: 5,
  overflow: "hidden",
  borderRadius: 999,
  background: "rgba(123, 32, 78, 0.1)",
});

globalStyle(".ultimate-status-progress-bar", {
  display: "block",
  width: "100%",
  height: "100%",
  borderRadius: "inherit",
  background:
    "linear-gradient(90deg, rgba(255, 129, 196, 0.92), rgba(255, 236, 247, 0.98))",
  transformOrigin: "left center",
  transform: "scaleX(calc(1 - var(--ultimate-progress, 0)))",
});

globalStyle(".skill-slots", {
  display: "grid",
  gridTemplateColumns: "repeat(5, var(--skill-slot-size, 56px))",
  gap: 8,
  justifyContent: "center",
  alignItems: "end",
});

globalStyle(".skill-slot", {
  width: "var(--skill-slot-size, 56px)",
  minWidth: "var(--skill-slot-size, 56px)",
  display: "grid",
  placeItems: "center",
  border: "none",
  borderRadius: 0,
  background: "transparent",
  color: ink,
  cursor: "pointer",
  padding: 0,
  position: "relative",
});

globalStyle(".skill-slot--passive", {
  cursor: "default",
  filter: "none",
});

globalStyle(".skill-icon-shell", {
  display: "grid",
  gridTemplateRows: "var(--skill-icon-size, 48px) 14px",
  justifyItems: "center",
  gap: 4,
  width: "100%",
  position: "relative",
});

globalStyle(".skill-icon-image", {
  width: "var(--skill-icon-size, 48px)",
  height: "var(--skill-icon-size, 48px)",
  objectFit: "cover",
  objectPosition: "center",
  borderRadius: 14,
  boxShadow: "0 10px 18px rgba(38, 29, 18, 0.12)",
  pointerEvents: "none",
  userSelect: "none",
});

globalStyle(".skill-icon-timer", {
  position: "absolute",
  top: 0,
  left: "50%",
  zIndex: 1,
  width: "var(--skill-icon-size, 48px)",
  height: "var(--skill-icon-size, 48px)",
  display: "grid",
  placeItems: "center",
  borderRadius: 14,
  overflow: "hidden",
  color: "#ffffff",
  fontFamily: fontMono,
  fontSize: "1rem",
  fontWeight: 800,
  textShadow: "0 1px 3px rgba(0, 0, 0, 0.58)",
  transform: "translateX(-50%)",
  isolation: "isolate",
});

globalStyle(".skill-icon-timer::before", {
  content: '""',
  position: "absolute",
  inset: 0,
  borderRadius: 14,
  border: "1px solid rgba(255, 255, 255, 0.28)",
  background:
    "conic-gradient(from 0deg, transparent 0turn, transparent calc(var(--cooldown-progress, 0) * 1turn), rgba(0, 0, 0, 0.76) calc(var(--cooldown-progress, 0) * 1turn), rgba(0, 0, 0, 0.76) 1turn)",
  backdropFilter: "blur(2px)",
  boxShadow:
    "inset 0 0 0 1px rgba(255, 255, 255, 0.12), 0 8px 16px rgba(0, 0, 0, 0.18)",
  zIndex: 0,
});

globalStyle('.skill-icon-timer[data-tone="ultimate"]::before', {
  borderColor: "rgba(255, 244, 251, 0.82)",
  background:
    "conic-gradient(from 0deg, rgba(255, 246, 252, 0.08) 0turn, rgba(255, 246, 252, 0.08) calc(var(--cooldown-progress, 0) * 1turn), rgba(255, 108, 187, 0.68) calc(var(--cooldown-progress, 0) * 1turn), rgba(255, 108, 187, 0.68) 1turn)",
  boxShadow:
    "inset 0 0 0 1px rgba(255, 255, 255, 0.24), 0 0 18px rgba(255, 154, 213, 0.18)",
});

globalStyle(".skill-icon-timer-value", {
  position: "relative",
  zIndex: 1,
});

globalStyle(".skill-icon-prime-badge", {
  position: "absolute",
  top: -4,
  right: -5,
  zIndex: 2,
  minWidth: 22,
  padding: "2px 5px",
  borderRadius: 999,
  background:
    "linear-gradient(180deg, rgba(255, 231, 243, 0.98) 0%, rgba(255, 173, 214, 0.96) 100%)",
  color: "#7b204e",
  fontFamily: fontMono,
  fontSize: "0.55rem",
  fontWeight: 900,
  lineHeight: 1,
  letterSpacing: "-0.02em",
  boxShadow: "0 6px 12px rgba(123, 32, 78, 0.22)",
});

globalStyle(".skill-key", {
  color: muted,
  fontFamily: fontMono,
  fontSize: "0.68rem",
  lineHeight: 1,
});

globalStyle(".skill-cooldown", {
  display: "none",
});

globalStyle('.skill-slot[data-ready="true"]', {
  filter:
    "drop-shadow(0 8px 12px color-mix(in srgb, var(--character-color) 28%, transparent))",
});

globalStyle('.skill-slot[data-ready="false"] .skill-icon-image', {
  filter: "none",
  opacity: 1,
});

globalStyle('.skill-slot[data-ready="false"] .skill-icon-timer::before', {
  borderColor: "rgba(255, 255, 255, 0.3)",
});

globalStyle('.skill-slot[data-primed="true"] .skill-icon-shell', {
  filter:
    "drop-shadow(0 0 10px rgba(255, 122, 191, 0.35)) drop-shadow(0 0 18px rgba(255, 122, 191, 0.22))",
});

globalStyle('.skill-slot[data-primed="true"] .skill-icon-image', {
  boxShadow:
    "0 0 0 2px rgba(255, 206, 232, 0.95), 0 0 0 5px rgba(255, 126, 194, 0.42), 0 10px 18px rgba(38, 29, 18, 0.12)",
  animation: `${skillPrimePulse} 1.2s ease-in-out infinite`,
});

globalStyle('.skill-slot[data-ultimate="true"] .skill-icon-image', {
  boxShadow:
    "0 0 0 2px rgba(255, 244, 251, 0.88), 0 0 0 5px rgba(255, 145, 206, 0.34), 0 0 18px rgba(255, 176, 223, 0.18), 0 10px 18px rgba(38, 29, 18, 0.12)",
});

globalStyle(".skill-passive-note", {
  color: "color-mix(in srgb, #514f4c 72%, var(--character-color))",
  fontFamily: fontMono,
  fontSize: "0.6rem",
  lineHeight: 1,
});

globalStyle(
  ".skill-slot--passive .skill-cooldown, .skill-slot--passive .skill-icon-timer",
  {
    display: "none",
  },
);

globalStyle(".skill-slot--passive .skill-key", {
  color: ink,
});

globalStyle(".hold-panel", {
  display: "grid",
  justifyItems: "center",
  gap: 8,
  alignSelf: "start",
  marginTop: 0,
  color: accent3,
  fontWeight: 700,
});

globalStyle(".game-board", {
  position: "relative",
  display: "grid",
  gridTemplateColumns: "repeat(var(--cols), var(--cell-size))",
  gridTemplateRows: "repeat(var(--rows), var(--cell-size))",
  gap: "var(--cell-gap)",
  justifyContent: "center",
  padding: 10,
  background:
    "linear-gradient(180deg, rgba(255, 255, 255, 0.76), rgba(255, 255, 255, 0.66)), rgba(255, 255, 255, 0.76)",
  borderRadius: 14,
  border: "1px solid rgba(26, 23, 19, 0.2)",
  boxShadow: "inset 0 0 0 2px rgba(255, 255, 255, 0.5)",
  backdropFilter: "blur(8px)",
});

globalStyle(".game-cell", {
  borderRadius: 4,
  background: "rgba(26, 23, 19, 0.06)",
  boxShadow: "inset 0 0 0 1px rgba(26, 23, 19, 0.12)",
  transition: "background 0.1s linear, box-shadow 0.1s linear",
  position: "relative",
  overflow: "hidden",
});

globalStyle('.game-cell[data-state="1"]', {
  backgroundColor: "color-mix(in srgb, var(--character-color) 24%, #ffffff)",
  backgroundImage: "var(--character-block-image, none)",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center center",
  backgroundSize: "contain",
  boxShadow:
    "inset 0 0 0 1px rgba(255, 255, 255, 0.6), inset 0 -3px 10px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.35)",
});

globalStyle('.game-cell[data-state="2"]', {
  backgroundColor: "color-mix(in srgb, var(--character-color) 34%, #ffffff)",
  backgroundImage: "var(--character-block-image, none)",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center center",
  backgroundSize: "contain",
  boxShadow:
    "0 0 0 1px rgba(255, 255, 255, 0.85) inset, 0 0 16px color-mix(in srgb, var(--character-color) 34%, transparent), 0 4px 12px color-mix(in srgb, var(--character-color) 28%, transparent)",
});

globalStyle('.game-cell[data-state="2"]::after', {
  content: '""',
  position: "absolute",
  inset: 0,
  borderRadius: "inherit",
  background:
    "radial-gradient(circle at 30% 24%, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.12) 18%, transparent 44%), linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0))",
  pointerEvents: "none",
});

globalStyle(".active-block-layer", {
  position: "absolute",
  inset: 10,
  pointerEvents: "none",
  zIndex: 4,
  willChange: "transform",
});

globalStyle(".ghost-block-layer", {
  position: "absolute",
  inset: 10,
  pointerEvents: "none",
  zIndex: 2,
});

globalStyle(".obstacle-preview-layer", {
  position: "absolute",
  inset: 10,
  pointerEvents: "none",
  zIndex: 3,
});

globalStyle(".active-block-cell", {
  position: "absolute",
  left: 0,
  top: 0,
  width: "var(--cell-size)",
  height: "var(--cell-size)",
  borderRadius: 4,
  backgroundColor: "color-mix(in srgb, var(--character-color) 20%, #ffffff)",
  backgroundImage: "var(--character-block-image, none)",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center center",
  backgroundSize: "contain",
  boxShadow:
    "0 0 0 1px rgba(255, 255, 255, 0.82) inset, 0 0 22px color-mix(in srgb, var(--character-color) 58%, transparent), 0 7px 16px color-mix(in srgb, var(--character-color) 38%, transparent)",
  transform:
    "translate(calc(var(--active-x) * (var(--cell-size) + var(--cell-gap))), calc(var(--active-y) * (var(--cell-size) + var(--cell-gap))))",
  transition:
    "transform 0.1s ease-out, filter 0.1s ease-out, box-shadow 0.1s ease-out",
  filter: "saturate(1.08) brightness(1.02)",
  willChange: "transform",
});

globalStyle(".ghost-block-cell", {
  position: "absolute",
  left: 0,
  top: 0,
  width: "var(--cell-size)",
  height: "var(--cell-size)",
  borderRadius: 4,
  background:
    "linear-gradient(135deg, color-mix(in srgb, var(--character-color) 28%, transparent), color-mix(in srgb, var(--character-color) 10%, transparent)), color-mix(in srgb, var(--character-color) 8%, rgba(0, 0, 0, 0.08))",
  border: "2px solid color-mix(in srgb, var(--character-color) 78%, #ffffff)",
  boxShadow:
    "inset 0 0 0 1px rgba(255, 255, 255, 0.16), 0 0 0 1px color-mix(in srgb, var(--character-color) 48%, transparent), 0 0 12px color-mix(in srgb, var(--character-color) 32%, transparent)",
  transform:
    "translate(calc(var(--ghost-x) * (var(--cell-size) + var(--cell-gap))), calc(var(--ghost-y) * (var(--cell-size) + var(--cell-gap))))",
  opacity: 0.95,
});

globalStyle(".obstacle-preview-cell", {
  position: "absolute",
  left: 0,
  top: 0,
  width: "var(--cell-size)",
  height: "var(--cell-size)",
  borderRadius: 4,
  background:
    "radial-gradient(circle, color-mix(in srgb, var(--character-color) 58%, #ffffff) 0%, color-mix(in srgb, var(--character-color) 26%, transparent) 62%, rgba(0, 0, 0, 0.16) 100%)",
  border: "2px solid #ffffff",
  boxShadow:
    "0 0 0 2px color-mix(in srgb, var(--character-color) 70%, #111111), 0 0 22px color-mix(in srgb, var(--character-color) 70%, transparent), inset 0 0 0 2px rgba(0, 0, 0, 0.22)",
  opacity: 0.98,
  transform:
    "translate(calc(var(--preview-x) * (var(--cell-size) + var(--cell-gap))), calc(var(--preview-y) * (var(--cell-size) + var(--cell-gap))))",
  animation: `${obstaclePreviewPulse} 0.56s ease-in-out infinite`,
  willChange: "opacity, transform, box-shadow",
});

globalStyle('.game-cell[data-state="3"]', {
  backgroundColor: "color-mix(in srgb, var(--character-color) 24%, #ffffff)",
  backgroundImage: "var(--character-block-image, none)",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center center",
  backgroundSize: "contain",
  boxShadow:
    "inset 0 0 0 1px rgba(255, 255, 255, 0.6), inset 0 -3px 10px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.35)",
});

globalStyle(
  '.game-cell[data-state="3"]::before, .game-cell[data-state="3"]::after',
  {
    content: "none",
  },
);

globalStyle('.game-cell[data-state="4"]', {
  backgroundColor: "color-mix(in srgb, var(--character-color) 20%, #ffffff)",
  backgroundImage:
    "var(--character-block-image, none), radial-gradient(circle at 50% 40%, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.1) 18%, transparent 46%)",
  backgroundRepeat: "no-repeat, no-repeat",
  backgroundPosition: "center center, center center",
  backgroundSize: "contain, cover",
  boxShadow:
    "inset 0 0 0 1px rgba(255, 255, 255, 0.8), 0 0 0 1px color-mix(in srgb, var(--character-color) 26%, transparent), 0 0 14px color-mix(in srgb, var(--character-color) 24%, transparent)",
  filter: "saturate(1.02) brightness(1.03)",
});

globalStyle(".game-overlay", {
  position: "absolute",
  inset: "42px 0 0",
  display: "grid",
  placeItems: "center",
  gap: 16,
  alignContent: "center",
  background: "rgba(255, 255, 255, 0.56)",
  borderRadius: 10,
  textAlign: "center",
  fontWeight: 600,
  zIndex: 5,
});

globalStyle(".game-overlay strong", {
  color: "#115a95",
  fontSize: "clamp(2.2rem, 5vw, 4rem)",
  lineHeight: 0.95,
  textShadow:
    "0 2px 0 #fff, 0 5px 0 color-mix(in srgb, var(--character-color) 58%, #5332d4)",
});

globalStyle(".game-overlay--intro", {
  inset: 0,
});

globalStyle(".game-overlay--clear span, .game-overlay--failed span", {
  color: "var(--character-color)",
  fontSize: "clamp(1.8rem, 4vw, 3.2rem)",
  fontWeight: 800,
  textShadow: "0 2px 0 #fff",
});

globalStyle(".game-overlay--failed span", {
  color: "#ff5a3d",
});

globalStyle(".game-overlay-actions", {
  display: "grid",
  gap: 12,
  justifyItems: "center",
});

globalStyle(".game-hud", {
  display: "grid",
  gap: 12,
});

globalStyle(".game-score-card", {
  minWidth: 190,
  background: "rgba(255, 255, 255, 0.86)",
  border: "1px solid rgba(26, 23, 19, 0.08)",
  borderRadius: 8,
  padding: 16,
  boxShadow: shadowSoft,
  display: "grid",
  gap: 5,
});

globalStyle(".game-stat-grid", {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 10,
});

globalStyle(".stat-card", {
  background: "rgba(255, 255, 255, 0.86)",
  borderRadius: 8,
  padding: 14,
  boxShadow: shadowSoft,
  display: "grid",
  gap: 4,
});

globalStyle(".stat-note", {
  color: muted,
  fontSize: "0.84rem",
});

globalStyle(".stat-card--status", {
  border: "1px solid var(--character-color)",
});

globalStyle(".mini-block", {
  display: "grid",
  justifyItems: "center",
  gap: 4,
});

globalStyle('.mini-block[data-muted="true"]', {
  opacity: 0,
});

globalStyle(".mini-block-label", {
  color: muted,
  fontSize: "0.7rem",
  fontWeight: 700,
});

globalStyle(".mini-block-grid", {
  display: "grid",
  gridTemplateColumns: "repeat(var(--mini-cols), 12px)",
  gridTemplateRows: "repeat(var(--mini-rows), 12px)",
  gap: 3,
  padding: 8,
  borderRadius: 8,
  background: "rgba(255, 255, 255, 0.8)",
  boxShadow: shadowSoft,
  placeContent: "center",
});

globalStyle(".mini-block-grid span", {
  gridColumn: "var(--mini-cell-x)",
  gridRow: "var(--mini-cell-y)",
  borderRadius: 3,
  backgroundColor: "color-mix(in srgb, var(--character-color) 18%, #ffffff)",
  backgroundImage: "var(--character-block-image, none)",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center center",
  backgroundSize: "contain",
  boxShadow:
    "0 0 10px color-mix(in srgb, var(--character-color) 38%, transparent)",
});

globalStyle(".hold-panel .mini-block-grid", {
  width: 92,
  height: 92,
  gridTemplateColumns: "repeat(var(--mini-cols), 14px)",
  gridTemplateRows: "repeat(var(--mini-rows), 14px)",
  placeContent: "center",
  background: "rgba(255, 255, 255, 0.86)",
  boxShadow: "0 8px 16px rgba(38, 29, 18, 0.1)",
});

globalStyle(".hold-panel .mini-block-grid span", {
  width: 14,
  height: 14,
});

globalStyle(".failure-pile", {
  width: "var(--visible-board-width)",
  height: "var(--visible-board-height)",
  position: "relative",
  overflow: "hidden",
});

globalStyle(".failure-pile span", {
  position: "absolute",
  left: 0,
  top: 0,
  width: "var(--cell-size)",
  aspectRatio: "1",
  borderRadius: 4,
  backgroundColor: "color-mix(in srgb, var(--character-color) 22%, #ffffff)",
  backgroundImage: "var(--character-block-image, none)",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center center",
  backgroundSize: "contain",
  boxShadow:
    "0 5px 9px color-mix(in srgb, var(--character-color) 24%, transparent)",
  animation: `${failureBlockCollapse} 1.48s cubic-bezier(0.2, 0.88, 0.22, 1) both`,
  animationDelay: "var(--fall-delay)",
  willChange: "transform",
});

globalStyle(".help-backdrop", {
  position: "fixed",
  inset: 0,
  zIndex: 20,
  display: "grid",
  placeItems: "center",
  padding: 20,
  background: "rgba(26, 23, 19, 0.38)",
});

globalStyle(".help-panel", {
  width: "min(760px, 100%)",
  display: "grid",
  gap: 20,
  borderRadius: 12,
  background: "#fff",
  padding: 22,
  boxShadow: shadow,
});

globalStyle(".help-header", {
  display: "flex",
  justifyContent: "space-between",
  gap: 16,
});

globalStyle(".help-grid", {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 18,
});

globalStyle(".help-grid section", {
  display: "grid",
  gap: 10,
});

globalStyle(".help-skill-item", {
  display: "grid",
  gridTemplateColumns: "34px minmax(0, 1fr)",
  gap: 10,
  alignItems: "start",
});

globalStyle(".help-skill-icon", {
  width: 34,
  height: 34,
  borderRadius: 8,
  objectFit: "cover",
  objectPosition: "center",
  pointerEvents: "none",
  userSelect: "none",
});

globalStyle(".page-game", {
  "@media": {
    "(max-width: 1180px) and (min-width: 981px)": {
      vars: {
        "--skill-slot-size": "48px",
        "--skill-icon-size": "42px",
      },
    },
    "(max-width: 980px) and (min-width: 641px)": {
      vars: {
        "--cell-size": "24px",
        "--skill-slot-size": "42px",
        "--skill-icon-size": "38px",
      },
    },
    "(max-width: 640px)": {
      height: "100dvh",
      minHeight: "100dvh",
      vars: {
        "--cell-size": "clamp(16px, 4vw, 20px)",
        "--cell-gap": "2px",
        "--skill-slot-size": "40px",
        "--skill-icon-size": "36px",
      },
    },
  },
});

globalStyle(".game-core", {
  "@media": {
    "(max-width: 1180px) and (min-width: 981px)": {
      gap: 8,
      minHeight: 0,
    },
    "(max-width: 980px) and (min-width: 641px)": {
      gridTemplateAreas: '"left board right"',
      gap: 8,
      alignContent: "start",
      alignItems: "start",
      minHeight: 0,
      marginTop: 0,
    },
    "(max-width: 640px)": {
      gridTemplateColumns: "minmax(0, 1fr) auto minmax(0, 1fr)",
      gridTemplateAreas: '"spacer left right-spacer" "spacer board right"',
      alignContent: "start",
      alignItems: "start",
      gap: 6,
      minHeight: 0,
      marginTop: 0,
    },
  },
});

globalStyle(".game-playfield", {
  "@media": {
    "(max-width: 980px) and (min-width: 641px)": {
      gridTemplateColumns: "1fr",
      padding: 12,
    },
    "(max-width: 640px)": {
      padding: 12,
    },
  },
});

globalStyle(".character-orbit", {
  "@media": {
    "(max-width: 980px) and (min-width: 641px)": {
      transform: "none",
      minHeight: 0,
      margin: 0,
      width: "100%",
    },
    "(max-width: 640px)": {
      transform: "none",
      minHeight: 0,
      margin: 0,
      width: "100%",
    },
  },
});

globalStyle(".game-character", {
  "@media": {
    "(max-width: 1180px) and (min-width: 981px)": {
      width: "clamp(122px, 12vw, 152px)",
      height: "clamp(170px, 20vh, 212px)",
    },
    "(max-width: 980px) and (min-width: 641px)": {
      width: "clamp(92px, 13vw, 118px)",
      height: "clamp(128px, 19vh, 164px)",
    },
    "(max-width: 640px)": {
      width: "clamp(96px, 24vw, 128px)",
      height: "clamp(132px, 32vh, 178px)",
    },
  },
});

globalStyle(".game-left-rail, .game-right-rail", {
  "@media": {
    "(max-width: 980px) and (min-width: 641px)": {
      gap: 12,
    },
    "(max-width: 640px)": {
      gap: 4,
    },
  },
});

globalStyle(".game-left-rail", {
  "@media": {
    "(max-width: 980px) and (min-width: 641px)": {
      gridArea: "left",
      order: "0",
      justifySelf: "end",
    },
    "(max-width: 640px)": {
      gridArea: "left",
      order: "0",
      justifySelf: "center",
      alignSelf: "end",
      maxWidth: "var(--visible-board-width)",
      marginTop: 0,
      gap: 0,
    },
  },
});

globalStyle(".board-stack", {
  "@media": {
    "(max-width: 980px) and (min-width: 641px)": {
      gridArea: "board",
      order: "0",
    },
    "(max-width: 640px)": {
      gridArea: "board",
      order: "0",
    },
  },
});

globalStyle(".game-right-rail", {
  "@media": {
    "(max-width: 980px) and (min-width: 641px)": {
      gridArea: "right",
      order: "0",
      gridTemplateColumns: "1fr",
      justifySelf: "start",
    },
    "(max-width: 640px)": {
      gridArea: "right",
      order: "0",
      gridTemplateColumns: "1fr",
      gridTemplateRows: "auto minmax(0, 1fr)",
      alignItems: "start",
      justifyContent: "stretch",
      justifySelf: "start",
    },
  },
});

globalStyle(".skill-slots", {
  "@media": {
    "(max-width: 1180px) and (min-width: 981px)": {
      gridTemplateColumns: "repeat(5, var(--skill-slot-size))",
      gap: 6,
    },
    "(max-width: 980px) and (min-width: 641px)": {
      gridTemplateColumns: "repeat(6, calc(var(--skill-slot-size) / 2))",
      gap: "7px 8px",
    },
    "(max-width: 640px)": {
      gridTemplateColumns: "repeat(5, var(--skill-slot-size))",
      gap: 14,
      justifyItems: "center",
    },
  },
});

globalStyle(".skill-slot", {
  "@media": {
    "(max-width: 980px) and (min-width: 641px)": {
      gridColumn: "span 2",
    },
    "(max-width: 640px)": {
      gridColumn: "auto",
      width: 52,
      minWidth: 52,
      height: 84,
    },
  },
});

globalStyle(".skill-slot:nth-child(4)", {
  "@media": {
    "(max-width: 980px) and (min-width: 641px)": {
      gridColumn: "2 / span 2",
    },
    "(max-width: 640px)": {
      gridColumn: "auto",
    },
  },
});

globalStyle(".bag-preview", {
  "@media": {
    "(max-width: 1180px) and (min-width: 981px)": {
      gridTemplateColumns: "minmax(0, 78px)",
      gap: 10,
    },
    "(max-width: 980px) and (min-width: 641px)": {
      gridTemplateColumns: "minmax(0, 82px)",
      gap: 14,
      padding: "14px 10px",
    },
    "(max-width: 640px)": {
      gridTemplateColumns: "minmax(0, 82px)",
      gap: 12,
      padding: "12px 8px",
    },
  },
});

globalStyle(".mini-block-grid", {
  "@media": {
    "(max-width: 1180px) and (min-width: 981px)": {
      gridTemplateColumns: "repeat(var(--mini-cols), 10px)",
      gridTemplateRows: "repeat(var(--mini-rows), 10px)",
      gap: 2,
    },
    "(max-width: 980px) and (min-width: 641px)": {
      gridTemplateColumns: "repeat(var(--mini-cols), 12px)",
      gridTemplateRows: "repeat(var(--mini-rows), 12px)",
      gap: 4,
      padding: "8px 0",
    },
  },
});

globalStyle(".bag-preview .mini-block-grid span", {
  "@media": {
    "(max-width: 1180px) and (min-width: 981px)": {
      width: 18,
      height: 18,
    },
    "(max-width: 980px) and (min-width: 641px)": {
      width: 16,
      height: 16,
    },
  },
});

globalStyle(".help-grid", {
  "@media": {
    "(max-width: 980px) and (min-width: 641px)": {
      gridTemplateColumns: "1fr",
    },
  },
});

globalStyle(".phaser-board-shell", {
  "@media": {
    "(max-width: 640px)": {
      gap: "var(--cell-gap)",
      padding: 10,
    },
  },
});

globalStyle(".phaser-board-shell", {
  width: "var(--visible-board-width)",
  height: "var(--visible-board-height)",
  display: "block",
  position: "relative",
  padding: 0,
  gap: 0,
  overflow: "hidden",
  borderRadius: 14,
  background:
    "linear-gradient(180deg, rgba(255, 255, 255, 0.76), rgba(255, 255, 255, 0.66)), rgba(255, 255, 255, 0.76)",
  border: "1px solid rgba(26, 23, 19, 0.2)",
  boxShadow: "inset 0 0 0 2px rgba(255, 255, 255, 0.5)",
  backdropFilter: "blur(8px)",
});

globalStyle('.phaser-board-shell[data-ultimate-active="true"]', {
  boxShadow:
    "inset 0 0 0 2px rgba(255, 255, 255, 0.5), 0 0 0 1px rgba(255, 225, 241, 0.5), 0 0 24px rgba(255, 184, 226, 0.12)",
});

globalStyle('.phaser-board-shell[data-ultimate-cast="true"]::after', {
  content: '""',
  position: "absolute",
  inset: 0,
  borderRadius: 14,
  background:
    "radial-gradient(circle at center, rgba(255, 244, 251, 0.4) 0%, rgba(255, 206, 232, 0.18) 28%, rgba(255, 206, 232, 0) 66%)",
  pointerEvents: "none",
  animation: `${ultimateCastGlow} 0.9s ease-out both`,
});

globalStyle(".phaser-board-shell canvas", {
  display: "block",
  width: "100%",
  height: "100%",
});

globalStyle(".skill-icon-shell", {
  "@media": {
    "(max-width: 640px)": {
      gridTemplateRows: "44px 12px",
    },
  },
});

globalStyle(".skill-icon-image, .skill-icon-timer", {
  "@media": {
    "(max-width: 640px)": {
      width: 44,
      height: 44,
    },
  },
});

globalStyle(".active-block-layer, .obstacle-preview-layer", {
  "@media": {
    "(max-width: 640px)": {
      inset: 10,
    },
  },
});
