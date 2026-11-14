import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, CalendarDays, EyeOff, Handshake, MapPin, MessageSquareQuote, Users } from "lucide-react";
import { FollowButton } from "@/components/site/FollowButton";
import { ListingCard } from "@/components/site/ListingCard";
import { Stars, TrustMeter } from "@/components/site/TrustMeter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { averageStars, formatNum, getSeller, listingsBySeller, sellerTrust } from "@/lib/market";
import { useFollows } from "@/lib/store";

export const Route = createFileRoute("/sellers/$sellerId")({
  loader: ({ params }) => {
    const seller = getSeller(params.sellerId);
    if (!seller) throw notFound();
    return { seller };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `البائع ${loaderData.seller.code} | علوة الساقي` },
          { name: "description", content: `صفحة البائع ${loaderData.seller.code} من ${loaderData.seller.governorate}: إعلاناته، تقييمات المشترين بعد الصفقات المكتملة، ونقاط الموثوقية.` },
          { property: "og:title", content: `البائع ${loaderData.seller.code} | علوة الساقي` },
          { property: "og:description", content: `بائع مواشٍ من ${loaderData.seller.governorate} عبر علوة الساقي.` },
          { property: "og:type", content: "profile" },
          { name: "twitter:card", content: "summary" },
        ]
      : [{ title: "البائع غير متاح | علوة الساقي" }, { name: "robots", content: "noindex" }],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="font-display text-2xl font-bold">هذا البائع غير متاح</h1>
      <Button asChild className="mt-6"><Link to="/listings">العودة للمعروض</Link></Button>
    </div>
  ),
  component: SellerPage,
});

function SellerPage() {
  const { seller } = Route.useLoaderData();
  const follows = useFollows();
  const listings = listingsBySeller(seller.code);
  const stars = seller.reviews.map((r) => r.stars);
  const avg = averageStars(stars);
  const followers = seller.followers + (follows.includes(seller.id) ? 1 : 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Link to="/listings" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowRight className="size-4" /> العودة للمعروض
      </Link>

      <section className="relative mt-4 overflow-hidden rounded-3xl bg-ink p-6 text-ink-foreground sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-lattice opacity-30" />
        <div className="relative grid gap-6 lg:grid-cols-[1fr_340px] lg:items-center">
          <div className="flex items-start gap-4">
            <div className="grid size-16 shrink-0 place-items-center rounded-2xl bg-gold font-display text-2xl font-bold text-accent-foreground">ع</div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-3xl font-bold">البائع {seller.code}</h1>
                {seller.verified ? <Badge variant="success" className="gap-1"><BadgeCheck className="size-3.5" /> حساب موثّق</Badge> : <Badge variant="warning">غير موثّق بعد</Badge>}
              </div>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-muted">
                <span className="flex items-center gap-1"><MapPin className="size-4" /> {seller.governorate}</span>
                <span className="flex items-center gap-1"><CalendarDays className="size-4" /> عضو منذ {seller.memberSince}</span>
                <span className="flex items-center gap-1"><Handshake className="size-4" /> {formatNum(seller.completedDeals)} صفقة مكتملة</span>
                <span className="flex items-center gap-1"><Users className="size-4" /> {formatNum(followers)} متابِع</span>
              </div>
              <p className="mt-3 flex items-center gap-1.5 text-xs text-ink-muted"><EyeOff className="size-4" /> اسم البائع ورقمه محجوبان. لا يمكن مراسلته مباشرة — كل تواصل يتم عبر وسيط العلوة.</p>
            </div>
          </div>
          <div className="grid gap-4 rounded-2xl bg-card p-5 text-card-foreground">
            <TrustMeter score={sellerTrust(seller)} />
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2"><Stars value={avg} /> {stars.length ? formatNum(avg) : "—"}</span>
              <span className="text-muted-foreground">{formatNum(stars.length)} تقييم</span>
            </div>
            <FollowButton sellerId={seller.id} sellerCode={seller.code} variant="hero" />
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl">إعلانات البائع ({formatNum(listings.length)})</h2>
        {listings.length ? (
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
        ) : (
          <p className="mt-3 text-muted-foreground">لا توجد إعلانات نشطة حالياً. تابِع البائع ليصلك تنبيه بإعلاناته القادمة.</p>
        )}
      </section>

      <section className="mt-12">
        <h2 className="flex items-center gap-2 font-display text-2xl"><MessageSquareQuote className="size-6 text-primary" /> تقييمات المشترين</h2>
        <p className="mt-1 text-sm text-muted-foreground">لا يُقبل التقييم إلا من مشترٍ أتمّ صفقة واستلم المواشي فعلاً.</p>
        {seller.reviews.length ? (
          <ul className="mt-4 grid gap-3 md:grid-cols-2">
            {seller.reviews.map((r) => (
              <li key={r.dealId} className="rounded-2xl border border-border bg-card p-5 shadow-card">
                <div className="flex items-center justify-between gap-2">
                  <Stars value={r.stars} />
                  <Badge variant="success">صفقة مكتملة {r.dealId}</Badge>
                </div>
                <p className="mt-3 leading-7">{r.text}</p>
                <p className="mt-2 text-xs text-muted-foreground">المشتري {r.buyerCode} · {r.date}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 rounded-2xl border border-dashed border-border p-5 text-sm text-muted-foreground">لا توجد تقييمات بعد — لم يُكمل هذا البائع صفقات مستلمة.</p>
        )}
      </section>
    </div>
  );
}
