import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/_authenticated/help")({
  component: HelpPage,
});

const FAQ = [
  {
    q: "Wie lege ich eine neue Rezeptur an?",
    a: "Öffne eine Kundin und tippe auf „Rezeptur hinzufügen“. Trage Marke, Ton, Gramm und optional Oxidant und Einwirkzeit für jede Komponente ein und speichere.",
  },
  {
    q: "Wie funktioniert der Farbtimer?",
    a: "Bei jeder Rezeptur-Komponente mit hinterlegter Einwirkzeit erscheint ein Countdown. Du kannst ihn starten, pausieren und zurücksetzen; bei Ablauf ertönt ein Signal und du bekommst eine Benachrichtigung. Über Einstellungen → Farbtimer kannst du die Funktion an- oder ausschalten.",
  },
  {
    q: "Wie hängt das Inventar mit meinen Rezepturen zusammen?",
    a: "Legst du im Inventar ein Produkt mit derselben Marke und demselben Ton an wie in einer Rezeptur, wird die dort hinterlegte Gramm-Menge beim Speichern automatisch vom Bestand abgezogen. Wareneingänge erfassen den Zukauf, ein Hinweis erscheint, sobald ein Produkt unter den Mindestbestand fällt.",
  },
  {
    q: "Wie verwalte ich mein Abo?",
    a: "Unter Menü → Abo verwalten siehst du deinen aktuellen Status und gelangst über „Zahlung & Kündigung verwalten“ ins Stripe-Kundenportal, wo du Zahlungsmethode und Kündigung selbst steuerst.",
  },
  {
    q: "Wie ändere ich meinen Namen, meine E-Mail oder mein Passwort?",
    a: "Unter Menü → Mein Profil kannst du alle drei Angaben getrennt voneinander ändern und speichern.",
  },
  {
    q: "Ich habe ein Problem, das hier nicht beantwortet wird.",
    a: "Schreib uns über das Kontaktformular – wir bieten keinen Telefon-Support, melden uns aber schriftlich per E-Mail zurück.",
  },
];

function HelpPage() {
  return (
    <AppShell back={{ to: "/clients" }} title="Hilfe / FAQ">
      <div className="space-y-6">
        <Accordion type="single" collapsible className="card-soft px-5">
          {FAQ.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger>{item.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <p className="text-sm text-muted-foreground text-center">
          Noch offene Fragen?{" "}
          <Link to="/contact" className="text-primary underline">
            Kontaktiere uns
          </Link>
          .
        </p>
      </div>
    </AppShell>
  );
}
