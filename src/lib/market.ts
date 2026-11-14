import sheep from "@/assets/sheep.jpg";
import cattle from "@/assets/cattle.jpg";
import goats from "@/assets/goats.jpg";
import camel from "@/assets/camel.jpg";

/** نسبة ضمان الجدية التي يدفعها المشتري عند قبول العرض */
export const GUARANTEE_RATE = 0.025;

export function guaranteeAmount(pricePerHead: number, count: number): number {
  return Math.round(pricePerHead * count * GUARANTEE_RATE);
}

export function formatIQD(n: number): string {
  return `${new Intl.NumberFormat("ar-IQ").format(n)} د.ع`;
}

export function formatNum(n: number): string {
  return new Intl.NumberFormat("ar-IQ").format(n);
}

export type AnimalType = "أغنام" | "ماعز" | "أبقار" | "إبل";
export const ANIMAL_TYPES: AnimalType[] = ["أغنام", "ماعز", "أبقار", "إبل"];
export const TYPE_IMAGE: Record<AnimalType, string> = {
  أغنام: sheep,
  ماعز: goats,
  أبقار: cattle,
  إبل: camel,
};

export type Listing = {
  id: string;
  type: AnimalType;
  breed: string;
  title: string;
  count: number;
  avgWeight: number;
  age: string;
  sex: string;
  pricePerHead: number;
  governorate: string;
  district: string;
  sellerCode: string;
  verified: boolean;
  vetCertificate: boolean;
  posted: string;
  offers: number;
  image: string;
  notes: string;
};

export const LISTINGS: Listing[] = [
  { id: "L-1042", type: "أغنام", breed: "عواسي", title: "خراف عواسي للتسمين", count: 40, avgWeight: 48, age: "٨–١٠ أشهر", sex: "ذكور", pricePerHead: 425000, governorate: "الأنبار", district: "الرمادي", sellerCode: "ع-٢٧١٤", verified: true, vetCertificate: true, posted: "منذ ساعتين", offers: 6, image: sheep, notes: "مرباة على الشعير والجت، ملقحة بالكامل." },
  { id: "L-1043", type: "أبقار", breed: "جنوبي محلي", title: "عجول جنوبية بوزن ممتاز", count: 6, avgWeight: 310, age: "١٤ شهراً", sex: "ذكور", pricePerHead: 3150000, governorate: "ذي قار", district: "الشطرة", sellerCode: "ع-٠٩٣٢", verified: true, vetCertificate: true, posted: "منذ ٥ ساعات", offers: 3, image: cattle, notes: "جاهزة للذبح أو التسمين، فحص بيطري حديث." },
  { id: "L-1044", type: "ماعز", breed: "شامي", title: "ماعز شامي حلوب", count: 12, avgWeight: 52, age: "٢–٣ سنوات", sex: "إناث", pricePerHead: 690000, governorate: "بابل", district: "المسيب", sellerCode: "ع-١١٥٨", verified: true, vetCertificate: false, posted: "أمس", offers: 9, image: goats, notes: "إنتاج حليب جيد، بعضها عشار." },
  { id: "L-1045", type: "إبل", breed: "عربية", title: "ناقة عربية أصيلة", count: 2, avgWeight: 450, age: "٥ سنوات", sex: "إناث", pricePerHead: 7800000, governorate: "المثنى", district: "السلمان", sellerCode: "ع-٣٣٠٢", verified: true, vetCertificate: true, posted: "منذ يومين", offers: 2, image: camel, notes: "صحة ممتازة، معتادة على المراعي الصحراوية." },
  { id: "L-1046", type: "أغنام", breed: "عرابي", title: "نعاج عرابي مع حملانها", count: 25, avgWeight: 55, age: "٢–٤ سنوات", sex: "إناث", pricePerHead: 510000, governorate: "البصرة", district: "الزبير", sellerCode: "ع-٢٠٨٨", verified: false, vetCertificate: false, posted: "منذ ٣ أيام", offers: 4, image: sheep, notes: "قطيع منزلي، مناسبة للتربية." },
  { id: "L-1047", type: "أبقار", breed: "هولشتاين مهجن", title: "أبقار حلوب مهجنة", count: 4, avgWeight: 420, age: "٣ سنوات", sex: "إناث", pricePerHead: 4600000, governorate: "نينوى", district: "الحمدانية", sellerCode: "ع-٤٠١٩", verified: true, vetCertificate: true, posted: "منذ ٣ أيام", offers: 5, image: cattle, notes: "إنتاج يومي ١٨–٢٢ لتر." },
  { id: "L-1048", type: "أغنام", breed: "كرادي", title: "خراف كرادي للأضاحي", count: 60, avgWeight: 45, age: "سنة", sex: "ذكور", pricePerHead: 460000, governorate: "السليمانية", district: "جمجمال", sellerCode: "ع-٥٥٢١", verified: true, vetCertificate: true, posted: "منذ ٤ أيام", offers: 11, image: sheep, notes: "مناسبة لموسم الأضاحي، أوزان متقاربة." },
  { id: "L-1049", type: "ماعز", breed: "محلي أسود", title: "جداء محلية", count: 18, avgWeight: 30, age: "٦ أشهر", sex: "مختلط", pricePerHead: 280000, governorate: "واسط", district: "الحي", sellerCode: "ع-٢٩٤٠", verified: false, vetCertificate: false, posted: "منذ أسبوع", offers: 1, image: goats, notes: "تربية حرة، بحالة جيدة." },
];

export function getListing(id: string): Listing | undefined {
  return LISTINGS.find((l) => l.id === id);
}

/** للبيانات التجريبية: إعلان معروف مسبقاً */
export function sampleListing(index: number): Listing {
  const l = LISTINGS[index];
  if (!l) throw new Error(`sample listing ${index} missing`);
  return l;
}

/* ---------- صلاحيات الإدارة ---------- */

export type StaffRole = "super_admin" | "admin" | "staff";

export const ROLE_LABEL: Record<StaffRole, string> = {
  super_admin: "المدير الأعلى",
  admin: "مدير",
  staff: "موظف",
};

export type AdminSection =
  | "overview"
  | "reports"
  | "deals"
  | "listings"
  | "verification"
  | "complaints"
  | "logistics"
  | "guarantees"
  | "users"
  | "fraud"
  | "reviews"
  | "staff"
  | "audit"
  | "settings";

export const SECTION_LABEL: Record<AdminSection, string> = {
  overview: "نظرة عامة",
  reports: "التقارير والمؤشرات",
  deals: "الصفقات",
  listings: "مراجعة الإعلانات",
  verification: "توثيق الحسابات",
  complaints: "الشكاوى",
  logistics: "النقل والتسليم",
  guarantees: "ضمانات الجدية",
  users: "المستخدمون",
  fraud: "كشف الحسابات الوهمية",
  reviews: "التقييمات والموثوقية",
  staff: "الطاقم والصلاحيات",
  audit: "سجل النشاط",
  settings: "إعدادات المنصة",
};

const ALL_SECTIONS = Object.keys(SECTION_LABEL) as AdminSection[];

export const ROLE_SECTIONS: Record<StaffRole, AdminSection[]> = {
  super_admin: ALL_SECTIONS,
  admin: ["overview", "reports", "deals", "listings", "verification", "complaints", "logistics", "guarantees", "users", "fraud", "reviews"],
  staff: ["overview", "listings", "verification", "complaints", "logistics", "reviews"],
};

export function canAccess(role: StaffRole, section: AdminSection): boolean {
  return ROLE_SECTIONS[role].includes(section);
}


/* ---------- السلة ---------- */

/** مجموع قيمة السلة وضمان الجدية المتوقّع (يُحسب لكل إعلان على حدة) */
export function cartSummary(items: { pricePerHead: number; count: number }[]): { total: number; guarantee: number } {
  return items.reduce(
    (acc, i) => ({ total: acc.total + i.pricePerHead * i.count, guarantee: acc.guarantee + guaranteeAmount(i.pricePerHead, i.count) }),
    { total: 0, guarantee: 0 },
  );
}

/* ---------- الصفقات والتقييم ---------- */

export type DealStatus = "negotiating" | "awaiting_guarantee" | "in_transit" | "delivered" | "cancelled";

export const DEAL_STATUS_LABEL: Record<DealStatus, string> = {
  negotiating: "تفاوض",
  awaiting_guarantee: "بانتظار الضمان",
  in_transit: "قيد النقل",
  delivered: "مكتملة — تم الاستلام",
  cancelled: "ملغاة",
};

/** يقيّم المشتري البائع فقط بعد صفقة مكتملة (تم الاستلام)، ومرة واحدة لكل صفقة */
export function canRateSeller(deal: { status: DealStatus; buyerCode: string; rated: boolean }, viewerCode: string): boolean {
  return deal.status === "delivered" && deal.buyerCode === viewerCode && !deal.rated;
}

/* ---------- نقاط الموثوقية ---------- */

export type TrustInput = {
  verified: boolean;
  completedDeals: number;
  /** جودة التعامل من ٠ إلى ١: للبائع من التقييمات، وللمشتري من دفع الضمان في موعده */
  quality: number;
  complaintsUpheld: number;
  /** انسحاب أو إلغاء بعد قبول العرض */
  cancellations: number;
};

export const TRUST_WEIGHTS = {
  verified: 40,
  unverified: 10,
  perDeal: 3,
  dealsMax: 30,
  qualityMax: 30,
  perComplaint: 10,
  perCancellation: 15,
} as const;

export function trustScore(i: TrustInput): number {
  const w = TRUST_WEIGHTS;
  const q = Math.min(Math.max(i.quality, 0), 1);
  const s =
    (i.verified ? w.verified : w.unverified) +
    Math.min(i.completedDeals * w.perDeal, w.dealsMax) +
    Math.round(q * w.qualityMax) -
    i.complaintsUpheld * w.perComplaint -
    i.cancellations * w.perCancellation;
  return Math.min(Math.max(s, 0), 100);
}

/** جودة البائع من متوسط النجوم (١ ← ٠، ٥ ← ١). بلا تقييمات = ٠ */
export function sellerQuality(stars: number[]): number {
  if (!stars.length) return 0;
  const avg = stars.reduce((a, b) => a + b, 0) / stars.length;
  return (avg - 1) / 4;
}

/** جودة المشتري: نسبة الصفقات التي دفع ضمانها في موعده */
export function buyerQuality(paidOnTime: number, totalDeals: number): number {
  return totalDeals > 0 ? paidOnTime / totalDeals : 0;
}

export function trustLevel(score: number): { label: string; variant: "success" | "primary" | "warning" | "danger" } {
  if (score >= 80) return { label: "موثوقية ممتازة", variant: "success" };
  if (score >= 60) return { label: "موثوقية جيدة", variant: "primary" };
  if (score >= 40) return { label: "موثوقية متوسطة", variant: "warning" };
  return { label: "موثوقية منخفضة", variant: "danger" };
}

export function averageStars(stars: number[]): number {
  return stars.length ? Math.round((stars.reduce((a, b) => a + b, 0) / stars.length) * 10) / 10 : 0;
}

/* ---------- منع التواصل المباشر ---------- */

const toLatinDigits = (t: string) =>
  t.replace(/[٠-٩]/g, (c) => String(c.charCodeAt(0) - 0x0660)).replace(/[۰-۹]/g, (c) => String(c.charCodeAt(0) - 0x06f0));

const CONTACT_WORDS = /(واتس|وتس|whats|تلي?[غگج]رام|telegram|فايبر|viber|انستا|instagram|سناب|snap|فيس ?بوك|facebook|تيك ?توك|tiktok|رقمي|رقم هاتفي|اتصل بي|كلمني)/i;

/** يكشف محاولة تبادل وسائل تواصل مباشرة. يعيد سبب المنع أو null */
export function detectContactInfo(text: string): string | null {
  const t = toLatinDigits(text);
  const digits = t.replace(/(\d)[\s\-.()]+(?=\d)/g, "$1");
  if (/(?:\+?964|00964|0)7\d{9}/.test(digits) || /\d{11,}/.test(digits)) return "رقم هاتف";
  if (/[^\s@]+@[^\s@]+\.[a-z]{2,}/i.test(t)) return "بريد إلكتروني";
  if (/(https?:\/\/|www\.|\.(com|net|org|iq|me)\b)/i.test(t)) return "رابط";
  if (CONTACT_WORDS.test(t)) return "وسيلة تواصل خارجية";
  return null;
}

/* ---------- البائعون (صفحة عامة بالرمز فقط) ---------- */

export type Review = { dealId: string; buyerCode: string; stars: number; text: string; date: string };

export type Seller = {
  id: string;
  code: string;
  governorate: string;
  memberSince: string;
  verified: boolean;
  completedDeals: number;
  complaintsUpheld: number;
  cancellations: number;
  followers: number;
  reviews: Review[];
};

const r = (dealId: string, buyerCode: string, stars: number, text: string, date: string): Review => ({ dealId, buyerCode, stars, text, date });

export const SELLERS: Seller[] = [
  { id: "S-2714", code: "ع-٢٧١٤", governorate: "الأنبار", memberSince: "٢٠٢٤", verified: true, completedDeals: 12, complaintsUpheld: 0, cancellations: 0, followers: 87, reviews: [r("D-251", "ع-١٢٠٣", 5, "الأوزان مطابقة تماماً والتسليم بموعده.", "قبل شهر"), r("D-233", "ع-٨٨١٠", 5, "خراف ممتازة ومعاملة راقية عبر الوسيط.", "قبل شهرين"), r("D-210", "ع-٥٠٢٧", 4, "جيدة، تأخر التحميل يوماً واحداً.", "قبل ٣ أشهر")] },
  { id: "S-0932", code: "ع-٠٩٣٢", governorate: "ذي قار", memberSince: "٢٠٢٤", verified: true, completedDeals: 7, complaintsUpheld: 0, cancellations: 0, followers: 41, reviews: [r("D-262", "ع-٣٣٨٠", 5, "عجول بحالة صحية ممتازة.", "قبل ٣ أسابيع"), r("D-240", "ع-٧٧١٢", 4, "سعر مناسب.", "قبل شهرين")] },
  { id: "S-1158", code: "ع-١١٥٨", governorate: "بابل", memberSince: "٢٠٢٥", verified: true, completedDeals: 5, complaintsUpheld: 1, cancellations: 0, followers: 23, reviews: [r("D-270", "ع-٦٦٠٤", 4, "الماعز حلوب كما وُصف.", "قبل أسبوعين"), r("D-244", "ع-٢١١٩", 3, "رأسان أقل وزناً من المذكور.", "قبل شهرين")] },
  { id: "S-3302", code: "ع-٣٣٠٢", governorate: "المثنى", memberSince: "٢٠٢٣", verified: true, completedDeals: 15, complaintsUpheld: 0, cancellations: 0, followers: 132, reviews: [r("D-281", "ع-٠٤٤٥", 5, "أفضل بائع إبل تعاملت معه.", "قبل أسبوع"), r("D-259", "ع-٩٩٢٠", 5, "صادق ودقيق.", "قبل شهر")] },
  { id: "S-2088", code: "ع-٢٠٨٨", governorate: "البصرة", memberSince: "٢٠٢٦", verified: false, completedDeals: 0, complaintsUpheld: 0, cancellations: 0, followers: 4, reviews: [] },
  { id: "S-4019", code: "ع-٤٠١٩", governorate: "نينوى", memberSince: "٢٠٢٥", verified: true, completedDeals: 9, complaintsUpheld: 0, cancellations: 1, followers: 58, reviews: [r("D-266", "ع-١٨٠٢", 5, "إنتاج الحليب كما ذُكر بالضبط.", "قبل ٣ أسابيع"), r("D-238", "ع-٤٤٠٩", 4, "جيد.", "قبل شهرين")] },
  { id: "S-5521", code: "ع-٥٥٢١", governorate: "السليمانية", memberSince: "٢٠٢٤", verified: true, completedDeals: 11, complaintsUpheld: 0, cancellations: 0, followers: 96, reviews: [r("D-290", "ع-٠٧٧٢", 5, "خراف أضاحي متقاربة الأوزان.", "قبل أسبوع"), r("D-249", "ع-٣١٠٠", 4, "جيدة جداً.", "قبل شهر")] },
  { id: "S-2940", code: "ع-٢٩٤٠", governorate: "واسط", memberSince: "٢٠٢٦", verified: false, completedDeals: 1, complaintsUpheld: 0, cancellations: 0, followers: 6, reviews: [r("D-275", "ع-٥٥٠٠", 4, "جداء بحالة جيدة.", "قبل أسبوعين")] },
];

export function getSeller(id: string): Seller | undefined {
  return SELLERS.find((s) => s.id === id);
}

export function sellerOf(listing: Listing): Seller | undefined {
  return SELLERS.find((s) => s.code === listing.sellerCode);
}

export function sellerTrust(s: Seller): number {
  return trustScore({
    verified: s.verified,
    completedDeals: s.completedDeals,
    quality: sellerQuality(s.reviews.map((x) => x.stars)),
    complaintsUpheld: s.complaintsUpheld,
    cancellations: s.cancellations,
  });
}

export function listingsBySeller(code: string): Listing[] {
  return LISTINGS.filter((l) => l.sellerCode === code);
}

/* ---------- التوثيق ومكافحة الحسابات الوهمية ---------- */

export const VERIFICATION_STEPS = [
  "تأكيد رقم الهاتف برمز يصل برسالة",
  "صورة البطاقة الوطنية الموحّدة (الوجهين)",
  "صورة شخصية (سيلفي) مع البطاقة للمطابقة",
  "مراجعة موظف التوثيق وتفعيل الحساب",
] as const;

/** البيع وتقديم العروض يتطلبان إكمال جميع خطوات التوثيق */
export function isFullyVerified(stepsDone: number): boolean {
  return stepsDone >= VERIFICATION_STEPS.length;
}
