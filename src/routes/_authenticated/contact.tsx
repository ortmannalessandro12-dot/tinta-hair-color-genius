import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { sendContactMessage } from "@/lib/contact.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/contact")({
  component: ContactPage,
});

function ContactPage() {
  const { data: user } = useQuery({
    queryKey: ["auth-user"],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      return data.user;
    },
  });

  const submit = useServerFn(sendContactMessage);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // Honeypot
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!user) return;
    setName((user.user_metadata?.name as string | undefined) ?? "");
    setEmail(user.email ?? "");
  }, [user]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      toast.error("Bitte alle Felder ausfüllen.");
      return;
    }
    setSending(true);
    try {
      await submit({ data: { name, email, subject, message, website } });
      toast.success("Nachricht gesendet");
      setSubject("");
      setMessage("");
    } catch (err) {
      console.error("[contact]", err);
      const text =
        err instanceof Error
          ? err.message
          : "Senden fehlgeschlagen. Bitte versuche es später erneut.";
      toast.error(text);
    } finally {
      setSending(false);
    }
  }

  return (
    <AppShell back={{ to: "/clients" }} title="Kontakt">
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Wir bieten keinen telefonischen Support – schreib uns einfach, wir melden uns per E-Mail
          zurück.
        </p>
        <form onSubmit={onSubmit} className="card-soft p-5 space-y-4">
          {/* Honeypot: für Menschen unsichtbar, Bots füllen es meist trotzdem aus. */}
          <div className="absolute -left-[9999px] w-px h-px overflow-hidden" aria-hidden>
            <label htmlFor="website">Website</label>
            <input
              id="website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">E-Mail</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="subject">Betreff</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="message">Nachricht</Label>
            <Textarea
              id="message"
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={sending} className="w-full h-11 rounded-full">
            {sending ? "Sendet …" : "Nachricht senden"}
          </Button>
        </form>
      </div>
    </AppShell>
  );
}
