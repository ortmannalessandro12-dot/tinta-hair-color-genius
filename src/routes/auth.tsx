import { createFileRoute, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(() => {
    if (typeof window === "undefined") return true;
    return localStorage.getItem("tinta-remember") !== "false";
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/clients", replace: true });
    });
  }, [navigate]);

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast.success("Konto erstellt. Du kannst dich jetzt anmelden.");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/clients", replace: true });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Etwas ist schiefgelaufen.");
    } finally {
      setLoading(false);
    }
  }

  async function handleOAuth(provider: "google" | "apple") {
    const res = await lovable.auth.signInWithOAuth(provider, { redirect_uri: window.location.origin });
    if (res.error) toast.error("Anmeldung fehlgeschlagen.");
    else if (!res.redirected) navigate({ to: "/clients", replace: true });
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="font-serif text-5xl tracking-tight">
            Tinta<span className="text-primary">.</span>
          </h1>
          <p className="mt-3 text-muted-foreground text-sm">
            Deine Farbrezepturen, sauber gespeichert.
          </p>
        </div>

        <div className="card-soft p-7">
          <div className="flex gap-2 mb-6 p-1 bg-secondary rounded-full">
            <button
              onClick={() => setMode("signin")}
              className={`flex-1 py-2 rounded-full text-sm font-medium transition ${mode === "signin" ? "bg-card shadow-soft" : "text-muted-foreground"}`}
            >
              Anmelden
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 py-2 rounded-full text-sm font-medium transition ${mode === "signup" ? "bg-card shadow-soft" : "text-muted-foreground"}`}
            >
              Registrieren
            </button>
          </div>

          <form onSubmit={handleEmail} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">E-Mail</Label>
              <Input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Passwort</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={6}
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full h-11 rounded-full">
              {loading ? "Moment …" : mode === "signin" ? "Anmelden" : "Konto erstellen"}
            </Button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px bg-border flex-1" /> oder <div className="h-px bg-border flex-1" />
          </div>

          <div className="space-y-2">
            <button
              onClick={() => handleOAuth("google")}
              className="w-full h-11 rounded-full border border-border bg-card hover:bg-secondary transition text-sm font-medium flex items-center justify-center gap-2"
            >
              <GoogleIcon /> Mit Google fortfahren
            </button>
            <button
              onClick={() => handleOAuth("apple")}
              className="w-full h-11 rounded-full bg-foreground text-background hover:opacity-90 transition text-sm font-medium flex items-center justify-center gap-2"
            >
              <AppleIcon /> Mit Apple fortfahren
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Deine Daten bleiben deine Daten. DSGVO-konform gespeichert.
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09A6.99 6.99 0 0 1 5.47 12c0-.73.13-1.43.36-2.09V7.07H2.18A11 11 0 0 0 1 12c0 1.77.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.07.56 4.21 1.65l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  );
}
function AppleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.05 12.04c-.03-2.96 2.42-4.38 2.53-4.45-1.38-2.02-3.53-2.3-4.3-2.33-1.83-.19-3.57 1.08-4.5 1.08-.94 0-2.37-1.05-3.9-1.02-2 .03-3.85 1.17-4.88 2.95-2.08 3.61-.53 8.95 1.5 11.88 1 1.43 2.18 3.04 3.72 2.98 1.5-.06 2.07-.97 3.88-.97s2.32.97 3.9.94c1.61-.03 2.63-1.46 3.62-2.9 1.14-1.67 1.61-3.29 1.64-3.37-.04-.02-3.15-1.21-3.18-4.79zM14.07 3.6c.83-1.01 1.39-2.41 1.23-3.8-1.2.05-2.64.8-3.5 1.8-.77.89-1.45 2.31-1.27 3.67 1.34.1 2.71-.68 3.54-1.67z" />
    </svg>
  );
}
