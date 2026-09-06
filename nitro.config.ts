// Vorschlag für den Umzug von Lovable (Cloudflare-Preset) zu Vercel.
// Nitro lädt eine root-level nitro.config.ts über c12 automatisch mit ein;
// falls der aktuelle @lovable.dev/vite-tanstack-config-Wrapper den Preset
// selbst fest auf "cloudflare" setzt, hat dessen eigener Override Vorrang
// (Nitros Priorität: eigener configOverride > NITRO_PRESET-Env-Var > Datei).
// In dem Fall zusätzlich NITRO_PRESET=vercel als Umgebungsvariable im
// Vercel-Projekt setzen. Erst mit echtem Build (außerhalb dieser Sandbox,
// die keinen Zugriff auf die privaten Lovable-Pakete hat) verifizierbar.
import { defineConfig } from "nitro";

export default defineConfig({
  preset: "vercel",
});
