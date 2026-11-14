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
  { id: "L-1042", type: "أغنام", breed: "عواسي", title: "خراف عواسي للتسمين", count: 40, avgWeight: 48, age: "٨–١٠ أشهر", sex: "ذكور", pricePerHead: 425000, governorate: "الأنبار", district: "الرمادي", sellerCode: "ب-٢٧١٤", verified: true, vetCertificate: true, posted: "منذ ساعتين", offers: 6, image: sheep, notes: "مرباة على الشعير والجت، ملقحة بالكامل." },
  { id: "L-1043", type: "أبقار", breed: "جنوبي محلي", title: "عجول جنوبية بوزن ممتاز", count: 6, avgWeight: 310, age: "١٤ شهراً", sex: "ذكور", pricePerHead: 3150000, governorate: "ذي قار", district: "الشطرة", sellerCode: "ب-٠٩٣٢", verified: true, vetCertificate: true, posted: "منذ ٥ ساعات", offers: 3, image: cattle, notes: "جاهزة للذبح أو التسمين، فحص بيطري حديث." },
  { id: "L-1044", type: "ماعز", breed: "شامي", title: "ماعز شامي حلوب", count: 12, avgWeight: 52, age: "٢–٣ سنوات", sex: "إناث", pricePerHead: 690000, governorate: "بابل", district: "المسيب", sellerCode: "ب-١١٥٨", verified: true, vetCertificate: false, posted: "أمس", offers: 9, image: goats, notes: "إنتاج حليب جيد، بعضها عشار." },
  { id: "L-1045", type: "إبل", breed: "عربية", title: "ناقة عربية أصيلة", count: 2, avgWeight: 450, age: "٥ سنوات", sex: "إناث", pricePerHead: 7800000, governorate: "المثنى", district: "السلمان", sellerCode: "ب-٣٣٠٢", verified: true, vetCertificate: true, posted: "منذ يومين", offers: 2, image: camel, notes: "صحة ممتازة، معتادة على المراعي الصحراوية." },
  { id: "L-1046", type: "أغنام", breed: "عرابي", title: "نعاج عرابي مع حملانها", count: 25, avgWeight: 55, age: "٢–٤ سنوات", sex: "إناث", pricePerHead: 510000, governorate: "البصرة", district: "الزبير", sellerCode: "ب-٢٠٨٨", verified: false, vetCertificate: false, posted: "منذ ٣ أيام", offers: 4, image: sheep, notes: "قطيع منزلي، مناسبة للتربية." },
  { id: "L-1047", type: "أبقار", breed: "هولشتاين مهجن", title: "أبقار حلوب مهجنة", count: 4, avgWeight: 420, age: "٣ سنوات", sex: "إناث", pricePerHead: 4600000, governorate: "نينوى", district: "الحمدانية", sellerCode: "ب-٤٠١٩", verified: true, vetCertificate: true, posted: "منذ ٣ أيام", offers: 5, image: cattle, notes: "إنتاج يومي ١٨–٢٢ لتر." },
  { id: "L-1048", type: "أغنام", breed: "كرادي", title: "خراف كرادي للأضاحي", count: 60, avgWeight: 45, age: "سنة", sex: "ذكور", pricePerHead: 460000, governorate: "السليمانية", district: "جمجمال", sellerCode: "ب-٥٥٢١", verified: true, vetCertificate: true, posted: "منذ ٤ أيام", offers: 11, image: sheep, notes: "مناسبة لموسم الأضاحي، أوزان متقاربة." },
  { id: "L-1049", type: "ماعز", breed: "محلي أسود", title: "جداء محلية", count: 18, avgWeight: 30, age: "٦ أشهر", sex: "مختلط", pricePerHead: 280000, governorate: "واسط", district: "الحي", sellerCode: "ب-٢٩٤٠", verified: false, vetCertificate: false, posted: "منذ أسبوع", offers: 1, image: goats, notes: "تربية حرة، بحالة جيدة." },
];

export function getListing(id: string): Listing | undefined {
  return LISTINGS.find((l) => l.id === id);
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
  | "deals"
  | "listings"
  | "verification"
  | "complaints"
  | "logistics"
  | "guarantees"
  | "users"
  | "staff"
  | "settings";

export const SECTION_LABEL: Record<AdminSection, string> = {
  overview: "نظرة عامة",
  deals: "الصفقات",
  listings: "مراجعة الإعلانات",
  verification: "توثيق الحسابات",
  complaints: "الشكاوى",
  logistics: "النقل والتسليم",
  guarantees: "ضمانات الجدية",
  users: "المستخدمون",
  staff: "الطاقم والصلاحيات",
  settings: "إعدادات المنصة",
};

const ALL_SECTIONS = Object.keys(SECTION_LABEL) as AdminSection[];

export const ROLE_SECTIONS: Record<StaffRole, AdminSection[]> = {
  super_admin: ALL_SECTIONS,
  admin: ["overview", "deals", "listings", "verification", "complaints", "logistics", "guarantees", "users"],
  staff: ["overview", "listings", "verification", "complaints", "logistics"],
};

export function canAccess(role: StaffRole, section: AdminSection): boolean {
  return ROLE_SECTIONS[role].includes(section);
}
