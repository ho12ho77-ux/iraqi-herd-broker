import { Link } from "@tanstack/react-router";
import { Menu, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "./Logo";

const NAV = [
  { to: "/listings", label: "المواشي المعروضة" },
  { to: "/sell", label: "اعرض مواشيك" },
  { to: "/how-it-works", label: "كيف تعمل الوساطة" },
  { to: "/account", label: "حسابي" },
  { to: "/admin", label: "لوحة الإدارة" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              activeProps={{ className: "bg-primary-soft text-primary" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link to="/login">دخول</Link>
          </Button>
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link to="/register">
              <UserRound /> إنشاء حساب
            </Link>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden" aria-label="القائمة">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="font-display text-lg">القائمة</SheetTitle>
              <div className="mt-6 flex flex-col gap-1">
                {NAV.map((n) => (
                  <Link key={n.to} to={n.to} className="rounded-md px-3 py-3 text-base font-medium hover:bg-muted" activeProps={{ className: "bg-primary-soft text-primary" }}>
                    {n.label}
                  </Link>
                ))}
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Button asChild variant="outline"><Link to="/login">دخول</Link></Button>
                  <Button asChild><Link to="/register">حساب جديد</Link></Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
