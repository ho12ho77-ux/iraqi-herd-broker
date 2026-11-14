import { GOVERNORATES, areasOf, districtsOf } from "@/lib/iraq";
import { Label } from "@/components/ui/label";

export type LocationValue = { governorate: string; district: string; area: string };

export function LocationSelect({ value, onChange, required }: { value: LocationValue; onChange: (v: LocationValue) => void; required?: boolean }) {
  const districts = districtsOf(value.governorate);
  const areas = areasOf(value.governorate, value.district);
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="grid gap-1.5">
        <Label htmlFor="gov">المحافظة</Label>
        <select id="gov" className="field" required={required} value={value.governorate} onChange={(e) => onChange({ governorate: e.target.value, district: "", area: "" })}>
          <option value="">اختر المحافظة</option>
          {GOVERNORATES.map((g) => <option key={g.name}>{g.name}</option>)}
        </select>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="district">القضاء</Label>
        <select id="district" className="field disabled:opacity-60" required={required} disabled={!value.governorate} value={value.district} onChange={(e) => onChange({ ...value, district: e.target.value, area: "" })}>
          <option value="">اختر القضاء</option>
          {districts.map((d) => <option key={d.name}>{d.name}</option>)}
        </select>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="area">المدينة / الناحية</Label>
        <select id="area" className="field disabled:opacity-60" required={required} disabled={!value.district} value={value.area} onChange={(e) => onChange({ ...value, area: e.target.value })}>
          <option value="">اختر المدينة</option>
          {areas.map((a) => <option key={a}>{a}</option>)}
        </select>
      </div>
    </div>
  );
}
