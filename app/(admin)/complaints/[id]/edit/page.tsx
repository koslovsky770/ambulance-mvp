import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/shared/page-header";
import { ComplaintForm } from "../../complaint-form";
import { upsertEntity } from "@/lib/entities";

export default async function EditComplaintPage({ params }: { params: { id: string } }) {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.from("complaints").select("*").eq("id", params.id).maybeSingle();
  if (!data) notFound();
  const action = async (fd: FormData) => { "use server"; await upsertEntity("complaints", params.id, fd); };
  return (
    <div className="max-w-xl">
      <PageHeader title="עריכת תלונה" />
      <div className="card"><ComplaintForm action={action} initial={data} /></div>
    </div>
  );
}
