import { Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-ink text-ink-foreground">
      <div className="bg-lattice">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo tone="light" />
            <p className="mt-4 max-w-md text-sm leading-7 text-ink-muted">
              سوق مواشٍ إلكتروني عراقي يربط البائع بالمشتري عبر وسيط موثوق، دون كشف هوية أي طرف للآخر حتى إتمام الصفقة.
            </p>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-ink-foreground/15 px-3 py-1 text-xs text-ink-muted">
              <ShieldCheck className="size-4 text-accent" /> نسخة معاينة — لا يتم أي دفع حقيقي
            </p>
          </div>
          <div>
            <h4 className="font-display text-base">المنصة</h4>
            <ul className="mt-3 space-y-2 text-sm text-ink-muted">
              <li><Link to="/listings" className="hover:text-ink-foreground">المواشي المعروضة</Link></li>
              <li><Link to="/sell" className="hover:text-ink-foreground">اعرض مواشيك</Link></li>
              <li><Link to="/how-it-works" className="hover:text-ink-foreground">ضمان الجدية والشروط</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display text-base">الحساب</h4>
            <ul className="mt-3 space-y-2 text-sm text-ink-muted">
              <li><Link to="/register" className="hover:text-ink-foreground">إنشاء حساب</Link></li>
              <li><Link to="/login" className="hover:text-ink-foreground">تسجيل الدخول</Link></li>
              <li><Link to="/account" className="hover:text-ink-foreground">حسابي وعروضي</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-ink-foreground/10 py-5 text-center text-xs text-ink-muted">
          © ٢٠٢٦ علوة الساقي للمواشي — العراق
        </div>
      </div>
    </footer>
  );
}
