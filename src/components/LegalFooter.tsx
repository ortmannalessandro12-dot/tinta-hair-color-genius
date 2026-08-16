import { Link } from "@tanstack/react-router";

export function LegalFooter({ className = "" }: { className?: string }) {
  return (
    <nav
      className={`flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground ${className}`}
      aria-label="Rechtliches"
    >
      <Link to="/impressum" className="hover:text-foreground transition">
        Impressum
      </Link>
      <Link to="/datenschutz" className="hover:text-foreground transition">
        Datenschutz
      </Link>
      <Link to="/avv" className="hover:text-foreground transition">
        Auftragsverarbeitungsvertrag
      </Link>
    </nav>
  );
}
