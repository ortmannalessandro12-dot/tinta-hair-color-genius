import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function AllergyFields({
  consent,
  allergies,
  onChange,
}: {
  consent: boolean;
  allergies: string;
  onChange: (patch: { consent?: boolean; allergies?: string }) => void;
}) {
  return (
    <div className="card-soft p-6 space-y-4">
      <div>
        <h3 className="font-serif text-lg">Unverträglichkeiten / Allergien</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Gesundheitsangaben nach Art. 9 DSGVO — Speicherung nur mit ausdrücklicher Einwilligung
          der Kundin.
        </p>
      </div>

      <label className="flex items-start gap-3 cursor-pointer">
        <Checkbox
          checked={consent}
          onCheckedChange={(v) => onChange({ consent: v === true })}
          className="mt-0.5"
        />
        <span className="text-sm leading-snug">
          Die Kundin hat der Speicherung dieser Gesundheitsangaben ausdrücklich zugestimmt.
        </span>
      </label>

      <div className="space-y-1.5">
        <Label htmlFor="allergies" className="text-xs text-muted-foreground">
          Unverträglichkeiten
        </Label>
        <Textarea
          id="allergies"
          value={allergies}
          disabled={!consent}
          onChange={(e) => onChange({ allergies: e.target.value })}
          placeholder="z. B. PPD-Allergie, Reaktion auf Ammoniak"
          maxLength={500}
          rows={3}
        />
      </div>
    </div>
  );
}

export function AllergyWarning({ allergies }: { allergies?: string | null }) {
  if (!allergies || !allergies.trim()) return null;
  return (
    <div
      role="alert"
      className="mb-5 flex items-start gap-3 rounded-2xl px-5 py-4 text-sm"
      style={{
        background: "color-mix(in oklab, var(--destructive) 10%, transparent)",
        border: "1px solid color-mix(in oklab, var(--destructive) 28%, transparent)",
      }}
    >
      <span aria-hidden className="text-lg leading-none">
        ⚠️
      </span>
      <p className="leading-snug">
        <span className="font-medium">Achtung — Unverträglichkeiten hinterlegt:</span>{" "}
        {allergies}
      </p>
    </div>
  );
}
