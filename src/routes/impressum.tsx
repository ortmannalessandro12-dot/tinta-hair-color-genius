import { createFileRoute, Link } from "@tanstack/react-router";
import { TODO_EMAIL } from "@/lib/legal";

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
            <p>
              Alessandro Ortmann
              <br />
              Meidelstetter Straße 12
              <br />
              72829 Engstingen
              <br />
              Deutschland
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl mb-2">Kontakt</h2>
            <p>E-Mail: {TODO_EMAIL}</p>
          </div>

          <div>
            <h2 className="font-serif text-xl mb-2">
              Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
            </h2>
            <p>Alessandro Ortmann, Anschrift wie oben</p>
          </div>

          <div>
            <h2 className="font-serif text-xl mb-2">Verbraucherstreitbeilegung</h2>
            <p>
              Ich bin nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl mb-2">Haftung für Inhalte</h2>
            <p>
              Als Diensteanbieter bin ich gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten
              nach den allgemeinen Gesetzen verantwortlich. Nach den §§ 8 bis 10 DDG bin ich als
              Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
              Informationen zu überwachen oder nach Umständen zu forschen, die auf eine
              rechtswidrige Tätigkeit hinweisen.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl mb-2">Haftung für Links</h2>
            <p>
              Mein Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte ich keinen
              Einfluss habe. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter
              verantwortlich.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl mb-2">Urheberrecht</h2>
            <p>
              Die durch den Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten
              unterliegen dem deutschen Urheberrecht.
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
