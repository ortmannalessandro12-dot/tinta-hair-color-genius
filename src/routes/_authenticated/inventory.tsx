import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BRANDS, getShadesForBrand } from "@/lib/tinta";
import { Plus, PackagePlus, AlertTriangle, Pencil } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/_authenticated/inventory")({
  component: InventoryPage,
});

const DEFAULT_MIN_STOCK = 50;
const UNITS = ["g", "ml", "Stück"];

type Product = {
  id: string;
  brand: string;
  shade: string;
  unit: string;
  quantity: number;
  min_stock: number;
};

function InventoryPage() {
  const qc = useQueryClient();
  const [newOpen, setNewOpen] = useState(false);
  const [receiptProduct, setReceiptProduct] = useState<Product | null>(null);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  const { data: products, isLoading } = useQuery({
    queryKey: ["inventory-products"],
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from("inventory_products")
        .select("id, brand, shade, unit, quantity, min_stock")
        .order("brand", { ascending: true })
        .order("shade", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const lowStock = useMemo(
    () => (products ?? []).filter((p) => p.quantity < p.min_stock),
    [products],
  );

  function invalidate() {
    qc.invalidateQueries({ queryKey: ["inventory-products"] });
  }

  return (
    <AppShell title="Inventar">
      <div className="space-y-6">
        {lowStock.length > 0 && (
          <div className="card-soft p-4 flex items-start gap-3 border-destructive/40 bg-destructive/5">
            <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <div className="text-sm">
              <div className="font-medium">
                {lowStock.length} {lowStock.length === 1 ? "Produkt" : "Produkte"} unter
                Mindestbestand
              </div>
              <div className="text-muted-foreground mt-0.5">
                {lowStock.map((p) => `${p.brand} ${p.shade}`).join(", ")}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <h1 className="font-serif text-2xl">Bestand</h1>
          <Button onClick={() => setNewOpen(true)} size="sm" className="rounded-full gap-1.5">
            <Plus className="h-4 w-4" /> Produkt
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-16 card-soft animate-pulse" />
            ))}
          </div>
        ) : !products || products.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            Noch keine Produkte im Inventar. Lege eines an, um den Bestand zu erfassen.
          </div>
        ) : (
          <ul className="space-y-2.5">
            {products.map((p) => {
              const low = p.quantity < p.min_stock;
              return (
                <li
                  key={p.id}
                  className={`card-soft p-4 flex items-center gap-3 ${low ? "border-destructive/40" : ""}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">
                      {p.brand} <span className="text-muted-foreground">·</span> {p.shade}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                      <span>
                        Bestand: {p.quantity} {p.unit}
                      </span>
                      <span>
                        · Mindestbestand: {p.min_stock} {p.unit}
                      </span>
                      {low && <Badge variant="destructive">Niedrig</Badge>}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditProduct(p)}
                    className="h-9 w-9 inline-flex items-center justify-center rounded-full hover:bg-secondary transition text-muted-foreground"
                    aria-label="Bearbeiten"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <Button
                    onClick={() => setReceiptProduct(p)}
                    size="sm"
                    variant="secondary"
                    className="rounded-full gap-1.5"
                  >
                    <PackagePlus className="h-4 w-4" /> Wareneingang
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <NewProductDialog open={newOpen} onOpenChange={setNewOpen} onSaved={invalidate} />
      <ReceiptDialog
        product={receiptProduct}
        onOpenChange={(open) => !open && setReceiptProduct(null)}
        onSaved={invalidate}
      />
      <EditProductDialog
        product={editProduct}
        onOpenChange={(open) => !open && setEditProduct(null)}
        onSaved={invalidate}
      />
    </AppShell>
  );
}

function NewProductDialog({
  open,
  onOpenChange,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}) {
  const [brand, setBrand] = useState("");
  const [brandCustom, setBrandCustom] = useState("");
  const [shade, setShade] = useState("");
  const [shadeCustom, setShadeCustom] = useState("");
  const [unit, setUnit] = useState("g");
  const [minStock, setMinStock] = useState(String(DEFAULT_MIN_STOCK));
  const [quantity, setQuantity] = useState("0");
  const [saving, setSaving] = useState(false);

  function reset() {
    setBrand("");
    setBrandCustom("");
    setShade("");
    setShadeCustom("");
    setUnit("g");
    setMinStock(String(DEFAULT_MIN_STOCK));
    setQuantity("0");
  }

  async function save() {
    const effectiveBrand = brand === "Andere…" ? brandCustom.trim() : brand;
    const effectiveShade = shade === "Andere…" ? shadeCustom.trim() : shade;
    if (!effectiveBrand || !effectiveShade) {
      toast.error("Bitte Marke und Ton angeben.");
      return;
    }
    setSaving(true);
    try {
      const { data: u } = await supabase.auth.getUser();
      const userId = u.user!.id;
      const { error } = await supabase.from("inventory_products").insert({
        user_id: userId,
        brand: effectiveBrand,
        shade: effectiveShade,
        unit,
        quantity: parseFloat(quantity) || 0,
        min_stock: parseFloat(minStock) || DEFAULT_MIN_STOCK,
      });
      if (error) throw error;
      toast.success("Produkt angelegt");
      reset();
      onOpenChange(false);
      onSaved();
    } catch (err) {
      console.error("[create-product]", err);
      toast.error("Anlegen fehlgeschlagen. Läuft die Marke/der Ton eventuell schon im Inventar?");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Neues Produkt</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Field label="Marke">
            <Pick
              value={brand}
              onChange={(v) => {
                setBrand(v);
                setShade("");
                setShadeCustom("");
                setBrandCustom("");
              }}
              options={BRANDS}
            />
          </Field>
          {brand === "Andere…" && (
            <Input
              placeholder="Marke eingeben"
              value={brandCustom}
              onChange={(e) => setBrandCustom(e.target.value)}
            />
          )}

          <Field label="Ton / Nuance">
            <Pick
              value={shade}
              onChange={(v) => setShade(v)}
              options={brand && brand !== "Andere…" ? getShadesForBrand(brand) : ["Andere…"]}
              placeholder={brand ? "Wählen …" : "Erst Marke wählen"}
            />
          </Field>
          {shade === "Andere…" && (
            <Input
              placeholder="Ton eingeben"
              value={shadeCustom}
              onChange={(e) => setShadeCustom(e.target.value)}
            />
          )}

          <div className="grid grid-cols-2 gap-3">
            <Field label="Einheit">
              <Pick value={unit} onChange={setUnit} options={UNITS} />
            </Field>
            <Field label="Anfangsbestand">
              <Input
                type="number"
                inputMode="decimal"
                min={0}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </Field>
          </div>

          <Field label="Mindestbestand">
            <Input
              type="number"
              inputMode="decimal"
              min={0}
              value={minStock}
              onChange={(e) => setMinStock(e.target.value)}
            />
          </Field>
        </div>
        <DialogFooter>
          <Button onClick={save} disabled={saving} className="rounded-full">
            {saving ? "Speichert …" : "Anlegen"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ReceiptDialog({
  product,
  onOpenChange,
  onSaved,
}: {
  product: Product | null;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}) {
  const [amount, setAmount] = useState("");
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    if (product) setAmount("");
  }, [product]);

  async function save() {
    if (!product) return;
    const value = parseFloat(amount);
    if (!value || value <= 0) {
      toast.error("Bitte eine Menge größer 0 angeben.");
      return;
    }
    setSaving(true);
    try {
      const { data: u } = await supabase.auth.getUser();
      const userId = u.user!.id;
      const { error } = await supabase.from("inventory_movements").insert({
        user_id: userId,
        product_id: product.id,
        type: "wareneingang",
        quantity: value,
      });
      if (error) throw error;
      toast.success("Wareneingang erfasst");
      onOpenChange(false);
      onSaved();
    } catch (err) {
      console.error("[receipt]", err);
      toast.error("Erfassen fehlgeschlagen.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={!!product} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Wareneingang{product ? `: ${product.brand} ${product.shade}` : ""}
          </DialogTitle>
        </DialogHeader>
        <Field label={`Menge (${product?.unit ?? ""})`}>
          <Input
            type="number"
            inputMode="decimal"
            min={0}
            autoFocus
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="z. B. 200"
          />
        </Field>
        <DialogFooter>
          <Button onClick={save} disabled={saving} className="rounded-full">
            {saving ? "Speichert …" : "Bestand erhöhen"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EditProductDialog({
  product,
  onOpenChange,
  onSaved,
}: {
  product: Product | null;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}) {
  const [unit, setUnit] = useState("g");
  const [minStock, setMinStock] = useState(String(DEFAULT_MIN_STOCK));
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    if (product) {
      setUnit(product.unit);
      setMinStock(String(product.min_stock));
    }
  }, [product]);

  async function save() {
    if (!product) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("inventory_products")
        .update({ unit, min_stock: parseFloat(minStock) || DEFAULT_MIN_STOCK })
        .eq("id", product.id);
      if (error) throw error;
      toast.success("Gespeichert");
      onOpenChange(false);
      onSaved();
    } catch (err) {
      console.error("[edit-product]", err);
      toast.error("Speichern fehlgeschlagen.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={!!product} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{product ? `${product.brand} ${product.shade}` : ""}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Field label="Einheit">
            <Pick value={unit} onChange={setUnit} options={UNITS} />
          </Field>
          <Field label="Mindestbestand">
            <Input
              type="number"
              inputMode="decimal"
              min={0}
              value={minStock}
              onChange={(e) => setMinStock(e.target.value)}
            />
          </Field>
        </div>
        <DialogFooter>
          <Button onClick={save} disabled={saving} className="rounded-full">
            {saving ? "Speichert …" : "Speichern"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function Pick({
  value,
  onChange,
  options,
  placeholder = "Wählen …",
}: {
  value: string;
  onChange: (v: string) => void;
  options: readonly string[] | string[];
  placeholder?: string;
}) {
  return (
    <Select value={value || undefined} onValueChange={onChange}>
      <SelectTrigger className="h-11 rounded-xl bg-card">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o} value={o}>
            {o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
