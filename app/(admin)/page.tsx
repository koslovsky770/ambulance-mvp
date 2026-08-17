import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CallList } from "@/components/calls/call-list";

export default async function DashboardPage() {
  const supabase = createSupabaseServerClient();
  const today = new Date().toISOString().slice(0, 10);

  const [{ count: openCount }, { count: todayCount }, { count: doneTodayCount }, { count: activeDrivers }, callsRes] =
    await Promise.all([
      supabase.from("calls").select("*", { count: "exact", head: true })
        .not("status", "in", "(COMPLETED,CANCELLED)"),
      supabase.from("calls").select("*", { count: "exact", head: true })
        .eq("scheduled_date", today),
      supabase.from("calls").select("*", { count: "exact", head: true })
        .eq("scheduled_date", today).eq("status", "COMPLETED"),
      supabase.from("drivers").select("*", { count: "exact", head: true }).eq("active", true),
      supabase.from("calls")
        .select("id,status,scheduled_date,scheduled_time,notes,patient:patients(name),institution:institutions(name),complaint:complaints(name),driver:drivers(profile:profiles(name)),vehicle:vehicles(vehicle_number)")
        .order("scheduled_date", { ascending: false })
        .order("scheduled_time", { ascending: false })
        .limit(50),
    ]);

  const kpis = [
    { label: "קריאות היום", value: todayCount ?? 0 },
    { label: "קריאות פתוחות", value: openCount ?? 0 },
    { label: "הסתיימו היום", value: doneTodayCount ?? 0 },
    { label: "נהגים פעילים", value: activeDrivers ?? 0 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">דשבורד</h1>
        <p className="text-sm text-slate-500">סקירה מהירה של פעילות היום</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpis.map(k => (
          <div key={k.label} className="card">
            <div className="text-3xl font-bold text-slate-900">{k.value}</div>
            <div className="mt-1 text-sm text-slate-500">{k.label}</div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-3">קריאות אחרונות</h2>
        <CallList calls={(callsRes.data ?? []) as any} />
      </div>
    </div>
  );
}
