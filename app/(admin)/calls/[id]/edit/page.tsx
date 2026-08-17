import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CallForm } from "@/components/calls/call-form";
import { updateCall } from "@/lib/calls";
import { PageHeader } from "@/components/shared/page-header";

export default async function EditCallPage({ params }: { params: { id: string } }) {
  const supabase = createSupabaseServerClient();
  const [{ data: call }, { data: patients }, { data: institutions }, { data: complaints }, { data: drivers }, { data: vehicles }] =
    await Promise.all([
      supabase.from("calls")
        .select("id, patient_id, institution_id, complaint_id, driver_id, vehicle_id, scheduled_date, scheduled_time, notes")
        .eq("id", params.id).maybeSingle(),
      supabase.from("patients").select("id, name").order("name"),
      supabase.from("institutions").select("id, name").order("name"),
      supabase.from("complaints").select("id, name").eq("active", true).order("name"),
      supabase.from("drivers").select("id, profile:profiles(name)").eq("active", true),
      supabase.from("vehicles").select("id, vehicle_number").eq("active", true).order("vehicle_number"),
    ]);
  if (!call) notFound();

  const update = updateCall.bind(null, params.id);

  return (
    <div className="max-w-2xl">
      <PageHeader title="עריכת קריאה" />
      <div className="card">
        <CallForm
          action={update}
          initial={{
            ...call,
            scheduled_time: call.scheduled_time?.slice(0, 5) ?? null,
          }}
          patients={patients ?? []} institutions={institutions ?? []} complaints={complaints ?? []}
          drivers={(drivers ?? []) as any} vehicles={vehicles ?? []}
        />
      </div>
    </div>
  );
}
