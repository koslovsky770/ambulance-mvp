import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { LogoutButton } from "@/components/shared/logout-button";

const nav = [
  { href: "/", label: "דשבורד" },
  { href: "/calls", label: "קריאות" },
  { href: "/patients", label: "מטופלים" },
  { href: "/drivers", label: "נהגים" },
  { href: "/vehicles", label: "רכבים" },
  { href: "/institutions", label: "מוסדות" },
  { href: "/complaints", label: "סוגי תלונות" },
  { href: "/reports", label: "דוחות" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireRole("admin");

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <aside className="md:w-60 bg-slate-900 text-slate-100 md:min-h-screen">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-lg font-bold">אמבולנסים</div>
            <div className="text-xs text-slate-400">{session.profile.name}</div>
          </div>
          <LogoutButton />
        </div>
        <nav className="p-2 flex md:flex-col gap-1 overflow-x-auto">
          {nav.map(n => (
            <Link key={n.href} href={n.href}
              className="block whitespace-nowrap rounded-lg px-3 py-2 text-sm hover:bg-slate-800">
              {n.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-4 md:p-6">{children}</main>
    </div>
  );
}
