import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/site/Logo";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "تسجيل الدخول | علوة الساقي" },
      { name: "description", content: "ادخل إلى حسابك في علوة الساقي للمواشي لمتابعة عروضك وصفقاتك." },
      { property: "og:title", content: "تسجيل الدخول | علوة الساقي" },
      { property: "og:description", content: "متابعة العروض السرية والصفقات." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="mx-auto grid max-w-md px-4 py-14">
      <div className="flex justify-center"><Logo /></div>
      <form
        className="mt-8 grid gap-5 rounded-3xl border border-border bg-card p-6 shadow-card sm:p-8"
        onSubmit={(e) => {
          e.preventDefault();
          toast("نسخة معاينة", { description: "تسجيل الدخول سيعمل بعد ربط قاعدة البيانات." });
        }}
      >
        <h1 className="font-display text-2xl font-bold">تسجيل الدخول</h1>
        <div className="grid gap-1.5">
          <Label htmlFor="phone">رقم الهاتف</Label>
          <Input id="phone" required dir="ltr" inputMode="tel" className="h-11 text-left" placeholder="07XX XXX XXXX" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="pw">كلمة المرور</Label>
          <Input id="pw" type="password" required className="h-11" />
        </div>
        <Button type="submit" size="xl"><Lock /> دخول</Button>
        <p className="text-center text-sm text-muted-foreground">ليس لديك حساب؟ <Link to="/register" className="font-semibold text-primary">أنشئ حساباً</Link></p>
      </form>
    </div>
  );
}
