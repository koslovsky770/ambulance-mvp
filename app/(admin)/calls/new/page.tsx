import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CallForm } from "@/components/calls/call-form";
import { createCall } from "@/lib/calls";
import { PageHeader } from "@/components/shared/page-header";

export default async function NewCallPage() {
  const supabase = createSupabaseServerClient();
  const [{ data: patients }, { data: institutions }, { data: complaints }, { data: drivers }, { data: vehicles }] =
    await Promise.all([
      supabase.from("patients").select("id, name").order("name"),
      supabase.from("institutions").select("id, name").order("name"),
      supabase.from("complaints").select("id, name").eq("active", true).order("name"),
      supabase.from("drivers").select("id, profile:profiles(name)").eq("active", true),
      supabase.from("vehicles").select("id, vehicle_number").eq("active", true).order("vehicle_number"),
    ]);
  return (
    <div className="max-w-2xl">
      <PageHeader title="קריאה חדשה" />
      <div className="card">
        <CallForm
          action={createCall}
          patients={patients ?? []} institutions={institutions ?? []} complaints={complaints ?? []}
          drivers={(drivers ?? []) as any} vehicles={vehicles ?? []}
        />
      </div>
    </div>
  );
}
