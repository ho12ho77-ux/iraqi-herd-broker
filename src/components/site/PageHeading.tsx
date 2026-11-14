import type { ReactNode } from "react";

export function PageHeading({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return (
    <div className="border-b border-border bg-secondary/50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        {eyebrow && <p className="text-sm font-semibold text-accent-foreground/80">{eyebrow}</p>}
        <h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">{title}</h1>
        {children && <div className="mt-3 max-w-2xl text-muted-foreground leading-7">{children}</div>}
      </div>
    </div>
  );
}
