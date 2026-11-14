import { describe, expect, it } from "vitest";
import { GOVERNORATES, areasOf, districtsOf } from "./iraq";
import { LISTINGS } from "./market";

describe("المحافظات العراقية", () => {
  it("تضم ١٩ محافظة بلا تكرار", () => {
    expect(GOVERNORATES).toHaveLength(19);
    expect(new Set(GOVERNORATES.map((g) => g.name)).size).toBe(19);
  });
  it("كل قضاء فيه مدينة مركز على الأقل", () => {
    for (const g of GOVERNORATES) for (const d of g.districts) expect(areasOf(g.name, d.name)[0]).toBe(`مركز ${d.name}`);
  });
  it("مواقع الإعلانات موجودة في القائمة", () => {
    for (const l of LISTINGS) expect(districtsOf(l.governorate).map((d) => d.name)).toContain(l.district);
  });
});
