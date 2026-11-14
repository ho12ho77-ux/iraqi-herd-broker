import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, CheckCircle2, EyeOff, FileWarning, Lock, MessagesSquare, ShieldCheck, Truck, XCircle } from "lucide-react";
import { PageHeading } from "@/components/site/PageHeading";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "كيف تعمل الوساطة وضمان الجدية | علوة الساقي" },
      { name: "description", content: "شرح نظام الوساطة السرية في علوة الساقي، وشروط ضمان الجدية بنسبة ٢٫٥٪، وحماية البيانات والنقل والشكاوى." },
      { property: "og:title", content: "كيف تعمل الوساطة | علوة الساقي" },
      { property: "og:description", content: "وساطة سرية، ضمان جدية ٢٫٥٪، توثيق للحسابات، ونقل وتسليم منسّق." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HowItWorks,
});

const REFUND = [
  "انسحاب البائع أو رفضه البيع بعد قبول العرض.",
  "عدم مطابقة المواشي للوصف أو الوزن أو الحالة الصحية عند الفحص.",
  "تعذّر التسليم لأسباب تعود للبائع أو للمنصة.",
];
const DEDUCT = [
  "يُخصم الضمان من الثمن الكلي عند الاستلام الناجح.",
  "يُحتفظ به لدى المنصة طوال فترة الصفقة ولا يصل للبائع مباشرة.",
];
const FORFEIT = [
  "انسحاب المشتري دون عذر مقبول بعد قبول البائع للعرض.",
  "عدم حضور المشتري للاستلام في الموعد المتفق عليه دون إشعار.",
];

function HowItWorks() {
  return (
    <>
      <PageHeading eyebrow="الدليل والشروط" title="كيف تعمل علوة الساقي">
        وسيط واحد موثوق بين البائع والمشتري: لا أرقام هواتف، لا أسماء، ولا مواقع دقيقة تُكشف قبل إتمام الصفقة.
      </PageHeading>
      <div className="mx-auto grid max-w-5xl gap-12 px-4 py-12 sm:px-6">
        <section className="grid gap-4 sm:grid-cols-3">
          {[
            { icon: EyeOff, t: "هوية محجوبة", d: "يظهر البائع برمز مثل «ب-٢٧١٤» ويظهر المشتري برمز مماثل." },
            { icon: MessagesSquare, t: "تفاوض عبر الوسيط", d: "العروض والعروض المقابلة تمر عبر موظف العلوة فقط." },
            { icon: BadgeCheck, t: "حسابات موثّقة", d: "التحقق من الهوية ورقم الهاتف قبل السماح بالبيع أو الشراء." },
          ].map((x) => (
            <div key={x.t} className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <x.icon className="size-7 text-primary" />
              <h2 className="mt-3 font-display text-lg">{x.t}</h2>
              <p className="mt-1 text-sm leading-7 text-muted-foreground">{x.d}</p>
            </div>
          ))}
        </section>

        <section id="guarantee" className="rounded-3xl bg-ink p-6 text-ink-foreground sm:p-10">
          <div className="flex items-center gap-3">
            <ShieldCheck className="size-9 text-accent" />
            <h2 className="font-display text-2xl font-bold sm:text-3xl">ضمان الجدية ٢٫٥٪</h2>
          </div>
          <p className="mt-3 max-w-2xl leading-8 text-ink-muted">
            مبلغ صغير يدفعه المشتري بعد قبول البائع لعرضه، يساوي ٢٫٥٪ من قيمة الصفقة، لضمان جدية الطرفين وحماية وقت البائع.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <TermList icon={CheckCircle2} tone="text-success" title="يُعاد كاملاً إذا" items={REFUND} />
            <TermList icon={Lock} tone="text-accent" title="أثناء الصفقة" items={DEDUCT} />
            <TermList icon={XCircle} tone="text-destructive" title="يُصادر لصالح البائع إذا" items={FORFEIT} />
          </div>
          <p className="mt-6 text-xs text-ink-muted">* هذه شروط أولية للمعاينة وتحتاج لمراجعة قانونية قبل الإطلاق. لا يوجد دفع حقيقي في هذه النسخة.</p>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <Truck className="size-7 text-primary" />
            <h2 className="mt-3 font-display text-xl">النقل والتسليم</h2>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">بعد دفع الضمان ينسّق فريق العلوة موعد الفحص البيطري، ثم النقل من موقع البائع إلى موقع المشتري، مع متابعة حالة الشحنة حتى التسليم والتوقيع.</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <FileWarning className="size-7 text-primary" />
            <h2 className="mt-3 font-display text-xl">الشكاوى والنزاعات</h2>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">يمكن لأي طرف فتح شكوى من حسابه على أي صفقة. يراجعها موظف مختص ويُصعّدها للإدارة عند الحاجة، ويُجمّد الضمان حتى البت فيها.</p>
          </div>
        </section>

        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild size="xl"><Link to="/register">ابدأ بإنشاء حسابك</Link></Button>
          <Button asChild size="xl" variant="outline"><Link to="/listings">تصفّح المعروض</Link></Button>
        </div>
      </div>
    </>
  );
}

function TermList({ icon: Icon, tone, title, items }: { icon: typeof CheckCircle2; tone: string; title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-ink-foreground/10 bg-ink-foreground/[0.04] p-5">
      <h3 className="flex items-center gap-2 font-display text-base"><Icon className={`size-5 ${tone}`} /> {title}</h3>
      <ul className="mt-3 space-y-2 text-sm leading-7 text-ink-muted">
        {items.map((i) => <li key={i}>• {i}</li>)}
      </ul>
    </div>
  );
}
