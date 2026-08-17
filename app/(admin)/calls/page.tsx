import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/shared/page-header";
import { CallList } from "@/components/calls/call-list";
import { CallFilters } from "./call-filters";
import type { CallStatus } from "@/lib/status";

export default async function CallsPage({ searchParams }: {
  searchParams: { q?: string; status?: string; driver?: string; institution?: string; from?: string; to?: string };
}) {
  const supabase = createSupabaseServerClient();

  let query = supabase.from("calls")
    .select("id,status,scheduled_date,scheduled_time,notes,patient:patients(id,name),institution:institutions(id,name),complaint:complaints(name),driver:drivers(id,profile:profiles(name)),vehicle:vehicles(vehicle_number)")
    .order("scheduled_date", { ascending: false })
    .order("scheduled_time", { ascending: false });

  if (searchParams.status) query = query.eq("status", searchParams.status as CallStatus);
  if (searchParams.driver) query = query.eq("driver_id", searchParams.driver);
  if (searchParams.institution) query = query.eq("institution_id", searchParams.institution);
  if (searchParams.from) query = query.gte("scheduled_date", searchParams.from);
  if (searchParams.to) query = query.lte("scheduled_date", searchParams.to);

  const { data } = await query;
  let calls = (data ?? []) as any[];

  if (searchParams.q) {
    const q = searchParams.q.toLowerCase();
    calls = calls.filter((c: any) =>
      c.patient?.name?.toLowerCase().includes(q) ||
      c.institution?.name?.toLowerCase().includes(q) ||
      c.driver?.profile?.name?.toLowerCase().includes(q));
  }

  const [{ data: drivers }, { data: institutions }] = await Promise.all([
    supabase.from("drivers").select("id, profile:profiles(name)").eq("active", true),
    supabase.from("institutions").select("id, name").order("name"),
  ]);

  return (
    <div>
      <PageHeader title="קריאות" actionHref="/calls/new" actionLabel="+ קריאה חדשה" />
      <CallFilters drivers={(drivers ?? []) as any} institutions={(institutions ?? []) as any} />
      <div className="mt-4">
        <CallList calls={calls as any} />
      </div>
    </div>
  );
}
