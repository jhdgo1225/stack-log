const FONT_STYLESHEET_ID = "daker-may-fonts-stylesheet";
const FONT_PRECONNECT_IDS = {
  api: "daker-may-fonts-preconnect-api",
  static: "daker-may-fonts-preconnect-static",
} as const;

const GOOGLE_FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;600&display=swap";

const ensureLink = (
  id: string,
  rel: string,
  href: string,
  crossOrigin?: "anonymous",
) => {
  if (typeof document === "undefined") {
    return;
  }

  if (document.getElementById(id) instanceof HTMLLinkElement) {
    return;
  }

  const link = document.createElement("link");
  link.id = id;
  link.rel = rel;
  link.href = href;

  if (crossOrigin) {
    link.crossOrigin = crossOrigin;
  }

  document.head.appendChild(link);
};

ensureLink(
  FONT_PRECONNECT_IDS.api,
  "preconnect",
  "https://fonts.googleapis.com",
);
ensureLink(
  FONT_PRECONNECT_IDS.static,
  "preconnect",
  "https://fonts.gstatic.com",
  "anonymous",
);
ensureLink(FONT_STYLESHEET_ID, "stylesheet", GOOGLE_FONTS_HREF);
