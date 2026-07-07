import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/avv")({
  head: () => ({
    meta: [
      { title: "Auftragsverarbeitungsvertrag (AVV) — Tinta" },
      {
        name: "description",
        content:
          "Auftragsverarbeitungsvertrag gemäß Art. 28 DSGVO zwischen dem Salon (Verantwortlicher) und Tinta (Auftragsverarbeiter).",
      },
      { property: "og:title", content: "Auftragsverarbeitungsvertrag (AVV) — Tinta" },
      {
        property: "og:description",
        content:
          "AVV nach Art. 28 DSGVO für die Nutzung der SaaS-Anwendung Tinta zur Verwaltung von Kundinnen- und Rezepturdaten.",
      },
    ],
  }),
  component: AvvPage,
});

function AvvPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/70 border-b border-border/60">
        <div className="mx-auto max-w-3xl px-5 h-16 flex items-center">
          <Link to="/" className="font-serif text-xl tracking-tight">
            Tinta<span className="text-primary">.</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-10">
        <h1 className="font-serif text-3xl md:text-4xl mb-2">
          Auftragsverarbeitungsvertrag (AVV)
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          gemäß Art. 28 DSGVO
        </p>

        <section className="prose prose-neutral max-w-none text-[15px] leading-relaxed space-y-6">
          <p>
            Dieser Auftragsverarbeitungsvertrag (nachfolgend „AVV") wird geschlossen
            zwischen dem Salon, der die SaaS-Anwendung Tinta nutzt (nachfolgend
            „Verantwortlicher"), und
          </p>
          <p>
            <strong>[VOLLSTÄNDIGER NAME]</strong>
            <br />
            <strong>[ADRESSE]</strong>
            <br />
            – nachfolgend „Auftragsverarbeiter" –
          </p>
          <p>
            Verantwortlicher und Auftragsverarbeiter werden nachfolgend einzeln als
            „Partei" und gemeinsam als „Parteien" bezeichnet.
          </p>

          <h2 className="font-serif text-xl mt-8">1. Gegenstand und Dauer</h2>
          <p>
            Gegenstand dieses Vertrags ist die Bereitstellung der SaaS-Anwendung
            Tinta zur Verwaltung von Kundinnen- und Rezepturdaten des
            Verantwortlichen. Der Auftragsverarbeiter verarbeitet personenbezogene
            Daten im Auftrag des Verantwortlichen ausschließlich zur Erbringung der
            in der Anwendung angebotenen Funktionen. Die Laufzeit dieses AVV
            entspricht der Laufzeit des zugrunde liegenden Nutzungs- bzw.
            Abonnementvertrags und endet automatisch mit dessen Beendigung.
          </p>

          <h2 className="font-serif text-xl mt-8">2. Art und Zweck der Verarbeitung</h2>
          <p>
            Die Verarbeitung umfasst insbesondere das Speichern, Organisieren,
            Strukturieren, Anzeigen und Löschen von Kundendaten des Salons, soweit
            dies zur Erbringung der App-Funktionen erforderlich ist. Zweck der
            Verarbeitung ist die digitale Dokumentation und Wiederauffindbarkeit
            von Haarfarbrezepturen sowie zugehöriger Kundinnen-Informationen.
          </p>

          <h2 className="font-serif text-xl mt-8">3. Art der Daten</h2>
          <p>
            Gegenstand der Verarbeitung sind folgende Datenkategorien:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Namen der Salonkundinnen und -kunden</li>
            <li>Haarfarb- und Rezepturdaten (Marken, Nuancen, Mengen, Entwickler)</li>
            <li>Behandlungshistorie inklusive Datum und Ergebnisfotos</li>
            <li>Optionale Notizen zu Kundinnen und Behandlungen</li>
            <li>Optionale Termindaten</li>
          </ul>

          <h2 className="font-serif text-xl mt-8">4. Kategorien betroffener Personen</h2>
          <p>Betroffene Personen sind die Kundinnen und Kunden des Salons.</p>

          <h2 className="font-serif text-xl mt-8">5. Pflichten des Auftragsverarbeiters</h2>
          <p>Der Auftragsverarbeiter verpflichtet sich insbesondere:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              die personenbezogenen Daten ausschließlich auf dokumentierte Weisung
              des Verantwortlichen zu verarbeiten;
            </li>
            <li>
              sicherzustellen, dass alle Personen, die Zugang zu den Daten haben,
              schriftlich zur Vertraulichkeit verpflichtet sind oder einer
              gesetzlichen Verschwiegenheitspflicht unterliegen;
            </li>
            <li>
              geeignete technische und organisatorische Maßnahmen nach Art. 32
              DSGVO zu treffen, insbesondere:
              <ul className="list-[circle] pl-6 mt-1 space-y-1">
                <li>Verschlüsselung der Daten in Übertragung (TLS) und Speicherung;</li>
                <li>Zugriffskontrolle durch Authentifizierungsverfahren;</li>
                <li>Mandantentrennung auf Datenbankebene (Row Level Security);</li>
                <li>Regelmäßige Backups zur Sicherstellung der Verfügbarkeit.</li>
              </ul>
            </li>
          </ul>

          <h2 className="font-serif text-xl mt-8">6. Unterauftragsverarbeiter</h2>
          <p>
            Der Verantwortliche erteilt hiermit die allgemeine Genehmigung zur
            Beauftragung von Unterauftragsverarbeitern. Der Auftragsverarbeiter
            informiert den Verantwortlichen über beabsichtigte Änderungen in
            Textform und räumt ein Widerspruchsrecht ein. Aktuell eingesetzte
            Unterauftragsverarbeiter:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Supabase (Datenbank &amp; Authentifizierung)</li>
            <li>Stripe Payments Europe Ltd. (Zahlungsabwicklung)</li>
            <li>Hosting-Infrastruktur des App-Anbieters (Lovable)</li>
          </ul>
          <p>
            Soweit eine Übermittlung in Drittländer erfolgt, geschieht dies auf
            Grundlage der EU-Standardvertragsklauseln bzw. — sofern anwendbar —
            des EU-US Data Privacy Framework.
          </p>

          <h2 className="font-serif text-xl mt-8">7. Unterstützungspflichten</h2>
          <p>
            Der Auftragsverarbeiter unterstützt den Verantwortlichen mit
            geeigneten technischen und organisatorischen Maßnahmen bei der
            Erfüllung der Betroffenenrechte (u.a. Auskunft, Berichtigung, Löschung,
            Einschränkung der Verarbeitung, Datenübertragbarkeit) sowie bei den
            Melde- und Benachrichtigungspflichten nach Art. 33 und 34 DSGVO.
          </p>

          <h2 className="font-serif text-xl mt-8">8. Meldung von Datenschutzverletzungen</h2>
          <p>
            Der Auftragsverarbeiter meldet dem Verantwortlichen jede ihm bekannt
            gewordene Verletzung des Schutzes personenbezogener Daten ohne
            unangemessene Verzögerung.
          </p>

          <h2 className="font-serif text-xl mt-8">9. Löschung und Rückgabe</h2>
          <p>
            Nach Beendigung des Vertragsverhältnisses löscht der
            Auftragsverarbeiter sämtliche im Auftrag verarbeitete
            personenbezogenen Daten des Salons innerhalb von 30 Tagen, sofern
            keine gesetzliche Aufbewahrungspflicht entgegensteht. Vor der Löschung
            wird dem Verantwortlichen eine angemessene Möglichkeit zum Export der
            Daten eingeräumt.
          </p>

          <h2 className="font-serif text-xl mt-8">10. Nachweis und Kontrolle</h2>
          <p>
            Der Auftragsverarbeiter stellt dem Verantwortlichen auf Anfrage alle
            erforderlichen Informationen zum Nachweis der Einhaltung der in
            Art. 28 DSGVO niedergelegten Pflichten zur Verfügung.
          </p>

          <h2 className="font-serif text-xl mt-8">11. Schlussbestimmungen</h2>
          <p>
            Es gilt das Recht der Bundesrepublik Deutschland. Änderungen und
            Ergänzungen dieses AVV bedürfen der Textform. Sollten einzelne
            Bestimmungen dieses Vertrags unwirksam sein, bleibt die Wirksamkeit
            der übrigen Bestimmungen unberührt.
          </p>
        </section>

        <div className="mt-12 border-t border-border/60 pt-6 text-sm text-muted-foreground flex flex-wrap gap-4">
          <Link to="/" className="hover:text-foreground">Zurück zur App</Link>
        </div>
      </main>
    </div>
  );
}
