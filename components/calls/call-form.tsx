import Link from "next/link";

type Options = { id: string; name?: string; vehicle_number?: string; profile?: { name: string } | null }[];

export function CallForm({ action, initial, patients, institutions, complaints, drivers, vehicles }: {
  action: (fd: FormData) => Promise<void>;
  initial?: {
    patient_id?: string; institution_id?: string; complaint_id?: string;
    driver_id?: string | null; vehicle_id?: string | null;
    scheduled_date?: string; scheduled_time?: string | null; notes?: string | null;
  };
  patients: Options; institutions: Options; complaints: Options; drivers: Options; vehicles: Options;
}) {
  const today = new Date().toISOString().slice(0, 10);
  return (
    <form action={action} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-3">
        <Field label="מטופל *">
          <select name="patient_id" defaultValue={initial?.patient_id ?? ""} required className="input">
            <option value="" disabled>בחר מטופל</option>
            {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </Field>
        <Field label="מוסד *">
          <select name="institution_id" defaultValue={initial?.institution_id ?? ""} required className="input">
            <option value="" disabled>בחר מוסד</option>
            {institutions.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
          </select>
        </Field>
        <Field label="תלונה *">
          <select name="complaint_id" defaultValue={initial?.complaint_id ?? ""} required className="input">
            <option value="" disabled>בחר תלונה</option>
            {complaints.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Field>
        <Field label="נהג">
          <select name="driver_id" defaultValue={initial?.driver_id ?? ""} className="input">
            <option value="">ללא שיוך</option>
            {drivers.map(d => <option key={d.id} value={d.id}>{d.profile?.name ?? "—"}</option>)}
          </select>
        </Field>
        <Field label="רכב">
          <select name="vehicle_id" defaultValue={initial?.vehicle_id ?? ""} className="input">
            <option value="">ללא</option>
            {vehicles.map(v => <option key={v.id} value={v.id}>{v.vehicle_number}</option>)}
          </select>
        </Field>
        <Field label="תאריך *">
          <input type="date" name="scheduled_date" defaultValue={initial?.scheduled_date ?? today} required className="input" />
        </Field>
        <Field label="שעה">
          <input type="time" name="scheduled_time" defaultValue={initial?.scheduled_time ?? ""} className="input" />
        </Field>
      </div>
      <Field label="הערות">
        <textarea name="notes" defaultValue={initial?.notes ?? ""} className="input" rows={3} />
      </Field>
      <div className="flex gap-2 justify-end">
        <Link href="/calls" className="btn btn-secondary">ביטול</Link>
        <button type="submit" className="btn btn-primary">שמירה</button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
    </div>
  );
}
