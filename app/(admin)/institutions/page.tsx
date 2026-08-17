import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/shared/page-header";
import { DeleteButton } from "@/components/shared/delete-form";
import { deleteEntity } from "@/lib/entities";

export default async function InstitutionsPage() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.from("institutions").select("*").order("name");
  const rows = data ?? [];
  return (
    <div>
      <PageHeader title="מוסדות" actionHref="/institutions/new" actionLabel="+ מוסד חדש" />
      {rows.length === 0 ? (
        <div className="card text-center text-slate-500">אין מוסדות</div>
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="table">
            <thead><tr><th>שם</th><th>כתובת</th><th>טלפון</th><th>הערות</th><th></th></tr></thead>
            <tbody>
              {rows.map((r: any) => (
                <tr key={r.id}>
                  <td>{r.name}</td>
                  <td>{r.address ?? "—"}</td>
                  <td>{r.phone ?? "—"}</td>
                  <td>{r.notes ?? "—"}</td>
                  <td className="flex gap-3 justify-end">
                    <Link href={`/institutions/${r.id}/edit`} className="text-sm hover:underline">עריכה</Link>
                    <DeleteButton action={async () => { "use server"; await deleteEntity("institutions", r.id); }} />
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
