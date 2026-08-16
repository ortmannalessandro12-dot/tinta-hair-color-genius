import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/impressum")({
  head: () => ({
    meta: [
      { title: "Impressum — Tinta" },
      {
        name: "description",
        content: "Impressum und Anbieterkennzeichnung nach § 5 DDG für die Anwendung Tinta.",
      },
      { property: "og:title", content: "Impressum — Tinta" },
      {
        property: "og:description",
        content: "Anbieterkennzeichnung nach § 5 DDG für die Farbrezeptur-App Tinta.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ImpressumPage,
});

function ImpressumPage() {
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
        <h1 className="font-serif text-3xl md:text-4xl mb-2">Impressum</h1>
        <p className="text-sm text-muted-foreground mb-8">Angaben gemäß § 5 DDG</p>

        <section className="space-y-8">
          <div>
            <h2 className="font-serif text-xl mb-2">Diensteanbieter</h2>
            <p>
              [VOLLSTÄNDIGER NAME]
              <br />
              [STRASSE UND HAUSNUMMER]
              <br />
              [PLZ UND ORT]
              <br />
              [LAND]
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl mb-2">Kontakt</h2>
            <p>
              E-Mail: [E-MAIL-ADRESSE]
              <br />
              Telefon: [TELEFONNUMMER]
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl mb-2">Umsatzsteuer</h2>
            <p>
              Umsatzsteuer-Identifikationsnummer gemäß § 27 a UStG: [USt-IdNr.]
              <br />
              Steuernummer: [STEUERNUMMER]
              <br />
              <span className="text-muted-foreground">
                (Bei Kleinunternehmerregelung nach § 19 UStG: „Gemäß § 19 UStG wird keine
                Umsatzsteuer berechnet.")
              </span>
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl mb-2">Verantwortlich für den Inhalt</h2>
            <p>
              [VERANTWORTLICHE PERSON]
              <br />
              [ANSCHRIFT, FALLS ABWEICHEND]
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl mb-2">EU-Streitschlichtung</h2>
            <p>
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung
              bereit: https://ec.europa.eu/consumers/odr. Wir sind nicht verpflichtet und
              nicht bereit, an einem Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl mb-2">Haftung für Inhalte und Links</h2>
            <p>
              Die Inhalte dieser Anwendung wurden mit größter Sorgfalt erstellt. Für die
              Richtigkeit, Vollständigkeit und Aktualität der Inhalte kann jedoch keine
              Gewähr übernommen werden. Für Inhalte externer Links sind ausschließlich
              deren Betreiber verantwortlich.
            </p>
          </div>
        </section>

        <div className="mt-12 flex gap-5 text-sm">
          <Link to="/datenschutz" className="text-primary hover:opacity-80">
            Datenschutz
          </Link>
          <Link to="/avv" className="text-primary hover:opacity-80">
            AVV
          </Link>
        </div>
      </main>
    </div>
  );
}
