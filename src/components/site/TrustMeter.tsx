import { ShieldCheck, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatNum, trustLevel } from "@/lib/market";
import { cn } from "@/lib/utils";

export function TrustMeter({ score, className }: { score: number; className?: string }) {
  const level = trustLevel(score);
  return (
    <div className={cn("grid gap-1.5", className)}>
      <div className="flex items-center justify-between gap-2 text-sm">
        <span className="flex items-center gap-1 font-semibold"><ShieldCheck className="size-4 text-primary" /> نقاط الموثوقية</span>
        <Badge variant={level.variant}>{formatNum(score)} / ١٠٠ · {level.label}</Badge>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={score} aria-label="نقاط الموثوقية">
        <div className="h-full rounded-full bg-gold" style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

export function Stars({ value, size = "size-4" }: { value: number; size?: string }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${value} من ٥`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={cn(size, i <= Math.round(value) ? "fill-accent text-accent" : "text-muted-foreground/40")} />
      ))}
    </span>
  );
}
