import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/shared/page-header";
import { DeleteButton } from "@/components/shared/delete-form";
import { deleteEntity } from "@/lib/entities";

export default async function ComplaintsPage() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.from("complaints").select("*").order("name");
  const rows = data ?? [];
  return (
    <div>
      <PageHeader title="סוגי תלונות" actionHref="/complaints/new" actionLabel="+ תלונה חדשה" />
      {rows.length === 0 ? (
        <div className="card text-center text-slate-500">אין תלונות</div>
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="table">
            <thead><tr><th>שם</th><th>קוד</th><th>סטטוס</th><th></th></tr></thead>
            <tbody>
              {rows.map((r: any) => (
                <tr key={r.id}>
                  <td>{r.name}</td>
                  <td>{r.code ?? "—"}</td>
                  <td>{r.active ? "פעיל" : "לא פעיל"}</td>
                  <td className="flex gap-3 justify-end">
                    <Link href={`/complaints/${r.id}/edit`} className="text-sm hover:underline">עריכה</Link>
                    <DeleteButton action={async () => { "use server"; await deleteEntity("complaints", r.id); }} />
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
