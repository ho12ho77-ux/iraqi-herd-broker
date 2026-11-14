import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, EyeOff, Handshake, Lock, ShieldCheck, Truck, BadgeCheck, MessagesSquare } from "lucide-react";
import hero from "@/assets/hero-market.jpg";
import { Button } from "@/components/ui/button";
import { ListingCard } from "@/components/site/ListingCard";
import { ANIMAL_TYPES, LISTINGS, TYPE_IMAGE, formatNum } from "@/lib/market";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "علوة الساقي للمواشي — سوق مواشٍ عراقي بوساطة سرية" },
      { name: "description", content: "بِع واشترِ الأغنام والماعز والأبقار والإبل في كل محافظات العراق عبر وسيط موثوق يحمي هوية البائع والمشتري." },
      { property: "og:title", content: "علوة الساقي للمواشي" },
      { property: "og:description", content: "سوق مواشٍ عراقي إلكتروني بوساطة سرية وضمان جدية ٢٫٥٪." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const STEPS = [
  { icon: BadgeCheck, title: "سجّل ووثّق حسابك", text: "بائعاً أو مشترياً، مع اختيار محافظتك وقضائك ومدينتك." },
  { icon: EyeOff, title: "اعرض أو تصفّح بسرية", text: "يظهر البائع برمز فقط، ولا يرى أحد رقم هاتف أو اسم الطرف الآخر." },
  { icon: MessagesSquare, title: "قدّم عرضك وتفاوض", text: "العروض تمر عبر وسيط العلوة الذي ينقل الأسعار والردود بين الطرفين." },
  { icon: ShieldCheck, title: "ضمان جدية ٢٫٥٪", text: "يُحجز عند قبول العرض ويُخصم من الثمن عند الاستلام." },
  { icon: Truck, title: "النقل والتسليم", text: "ننسّق الفحص والنقل والتسليم ونتابع الصفقة حتى إتمامها." },
];

function Home() {
  const featured = LISTINGS.slice(0, 4);
  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-ink">
        <img src={hero} alt="علوة مواشٍ عراقية وقت الغروب" width={1600} height={912} className="absolute inset-0 -z-10 size-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-hero-fade" />
        <div className="mx-auto flex min-h-[78vh] max-w-7xl flex-col justify-end px-4 pb-14 pt-28 sm:px-6 sm:pb-20">
          <div className="max-w-2xl animate-rise">
            <span className="inline-flex items-center gap-2 rounded-full border border-ink-foreground/25 bg-ink/40 px-3 py-1 text-xs text-ink-foreground backdrop-blur">
              <Lock className="size-3.5 text-accent" /> وساطة سرية — هويتك محمية حتى إتمام الصفقة
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.25] text-ink-foreground sm:text-6xl">
              علوة الساقي
              <span className="block text-accent">سوق المواشي العراقي الموثوق</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-ink-foreground/85 sm:text-lg">
              نربط البائع والمشتري في كل محافظات العراق، ونتولّى التفاوض والضمان والنقل — دون أن يكشف أي طرف بياناته للآخر.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="hero" size="xl">
                <Link to="/listings">تصفّح المواشي <ArrowLeft /></Link>
              </Button>
              <Button asChild variant="glass" size="xl">
                <Link to="/sell">اعرض مواشيك للبيع</Link>
              </Button>
            </div>
          </div>
          <dl className="mt-12 grid max-w-2xl grid-cols-3 gap-4 border-t border-ink-foreground/15 pt-6 text-ink-foreground">
            {[
              ["١٩", "محافظة مغطّاة"],
              ["٢٫٥٪", "ضمان جدية فقط"],
              ["١٠٠٪", "سرية بين الطرفين"],
            ].map(([n, l]) => (
              <div key={l}>
                <dt className="font-display text-2xl font-bold text-accent sm:text-3xl">{n}</dt>
                <dd className="text-xs text-ink-foreground/75 sm:text-sm">{l}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">ماذا تبحث عنه؟</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">
          {ANIMAL_TYPES.map((t) => {
            const n = LISTINGS.filter((l) => l.type === t).length;
            return (
              <Link key={t} to="/listings" search={{ type: t }} className="group relative overflow-hidden rounded-2xl bg-ink shadow-card">
                <img src={TYPE_IMAGE[t]} alt={t} loading="lazy" width={1024} height={768} className="aspect-[4/3] w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-hero-fade" />
                <div className="absolute bottom-3 right-3">
                  <p className="font-display text-xl font-bold text-ink-foreground">{t}</p>
                  <p className="text-xs text-ink-foreground/75">{formatNum(n)} إعلانات</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-ink text-ink-foreground">
        <div className="bg-lattice">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-accent">نظام الوساطة السرية</p>
                <h2 className="mt-1 font-display text-2xl font-bold sm:text-4xl">من العرض إلى التسليم، ونحن بينكما</h2>
              </div>
              <Button asChild variant="glass"><Link to="/how-it-works">التفاصيل والشروط</Link></Button>
            </div>
            <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {STEPS.map((s, i) => (
                <li key={s.title} className="relative rounded-2xl border border-ink-foreground/10 bg-ink-foreground/[0.04] p-5">
                  <span className="absolute left-4 top-4 font-display text-3xl font-bold text-ink-foreground/10">{formatNum(i + 1)}</span>
                  <s.icon className="size-7 text-accent" />
                  <h3 className="mt-4 font-display text-lg">{s.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-ink-muted">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">أحدث المعروض في العلوة</h2>
          <Link to="/listings" className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
            عرض الكل <ArrowLeft className="size-4" />
          </Link>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((l) => <ListingCard key={l.id} listing={l} />)}
        </div>
      </section>

      {/* Trust band */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-6 rounded-3xl border border-border bg-card p-6 shadow-card sm:p-10 md:grid-cols-[1.3fr_1fr] md:items-center">
          <div>
            <Handshake className="size-10 text-primary" />
            <h2 className="mt-4 font-display text-2xl font-bold sm:text-3xl">ضمان جدية عادل للطرفين</h2>
            <p className="mt-3 leading-8 text-muted-foreground">
              عند قبول البائع لعرضك يُحجز ٢٫٥٪ فقط من قيمة الصفقة كضمان. يُخصم من الثمن عند الاستلام، ويُعاد لك كاملاً إذا انسحب البائع أو لم تطابق المواشي الوصف.
            </p>
          </div>
          <div className="rounded-2xl bg-secondary p-6">
            <p className="text-sm text-muted-foreground">مثال: ٤٠ رأس × ٤٢٥٬٠٠٠ د.ع</p>
            <p className="mt-2 font-display text-lg">قيمة الصفقة: ١٧٬٠٠٠٬٠٠٠ د.ع</p>
            <p className="mt-1 font-display text-3xl font-bold text-primary">الضمان: ٤٢٥٬٠٠٠ د.ع</p>
            <Button asChild className="mt-5 w-full"><Link to="/how-it-works">اقرأ الشروط كاملة</Link></Button>
          </div>
        </div>
      </section>
    </>
  );
}
