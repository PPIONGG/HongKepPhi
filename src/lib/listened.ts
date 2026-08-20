const STORAGE_KEY = "hong-kep-phi:listened";
const CODE_PREFIX = "hk1";

export function readListened(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

export function writeListened(slugs: string[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
}

function catalogNumber(catalog: string) {
  const match = /^HK-(\d+)$/i.exec(catalog.trim());
  if (!match) return null;
  const value = Number(match[1]);
  return value > 0 ? value : null;
}

function toBase64Url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(value: string) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  const binary = atob(padded + pad);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export function encodeListenedCode(
  slugs: string[],
  catalogBySlug: Record<string, string>,
) {
  const numbers = slugs
    .map((slug) => catalogNumber(catalogBySlug[slug] ?? ""))
    .filter((value): value is number => value != null);
  const max = numbers.length > 0 ? Math.max(...numbers) : 0;
  const bytes = new Uint8Array(Math.max(1, Math.ceil(max / 8)));
  for (const number of numbers) {
    const index = number - 1;
    bytes[index >> 3] |= 1 << (index & 7);
  }
  return `${CODE_PREFIX}.${toBase64Url(bytes)}`;
}

export function decodeListenedCode(
  code: string,
  slugByCatalog: Record<string, string>,
) {
  const trimmed = code.trim();
  const dot = trimmed.indexOf(".");
  if (dot < 0) return null;
  const prefix = trimmed.slice(0, dot).toLowerCase();
  const payload = trimmed.slice(dot + 1);
  if (prefix !== CODE_PREFIX || payload.length === 0) return null;
  let bytes: Uint8Array;
  try {
    bytes = fromBase64Url(payload);
  } catch {
    return null;
  }
  const slugs: string[] = [];
  for (let bit = 0; bit < bytes.length * 8; bit += 1) {
    if (bytes[bit >> 3] & (1 << (bit & 7))) {
      const catalog = `HK-${String(bit + 1).padStart(3, "0")}`;
      const slug = slugByCatalog[catalog];
      if (slug) slugs.push(slug);
    }
  }
  return slugs;
}
