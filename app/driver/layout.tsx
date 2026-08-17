import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { LogoutButton } from "@/components/shared/logout-button";

export default async function DriverLayout({ children }: { children: React.ReactNode }) {
  const session = await requireRole("driver");
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div>
          <div className="text-base font-bold">
            <Link href="/driver">הקריאות שלי</Link>
          </div>
          <div className="text-xs text-slate-400">{session.profile.name}</div>
        </div>
        <LogoutButton />
      </header>
      <main className="p-4 max-w-2xl mx-auto pb-24">{children}</main>
    </div>
  );
}
