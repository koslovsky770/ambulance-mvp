import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/shared/page-header";
import { ReportFilters } from "./report-filters";
import { STATUS_HE, type CallStatus } from "@/lib/status";
import { ExportCsvButton } from "./export-csv";

export default async function ReportsPage({ searchParams }: {
  searchParams: {
    from?: string; to?: string; status?: string; driver?: string; institution?: string; patient?: string;
  };
}) {
  const supabase = createSupabaseServerClient();
  let query = supabase.from("calls").select(`
    id, status, scheduled_date, scheduled_time,
    received_at, departed_at, arrived_at, completed_at, cancelled_at,
    patient:patients(name), institution:institutions(name),
    complaint:complaints(name), driver:drivers(profile:profiles(name)),
    vehicle:vehicles(vehicle_number)
  `).order("scheduled_date", { ascending: false });

  if (searchParams.from) query = query.gte("scheduled_date", searchParams.from);
  if (searchParams.to) query = query.lte("scheduled_date", searchParams.to);
  if (searchParams.status) query = query.eq("status", searchParams.status as CallStatus);
  if (searchParams.driver) query = query.eq("driver_id", searchParams.driver);
  if (searchParams.institution) query = query.eq("institution_id", searchParams.institution);
  if (searchParams.patient) query = query.eq("patient_id", searchParams.patient);

  const { data: rows } = await query;

  const [{ data: drivers }, { data: institutions }, { data: patients }] = await Promise.all([
    supabase.from("drivers").select("id, profile:profiles(name)"),
    supabase.from("institutions").select("id, name").order("name"),
    supabase.from("patients").select("id, name").order("name"),
  ]);

  return (
    <div>
      <PageHeader title="דוחות" />
      <ReportFilters drivers={(drivers ?? []) as any} institutions={(institutions ?? []) as any} patients={(patients ?? []) as any} />
      <div className="flex justify-end my-3">
        <ExportCsvButton rows={rows ?? []} />
      </div>
      <div className="card overflow-x-auto p-0">
        <table className="table">
          <thead>
            <tr>
              <th>תאריך</th><th>שעה</th><th>מטופל</th><th>מוסד</th>
              <th>תלונה</th><th>נהג</th><th>רכב</th><th>סטטוס</th>
              <th>סיום</th>
            </tr>
          </thead>
          <tbody>
            {(rows ?? []).map((r: any) => (
              <tr key={r.id}>
                <td>{r.scheduled_date}</td>
                <td>{r.scheduled_time?.slice(0,5) ?? "—"}</td>
                <td>{r.patient?.name ?? "—"}</td>
                <td>{r.institution?.name ?? "—"}</td>
                <td>{r.complaint?.name ?? "—"}</td>
                <td>{r.driver?.profile?.name ?? "—"}</td>
                <td>{r.vehicle?.vehicle_number ?? "—"}</td>
                <td>{STATUS_HE[r.status as CallStatus]}</td>
                <td className="text-xs text-slate-500">
                  {r.completed_at ? new Date(r.completed_at).toLocaleString("he-IL") : "—"}
                </td>
              </tr>
            ))}
            {(!rows || rows.length === 0) && (
              <tr><td colSpan={9} className="text-center text-slate-500 py-6">אין תוצאות</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
