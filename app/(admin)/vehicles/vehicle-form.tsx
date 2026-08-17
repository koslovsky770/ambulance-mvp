import Link from "next/link";

export function VehicleForm({ action, initial }: {
  action: (fd: FormData) => Promise<void>;
  initial?: { vehicle_number: string; name?: string | null; active?: boolean };
}) {
  return (
    <form action={action} className="space-y-3">
      <F label="מספר רכב *"><input name="vehicle_number" defaultValue={initial?.vehicle_number ?? ""} required className="input" dir="ltr" /></F>
      <F label="שם / תיאור"><input name="name" defaultValue={initial?.name ?? ""} className="input" /></F>
      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" name="active" defaultChecked={initial?.active ?? true} className="h-4 w-4" />
        פעיל
      </label>
      <div className="flex gap-2 justify-end">
        <Link href="/vehicles" className="btn btn-secondary">ביטול</Link>
        <button type="submit" className="btn btn-primary">שמירה</button>
      </div>
    </form>
  );
}
const F = ({ label, children }: { label: string; children: React.ReactNode }) =>
  <div><label className="label">{label}</label>{children}</div>;
