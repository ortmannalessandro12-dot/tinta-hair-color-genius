export const TREATMENTS = [
  "Coloration","Blondierung","Tönung",
  "Glossing","Balayage","Highlights","Sonstiges",
] as const;

export const BRAND_SHADES: Record<string, string[]> = {

  "L'Oréal Dia Light": [
    "1.0 Natur","2.0 Natur","3.0 Natur","4.0 Natur","5.0 Natur",
    "6.0 Natur","7.0 Natur","8.0 Natur","9.0 Natur","10.0 Natur",
    "5.1 Asch (blau)","6.1 Asch (blau)","7.1 Asch (blau)",
    "8.1 Asch (blau)","9.1 Asch (blau)",
    "5.2 Irisé/Violett","6.2 Irisé/Violett","7.2 Irisé/Violett",
    "8.2 Irisé/Violett",
    "5.3 Gold","6.3 Gold","7.3 Gold","8.3 Gold","9.3 Gold","10.3 Gold",
    "5.4 Kupfer","6.4 Kupfer","7.4 Kupfer","8.4 Kupfer",
    "5.5 Mahagoni","6.5 Mahagoni","7.5 Mahagoni",
    "5.6 Rot","6.6 Rot","7.6 Rot",
    "5.7 Braun","6.7 Braun","7.7 Braun",
    "5.8 Mokka","6.8 Mokka","7.8 Mokka",
    "7.9 Cendré Soft/kühles Beige","8.9 Cendré Soft/kühles Beige",
    "Andere…",
  ],

  "Wella": [
    "1/0 Natur","2/0 Natur","3/0 Natur","4/0 Natur","5/0 Natur",
    "6/0 Natur","7/0 Natur","8/0 Natur","9/0 Natur","10/0 Natur",
    "4/1 Asch","5/1 Asch","6/1 Asch","7/1 Asch","8/1 Asch","9/1 Asch",
    "5/2 Matt/Grün","6/2 Matt/Grün","7/2 Matt/Grün",
    "5/3 Gold","6/3 Gold","7/3 Gold","8/3 Gold","9/3 Gold",
    "5/4 Rot","6/4 Rot","7/4 Rot",
    "5/5 Mahagoni","6/5 Mahagoni","7/5 Mahagoni",
    "4/6 Violett","5/6 Violett","6/6 Violett",
    "5/7 Braun","6/7 Braun","7/7 Braun",
    "6/8 Perle/Blau-Violett","7/8 Perle/Blau-Violett",
    "8/9 Cendré/Soft Asch","9/9 Cendré/Soft Asch",
    "6/43","7/43","8/43","6/45","7/45",
    "Andere…",
  ],

  "Schwarzkopf Igora Royal": [
    "1-0 Natur","2-0 Natur","3-0 Natur","4-0 Natur","5-0 Natur",
    "6-0 Natur","7-0 Natur","8-0 Natur","9-0 Natur","10-0 Natur",
    "4-1 Cendré/Asch","5-1 Cendré/Asch","6-1 Cendré/Asch",
    "7-1 Cendré/Asch","8-1 Cendré/Asch","9-1 Cendré/Asch",
    "5-2 Matt","6-2 Matt","7-2 Matt",
    "5-3 Gold","6-3 Gold","7-3 Gold","8-3 Gold",
    "4-4 Beige","5-4 Beige","6-4 Beige","7-4 Beige",
    "4-5 Gold-Mahagoni","5-5 Gold-Mahagoni","6-5 Gold-Mahagoni",
    "4-6 Schokolade","5-6 Schokolade","6-6 Schokolade",
    "5-7 Kupfer","6-7 Kupfer","7-7 Kupfer",
    "5-8 Rot","6-8 Rot","7-8 Rot",
    "5-9 Violett","6-9 Violett",
    "Andere…",
  ],

  "Goldwell Topchic": [
    "2N Natur","3N Natur","4N Natur","5N Natur","6N Natur",
    "7N Natur","8N Natur","9N Natur","10N Natur",
    "5A Asch","6A Asch","7A Asch","8A Asch",
    "5AA Intensiv Asch","6AA Intensiv Asch","7AA Intensiv Asch",
    "5P Perle","6P Perle","7P Perle",
    "5V Violett","6V Violett","7V Violett",
    "5G Gold","6G Gold","7G Gold","8G Gold",
    "5K Kupfer","6K Kupfer","7K Kupfer",
    "5R Rot","6R Rot","7R Rot",
    "5M Matt","6M Matt","7M Matt",
    "Andere…",
  ],

  "Redken Shades EQ": [
    "06N Natural","07N Natural","08N Natural","09N Natural","010N Natural",
    "06NA Natural Ash","07NA Natural Ash","08NA Natural Ash",
    "06T Titanium","07T Titanium","08T Titanium",
    "06P Pearl","07P Pearl","08P Pearl",
    "06V Violet","07V Violet","08V Violet",
    "06B Blue","07B Blue","08B Blue",
    "06GB Gold Beige","07GB Gold Beige","08GB Gold Beige",
    "06GI Gold Iridescent","07GI Gold Iridescent",
    "Andere…",
  ],

  "Newsha": [
    "1.0 Natur","2.0 Natur","3.0 Natur","4.0 Natur","5.0 Natur",
    "6.0 Natur","7.0 Natur","8.0 Natur","9.0 Natur","10.0 Natur",
    "5.1 Asch (Blau)","6.1 Asch (Blau)","7.1 Asch (Blau)","8.1 Asch (Blau)",
    "5.2 Violett/Irisé","6.2 Violett/Irisé","7.2 Violett/Irisé",
    "5.3 Gold","6.3 Gold","7.3 Gold","8.3 Gold",
    "5.4 Kupfer","6.4 Kupfer","7.4 Kupfer",
    "5.5 Mahagoni","6.5 Mahagoni","7.5 Mahagoni",
    "5.6 Rot","6.6 Rot","7.6 Rot",
    "5.7 Braun/Matt","6.7 Braun/Matt","7.7 Braun/Matt",
    "5.8 Perle","6.8 Perle","7.8 Perle",
    "7.9 Cendré/Rauchig","8.9 Cendré/Rauchig",
    "Andere…",
  ],

  "Andere…": [],
};

export const BRANDS = Object.keys(BRAND_SHADES) as readonly string[];
export const SHADES: readonly string[] = ["Andere…"];

export const CORRECTIONS = [
  "Keine","Anti-Gelb Silber","Anti-Orange Blau","Anti-Rot Grün",
  "Pastell-Töne","Glossing-Base",
];

export const DEVELOPERS = ["1,9%","3%","6%","9%","12%"];
export const TIMES = Array.from({ length: 9 }, (_, i) => 10 + i * 5);

export function initials(name: string) {
  return name.trim().split(/\s+/).slice(0,2)
    .map((p) => p[0]?.toUpperCase() ?? "").join("");
}

const PALETTE = [
  "oklch(0.88 0.07 10)","oklch(0.88 0.06 30)",
  "oklch(0.9 0.05 165)","oklch(0.88 0.06 60)",
  "oklch(0.86 0.07 340)","oklch(0.88 0.05 130)",
];

export function avatarColor(name: string) {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

export function formatDateDE(iso: string) {
  return new Date(iso).toLocaleDateString("de-DE", {
    day: "2-digit", month: "short", year: "numeric",
  });
}



