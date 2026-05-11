/**
 * Shared browser-origin rules for Express CORS and Socket.IO handshake CORS.
 * Render: set CLIENT_URL to the exact tab URL, or rely on RENDER_EXTERNAL_URL for same-host deploys.
 * Optional ALLOWED_ORIGINS="https://a.com,https://b.com" for www vs apex, etc.
 */

const normalizeOrigin = (value) => {
  if (!value || typeof value !== "string") return "";
  return value.trim().replace(/\/+$/, "");
};

export const getPrimaryProductionOrigin = () =>
  normalizeOrigin(process.env.CLIENT_URL) ||
  normalizeOrigin(process.env.RENDER_EXTERNAL_URL) ||
  "https://chatapp-yr2n.onrender.com";

export const getAllAllowedOrigins = () => {
  const set = new Set();
  const add = (value) => {
    const n = normalizeOrigin(value);
    if (n) set.add(n);
  };

  add(process.env.CLIENT_URL);
  add(process.env.RENDER_EXTERNAL_URL);
  const list = process.env.ALLOWED_ORIGINS || "";
  list.split(",").forEach((item) => add(item));
  add("https://chatapp-yr2n.onrender.com");

  return set;
};

const isLocalhostOrigin = (origin = "") =>
  /^http:\/\/localhost:\d+$/.test(origin);

export const isOriginAllowedForCors = (origin) => {
  if (!origin) return true;
  if (isLocalhostOrigin(origin)) return true;
  const normalized = normalizeOrigin(origin);
  return getAllAllowedOrigins().has(normalized);
};
