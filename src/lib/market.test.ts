import { describe, expect, it } from "vitest";
import { canAccess, canRateSeller, cartSummary, detectContactInfo, guaranteeAmount, ROLE_SECTIONS, sellerQuality, trustScore } from "./market";

describe("ضمان الجدية", () => {
  it("يساوي 2.5% من قيمة الصفقة", () => {
    expect(guaranteeAmount(1_000_000, 1)).toBe(25_000);
    expect(guaranteeAmount(425_000, 40)).toBe(425_000);
  });
});

describe("الصلاحيات", () => {
  it("المدير الأعلى يملك جميع الأقسام", () => {
    expect(canAccess("super_admin", "staff")).toBe(true);
    expect(canAccess("super_admin", "settings")).toBe(true);
  });
  it("المدير لا يدير الطاقم ولا الإعدادات", () => {
    expect(canAccess("admin", "staff")).toBe(false);
    expect(canAccess("admin", "settings")).toBe(false);
    expect(canAccess("admin", "deals")).toBe(true);
  });
  it("الموظف لا يرى الصفقات ولا الضمانات ولا المستخدمين", () => {
    expect(canAccess("staff", "deals")).toBe(false);
    expect(canAccess("staff", "guarantees")).toBe(false);
    expect(canAccess("staff", "users")).toBe(false);
    expect(ROLE_SECTIONS.staff).toContain("complaints");
  });
});

describe("صلاحيات الأقسام الجديدة", () => {
  it("سجل النشاط للمدير الأعلى فقط", () => {
    expect(canAccess("super_admin", "audit")).toBe(true);
    expect(canAccess("admin", "audit")).toBe(false);
    expect(canAccess("staff", "audit")).toBe(false);
  });
  it("المدير يرى التقارير وكشف الحسابات الوهمية، والموظف لا", () => {
    expect(canAccess("admin", "reports")).toBe(true);
    expect(canAccess("admin", "fraud")).toBe(true);
    expect(canAccess("staff", "reports")).toBe(false);
    expect(canAccess("staff", "fraud")).toBe(false);
  });
});

describe("السلة", () => {
  it("تجمع القيمة وضمان ٢٫٥٪ لكل إعلان", () => {
    expect(cartSummary([{ pricePerHead: 1_000_000, count: 2 }, { pricePerHead: 400_000, count: 5 }])).toEqual({ total: 4_000_000, guarantee: 100_000 });
  });
});

describe("تقييم البائع", () => {
  const deal = { status: "delivered" as const, buyerCode: "ع-٤٤١٧", rated: false };
  it("مسموح للمشتري بعد صفقة مكتملة فقط", () => {
    expect(canRateSeller(deal, "ع-٤٤١٧")).toBe(true);
    expect(canRateSeller({ ...deal, status: "in_transit" }, "ع-٤٤١٧")).toBe(false);
    expect(canRateSeller({ ...deal, status: "awaiting_guarantee" }, "ع-٤٤١٧")).toBe(false);
  });
  it("لا يقيّم غير المشتري ولا يقيّم مرتين", () => {
    expect(canRateSeller(deal, "ع-١٢٠٣")).toBe(false);
    expect(canRateSeller({ ...deal, rated: true }, "ع-٤٤١٧")).toBe(false);
  });
});

describe("نقاط الموثوقية", () => {
  const base = { verified: true, completedDeals: 10, quality: 1, complaintsUpheld: 0, cancellations: 0 };
  it("حساب موثّق بعشر صفقات وتقييم كامل = ١٠٠", () => {
    expect(trustScore(base)).toBe(100);
    expect(sellerQuality([5, 5])).toBe(1);
  });
  it("حساب جديد غير موثّق = ١٠", () => {
    expect(trustScore({ verified: false, completedDeals: 0, quality: 0, complaintsUpheld: 0, cancellations: 0 })).toBe(10);
  });
  it("الانسحاب بعد القبول يخصم ١٥ والشكوى المثبتة ١٠، ولا تنزل تحت الصفر", () => {
    expect(trustScore({ ...base, cancellations: 1 })).toBe(85);
    expect(trustScore({ ...base, complaintsUpheld: 1 })).toBe(90);
    expect(trustScore({ ...base, cancellations: 9 })).toBe(0);
  });
});

describe("منع التواصل المباشر", () => {
  it("يمنع أرقام الهواتف العراقية بالأرقام العربية أو اللاتينية", () => {
    expect(detectContactInfo("رقمي ٠٧٧٠ ١٢٣ ٤٥٦٧")).not.toBeNull();
    expect(detectContactInfo("+964 770 123 4567")).toBe("رقم هاتف");
  });
  it("يمنع البريد وروابط وتطبيقات المراسلة", () => {
    expect(detectContactInfo("ابعثلي على ali@mail.com")).toBe("بريد إلكتروني");
    expect(detectContactInfo("كلمني واتساب")).toBe("وسيلة تواصل خارجية");
  });
  it("يسمح بالأسعار والأعداد العادية", () => {
    expect(detectContactInfo("عرضي ٢٬٩٥٠٬٠٠٠ د.ع للرأس لـ ٦ عجول")).toBeNull();
    expect(detectContactInfo("السعر 2950000 للرأس")).toBeNull();
  });
});
