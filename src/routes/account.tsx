import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Ban, BadgeCheck, CheckCircle2, Circle, Clock, EyeOff, MessagesSquare, ShieldCheck, ShoppingBasket, Star } from "lucide-react";
import { FollowButton } from "@/components/site/FollowButton";
import { Stars, TrustMeter } from "@/components/site/TrustMeter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  DEAL_STATUS_LABEL, LISTINGS, SELLERS, TRUST_WEIGHTS, VERIFICATION_STEPS, buyerQuality, canRateSeller, detectContactInfo,
  formatIQD, formatNum, guaranteeAmount, sampleListing, sellerTrust, trustScore, type DealStatus,
} from "@/lib/market";
import { saveRating, useCart, useFollows, useMyRatings } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "حسابي | علوة الساقي" },
      { name: "description", content: "حسابك الموحّد للبيع والشراء: العروض والمشتريات والتقييمات والمتابعات ونقاط الموثوقية والتوثيق." },
      { property: "og:title", content: "حسابي | علوة الساقي" },
      { property: "og:description", content: "مشترياتك ومبيعاتك ومفاوضاتك في حساب واحد." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AccountPage,
});

const MY_CODE = "ع-٤٤١٧";

type OfferStatus = "pending" | "counter" | "accepted" | "rejected";
const STATUS: Record<OfferStatus, { label: string; variant: "warning" | "accent" | "success" | "danger" }> = {
  pending: { label: "بانتظار رد البائع", variant: "warning" },
  counter: { label: "عرض مقابل من البائع", variant: "accent" },
  accepted: { label: "مقبول — بانتظار الضمان", variant: "success" },
  rejected: { label: "مرفوض", variant: "danger" },
};

const MY_OFFERS: { listing: ReturnType<typeof sampleListing>; price: number; count: number; status: OfferStatus; counter?: number }[] = [
  { listing: sampleListing(0), price: 400000, count: 40, status: "accepted" },
  { listing: sampleListing(1), price: 2950000, count: 6, status: "counter", counter: 3080000 },
  { listing: sampleListing(2), price: 640000, count: 10, status: "pending" },
  { listing: sampleListing(6), price: 410000, count: 30, status: "rejected" },
];

const MY_DEALS: { id: string; listing: ReturnType<typeof sampleListing>; count: number; status: DealStatus }[] = [
  { id: "D-301", listing: sampleListing(0), count: 40, status: "awaiting_guarantee" },
  { id: "D-296", listing: sampleListing(5), count: 2, status: "in_transit" },
  { id: "D-288", listing: sampleListing(3), count: 1, status: "delivered" },
  { id: "D-276", listing: sampleListing(6), count: 15, status: "delivered" },
];

const INITIAL_THREAD = [
  { from: "me", text: "عرضي ٢٬٩٥٠٬٠٠٠ د.ع للرأس لكامل العدد (٦ عجول)." },
  { from: "broker", text: "تم إيصال عرضك للبائع ع-٠٩٣٢. البائع يطلب ٣٬٠٨٠٬٠٠٠ د.ع ويتكفّل بالفحص البيطري." },
  { from: "me", text: "هل يمكن التسليم في الكوت خلال أسبوع؟" },
  { from: "broker", text: "البائع موافق على التسليم خلال ٧ أيام. هل تقبل السعر المقابل؟" },
];

const MY_TRUST = { verified: false, completedDeals: 2, paidOnTime: 2, totalDeals: 2, complaintsUpheld: 0, cancellations: 0 };

function AccountPage() {
  const cart = useCart();
  const score = trustScore({
    verified: MY_TRUST.verified,
    completedDeals: MY_TRUST.completedDeals,
    quality: buyerQuality(MY_TRUST.paidOnTime, MY_TRUST.totalDeals),
    complaintsUpheld: MY_TRUST.complaintsUpheld,
    cancellations: MY_TRUST.cancellations,
  });
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="grid gap-5 rounded-3xl bg-ink p-6 text-ink-foreground md:grid-cols-[1fr_320px] md:items-center">
        <div className="flex items-center gap-4">
          <div className="grid size-14 place-items-center rounded-2xl bg-gold font-display text-xl font-bold text-accent-foreground">ع</div>
          <div>
            <p className="font-display text-xl">مرحباً، حسابك الموحّد: {MY_CODE}</p>
            <p className="text-sm text-ink-muted">تبيع وتشتري من نفس الحساب</p>
            <p className="mt-1 flex items-center gap-1 text-sm text-ink-muted"><EyeOff className="size-4" /> هذا الرمز هو كل ما يراه الطرف الآخر عنك</p>
            <Badge variant="warning" className="mt-2 gap-1"><Clock className="size-3.5" /> التوثيق قيد المراجعة</Badge>
          </div>
        </div>
        <div className="rounded-2xl bg-card p-4 text-card-foreground"><TrustMeter score={score} /></div>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">نسخة معاينة ببيانات تجريبية.</p>

      <Tabs defaultValue="buying" className="mt-6">
        <TabsList className="h-auto w-full flex-wrap justify-start gap-1 bg-secondary p-1">
          <TabsTrigger value="buying">مشترياتي</TabsTrigger>
          <TabsTrigger value="selling">مبيعاتي</TabsTrigger>
          <TabsTrigger value="chat">المفاوضات</TabsTrigger>
          <TabsTrigger value="following">أتابعهم</TabsTrigger>
          <TabsTrigger value="trust">الموثوقية</TabsTrigger>
          <TabsTrigger value="verify">التوثيق</TabsTrigger>
        </TabsList>

        <TabsContent value="buying" className="mt-5 grid gap-8">
          <Link to="/cart" className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 shadow-card hover:border-primary/50">
            <span className="flex items-center gap-2 font-semibold"><ShoppingBasket className="size-5 text-primary" /> سلتي</span>
            <span className="text-sm text-muted-foreground">{formatNum(Object.keys(cart).length)} إعلان محفوظ ←</span>
          </Link>

          <section className="grid gap-3">
            <h2 className="font-display text-xl">عروضي السرية</h2>
            {MY_OFFERS.map((o) => (
              <div key={o.listing.id} className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-card sm:flex-row sm:items-center">
                <img src={o.listing.image} alt="" loading="lazy" width={1024} height={768} className="h-20 w-28 rounded-xl object-cover" />
                <div className="flex-1">
                  <Link to="/listings/$id" params={{ id: o.listing.id }} className="font-display text-lg hover:text-primary">{o.listing.title}</Link>
                  <p className="text-sm text-muted-foreground">عرضك: {formatIQD(o.price)} × {formatNum(o.count)}{o.counter ? ` · البائع يطلب ${formatIQD(o.counter)}` : ""}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={STATUS[o.status].variant}>{STATUS[o.status].label}</Badge>
                  {o.status === "accepted" && (
                    <Button size="sm" variant="hero"><ShieldCheck /> دفع الضمان {formatIQD(guaranteeAmount(o.price, o.count))}</Button>
                  )}
                  {o.status === "counter" && <Button size="sm">مراجعة العرض المقابل</Button>}
                </div>
              </div>
            ))}
          </section>

          <PurchasesSection />
        </TabsContent>

        <TabsContent value="selling" className="mt-5 grid gap-3">
          {LISTINGS.slice(3, 5).map((l) => (
            <div key={l.id} className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-card sm:flex-row sm:items-center">
              <img src={l.image} alt="" loading="lazy" width={1024} height={768} className="h-20 w-28 rounded-xl object-cover" />
              <div className="flex-1">
                <p className="font-display text-lg">{l.title}</p>
                <p className="text-sm text-muted-foreground">{formatIQD(l.pricePerHead)} للرأس · {formatNum(l.count)} رأس</p>
              </div>
              <Badge variant="primary">{formatNum(l.offers)} عروض سرية جديدة</Badge>
              <Button size="sm" variant="outline">عرض العروض</Button>
            </div>
          ))}
          <Button asChild variant="outline" className="justify-self-start"><Link to="/sell">+ إعلان جديد</Link></Button>
        </TabsContent>

        <TabsContent value="chat" className="mt-5"><BrokerChat /></TabsContent>

        <TabsContent value="following" className="mt-5"><Following /></TabsContent>

        <TabsContent value="trust" className="mt-5">
          <div className="grid gap-4 rounded-3xl border border-border bg-card p-6 shadow-card">
            <TrustMeter score={score} />
            <p className="text-sm text-muted-foreground">كيف تُحسب نقاطك (من ١٠٠):</p>
            <ul className="grid gap-2 text-sm sm:grid-cols-2">
              {[
                { t: `توثيق الحساب`, v: `+${formatNum(TRUST_WEIGHTS.verified)}` },
                { t: `كل صفقة مكتملة (حتى ${formatNum(TRUST_WEIGHTS.dealsMax)})`, v: `+${formatNum(TRUST_WEIGHTS.perDeal)}` },
                { t: "جودة التعامل: تقييم المشترين للبائع، أو دفع الضمان في موعده للمشتري", v: `حتى +${formatNum(TRUST_WEIGHTS.qualityMax)}` },
                { t: "شكوى مثبتة ضدك", v: `−${formatNum(TRUST_WEIGHTS.perComplaint)}` },
                { t: "انسحاب أو إلغاء بعد قبول العرض", v: `−${formatNum(TRUST_WEIGHTS.perCancellation)}` },
              ].map((x) => (
                <li key={x.t} className="flex items-center justify-between gap-3 rounded-xl bg-secondary/60 px-4 py-3"><span>{x.t}</span><span className="font-display font-bold text-primary">{x.v}</span></li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground">أكمل التوثيق لترتفع نقاطك {formatNum(TRUST_WEIGHTS.verified - TRUST_WEIGHTS.unverified)} نقطة فوراً.</p>
          </div>
        </TabsContent>

        <TabsContent value="verify" className="mt-5">
          <ol className="grid gap-3 rounded-3xl border border-border bg-card p-6 shadow-card">
            {VERIFICATION_STEPS.map((t, i) => {
              const done = i < 2;
              return (
                <li key={t} className="flex items-center gap-3">
                  {done ? <CheckCircle2 className="size-5 text-success" /> : <Circle className="size-5 text-muted-foreground" />}
                  <span className={done ? "" : "text-muted-foreground"}>{t}</span>
                  {i === 2 && <Button size="sm" variant="outline" className="ms-auto">رفع الصورة</Button>}
                </li>
              );
            })}
            <div className="mt-2 grid gap-2 rounded-2xl bg-secondary/60 p-4 text-xs leading-6 text-muted-foreground">
              <p className="flex items-center gap-2"><BadgeCheck className="size-4 text-primary" /> صور الوثائق مشفّرة ولا يطّلع عليها إلا موظف التوثيق المختص.</p>
              <p className="flex items-center gap-2"><Ban className="size-4 text-primary" /> رقم هاتف واحد وبطاقة وطنية واحدة لكل حساب — تُرفض الحسابات المكررة تلقائياً.</p>
            </div>
          </ol>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PurchasesSection() {
  const ratings = useMyRatings();
  const [open, setOpen] = useState<string | null>(null);
  const [stars, setStars] = useState(5);
  const [text, setText] = useState("");
  const deal = MY_DEALS.find((d) => d.id === open);

  return (
    <section className="grid gap-3">
      <h2 className="font-display text-xl">صفقاتي وتقييم البائعين</h2>
      <p className="text-sm text-muted-foreground">يمكنك تقييم البائع فقط بعد اكتمال الصفقة واستلامك المواشي.</p>
      {MY_DEALS.map((d) => {
        const mine = ratings[d.id];
        const allowed = canRateSeller({ status: d.status, buyerCode: MY_CODE, rated: !!mine }, MY_CODE);
        return (
          <div key={d.id} className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-card sm:flex-row sm:items-center">
            <img src={d.listing.image} alt="" loading="lazy" width={1024} height={768} className="h-16 w-24 rounded-lg object-cover" />
            <div className="flex-1">
              <p className="font-semibold">{d.listing.title} <span className="text-xs text-muted-foreground">· {d.id} · البائع {d.listing.sellerCode}</span></p>
              <p className="text-sm text-muted-foreground">{formatNum(d.count)} رأس · {formatIQD(d.listing.pricePerHead * d.count)}</p>
            </div>
            <Badge variant={d.status === "delivered" ? "success" : d.status === "in_transit" ? "primary" : "warning"}>{DEAL_STATUS_LABEL[d.status]}</Badge>
            {mine ? (
              <span className="flex items-center gap-2 text-sm"><Stars value={mine.stars} /> قيّمت</span>
            ) : allowed ? (
              <Button size="sm" variant="hero" onClick={() => { setOpen(d.id); setStars(5); setText(""); }}><Star /> قيّم البائع</Button>
            ) : (
              <span className="text-xs text-muted-foreground">التقييم بعد الاستلام</span>
            )}
          </div>
        );
      })}

      <Dialog open={!!deal} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle className="font-display">تقييم البائع {deal?.listing.sellerCode}</DialogTitle>
            <DialogDescription>صفقة {deal?.id} — {deal?.listing.title}. يظهر تقييمك في صفحة البائع برمزك فقط.</DialogDescription>
          </DialogHeader>
          <div className="flex justify-center gap-1" role="radiogroup" aria-label="عدد النجوم">
            {[1, 2, 3, 4, 5].map((i) => (
              <button key={i} type="button" role="radio" aria-checked={stars === i} aria-label={`${i} نجوم`} onClick={() => setStars(i)}>
                <Star className={cn("size-9", i <= stars ? "fill-accent text-accent" : "text-muted-foreground/40")} />
              </button>
            ))}
          </div>
          <Textarea rows={3} placeholder="كيف كانت المواشي والتسليم؟" value={text} onChange={(e) => setText(e.target.value)} />
          {detectContactInfo(text) && <p role="alert" className="text-xs text-destructive">لا يُسمح بكتابة وسائل تواصل في التقييم.</p>}
          <DialogFooter>
            <Button
              disabled={!!detectContactInfo(text)}
              onClick={() => {
                if (!deal) return;
                saveRating(deal.id, { stars, text });
                setOpen(null);
                toast.success("شكراً، تم حفظ تقييمك", { description: "نسخة معاينة: محفوظ على هذا الجهاز فقط." });
              }}
            >
              حفظ التقييم
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}

function BrokerChat() {
  const [thread, setThread] = useState(INITIAL_THREAD);
  const [draft, setDraft] = useState("");
  const blocked = detectContactInfo(draft);
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-card">
      <div className="flex items-center gap-3 border-b border-border p-4">
        <MessagesSquare className="size-5 text-primary" />
        <div>
          <p className="font-semibold">{sampleListing(1).title}</p>
          <p className="text-xs text-muted-foreground">المحادثة مع وسيط العلوة فقط — البائع لا يرى رسائلك مباشرة</p>
        </div>
      </div>
      <div className="grid gap-3 bg-secondary/40 p-4">
        {thread.map((m, i) => (
          <div key={i} className={m.from === "me" ? "max-w-[80%] justify-self-start rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground" : "max-w-[80%] justify-self-end rounded-2xl rounded-tl-sm border border-border bg-card px-4 py-2.5 text-sm"}>
            {m.from === "broker" && <p className="mb-1 text-xs font-semibold text-accent-foreground/70">وسيط العلوة</p>}
            {m.text}
          </div>
        ))}
      </div>
      <form
        className="grid gap-2 border-t border-border p-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (!draft.trim() || blocked) return;
          setThread((t) => [...t, { from: "me", text: draft.trim() }]);
          setDraft("");
        }}
      >
        <div className="flex gap-2">
          <input className="field" placeholder="اكتب رسالتك للوسيط…" value={draft} onChange={(e) => setDraft(e.target.value)} aria-invalid={!!blocked} aria-label="رسالة للوسيط" />
          <Button type="submit" disabled={!draft.trim() || !!blocked}>إرسال</Button>
        </div>
        {blocked && (
          <p role="alert" className="flex items-center gap-1.5 text-xs text-destructive"><Ban className="size-3.5" /> لا يمكن إرسال {blocked}. يمنع النظام التواصل المباشر بين البائع والمشتري لحماية الطرفين.</p>
        )}
      </form>
    </div>
  );
}

function Following() {
  const follows = useFollows();
  const list = SELLERS.filter((s) => follows.includes(s.id));
  if (!list.length)
    return (
      <div className="rounded-3xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        لا تتابع أي بائع بعد. افتح أي إعلان ثم «صفحة البائع» واضغط «متابعة البائع».
      </div>
    );
  return (
    <ul className="grid gap-3 md:grid-cols-2">
      {list.map((s) => (
        <li key={s.id} className="grid gap-3 rounded-2xl border border-border bg-card p-4 shadow-card">
          <div className="flex items-center justify-between gap-2">
            <Link to="/sellers/$sellerId" params={{ sellerId: s.id }} className="font-display text-lg hover:text-primary">البائع {s.code}</Link>
            <span className="text-sm text-muted-foreground">{s.governorate}</span>
          </div>
          <TrustMeter score={sellerTrust(s)} />
          <FollowButton sellerId={s.id} sellerCode={s.code} size="sm" />
        </li>
      ))}
    </ul>
  );
}
