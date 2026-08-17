import Link from "next/link";

export function InstitutionForm({ action, initial }: {
  action: (fd: FormData) => Promise<void>;
  initial?: { name: string; address?: string | null; phone?: string | null; notes?: string | null };
}) {
  return (
    <form action={action} className="space-y-3">
      <F label="שם *"><input name="name" defaultValue={initial?.name ?? ""} required className="input" /></F>
      <F label="כתובת"><input name="address" defaultValue={initial?.address ?? ""} className="input" /></F>
      <F label="טלפון"><input name="phone" defaultValue={initial?.phone ?? ""} className="input" dir="ltr" /></F>
      <F label="הערות"><textarea name="notes" defaultValue={initial?.notes ?? ""} className="input" rows={3} /></F>
      <div className="flex gap-2 justify-end">
        <Link href="/institutions" className="btn btn-secondary">ביטול</Link>
        <button type="submit" className="btn btn-primary">שמירה</button>
      </div>
    </form>
  );
}
const F = ({ label, children }: { label: string; children: React.ReactNode }) =>
  <div><label className="label">{label}</label>{children}</div>;
