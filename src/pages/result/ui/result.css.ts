import { globalStyle } from "@vanilla-extract/css";

globalStyle(".page-result", {
  alignItems: "start",
});

globalStyle(".result-panel", {
  maxWidth: 720,
  margin: "0 auto",
  textAlign: "center",
});

globalStyle(".result-subtitle", {
  marginTop: 8,
});

globalStyle(".result-grid", {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
  gap: 18,
  marginTop: 24,
});

globalStyle(".result-actions", {
  marginTop: 28,
  display: "flex",
  justifyContent: "center",
  gap: 16,
  flexWrap: "wrap",
});
