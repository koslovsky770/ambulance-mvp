import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCallColor, STATUS_HE, COLOR_CLASS, COLOR_DOT, type CallStatus } from "@/lib/status";

export default async function DriverHome() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("calls")
    .select("id,status,scheduled_date,scheduled_time,notes,patient:patients(name),institution:institutions(name),complaint:complaints(name)")
    .not("status", "in", "(COMPLETED,CANCELLED)")
    .order("scheduled_date", { ascending: true })
    .order("scheduled_time", { ascending: true });

  const calls = (data ?? []) as Array<{
    id: string; status: CallStatus; scheduled_date: string; scheduled_time: string | null;
    patient: { name: string } | null;
    institution: { name: string } | null;
    complaint: { name: string } | null;
  }>;

  if (calls.length === 0) {
    return <div className="card text-center text-slate-500 mt-8">אין קריאות פעילות</div>;
  }

  return (
    <div className="space-y-3">
      {calls.map(c => {
        const color = getCallColor(c.status, c.scheduled_date);
        return (
          <Link key={c.id} href={`/driver/calls/${c.id}`} className="card block active:bg-slate-100">
            <div className="flex items-center justify-between">
              <span className={`pill border ${COLOR_CLASS[color]}`}>
                <span className={`h-2 w-2 rounded-full ${COLOR_DOT[color]}`} />
                {STATUS_HE[c.status]}
              </span>
              <span className="text-sm text-slate-500">
                {c.scheduled_time?.slice(0, 5) ?? ""}
              </span>
            </div>
            <div className="mt-2 text-lg font-semibold text-slate-900">{c.patient?.name ?? "—"}</div>
            <div className="text-sm text-slate-600">{c.institution?.name ?? "—"}</div>
            <div className="text-xs text-slate-500 mt-1">{c.complaint?.name ?? "—"}</div>
          </Link>
        );
      })}
    </div>
  );
}
