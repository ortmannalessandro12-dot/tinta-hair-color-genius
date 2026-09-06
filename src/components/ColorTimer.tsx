import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { toast } from "sonner";

function playChime() {
  try {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    for (const [freq, delay] of [
      [880, 0],
      [660, 220],
      [880, 440],
    ] as const) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.value = 0.2;
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime + delay / 1000);
      osc.stop(ctx.currentTime + delay / 1000 + 0.18);
    }
  } catch {
    // Web Audio nicht verfügbar — Timer funktioniert trotzdem still weiter.
  }
}

function notifyDone(minutes: number) {
  toast.success(`Einwirkzeit abgelaufen (${minutes} Min.)`);
  playChime();
  if (typeof Notification !== "undefined" && Notification.permission === "granted") {
    new Notification("Tinta – Einwirkzeit abgelaufen", {
      body: `${minutes} Minuten sind um.`,
    });
  }
}

export function ColorTimer({ minutes }: { minutes: number }) {
  const totalSeconds = minutes * 60;
  const [remaining, setRemaining] = useState(totalSeconds);
  const [running, setRunning] = useState(false);
  const notifiedRef = useRef(false);

  useEffect(() => {
    if (!running) return;
    if (remaining <= 0) {
      setRunning(false);
      if (!notifiedRef.current) {
        notifiedRef.current = true;
        notifyDone(minutes);
      }
      return;
    }
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [running, remaining, minutes]);

  function toggle() {
    if (!running) {
      if (remaining <= 0) setRemaining(totalSeconds);
      notifiedRef.current = false;
      if (typeof Notification !== "undefined" && Notification.permission === "default") {
        void Notification.requestPermission();
      }
    }
    setRunning((r) => !r);
  }

  function reset() {
    setRunning(false);
    notifiedRef.current = false;
    setRemaining(totalSeconds);
  }

  const mm = Math.floor(remaining / 60);
  const ss = remaining % 60;
  const done = remaining <= 0;

  return (
    <div className="flex items-center gap-2 mt-2 p-2 rounded-xl bg-secondary/60">
      <span
        className={`font-mono tabular-nums text-sm flex-1 ${done ? "text-primary font-medium" : ""}`}
      >
        {mm}:{ss.toString().padStart(2, "0")}
      </span>
      <button
        type="button"
        onClick={toggle}
        className="h-8 w-8 inline-flex items-center justify-center rounded-full hover:bg-background transition"
        aria-label={running ? "Timer pausieren" : "Timer starten"}
      >
        {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </button>
      <button
        type="button"
        onClick={reset}
        className="h-8 w-8 inline-flex items-center justify-center rounded-full hover:bg-background transition text-muted-foreground"
        aria-label="Timer zurücksetzen"
      >
        <RotateCcw className="h-4 w-4" />
      </button>
    </div>
  );
}
