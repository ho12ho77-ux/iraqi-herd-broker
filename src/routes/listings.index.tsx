import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SlidersHorizontal } from "lucide-react";
import { ListingCard } from "@/components/site/ListingCard";
import { PageHeading } from "@/components/site/PageHeading";
import { Label } from "@/components/ui/label";
import { GOVERNORATES, districtsOf } from "@/lib/iraq";
import { ANIMAL_TYPES, LISTINGS, formatNum } from "@/lib/market";

type Search = { type?: string; gov?: string; district?: string; sort?: string };

export const Route = createFileRoute("/listings/")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    type: typeof s.type === "string" ? s.type : undefined,
    gov: typeof s.gov === "string" ? s.gov : undefined,
    district: typeof s.district === "string" ? s.district : undefined,
    sort: typeof s.sort === "string" ? s.sort : undefined,
  }),
  head: () => ({
    meta: [
      { title: "المواشي المعروضة | علوة الساقي" },
      { name: "description", content: "تصفّح الأغنام والماعز والأبقار والإبل المعروضة للبيع في محافظات العراق مع الأوزان والأسعار." },
      { property: "og:title", content: "المواشي المعروضة | علوة الساقي" },
      { property: "og:description", content: "إعلانات مواشٍ موثّقة بأوزانها وأسعارها، والتفاوض عبر وسيط سري." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ListingsPage,
});

function ListingsPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/listings/" });
  const set = (patch: Partial<Search>) =>
    navigate({ search: (prev: Search) => ({ ...prev, ...patch }), replace: true });

  let items = LISTINGS.filter(
    (l) =>
      (!search.type || l.type === search.type) &&
      (!search.gov || l.governorate === search.gov) &&
      (!search.district || l.district === search.district),
  );
  if (search.sort === "low") items = [...items].sort((a, b) => a.pricePerHead - b.pricePerHead);
  if (search.sort === "high") items = [...items].sort((a, b) => b.pricePerHead - a.pricePerHead);

  return (
    <>
      <PageHeading eyebrow="سوق العلوة" title="المواشي المعروضة">
        كل الإعلانات تظهر برمز البائع فقط. قدّم عرضك السري وسيتولّى وسيط العلوة التفاوض نيابةً عنك.
      </PageHeading>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
          <p className="mb-3 flex items-center gap-2 text-sm font-semibold"><SlidersHorizontal className="size-4" /> تصفية النتائج</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="grid gap-1.5">
              <Label htmlFor="f-type">النوع</Label>
              <select id="f-type" className="field" value={search.type ?? ""} onChange={(e) => set({ type: e.target.value || undefined })}>
                <option value="">كل الأنواع</option>
                {ANIMAL_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="f-gov">المحافظة</Label>
              <select id="f-gov" className="field" value={search.gov ?? ""} onChange={(e) => set({ gov: e.target.value || undefined, district: undefined })}>
                <option value="">كل المحافظات</option>
                {GOVERNORATES.map((g) => <option key={g.name}>{g.name}</option>)}
              </select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="f-district">القضاء</Label>
              <select id="f-district" className="field disabled:opacity-60" disabled={!search.gov} value={search.district ?? ""} onChange={(e) => set({ district: e.target.value || undefined })}>
                <option value="">كل الأقضية</option>
                {districtsOf(search.gov ?? "").map((d) => <option key={d.name}>{d.name}</option>)}
              </select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="f-sort">الترتيب</Label>
              <select id="f-sort" className="field" value={search.sort ?? ""} onChange={(e) => set({ sort: e.target.value || undefined })}>
                <option value="">الأحدث</option>
                <option value="low">السعر: من الأقل</option>
                <option value="high">السعر: من الأعلى</option>
              </select>
            </div>
          </div>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">{formatNum(items.length)} إعلان</p>
        {items.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
            لا توجد إعلانات مطابقة حالياً. جرّب محافظة أو نوعاً آخر.
          </div>
        ) : (
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
        )}
      </div>
    </>
  );
}
