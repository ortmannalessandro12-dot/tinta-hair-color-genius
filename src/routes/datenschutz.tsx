import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/datenschutz")({
  head: () => ({
    meta: [
      { title: "Datenschutzerklärung — Tinta" },
      {
        name: "description",
        content:
          "Datenschutzerklärung nach DSGVO: welche Daten Tinta verarbeitet, zu welchem Zweck, mit welchen Dienstleistern und welche Rechte du hast.",
      },
      { property: "og:title", content: "Datenschutzerklärung — Tinta" },
      {
        property: "og:description",
        content:
          "Informationen zur Verarbeitung personenbezogener Daten in der Farbrezeptur-App Tinta.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DatenschutzPage,
});

function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/70 border-b border-border/60">
        <div className="mx-auto max-w-3xl px-5 h-16 flex items-center">
          <Link to="/" className="font-serif text-xl tracking-tight">
            Tinta<span className="text-primary">.</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-10 text-[16px] leading-relaxed">
        <h1 className="font-serif text-3xl md:text-4xl mb-2">Datenschutzerklärung</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Informationen nach Art. 13 und 14 DSGVO
        </p>

        <section className="space-y-8">
          <div>
            <h2 className="font-serif text-xl mb-2">1. Verantwortlicher</h2>
            <p>
              [VOLLSTÄNDIGER NAME]
              <br />
              [STRASSE UND HAUSNUMMER]
              <br />
              [PLZ UND ORT]
              <br />
              E-Mail: [E-MAIL-ADRESSE]
              <br />
              Telefon: [TELEFONNUMMER]
            </p>
            <p className="mt-2 text-muted-foreground">
              Datenschutzbeauftragte:r (falls benannt): [NAME UND KONTAKT ODER „nicht
              erforderlich"]
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl mb-2">2. Welche Daten wir verarbeiten</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Account-Daten:</strong> E-Mail-Adresse, verschlüsseltes Passwort
                bzw. Login über Google/Apple, Zeitpunkt der Registrierung und der letzten
                Anmeldung, Zustimmung zum Auftragsverarbeitungsvertrag.
              </li>
              <li>
                <strong>Kundendaten der Salons:</strong> Name und optionale Notizen zu
                Kundinnen und Kunden, die der Salon selbst erfasst.
              </li>
              <li>
                <strong>Rezeptdaten:</strong> Marken, Nuancen, Mengen, Oxidant,
                Einwirkzeiten, Notizen sowie optionale Fotos des Ergebnisses.
              </li>
              <li>
                <strong>Abo- und Zahlungsdaten:</strong> Abo-Status, Trial-Ende,
                Kunden- und Abo-Kennung von Stripe. Kreditkartendaten werden
                ausschließlich von Stripe verarbeitet und erreichen uns nie.
              </li>
              <li>
                <strong>Technische Daten:</strong> Server-Logdaten wie IP-Adresse,
                Zeitpunkt und Fehlermeldungen zur Absicherung und Fehleranalyse.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-xl mb-2">3. Zweck und Rechtsgrundlage</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Bereitstellung von Login, Speicherung und Anzeige der Rezepturen:
                Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung).
              </li>
              <li>
                Zahlungsabwicklung und Abo-Verwaltung: Art. 6 Abs. 1 lit. b DSGVO.
              </li>
              <li>
                Betrieb, Sicherheit und Fehleranalyse: Art. 6 Abs. 1 lit. f DSGVO
                (berechtigtes Interesse an einem stabilen, sicheren Dienst).
              </li>
              <li>
                Gesetzliche Aufbewahrungspflichten für Rechnungen: Art. 6 Abs. 1 lit. c
                DSGVO.
              </li>
            </ul>
            <p className="mt-2">
              Für die von Salons eingegebenen Kundendaten ist der jeweilige Salon
              Verantwortlicher; wir verarbeiten diese Daten als Auftragsverarbeiter auf
              Grundlage des{" "}
              <Link to="/avv" className="text-primary hover:opacity-80">
                Auftragsverarbeitungsvertrags
              </Link>
              .
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl mb-2">4. Eingesetzte Dienstleister</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Supabase</strong> — Hosting von Datenbank, Authentifizierung und
                Dateispeicher. Serverstandort EU. Auftragsverarbeiter nach Art. 28 DSGVO.
              </li>
              <li>
                <strong>Stripe</strong> — Zahlungsabwicklung und Abo-Verwaltung.
                Übermittelt werden E-Mail-Adresse und Zahlungsdaten; die Zahlungsdaten
                werden direkt bei Stripe eingegeben. Stripe Payments Europe Ltd., Irland.
              </li>
              <li>
                <strong>[WEITERER DIENSTLEISTER, FALLS GENUTZT]</strong> — [ZWECK].
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-xl mb-2">5. Speicherdauer</h2>
            <p>
              Account-, Kundinnen- und Rezeptdaten werden gespeichert, solange dein Konto
              besteht. Nach Löschung des Kontos werden sie innerhalb von 30 Tagen
              endgültig gelöscht. Rechnungs- und steuerrelevante Daten bewahren wir
              gemäß gesetzlicher Fristen bis zu 10 Jahre auf. Server-Logs werden
              spätestens nach [ANZAHL] Tagen gelöscht.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl mb-2">6. Deine Rechte</h2>
            <p>
              Du hast das Recht auf Auskunft (Art. 15), Berichtigung (Art. 16), Löschung
              (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit
              (Art. 20) sowie Widerspruch gegen Verarbeitungen auf Grundlage
              berechtigter Interessen (Art. 21 DSGVO). Erteilte Einwilligungen kannst du
              jederzeit mit Wirkung für die Zukunft widerrufen.
            </p>
            <p className="mt-2">
              Außerdem besteht ein Beschwerderecht bei einer Aufsichtsbehörde,
              zuständig ist: [ZUSTÄNDIGE AUFSICHTSBEHÖRDE].
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl mb-2">7. Kontakt</h2>
            <p>
              Für alle Fragen zum Datenschutz erreichst du uns unter
              [E-MAIL-ADRESSE] oder postalisch unter der oben genannten Anschrift.
            </p>
          </div>
        </section>

        <div className="mt-12 flex gap-5 text-sm">
          <Link to="/impressum" className="text-primary hover:opacity-80">
            Impressum
          </Link>
          <Link to="/avv" className="text-primary hover:opacity-80">
            AVV
          </Link>
        </div>
      </main>
    </div>
  );
}
