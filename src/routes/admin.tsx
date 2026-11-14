import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  AlertTriangle, BadgeCheck, Banknote, ClipboardList, Crown, FileSearch, Handshake, LayoutDashboard,
  Lock, Settings, ShieldCheck, Truck, UserCog, Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  LISTINGS, sampleListing, ROLE_LABEL, ROLE_SECTIONS, SECTION_LABEL, canAccess, formatIQD, formatNum, guaranteeAmount,
  type AdminSection, type StaffRole,
} from "@/lib/market";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "لوحة الإدارة | علوة الساقي" },
      { name: "description", content: "إدارة الصفقات والتوثيق والشكاوى والنقل وصلاحيات الطاقم في علوة الساقي." },
      { property: "og:title", content: "لوحة الإدارة | علوة الساقي" },
      { property: "og:description", content: "لوحة تحكم المدير الأعلى والمدراء والموظفين." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const ICONS: Record<AdminSection, LucideIcon> = {
  overview: LayoutDashboard, deals: Handshake, listings: FileSearch, verification: BadgeCheck,
  complaints: AlertTriangle, logistics: Truck, guarantees: Banknote, users: Users, staff: UserCog, settings: Settings,
};

function AdminPage() {
  const [role, setRole] = useState<StaffRole>("super_admin");
  const [section, setSection] = useState<AdminSection>("overview");
  const active = canAccess(role, section) ? section : "overview";

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">لوحة الإدارة</h1>
          <p className="text-sm text-muted-foreground">معاينة ببيانات تجريبية — جرّب تبديل الدور لرؤية الصلاحيات.</p>
        </div>
        <div className="flex items-center gap-1 rounded-xl border border-border bg-card p-1 shadow-card">
          {(Object.keys(ROLE_LABEL) as StaffRole[]).map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={cn("flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors", role === r ? "bg-ink text-ink-foreground" : "text-muted-foreground hover:bg-muted")}
            >
              {r === "super_admin" && <Crown className="size-4 text-accent" />}
              {ROLE_LABEL[r]}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[240px_1fr]">
        <nav className="flex gap-1 overflow-x-auto rounded-2xl bg-sidebar p-2 text-sidebar-foreground lg:flex-col lg:self-start">
          {(Object.keys(SECTION_LABEL) as AdminSection[]).map((s) => {
            const Icon = ICONS[s];
            const allowed = canAccess(role, s);
            return (
              <button
                key={s}
                disabled={!allowed}
                onClick={() => setSection(s)}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition-colors",
                  active === s ? "bg-sidebar-primary text-sidebar-primary-foreground" : "hover:bg-sidebar-accent",
                  !allowed && "cursor-not-allowed opacity-35 hover:bg-transparent",
                )}
              >
                <Icon className="size-4" /> {SECTION_LABEL[s]}
                {!allowed && <Lock className="ms-auto size-3.5" />}
              </button>
            );
          })}
        </nav>

        <section className="min-w-0">
          <h2 className="mb-4 font-display text-2xl">{SECTION_LABEL[active]}</h2>
          {active === "overview" && <Overview role={role} />}
          {active === "deals" && <Deals />}
          {active === "listings" && <ListingsReview />}
          {active === "verification" && <Verification />}
          {active === "complaints" && <Complaints />}
          {active === "logistics" && <Logistics />}
          {active === "guarantees" && <Guarantees />}
          {active === "users" && <UsersSection />}
          {active === "staff" && <Staff />}
          {active === "settings" && <SettingsSection />}
        </section>
      </div>
    </div>
  );
}

function Panel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("overflow-hidden rounded-2xl border border-border bg-card shadow-card", className)}>{children}</div>;
}

function Table({ head, rows }: { head: string[]; rows: React.ReactNode[][] }) {
  return (
    <Panel>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px] text-sm">
          <thead className="bg-secondary/70 text-right text-xs text-muted-foreground">
            <tr>{head.map((h) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t border-border">
                {r.map((c, j) => <td key={j} className="px-4 py-3 align-middle">{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function Overview({ role }: { role: StaffRole }) {
  const stats = [
    { l: "صفقات نشطة", v: "٣٤", icon: Handshake },
    { l: "بانتظار التوثيق", v: "١٢", icon: BadgeCheck },
    { l: "شكاوى مفتوحة", v: "٥", icon: AlertTriangle },
    { l: "شحنات اليوم", v: "٨", icon: Truck },
  ];
  return (
    <div className="grid gap-5">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <Panel key={s.l} className="p-4">
            <s.icon className="size-5 text-primary" />
            <p className="mt-3 font-display text-3xl font-bold">{s.v}</p>
            <p className="text-xs text-muted-foreground">{s.l}</p>
          </Panel>
        ))}
      </div>
      <Panel className="p-5">
        <p className="flex items-center gap-2 font-display text-lg"><ShieldCheck className="size-5 text-primary" /> صلاحيات دور «{ROLE_LABEL[role]}»</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {ROLE_SECTIONS[role].map((s) => <Badge key={s} variant="primary">{SECTION_LABEL[s]}</Badge>)}
        </div>
      </Panel>
    </div>
  );
}

const DEALS = [
  { id: "D-301", l: sampleListing(0), buyer: "م-٤٤١٧", stage: "بانتظار الضمان", v: "warning" as const },
  { id: "D-298", l: sampleListing(1), buyer: "م-١٢٠٣", stage: "تفاوض", v: "accent" as const },
  { id: "D-295", l: sampleListing(5), buyer: "م-٣٣٨٠", stage: "قيد النقل", v: "primary" as const },
  { id: "D-290", l: sampleListing(6), buyer: "م-٠٧٧٢", stage: "مكتملة", v: "success" as const },
];

function Deals() {
  return (
    <Table
      head={["الصفقة", "الإعلان", "البائع", "المشتري", "القيمة", "المرحلة"]}
      rows={DEALS.map((d) => [d.id, d.l.title, d.l.sellerCode, d.buyer, formatIQD(d.l.pricePerHead * d.l.count), <Badge variant={d.v}>{d.stage}</Badge>])}
    />
  );
}

function ListingsReview() {
  return (
    <div className="grid gap-3">
      {LISTINGS.filter((l) => !l.verified || !l.vetCertificate).slice(0, 3).map((l) => (
        <Panel key={l.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
          <img src={l.image} alt="" loading="lazy" width={1024} height={768} className="h-16 w-24 rounded-lg object-cover" />
          <div className="flex-1">
            <p className="font-semibold">{l.title} <span className="text-xs text-muted-foreground">· {l.id}</span></p>
            <p className="text-xs text-muted-foreground">{l.governorate} — {l.district} · {formatIQD(l.pricePerHead)}</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm">قبول ونشر</Button>
            <Button size="sm" variant="outline">طلب تعديل</Button>
          </div>
        </Panel>
      ))}
    </div>
  );
}

function Verification() {
  const rows = [
    ["م-٤٤١٧", "مشترٍ", "بغداد — الكرخ", "بطاقة وطنية", "منذ ساعة"],
    ["ب-٦٠١٢", "بائع", "ميسان — العمارة", "بطاقة وطنية", "منذ ٣ ساعات"],
    ["ب-٦٠١٥", "بائع", "كربلاء — عين التمر", "بطاقة + حيازة", "أمس"],
  ];
  return (
    <Table
      head={["الحساب", "النوع", "الموقع", "الوثائق", "تاريخ الطلب", ""]}
      rows={rows.map((r) => [...r, <div className="flex gap-2"><Button size="sm">توثيق</Button><Button size="sm" variant="outline">رفض</Button></div>])}
    />
  );
}

function Complaints() {
  const rows = [
    ["C-41", "D-295", "المشتري", "تأخر موعد النقل", <Badge variant="warning">قيد المعالجة</Badge>],
    ["C-40", "D-287", "البائع", "انسحاب المشتري بعد القبول", <Badge variant="danger">مصعّدة للإدارة</Badge>],
    ["C-38", "D-280", "المشتري", "اختلاف الوزن عن الإعلان", <Badge variant="success">محلولة</Badge>],
  ];
  return <Table head={["الشكوى", "الصفقة", "مقدّمها", "الموضوع", "الحالة"]} rows={rows} />;
}

function Logistics() {
  const rows = [
    ["D-295", "نينوى — الحمدانية", "أربيل — شقلاوة", "شاحنة ٢ — سائق ٠٧", <Badge variant="primary">في الطريق</Badge>],
    ["D-293", "الأنبار — الرمادي", "بغداد — أبو غريب", "شاحنة ٥", <Badge variant="warning">موعد التحميل غداً</Badge>],
    ["D-290", "السليمانية — جمجمال", "كركوك — كركوك", "شاحنة ١", <Badge variant="success">تم التسليم</Badge>],
  ];
  return <Table head={["الصفقة", "من", "إلى", "الناقل", "الحالة"]} rows={rows} />;
}

function Guarantees() {
  return (
    <Table
      head={["الصفقة", "قيمة الصفقة", "الضمان ٢٫٥٪", "الحالة"]}
      rows={DEALS.map((d) => {
        const total = d.l.pricePerHead * d.l.count;
        return [d.id, formatIQD(total), formatIQD(guaranteeAmount(d.l.pricePerHead, d.l.count)), <Badge variant={d.stage === "مكتملة" ? "success" : "accent"}>{d.stage === "مكتملة" ? "خُصم من الثمن" : "محجوز"}</Badge>];
      })}
    />
  );
}

function UsersSection() {
  const rows = [
    ["م-٤٤١٧", "مشترٍ", "بغداد", <Badge variant="warning">قيد التوثيق</Badge>, formatNum(4)],
    ["ب-٢٧١٤", "بائع", "الأنبار", <Badge variant="success">موثّق</Badge>, formatNum(12)],
    ["ب-٠٩٣٢", "بائع", "ذي قار", <Badge variant="success">موثّق</Badge>, formatNum(7)],
    ["م-٠٧٧٢", "مشترٍ", "كركوك", <Badge variant="danger">موقوف</Badge>, formatNum(1)],
  ];
  return <Table head={["الرمز", "النوع", "المحافظة", "الحالة", "الصفقات"]} rows={rows} />;
}

function Staff() {
  const team = [
    { n: "المدير الأعلى", r: "super_admin" as StaffRole },
    { n: "مدير العمليات", r: "admin" as StaffRole },
    { n: "موظف توثيق — بغداد", r: "staff" as StaffRole },
    { n: "موظف نقل — البصرة", r: "staff" as StaffRole },
  ];
  return (
    <div className="grid gap-5">
      <Table head={["الاسم", "الدور", "عدد الأقسام المتاحة"]} rows={team.map((t) => [t.n, <Badge variant={t.r === "super_admin" ? "accent" : t.r === "admin" ? "primary" : "secondary"}>{ROLE_LABEL[t.r]}</Badge>, formatNum(ROLE_SECTIONS[t.r].length)])} />
      <Panel className="p-5">
        <p className="flex items-center gap-2 font-display text-lg"><ClipboardList className="size-5 text-primary" /> مصفوفة الصلاحيات</p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[480px] text-sm">
            <thead><tr className="text-xs text-muted-foreground"><th className="py-2 text-right">القسم</th>{(Object.keys(ROLE_LABEL) as StaffRole[]).map((r) => <th key={r} className="py-2">{ROLE_LABEL[r]}</th>)}</tr></thead>
            <tbody>
              {(Object.keys(SECTION_LABEL) as AdminSection[]).map((s) => (
                <tr key={s} className="border-t border-border">
                  <td className="py-2">{SECTION_LABEL[s]}</td>
                  {(Object.keys(ROLE_LABEL) as StaffRole[]).map((r) => (
                    <td key={r} className="py-2 text-center">{canAccess(r, s) ? <span className="text-success">✔</span> : <span className="text-muted-foreground">—</span>}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Button className="mt-4" size="sm"><UserCog /> إضافة عضو للطاقم</Button>
      </Panel>
    </div>
  );
}

function SettingsSection() {
  const items = [
    { t: "إخفاء هوية الأطراف حتى إتمام الصفقة", on: true },
    { t: "إلزام التوثيق قبل تقديم العروض", on: true },
    { t: "إلزام شهادة الفحص البيطري للأبقار والإبل", on: false },
    { t: "استقبال تسجيلات جديدة", on: true },
  ];
  return (
    <Panel className="grid gap-1 p-2">
      <div className="flex items-center justify-between rounded-xl p-3">
        <span>نسبة ضمان الجدية</span><Badge variant="accent">٢٫٥٪</Badge>
      </div>
      {items.map((i) => (
        <label key={i.t} className="flex items-center justify-between gap-4 rounded-xl p-3 hover:bg-muted">
          <span className="text-sm">{i.t}</span><Switch defaultChecked={i.on} />
        </label>
      ))}
    </Panel>
  );
}
