import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowRight, BadgeCheck, CalendarDays, EyeOff, Lock, MapPin, Scale, ShieldCheck, Stethoscope, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GUARANTEE_RATE, formatIQD, formatNum, getListing, guaranteeAmount } from "@/lib/market";

export const Route = createFileRoute("/listings/$id")({
  loader: ({ params }) => {
    const listing = getListing(params.id);
    if (!listing) throw notFound();
    return { listing };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.listing.title} | علوة الساقي` },
          { name: "description", content: `${loaderData.listing.type} ${loaderData.listing.breed} في ${loaderData.listing.governorate} — ${loaderData.listing.count} رأس بمعدل ${loaderData.listing.avgWeight} كغم.` },
          { property: "og:title", content: loaderData.listing.title },
          { property: "og:description", content: `معروض في ${loaderData.listing.governorate} عبر علوة الساقي للمواشي.` },
          { property: "og:type", content: "product" },
          { name: "twitter:card", content: "summary_large_image" },
        ]
      : [{ title: "الإعلان غير متاح | علوة الساقي" }, { name: "robots", content: "noindex" }],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="font-display text-2xl font-bold">هذا الإعلان غير متاح</h1>
      <p className="mt-2 text-muted-foreground">ربما بيعت المواشي أو أُزيل الإعلان.</p>
      <Button asChild className="mt-6"><Link to="/listings">العودة للمعروض</Link></Button>
    </div>
  ),
  component: ListingPage,
});

function ListingPage() {
  const { listing } = Route.useLoaderData();
  const [price, setPrice] = useState(String(Math.round(listing.pricePerHead * 0.95)));
  const [count, setCount] = useState(String(listing.count));
  const [note, setNote] = useState("");
  const p = Number(price) || 0;
  const c = Math.min(Number(count) || 0, listing.count);
  const total = p * c;

  const specs = [
    { icon: Users, label: "العدد", value: `${formatNum(listing.count)} رأس` },
    { icon: Scale, label: "معدل الوزن", value: `${formatNum(listing.avgWeight)} كغم` },
    { icon: CalendarDays, label: "العمر", value: listing.age },
    { icon: BadgeCheck, label: "الجنس", value: listing.sex },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Link to="/listings" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowRight className="size-4" /> العودة للمعروض
      </Link>
      <div className="mt-4 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="overflow-hidden rounded-3xl bg-muted shadow-card">
            <img src={listing.image} alt={listing.title} width={1024} height={768} className="aspect-[4/3] w-full object-cover" />
          </div>
          <div className="mt-3 grid grid-cols-4 gap-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="overflow-hidden rounded-xl bg-muted">
                <img src={listing.image} alt="" loading="lazy" width={1024} height={768} className="aspect-square w-full object-cover" style={{ objectPosition: `${i * 30}% 50%` }} />
              </div>
            ))}
          </div>

          <div className="mt-8">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="accent">{listing.type} · {listing.breed}</Badge>
              {listing.vetCertificate && <Badge variant="success" className="gap-1"><Stethoscope className="size-3.5" /> شهادة فحص بيطري</Badge>}
              <span className="text-xs text-muted-foreground">رقم الإعلان {listing.id} · {listing.posted}</span>
            </div>
            <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">{listing.title}</h1>
            <p className="mt-2 flex items-center gap-1 text-muted-foreground"><MapPin className="size-4" /> {listing.governorate} — قضاء {listing.district}</p>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {specs.map((s) => (
                <div key={s.label} className="rounded-2xl border border-border bg-card p-4">
                  <s.icon className="size-5 text-primary" />
                  <p className="mt-2 text-xs text-muted-foreground">{s.label}</p>
                  <p className="font-display text-lg">{s.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl bg-secondary/60 p-5">
              <h2 className="font-display text-lg">وصف البائع</h2>
              <p className="mt-2 leading-8 text-muted-foreground">{listing.notes}</p>
            </div>
            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-border bg-card p-5">
              <EyeOff className="mt-0.5 size-5 shrink-0 text-primary" />
              <div className="text-sm leading-7">
                <p className="font-semibold">البائع: {listing.sellerCode} {listing.verified && <span className="text-success">· حساب موثّق</span>}</p>
                <p className="text-muted-foreground">اسم البائع ورقم هاتفه وموقعه الدقيق محجوبة. يتواصل وسيط العلوة معه نيابةً عنك.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Offer panel */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-lift">
            <p className="text-sm text-muted-foreground">السعر المطلوب للرأس</p>
            <p className="font-display text-3xl font-bold text-primary">{formatIQD(listing.pricePerHead)}</p>
            <p className="mt-1 text-xs text-muted-foreground">{formatNum(listing.offers)} عروض سرية مقدّمة حتى الآن</p>

            <form
              className="mt-6 grid gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                toast.success("تم إرسال عرضك السري إلى وسيط العلوة", {
                  description: "نسخة معاينة: لم يُحفظ العرض ولم يُطلب أي دفع.",
                });
              }}
            >
              <div className="flex items-center gap-2 rounded-xl bg-primary-soft px-3 py-2 text-sm text-primary">
                <Lock className="size-4" /> عرض سري — لن يرى البائع هويتك
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="price">سعرك للرأس (د.ع)</Label>
                  <Input id="price" inputMode="numeric" className="h-11" value={price} onChange={(e) => setPrice(e.target.value.replace(/\D/g, ""))} />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="count">العدد</Label>
                  <Input id="count" inputMode="numeric" className="h-11" value={count} onChange={(e) => setCount(e.target.value.replace(/\D/g, ""))} />
                </div>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="note">ملاحظة للوسيط (اختياري)</Label>
                <Textarea id="note" rows={3} placeholder="مثال: أرغب بالاستلام خلال أسبوع في بغداد" value={note} onChange={(e) => setNote(e.target.value)} />
              </div>

              <div className="rounded-2xl border border-dashed border-border bg-secondary/50 p-4 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">قيمة عرضك</span><span className="font-semibold">{formatIQD(total)}</span></div>
                <div className="mt-2 flex justify-between"><span className="text-muted-foreground">ضمان الجدية ({formatNum(GUARANTEE_RATE * 100)}٪)</span><span className="font-display text-lg font-bold text-primary">{formatIQD(guaranteeAmount(p, c))}</span></div>
                <p className="mt-2 text-xs leading-6 text-muted-foreground">يُطلب الضمان فقط بعد قبول البائع لعرضك، ويُخصم من الثمن عند الاستلام.</p>
              </div>
              <Button type="submit" size="xl" disabled={total <= 0}>إرسال العرض السري</Button>
              <Link to="/how-it-works" className="flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                <ShieldCheck className="size-3.5" /> شروط ضمان الجدية
              </Link>
            </form>
          </div>
        </aside>
      </div>
    </div>
  );
}
