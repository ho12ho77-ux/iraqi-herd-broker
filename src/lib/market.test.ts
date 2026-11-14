import { describe, expect, it } from "vitest";
import { canAccess, guaranteeAmount, ROLE_SECTIONS } from "./market";

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
