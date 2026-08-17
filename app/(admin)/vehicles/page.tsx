import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/shared/page-header";
import { DeleteButton } from "@/components/shared/delete-form";
import { deleteEntity } from "@/lib/entities";

export default async function VehiclesPage() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.from("vehicles").select("*").order("vehicle_number");
  const rows = data ?? [];
  return (
    <div>
      <PageHeader title="רכבים" actionHref="/vehicles/new" actionLabel="+ רכב חדש" />
      {rows.length === 0 ? (
        <div className="card text-center text-slate-500">אין רכבים</div>
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="table">
            <thead><tr><th>מספר רכב</th><th>שם</th><th>סטטוס</th><th></th></tr></thead>
            <tbody>
              {rows.map((r: any) => (
                <tr key={r.id}>
                  <td dir="ltr" className="text-right">{r.vehicle_number}</td>
                  <td>{r.name ?? "—"}</td>
                  <td>{r.active ? "פעיל" : "לא פעיל"}</td>
                  <td className="flex gap-3 justify-end">
                    <Link href={`/vehicles/${r.id}/edit`} className="text-sm hover:underline">עריכה</Link>
                    <DeleteButton action={async () => { "use server"; await deleteEntity("vehicles", r.id); }} />
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
