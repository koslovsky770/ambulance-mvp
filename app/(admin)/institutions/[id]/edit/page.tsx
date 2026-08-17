import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/shared/page-header";
import { InstitutionForm } from "../../institution-form";
import { upsertEntity } from "@/lib/entities";

export default async function EditInstitutionPage({ params }: { params: { id: string } }) {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.from("institutions").select("*").eq("id", params.id).maybeSingle();
  if (!data) notFound();
  const action = async (fd: FormData) => { "use server"; await upsertEntity("institutions", params.id, fd); };
  return (
    <div className="max-w-xl">
      <PageHeader title="עריכת מוסד" />
      <div className="card"><InstitutionForm action={action} initial={data} /></div>
    </div>
  );
}
