import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/shared/page-header";
import { PatientForm } from "../../patient-form";
import { upsertEntity } from "@/lib/entities";

export default async function EditPatientPage({ params }: { params: { id: string } }) {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.from("patients").select("*").eq("id", params.id).maybeSingle();
  if (!data) notFound();
  const action = async (fd: FormData) => { "use server"; await upsertEntity("patients", params.id, fd); };
  return (
    <div className="max-w-xl">
      <PageHeader title="עריכת מטופל" />
      <div className="card"><PatientForm action={action} initial={data} /></div>
    </div>
  );
}
