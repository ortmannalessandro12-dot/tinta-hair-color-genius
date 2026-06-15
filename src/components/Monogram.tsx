import { cn } from "@/lib/utils";
import { avatarColor, initials } from "@/lib/tinta";

export function Monogram({
  name,
  size = 44,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const text = initials(name || "?") || "?";
  return (
    <div
      className={cn(
        "flex items-center justify-center font-serif font-medium text-foreground/80 shrink-0",
        className,
      )}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: avatarColor(name || "?"),
        fontSize: size * 0.4,
        letterSpacing: "-0.02em",
      }}
      aria-hidden
    >
      {text}
    </div>
  );
}
