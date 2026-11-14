import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Camera, EyeOff } from "lucide-react";
import { PageHeading } from "@/components/site/PageHeading";
import { LocationSelect, type LocationValue } from "@/components/site/LocationSelect";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ANIMAL_TYPES, detectContactInfo, formatIQD } from "@/lib/market";

export const Route = createFileRoute("/sell")({
  head: () => ({
    meta: [
      { title: "اعرض مواشيك للبيع | علوة الساقي" },
      { name: "description", content: "أضف إعلان مواشٍ بالصور والأوزان والسعر، وتلقَّ عروضاً سرية عبر وسيط علوة الساقي." },
      { property: "og:title", content: "اعرض مواشيك للبيع | علوة الساقي" },
      { property: "og:description", content: "بِع مواشيك دون كشف رقمك أو اسمك للمشترين." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SellPage,
});

function SellPage() {
  const [loc, setLoc] = useState<LocationValue>({ governorate: "", district: "", area: "" });
  const [price, setPrice] = useState("");
  const [notes, setNotes] = useState("");
  const blocked = detectContactInfo(notes);
  return (
    <>
      <PageHeading eyebrow="للبائعين" title="اعرض مواشيك للبيع">
        يراجع فريق العلوة الإعلان قبل نشره. يظهر للمشترين برمزك فقط، دون اسمك أو رقمك.
      </PageHeading>
      <form
        className="mx-auto grid max-w-4xl gap-6 px-4 py-10 sm:px-6"
        onSubmit={(e) => {
          e.preventDefault();
          if (blocked) return;
          toast.success("أُرسل الإعلان للمراجعة", { description: "نسخة معاينة: لم يُنشر الإعلان فعلياً." });
        }}
      >
        <section className="grid gap-4 rounded-3xl border border-border bg-card p-5 shadow-card sm:p-7">
          <h2 className="font-display text-xl">صور المواشي</h2>
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-secondary/40 p-10 text-center hover:border-primary/50">
            <Camera className="size-8 text-primary" />
            <span className="font-semibold">اضغط لإضافة الصور</span>
            <span className="text-xs text-muted-foreground">حتى ٨ صور واضحة من جوانب مختلفة</span>
            <input type="file" accept="image/*" multiple className="sr-only" />
          </label>
        </section>

        <section className="grid gap-4 rounded-3xl border border-border bg-card p-5 shadow-card sm:p-7">
          <h2 className="font-display text-xl">بيانات المواشي</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="grid gap-1.5">
              <Label htmlFor="type">النوع</Label>
              <select id="type" className="field" required defaultValue="">
                <option value="" disabled>اختر النوع</option>
                {ANIMAL_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="breed">السلالة</Label>
              <Input id="breed" className="h-11" placeholder="عواسي، شامي، جنوبي…" required />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="sex">الجنس</Label>
              <select id="sex" className="field" defaultValue="ذكور">
                <option>ذكور</option><option>إناث</option><option>مختلط</option>
              </select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="count">العدد (رأس)</Label>
              <Input id="count" inputMode="numeric" className="h-11" required />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="weight">معدل الوزن (كغم)</Label>
              <Input id="weight" inputMode="numeric" className="h-11" required />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="age">العمر</Label>
              <Input id="age" className="h-11" placeholder="مثال: ٨ أشهر" />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="price">السعر المطلوب للرأس (د.ع)</Label>
            <Input id="price" inputMode="numeric" className="h-11" required value={price} onChange={(e) => setPrice(e.target.value.replace(/\D/g, ""))} />
            {price && <p className="text-xs text-muted-foreground">يظهر للمشترين: {formatIQD(Number(price))}</p>}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="notes">وصف إضافي</Label>
            <Textarea id="notes" rows={3} placeholder="نوع العلف، التلقيحات، الحالة الصحية…" value={notes} onChange={(e) => setNotes(e.target.value)} aria-invalid={!!blocked} />
            {blocked && <p role="alert" className="text-xs text-destructive">ممنوع كتابة {blocked} في الإعلان — يتواصل المشترون معك عبر وسيط العلوة فقط.</p>}
          </div>
          <label className="flex items-center gap-3 text-sm"><Checkbox /> لدي شهادة فحص بيطري حديثة</label>
        </section>

        <section className="grid gap-4 rounded-3xl border border-border bg-card p-5 shadow-card sm:p-7">
          <h2 className="font-display text-xl">موقع المواشي</h2>
          <LocationSelect value={loc} onChange={setLoc} required />
          <p className="flex items-center gap-2 text-xs text-muted-foreground"><EyeOff className="size-4" /> يظهر للمشترين المحافظة والقضاء فقط. الموقع الدقيق يُستخدم لتنسيق النقل.</p>
        </section>

        <Button type="submit" size="xl" className="justify-self-start" disabled={!!blocked}>إرسال الإعلان للمراجعة</Button>
      </form>
    </>
  );
}
