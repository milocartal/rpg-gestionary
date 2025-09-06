export function absoluteUrl(path = "/") {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return new URL(path, base).toString();
}

export function summarize(text?: string, max = 160) {
  if (!text) return undefined;
  const s = text.replace(/\s+/g, " ").trim();
  return s.length <= max ? s : s.slice(0, max - 1) + "…";
}
