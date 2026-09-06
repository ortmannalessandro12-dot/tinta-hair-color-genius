import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["auth-user"],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      return data.user;
    },
  });

  if (isLoading || !user) {
    return (
      <AppShell back={{ to: "/clients" }} title="Mein Profil">
        <div className="h-40 card-soft animate-pulse" />
      </AppShell>
    );
  }

  return (
    <AppShell back={{ to: "/clients" }} title="Mein Profil">
      <div className="space-y-5">
        <NameForm initialName={(user.user_metadata?.name as string | undefined) ?? ""} />
        <EmailForm initialEmail={user.email ?? ""} />
        <PasswordForm />
      </div>
    </AppShell>
  );
}

function NameForm({ initialName }: { initialName: string }) {
  const [name, setName] = useState(initialName);
  const [saving, setSaving] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ data: { name: name.trim() } });
      if (error) throw error;
      toast.success("Name gespeichert");
    } catch (err) {
      console.error("[update-name]", err);
      toast.error("Speichern fehlgeschlagen.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save} className="card-soft p-5 space-y-3">
      <Label htmlFor="name">Name</Label>
      <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
      <Button type="submit" disabled={saving} size="sm" className="rounded-full">
        {saving ? "Speichert …" : "Speichern"}
      </Button>
    </form>
  );
}

function EmailForm({ initialEmail }: { initialEmail: string }) {
  const [email, setEmail] = useState(initialEmail);
  const [saving, setSaving] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ email });
      if (error) throw error;
      toast.success("Bestätigungslink wurde an die neue Adresse gesendet.");
    } catch (err) {
      console.error("[update-email]", err);
      toast.error("E-Mail-Änderung fehlgeschlagen.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save} className="card-soft p-5 space-y-3">
      <Label htmlFor="email">E-Mail</Label>
      <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Button type="submit" disabled={saving} size="sm" className="rounded-full">
        {saving ? "Speichert …" : "E-Mail ändern"}
      </Button>
    </form>
  );
}

function PasswordForm() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Passwort muss mindestens 6 Zeichen haben.");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwörter stimmen nicht überein.");
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Passwort geändert");
      setPassword("");
      setConfirm("");
    } catch (err) {
      console.error("[update-password]", err);
      toast.error("Passwort-Änderung fehlgeschlagen.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save} className="card-soft p-5 space-y-3">
      <Label htmlFor="password">Neues Passwort</Label>
      <Input
        id="password"
        type="password"
        minLength={6}
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Label htmlFor="password-confirm">Passwort bestätigen</Label>
      <Input
        id="password-confirm"
        type="password"
        minLength={6}
        autoComplete="new-password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
      />
      <Button type="submit" disabled={saving} size="sm" className="rounded-full">
        {saving ? "Speichert …" : "Passwort ändern"}
      </Button>
    </form>
  );
}
