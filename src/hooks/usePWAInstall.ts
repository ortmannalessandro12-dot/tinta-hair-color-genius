import { useState, useEffect, useCallback } from "react";

export interface PWAInstallState {
  isIOS: boolean;
  isStandalone: boolean;
  canInstall: boolean;
  promptEvent: BeforeInstallPromptEvent | null;
  isDismissed: boolean;
  dismiss: () => void;
  showPrompt: () => void;
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const STORAGE_KEY = "tinta-pwa-install-dismissed";

export function usePWAInstall(): PWAInstallState {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if already dismissed
    try {
      const dismissed = localStorage.getItem(STORAGE_KEY);
      if (dismissed) setIsDismissed(true);
    } catch {
      // ignore
    }

    // Check if running as standalone PWA
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsStandalone(standalone);

    // Detect iOS
    const ua = window.navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(ua);
    setIsIOS(ios);

    // Listen for beforeinstallprompt (Android/Desktop Chrome)
    const handler = (e: Event) => {
      e.preventDefault();
      setPromptEvent(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const dismiss = useCallback(() => {
    setIsDismissed(true);
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // ignore
    }
  }, []);

  const showPrompt = useCallback(async () => {
    if (!promptEvent) return;
    await promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;
    if (outcome === "accepted") {
      setPromptEvent(null);
    }
  }, [promptEvent]);

  const canInstall = !isStandalone && (!isIOS || true); // iOS can always show instructions

  return {
    isIOS,
    isStandalone,
    canInstall: canInstall && !isDismissed && (isIOS || promptEvent !== null),
    promptEvent,
    isDismissed,
    dismiss,
    showPrompt,
  };
}
