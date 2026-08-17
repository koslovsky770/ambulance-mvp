import Link from "next/link";

export function ComplaintForm({ action, initial }: {
  action: (fd: FormData) => Promise<void>;
  initial?: { name: string; code?: string | null; active?: boolean };
}) {
  return (
    <form action={action} className="space-y-3">
      <div><label className="label">שם *</label><input name="name" defaultValue={initial?.name ?? ""} required className="input" /></div>
      <div><label className="label">קוד</label><input name="code" defaultValue={initial?.code ?? ""} className="input" dir="ltr" /></div>
      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" name="active" defaultChecked={initial?.active ?? true} className="h-4 w-4" />
        פעיל
      </label>
      <div className="flex gap-2 justify-end">
        <Link href="/complaints" className="btn btn-secondary">ביטול</Link>
        <button type="submit" className="btn btn-primary">שמירה</button>
      </div>
    </form>
  );
}
