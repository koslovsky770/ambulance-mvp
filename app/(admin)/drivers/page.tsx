import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/shared/page-header";
import { toggleDriverActive } from "@/lib/drivers";

export default async function DriversPage() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.from("drivers")
    .select("id, phone, active, profile:profiles(name)")
    .order("created_at", { ascending: false });
  const rows = (data ?? []) as any[];
  return (
    <div>
      <PageHeader title="נהגים" actionHref="/drivers/new" actionLabel="+ נהג חדש" />
      {rows.length === 0 ? (
        <div className="card text-center text-slate-500">אין נהגים</div>
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="table">
            <thead><tr><th>שם</th><th>טלפון</th><th>סטטוס</th><th></th></tr></thead>
            <tbody>
              {rows.map(d => (
                <tr key={d.id}>
                  <td>{d.profile?.name ?? "—"}</td>
                  <td>{d.phone ?? "—"}</td>
                  <td>{d.active ? "פעיל" : "חסום"}</td>
                  <td className="flex gap-3 justify-end">
                    <form action={async () => { "use server"; await toggleDriverActive(d.id, !d.active); }}>
                      <button className="text-sm hover:underline">
                        {d.active ? "חסימה" : "הפעלה"}
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
