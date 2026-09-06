import * as React from "react";
import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  Menu,
  Users,
  BookOpen,
  Package,
  CreditCard,
  Settings,
  User,
  Mail,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";

const ITEMS = [
  { to: "/clients", label: "Kunden", icon: Users },
  { to: "/recipes", label: "Rezepte", icon: BookOpen },
  { to: "/inventory", label: "Inventar", icon: Package },
  { to: "/account/billing", label: "Abo verwalten", icon: CreditCard },
  { to: "/settings", label: "Einstellungen", icon: Settings },
  { to: "/profile", label: "Mein Profil", icon: User },
  { to: "/contact", label: "Kontakt", icon: Mail },
  { to: "/help", label: "Hilfe / FAQ", icon: HelpCircle },
] as const;

export function MainMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const qc = useQueryClient();

  async function signOut() {
    setOpen(false);
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="-ml-2 inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary transition"
          aria-label="Menü öffnen"
        >
          <Menu className="h-5 w-5" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 flex flex-col p-0">
        <SheetHeader className="p-5 pb-3 border-b border-border/60">
          <SheetTitle className="font-serif text-xl tracking-tight text-left">
            Tinta<span className="text-primary">.</span>
          </SheetTitle>
        </SheetHeader>
        <nav className="flex-1 overflow-y-auto py-2">
          {ITEMS.map(({ to, label, icon: Icon }) => (
            <SheetClose asChild key={to}>
              <Link
                to={to}
                className="flex items-center gap-3 px-5 py-3 text-sm hover:bg-secondary transition data-[status=active]:bg-secondary data-[status=active]:font-medium"
              >
                <Icon className="h-4 w-4 text-muted-foreground" />
                {label}
              </Link>
            </SheetClose>
          ))}
        </nav>
        <div className="p-3 border-t border-border/60">
          <button
            type="button"
            onClick={signOut}
            className="flex w-full items-center gap-3 px-2 py-3 text-sm text-destructive hover:bg-destructive/5 rounded-lg transition"
          >
            <LogOut className="h-4 w-4" />
            Abmelden
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
