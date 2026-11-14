import { createFileRoute, Link } from "@tanstack/react-router";
import { Lock, Minus, Plus, ShieldCheck, ShoppingBasket, Trash2 } from "lucide-react";
import { PageHeading } from "@/components/site/PageHeading";
import { Button } from "@/components/ui/button";
import { GUARANTEE_RATE, cartSummary, formatIQD, formatNum, getListing, type Listing } from "@/lib/market";
import { removeCartItem, setCartItem, useCart } from "@/lib/store";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "سلتي | علوة الساقي" },
      { name: "description", content: "المواشي التي حفظتها للشراء في علوة الساقي، مع تقدير قيمة الصفقة وضمان الجدية." },
      { property: "og:title", content: "سلتي | علوة الساقي" },
      { property: "og:description", content: "احفظ المواشي التي تنوي شراءها وقدّم عليها عروضاً سرية." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const cart = useCart();
  const items = Object.entries(cart)
    .map(([id, count]) => ({ listing: getListing(id), count }))
    .filter((x): x is { listing: Listing; count: number } => !!x.listing)
    .map((x) => ({ ...x, count: Math.min(x.count, x.listing.count) }));
  const sum = cartSummary(items.map((i) => ({ pricePerHead: i.listing.pricePerHead, count: i.count })));

  return (
    <>
      <PageHeading eyebrow="مشترياتك" title="سلتي">
        احفظ هنا المواشي التي تنوي شراءها. الشراء يتم دائماً بعرض سري عبر وسيط العلوة، ولا يُطلب أي دفع من السلة.
      </PageHeading>
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_340px]">
        {items.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-card p-10 text-center lg:col-span-2">
            <ShoppingBasket className="mx-auto size-10 text-muted-foreground" />
            <p className="mt-3 font-display text-xl">سلتك فارغة</p>
            <p className="mt-1 text-sm text-muted-foreground">تصفّح المعروض واضغط «للسلة» على أي إعلان.</p>
            <Button asChild className="mt-5"><Link to="/listings">تصفّح المواشي</Link></Button>
          </div>
        ) : (
          <>
            <ul className="grid gap-3">
              {items.map(({ listing: l, count }) => (
                <li key={l.id} className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-card sm:flex-row sm:items-center">
                  <img src={l.image} alt="" loading="lazy" width={1024} height={768} className="h-24 w-full rounded-xl object-cover sm:w-32" />
                  <div className="flex-1">
                    <Link to="/listings/$id" params={{ id: l.id }} className="font-display text-lg hover:text-primary">{l.title}</Link>
                    <p className="text-sm text-muted-foreground">{l.governorate} — {l.district} · {formatIQD(l.pricePerHead)} للرأس</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Button size="icon" variant="outline" className="size-8" aria-label="إنقاص العدد" disabled={count <= 1} onClick={() => setCartItem(l.id, count - 1)}><Minus /></Button>
                      <span className="min-w-16 text-center text-sm font-semibold">{formatNum(count)} رأس</span>
                      <Button size="icon" variant="outline" className="size-8" aria-label="زيادة العدد" disabled={count >= l.count} onClick={() => setCartItem(l.id, count + 1)}><Plus /></Button>
                      <span className="text-xs text-muted-foreground">من {formatNum(l.count)} متاحة</span>
                    </div>
                  </div>
                  <div className="flex flex-row items-center gap-2 sm:flex-col sm:items-end">
                    <p className="font-display text-lg font-bold text-primary">{formatIQD(l.pricePerHead * count)}</p>
                    <div className="flex gap-2">
                      <Button asChild size="sm"><Link to="/listings/$id" params={{ id: l.id }}><Lock /> قدّم عرضاً سرياً</Link></Button>
                      <Button size="icon" variant="ghost" className="size-9" aria-label="إزالة من السلة" onClick={() => removeCartItem(l.id)}><Trash2 /></Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="grid gap-3 rounded-3xl bg-ink p-6 text-ink-foreground">
                <p className="font-display text-xl">ملخص السلة</p>
                <div className="flex justify-between text-sm"><span className="text-ink-muted">عدد الإعلانات</span><span>{formatNum(items.length)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-ink-muted">القيمة التقديرية</span><span className="font-semibold">{formatIQD(sum.total)}</span></div>
                <div className="flex justify-between border-t border-ink-foreground/15 pt-3"><span className="text-ink-muted">ضمان الجدية ({formatNum(GUARANTEE_RATE * 100)}٪)</span><span className="font-display text-lg font-bold text-accent">{formatIQD(sum.guarantee)}</span></div>
                <p className="flex items-start gap-2 text-xs leading-6 text-ink-muted"><ShieldCheck className="mt-0.5 size-4 shrink-0" /> الضمان يُطلب لكل صفقة على حدة، وفقط بعد قبول البائع لعرضك. الأسعار تقديرية وقابلة للتفاوض.</p>
                <p className="text-xs text-ink-muted">نسخة معاينة: السلة محفوظة على هذا الجهاز فقط.</p>
              </div>
            </aside>
          </>
        )}
      </div>
    </>
  );
}
