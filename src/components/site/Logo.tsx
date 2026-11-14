import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function Logo({ className, tone = "default" }: { className?: string; tone?: "default" | "light" }) {
  return (
    <Link to="/" className={cn("flex items-center gap-2.5", className)}>
      <span className="grid size-10 place-items-center rounded-xl bg-gold shadow-card">
        <svg viewBox="0 0 32 32" className="size-6 text-accent-foreground" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M6 13c0-4 3-7 7-7h6c4 0 7 3 7 7v3c0 5-4 9-10 9S6 21 6 16z" />
          <path d="M6 12 3 9M26 12l3-3M12 16h.01M20 16h.01M13 21c2 1 4 1 6 0" />
        </svg>
      </span>
      <span className="leading-tight">
        <span className={cn("block font-display text-xl font-bold", tone === "light" ? "text-ink-foreground" : "text-foreground")}>
          علوة الساقي
        </span>
        <span className={cn("block text-[11px] tracking-wide", tone === "light" ? "text-ink-muted" : "text-muted-foreground")}>
          للمواشي · وساطة سرية موثوقة
        </span>
      </span>
    </Link>
  );
}
