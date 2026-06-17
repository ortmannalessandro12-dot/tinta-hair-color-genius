export const TREATMENTS = [
  "Coloration",
  "Blondierung",
  "Tönung",
  "Glossing",
  "Balayage",
  "Highlights",
  "Sonstiges",
] as const;

export const BRAND_SHADES: Record<string, string[]> = {
  "Wella Koleston Perfect": [
    "1/0","2/0","3/0","4/0","5/0","6/0","7/0","8/0","9/0","10/0",
    "4/1","5/1","6/1","7/1","8/1","9/1","6/2","7/2","8/2",
    "5/3","6/3","7/3","8/3","9/3","4/4","5/4","6/4","7/4",
    "5/5","6/5","7/5","4/6","5/6","6/45","7/43","8/43","9/16",
    "Andere…",
  ],
  "Schwarzkopf Igora Royal": [
    "1-0","2-0","3-0","4-0","5-0","6-0","7-0","8-0","9-0","10-0",
    "3-1","4-1","5-1","6-1","7-1","8-1","9-1",
    "4-2","5-2","6-2","7-2","4-3","5-3","6-3","7-3",
    "4-4","5-4","6-4","4-5","5-5","6-5","4-6","5-6","6-6",
    "4-7","5-7","6-7","4-88","5-88","6-88",
    "Andere…",
  ],
  "Schwarzkopf Blondme": [
    "Sand","Ice","Ash","Caramel","Pearl","Strawberry",
    "Cool Ice","Warm Caramel","Ultra Cool","Ultra Warm",
    "Tönung Sand","Tönung Ice","Tönung Caramel","Tönung Pearl",
    "Andere…",
  ],
  "L'Oréal Majirel": [
    "1.0","2.0","3.0","4.0","5.0","6.0","7.0","8.0","9.0","10.0",
    "4.1","5.1","6.1","7.1","8.1","4.2","5.2","6.2","7.2",
    "5.3","6.3","7.3","8.3","4.4","5.4","6.4","7.4",
    "4.5","5.5","6.5","4.6","5.6","6.6","7.62","6.45","5.52",
    "Andere…",
  ],
  "Goldwell Topchic": [
    "2N","3N","4N","5N","6N","7N","8N","9N","10N",
    "5G","6G","7G","8G","5KG","6KG","7KG",
    "6K","7K","8K","5RR","6RR","5R","6R",
    "5B","6B","7B","8B","5GB","6GB",
    "Andere…",
  ],
  "Redken Shades EQ": [
    "06N","07N","08N","09N","010N",
    "06G","07G","08G","06GN","07GN",
    "06C","07C","08C","06Gb","07Gb",
    "06V","07V","06VB","06RO","07RO",
    "06B","07B","08B","06T","07T",
    "Andere…",
  ],
  "Andere…": [],
};

export const BRANDS = Object.keys(BRAND_SHADES) as readonly string[];

export const SHADES: readonly string[] = ["Andere…"];

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
