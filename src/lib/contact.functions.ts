import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(1),
  // Honeypot: für Menschen unsichtbares Feld, das leer bleiben muss.
  website: z.string().optional(),
});

export const sendContactMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(contactSchema)
  .handler(async ({ data, context }) => {
    if (data.website) {
      // Spam-Bot hat das Honeypot-Feld ausgefüllt: so tun, als wäre alles
      // gutgegangen, ohne die Nachricht weiterzuverarbeiten.
      return { ok: true as const };
    }

    // TODO: Echten E-Mail-Versand anschließen (z. B. über Resend), sobald
    // ein Anbieter und CONTACT_EMAIL_TO als Empfänger feststehen. Bis dahin
    // wird die Anfrage nur serverseitig geloggt und dem Nutzer transparent
    // mitgeteilt, dass der Versand noch nicht aktiv ist.
    console.warn("[contact] Neue Kontaktanfrage (E-Mail-Versand noch nicht konfiguriert):", {
      to: process.env.CONTACT_EMAIL_TO ?? "(CONTACT_EMAIL_TO nicht gesetzt)",
      from: data.email,
      name: data.name,
      subject: data.subject,
      message: data.message,
      userId: context.userId,
    });

    throw new Error(
      "Der Versand ist technisch vorbereitet, aber noch nicht aktiviert. Bitte wende dich vorerst direkt per E-Mail an uns.",
    );
  });
