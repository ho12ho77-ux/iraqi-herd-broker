import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, CheckCircle2, Circle, Clock, EyeOff, MessagesSquare, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LISTINGS, sampleListing, formatIQD, formatNum, guaranteeAmount } from "@/lib/market";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "حسابي | علوة الساقي" },
      { name: "description", content: "تابع عروضك السرية والمفاوضات وإعلاناتك وحالة توثيق حسابك." },
      { property: "og:title", content: "حسابي | علوة الساقي" },
      { property: "og:description", content: "عروضك، مفاوضاتك، وإعلاناتك في مكان واحد." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AccountPage,
});

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

const THREAD = [
  { from: "me", text: "عرضي ٢٬٩٥٠٬٠٠٠ د.ع للرأس لكامل العدد (٦ عجول)." },
  { from: "broker", text: "تم إيصال عرضك للبائع ب-٠٩٣٢. البائع يطلب ٣٬٠٨٠٬٠٠٠ د.ع ويتكفّل بالفحص البيطري." },
  { from: "me", text: "هل يمكن التسليم في الكوت خلال أسبوع؟" },
  { from: "broker", text: "البائع موافق على التسليم خلال ٧ أيام. هل تقبل السعر المقابل؟" },
];

function AccountPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-ink p-6 text-ink-foreground">
        <div className="flex items-center gap-4">
          <div className="grid size-14 place-items-center rounded-2xl bg-gold font-display text-xl font-bold text-accent-foreground">م</div>
          <div>
            <p className="font-display text-xl">مرحباً، حسابك: م-٤٤١٧</p>
            <p className="flex items-center gap-1 text-sm text-ink-muted"><EyeOff className="size-4" /> هذا الرمز هو كل ما يراه الطرف الآخر عنك</p>
          </div>
        </div>
        <Badge variant="warning" className="gap-1"><Clock className="size-3.5" /> التوثيق قيد المراجعة</Badge>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">نسخة معاينة ببيانات تجريبية.</p>

      <Tabs defaultValue="offers" className="mt-6">
        <TabsList className="h-auto w-full flex-wrap justify-start gap-1 bg-secondary p-1">
          <TabsTrigger value="offers">عروضي</TabsTrigger>
          <TabsTrigger value="chat">المفاوضات</TabsTrigger>
          <TabsTrigger value="selling">إعلاناتي</TabsTrigger>
          <TabsTrigger value="verify">التوثيق</TabsTrigger>
        </TabsList>

        <TabsContent value="offers" className="mt-5 grid gap-3">
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
        </TabsContent>

        <TabsContent value="chat" className="mt-5">
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-card">
            <div className="flex items-center gap-3 border-b border-border p-4">
              <MessagesSquare className="size-5 text-primary" />
              <div>
                <p className="font-semibold">{sampleListing(1).title}</p>
                <p className="text-xs text-muted-foreground">المحادثة مع وسيط العلوة فقط — البائع لا يرى رسائلك مباشرة</p>
              </div>
            </div>
            <div className="grid gap-3 bg-secondary/40 p-4">
              {THREAD.map((m, i) => (
                <div key={i} className={m.from === "me" ? "max-w-[80%] justify-self-start rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground" : "max-w-[80%] justify-self-end rounded-2xl rounded-tl-sm border border-border bg-card px-4 py-2.5 text-sm"}>
                  {m.from === "broker" && <p className="mb-1 text-xs font-semibold text-accent-foreground/70">وسيط العلوة</p>}
                  {m.text}
                </div>
              ))}
            </div>
            <div className="flex gap-2 border-t border-border p-3">
              <input className="field" placeholder="اكتب رسالتك للوسيط…" />
              <Button>إرسال</Button>
            </div>
          </div>
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

        <TabsContent value="verify" className="mt-5">
          <ol className="grid gap-3 rounded-3xl border border-border bg-card p-6 shadow-card">
            {[
              { t: "تأكيد رقم الهاتف", done: true },
              { t: "رفع صورة البطاقة الوطنية (الوجهين)", done: true },
              { t: "مراجعة فريق التوثيق", done: false },
              { t: "تفعيل الحساب الموثّق", done: false },
            ].map((s) => (
              <li key={s.t} className="flex items-center gap-3">
                {s.done ? <CheckCircle2 className="size-5 text-success" /> : <Circle className="size-5 text-muted-foreground" />}
                <span className={s.done ? "" : "text-muted-foreground"}>{s.t}</span>
              </li>
            ))}
            <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground"><BadgeCheck className="size-4" /> صور الوثائق مشفّرة ولا يطّلع عليها إلا موظف التوثيق المختص.</p>
          </ol>
        </TabsContent>
      </Tabs>
    </div>
  );
}
