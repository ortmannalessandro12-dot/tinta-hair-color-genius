import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ChevronLeft } from "lucide-react";

export function AppShell({
  children,
  title,
  back,
  right,
}: {
  children: ReactNode;
  title?: string;
  back?: { to: string; params?: Record<string, string> };
  right?: ReactNode;
}) {
  return (
    <div className="min-h-screen pb-28">
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/70 border-b border-border/60">
        <div className="mx-auto max-w-2xl px-5 h-16 flex items-center gap-3">
          {back ? (
            <Link
              to={back.to}
              params={back.params as never}
              className="-ml-2 inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary transition"
              aria-label="Zurück"
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>
          ) : (
            <Link to="/" className="font-serif text-xl tracking-tight">
              Tinta<span className="text-primary">.</span>
            </Link>
          )}
          {title && <h1 className="font-serif text-lg flex-1 truncate">{title}</h1>}
          <div className="ml-auto flex items-center gap-2">{right}</div>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-5 pt-6">{children}</main>
    </div>
  );
}
