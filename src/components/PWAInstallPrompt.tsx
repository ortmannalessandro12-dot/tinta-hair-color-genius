import { useState } from "react";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { X, Share, Plus, Download, Smartphone } from "lucide-react";

export function PWAInstallPrompt() {
  const { isIOS, canInstall, isDismissed, dismiss, showPrompt } = usePWAInstall();
  const [showIOSHelp, setShowIOSHelp] = useState(false);

  if (!canInstall || isDismissed) return null;

  // iOS: show elegant helper since we can't trigger install programmatically
  if (isIOS) {
    return (
      <>
        {/* Subtle fixed bottom banner */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md">
          <div className="rounded-2xl border border-[#E8D5DB] bg-[#FFF8FA]/95 backdrop-blur-xl shadow-lg shadow-rose-900/5 px-5 py-4 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-start gap-4">
              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Smartphone className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  Tinta als App nutzen
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                  Für schnelleren Zugriff direkt vom Home-Screen.
                </p>
                <button
                  onClick={() => setShowIOSHelp(true)}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Zum Home-Screen hinzufügen
                </button>
              </div>
              <button
                onClick={dismiss}
                className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full hover:bg-secondary transition"
                aria-label="Schließen"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>

        {/* iOS step-by-step modal */}
        {showIOSHelp && (
          <div
            className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center bg-black/20 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setShowIOSHelp(false)}
          >
            <div
              className="w-full max-w-sm mx-4 mb-6 sm:mb-0 rounded-3xl bg-[#FFF8FA] border border-[#E8D5DB] shadow-2xl p-6 animate-in slide-in-from-bottom-6 zoom-in-95 duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-serif text-lg text-foreground">
                  Zum Home-Screen hinzufügen
                </h3>
                <button
                  onClick={() => setShowIOSHelp(false)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-secondary transition"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                    1
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">
                      Tippe unten in Safari auf{" "}
                      <span className="inline-flex items-center gap-1 align-middle px-2 py-0.5 rounded-md bg-secondary text-xs font-medium">
                        <Share className="h-3.5 w-3.5" />
                        Teilen
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                    2
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">
                      Wähle im Menü{" "}
                      <span className="inline-flex items-center gap-1 align-middle px-2 py-0.5 rounded-md bg-secondary text-xs font-medium">
                        <Plus className="h-3.5 w-3.5" />
                        Zum Home-Bildschirm
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                    3
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">
                      Tippe oben rechts auf{" "}
                      <span className="font-semibold">Hinzufügen</span>.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-secondary/50 p-4 text-center">
                <p className="text-xs text-muted-foreground">
                  Danach hast du Tinta wie eine native App auf deinem iPhone.
                </p>
              </div>

              <button
                onClick={() => {
                  setShowIOSHelp(false);
                  dismiss();
                }}
                className="mt-5 w-full rounded-xl bg-primary py-3 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
              >
                Verstanden
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Android / Desktop Chrome with native install prompt
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md">
      <div className="rounded-2xl border border-[#E8D5DB] bg-[#FFF8FA]/95 backdrop-blur-xl shadow-lg shadow-rose-900/5 px-5 py-4 animate-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-start gap-4">
          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <Download className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">
              Tinta als App installieren
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
              Für schnelleren Zugriff direkt vom Home-Screen.
            </p>
            <button
              onClick={showPrompt}
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              Jetzt installieren
            </button>
          </div>
          <button
            onClick={dismiss}
            className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full hover:bg-secondary transition"
            aria-label="Schließen"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}
