import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/shared/page-header";
import { VehicleForm } from "../../vehicle-form";
import { upsertEntity } from "@/lib/entities";

export default async function EditVehiclePage({ params }: { params: { id: string } }) {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.from("vehicles").select("*").eq("id", params.id).maybeSingle();
  if (!data) notFound();
  const action = async (fd: FormData) => { "use server"; await upsertEntity("vehicles", params.id, fd); };
  return (
    <div className="max-w-xl">
      <PageHeader title="עריכת רכב" />
      <div className="card"><VehicleForm action={action} initial={data} /></div>
    </div>
  );
}
