import { createFileRoute, Link } from "@tanstack/react-router";
import { TODO_EMAIL } from "@/lib/legal";

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

        <section className="space-y-8 mt-8">
          <div>
            <h2 className="font-serif text-xl mb-2">1. Verantwortlicher</h2>
            <p>
              Alessandro Ortmann, Meidelstetter Straße 12, 72829 Engstingen, Deutschland.
              <br />
              E-Mail: {TODO_EMAIL}
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl mb-2">2. Allgemeines</h2>
            <p>
              Tinta ist eine Webanwendung zur Verwaltung von Farbrezepturen für Friseursalons. Diese
              Erklärung informiert über die Verarbeitung personenbezogener Daten bei der Nutzung von
              Tinta.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl mb-2">3. Zwei Arten von Daten</h2>
            <p>
              Diese Erklärung betrifft die Daten der Nutzerinnen und Nutzer von Tinta (Saloninhaber
              und Mitarbeitende). Für die Daten der Salonkundschaft, die Nutzer in Tinta speichern,
              ist der jeweilige Salon selbst datenschutzrechtlich verantwortlich. Tinta verarbeitet
              diese Daten ausschließlich weisungsgebunden im Auftrag des Salons (Art. 28 DSGVO).
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl mb-2">4. Daten bei Registrierung und Nutzung</h2>
            <p>
              Bei der Erstellung eines Kontos werden E-Mail-Adresse und ein verschlüsseltes Passwort
              verarbeitet. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung). Zweck:
              Bereitstellung des Nutzerkontos und der Anwendung.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl mb-2">5. Inhaltsdaten</h2>
            <p>
              Nutzer speichern in Tinta Kundendaten, Farbrezepturen, Behandlungsnotizen und ggf.
              Fotos. Diese Daten werden ausschließlich zur Bereitstellung der Anwendung verarbeitet
              und nicht zu eigenen Zwecken ausgewertet, verkauft oder an Dritte weitergegeben.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl mb-2">
              6. Besondere Kategorien personenbezogener Daten
            </h2>
            <p>
              Nutzer können Angaben zu Allergien oder Unverträglichkeiten der Salonkundschaft
              erfassen. Dabei handelt es sich um Gesundheitsdaten im Sinne von Art. 9 DSGVO. Für die
              Rechtmäßigkeit dieser Erfassung ist der jeweilige Salon verantwortlich; er hat vor der
              Erfassung eine ausdrückliche Einwilligung der betroffenen Person einzuholen (Art. 9
              Abs. 2 lit. a DSGVO). Tinta verarbeitet diese Daten ausschließlich im Auftrag und
              speichert sie verschlüsselt.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl mb-2">7. Server-Logfiles</h2>
            <p>
              Beim Aufruf der Anwendung werden technisch notwendige Zugriffsdaten erhoben
              (IP-Adresse, Datum und Uhrzeit, aufgerufene Seite, Browsertyp, Betriebssystem,
              Referrer). Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an
              Betriebssicherheit und Fehleranalyse).
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl mb-2">
              8. Eingesetzte Dienstleister (Auftragsverarbeiter)
            </h2>
            <p>
              <strong>Hosting und Datenbank:</strong> Supabase, Serverstandort Irland (EU).
              Sämtliche Nutzer- und Inhaltsdaten werden auf Servern innerhalb der Europäischen Union
              gespeichert. Es besteht ein Auftragsverarbeitungsvertrag.
            </p>
            <p className="mt-3">
              <strong>Anwendungs-Hosting:</strong> Lovable — Bereitstellung und Auslieferung der
              Weboberfläche.
            </p>
            <p className="mt-3">
              <strong>Zahlungsabwicklung:</strong> Stripe Payments Europe Ltd., Dublin, Irland. Bei
              Abschluss eines kostenpflichtigen Abonnements werden Zahlungs- und Rechnungsdaten an
              Stripe übermittelt. Zahlungsdaten wie Kreditkartennummern werden ausschließlich von
              Stripe verarbeitet und sind für den Verantwortlichen nicht einsehbar. Eine
              Übermittlung in die USA kann stattfinden und erfolgt auf Grundlage geeigneter
              Garantien. Datenschutzhinweise:{" "}
              <a
                href="https://stripe.com/de/privacy"
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:opacity-80 underline"
              >
                https://stripe.com/de/privacy
              </a>
              . Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl mb-2">9. Cookies und lokale Speicherung</h2>
            <p>
              Tinta setzt ausschließlich technisch notwendige Cookies bzw. lokale
              Speichertechnologien ein, insbesondere zur Aufrechterhaltung der Anmeldesitzung. Es
              findet kein Tracking und keine Analyse des Nutzerverhaltens statt. Es werden keine
              Werbe- oder Analysedienste eingesetzt.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl mb-2">10. Speicherdauer</h2>
            <p>
              Nutzerdaten werden für die Dauer des Vertragsverhältnisses gespeichert. Nach Kündigung
              werden Konto und Inhaltsdaten innerhalb von 30 Tagen gelöscht, sofern keine
              gesetzlichen Aufbewahrungspflichten entgegenstehen. Rechnungs- und Buchhaltungsdaten
              werden entsprechend den handels- und steuerrechtlichen Fristen aufbewahrt.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl mb-2">11. Rechte der betroffenen Personen</h2>
            <p>
              Sie haben das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung
              (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20)
              sowie Widerspruch (Art. 21 DSGVO). Erteilte Einwilligungen können jederzeit mit
              Wirkung für die Zukunft widerrufen werden. Zur Ausübung genügt eine Nachricht an:{" "}
              {TODO_EMAIL}
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl mb-2">12. Beschwerderecht</h2>
            <p>
              Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren.
              Zuständig ist: Der Landesbeauftragte für den Datenschutz und die Informationsfreiheit
              Baden-Württemberg, Lautenschlagerstraße 20, 70173 Stuttgart.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl mb-2">13. Datensicherheit</h2>
            <p>
              Die Übertragung erfolgt verschlüsselt über TLS. Der Zugriff auf Inhaltsdaten ist durch
              Zugriffsbeschränkungen auf Datenbankebene technisch abgesichert.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl mb-2">14. Änderungen</h2>
            <p>
              Diese Datenschutzerklärung wird angepasst, wenn sich die Verarbeitung ändert. Es gilt
              jeweils die auf dieser Seite veröffentlichte Fassung.
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
