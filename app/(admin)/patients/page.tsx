import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/shared/page-header";
import { DeleteButton } from "@/components/shared/delete-form";
import { deleteEntity } from "@/lib/entities";

export default async function PatientsPage() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.from("patients").select("*").order("name");
  const rows = data ?? [];
  return (
    <div>
      <PageHeader title="מטופלים" actionHref="/patients/new" actionLabel="+ מטופל חדש" />
      {rows.length === 0 ? (
        <div className="card text-center text-slate-500">אין מטופלים</div>
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="table">
            <thead><tr><th>שם</th><th>ת.ז.</th><th>טלפון</th><th>הערות</th><th></th></tr></thead>
            <tbody>
              {rows.map((p: any) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.identity_number ?? "—"}</td>
                  <td>{p.phone ?? "—"}</td>
                  <td>{p.notes ?? "—"}</td>
                  <td className="flex gap-3 justify-end">
                    <Link href={`/patients/${p.id}/edit`} className="text-sm text-slate-700 hover:underline">עריכה</Link>
                    <DeleteButton action={async () => { "use server"; await deleteEntity("patients", p.id); }} />
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
