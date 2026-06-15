export const TREATMENTS = [
  "Coloration",
  "Blondierung",
  "Tönung",
  "Glossing",
  "Balayage",
  "Highlights",
  "Sonstiges",
] as const;

export const BRANDS = [
  "Wella",
  "Schwarzkopf",
  "L'Oréal Professionnel",
  "Goldwell",
  "Redken",
  "Matrix",
  "Indola",
  "Kérastase",
  "Alfaparf",
  "Davines",
  "Olaplex",
  "Andere…",
] as const;

const LEVELS = ["1/0", "2/0", "3/0", "4/0", "5/0", "6/0", "7/0", "8/0", "9/0", "10/0"];
const REFLECTS = ["/1 Asch", "/2 Matt", "/3 Gold", "/4 Kupfer", "/5 Mahagoni", "/6 Violett", "/7 Braun"];
export const SHADES = [...LEVELS, ...REFLECTS, "Andere…"];

export const CORRECTIONS = [
  "Keine",
  "Anti-Gelb Silber",
  "Anti-Orange Blau",
  "Anti-Rot Grün",
  "Pastell-Töne",
  "Glossing-Base",
];

export const DEVELOPERS = ["1,9%", "3%", "6%", "9%", "12%"];

export const TIMES = Array.from({ length: 9 }, (_, i) => 10 + i * 5); // 10..50

export function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

const PALETTE = [
  "oklch(0.88 0.07 10)",
  "oklch(0.88 0.06 30)",
  "oklch(0.9 0.05 165)",
  "oklch(0.88 0.06 60)",
  "oklch(0.86 0.07 340)",
  "oklch(0.88 0.05 130)",
];

export function avatarColor(name: string) {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

export function formatDateDE(iso: string) {
  return new Date(iso).toLocaleDateString("de-DE", { day: "2-digit", month: "short", year: "numeric" });
}
