import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { createDriver } from "@/lib/drivers";

export default function NewDriverPage() {
  return (
    <div className="max-w-xl">
      <PageHeader title="נהג חדש" />
      <div className="card">
        <form action={createDriver} className="space-y-3">
          <F label="שם מלא *"><input name="name" required className="input" /></F>
          <F label="אימייל (שם משתמש) *"><input name="email" type="email" required className="input" dir="ltr" /></F>
          <F label="סיסמה *"><input name="password" type="password" required minLength={6} className="input" dir="ltr" /></F>
          <F label="טלפון"><input name="phone" className="input" dir="ltr" /></F>
          <div className="flex gap-2 justify-end">
            <Link href="/drivers" className="btn btn-secondary">ביטול</Link>
            <button type="submit" className="btn btn-primary">יצירה</button>
          </div>
        </form>
      </div>
      <p className="mt-3 text-xs text-slate-500">
        המערכת יוצרת משתמש התחברות + פרופיל + רשומת נהג בבת אחת.
      </p>
    </div>
  );
}
const F = ({ label, children }: { label: string; children: React.ReactNode }) =>
  <div><label className="label">{label}</label>{children}</div>;
