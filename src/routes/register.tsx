import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ShieldCheck, ShoppingBag, Store } from "lucide-react";
import { LocationSelect, type LocationValue } from "@/components/site/LocationSelect";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "إنشاء حساب | علوة الساقي" },
      { name: "description", content: "أنشئ حساباً واحداً للبيع والشراء في علوة الساقي للمواشي واختر محافظتك وقضاءك ومدينتك." },
      { property: "og:title", content: "إنشاء حساب | علوة الساقي" },
      { property: "og:description", content: "حساب موحّد موثّق للبيع والشراء في سوق المواشي العراقي." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const [loc, setLoc] = useState<LocationValue>({ governorate: "", district: "", area: "" });
  const [agree, setAgree] = useState(false);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="font-display text-3xl font-bold">إنشاء حساب جديد</h1>
      <p className="mt-2 text-muted-foreground">بياناتك لا تُعرض لأي طرف آخر. يراها فريق التوثيق فقط.</p>

      <form
        className="mt-8 grid gap-6 rounded-3xl border border-border bg-card p-5 shadow-card sm:p-8"
        onSubmit={(e) => {
          e.preventDefault();
          toast.success("تم استلام طلب التسجيل", { description: "نسخة معاينة: لم يتم إنشاء حساب فعلي بعد." });
        }}
      >
        <div className="grid gap-3 rounded-2xl border-2 border-primary bg-primary-soft p-4 sm:grid-cols-[auto_1fr] sm:items-center">
          <div className="flex gap-2">
            <ShoppingBag className="size-7 text-primary" />
            <Store className="size-7 text-primary" />
          </div>
          <div>
            <p className="font-display text-lg">حساب واحد للبيع والشراء</p>
            <p className="text-sm text-muted-foreground">تشتري وتعرض مواشيك من نفس الحساب، بسلة واحدة ونقاط موثوقية واحدة.</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <Label htmlFor="name">الاسم الثلاثي</Label>
            <Input id="name" required className="h-11" placeholder="كما في البطاقة الوطنية" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="phone">رقم الهاتف</Label>
            <Input id="phone" required dir="ltr" inputMode="tel" className="h-11 text-left" placeholder="07XX XXX XXXX" />
          </div>
        </div>

        <LocationSelect value={loc} onChange={setLoc} required />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <Label htmlFor="pw">كلمة المرور</Label>
            <Input id="pw" type="password" required minLength={8} className="h-11" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="pw2">تأكيد كلمة المرور</Label>
            <Input id="pw2" type="password" required minLength={8} className="h-11" />
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-2xl bg-secondary/60 p-4 text-sm leading-7">
          <ShieldCheck className="mt-1 size-5 shrink-0 text-primary" />
          <p className="text-muted-foreground">
            لتقليل الحسابات الوهمية: رقم هاتف واحد وبطاقة وطنية واحدة لكل حساب. بعد التسجيل نؤكد رقمك برسالة، ثم تُطلب صورة البطاقة الوطنية وصورة شخصية معها. يمكنك التصفح وحفظ المواشي في السلة فوراً، ويلزم التوثيق قبل تقديم العروض أو نشر الإعلانات.
          </p>
        </div>

        <label className="flex items-start gap-3 text-sm">
          <Checkbox checked={agree} onCheckedChange={(v) => setAgree(v === true)} className="mt-1" />
          <span>أوافق على <Link to="/how-it-works" className="text-primary underline">شروط الوساطة وضمان الجدية</Link> وسياسة حماية البيانات.</span>
        </label>

        <Button type="submit" size="xl" disabled={!agree}>إنشاء الحساب</Button>
        <p className="text-center text-sm text-muted-foreground">لديك حساب؟ <Link to="/login" className="font-semibold text-primary">سجّل الدخول</Link></p>
      </form>
    </div>
  );
}
