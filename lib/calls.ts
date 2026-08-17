"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth";
import type { CallStatus } from "@/lib/status";

export async function createCall(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const patient_id = String(formData.get("patient_id"));
  const institution_id = String(formData.get("institution_id"));
  const complaint_id = String(formData.get("complaint_id"));
  const driver_id = String(formData.get("driver_id") || "") || null;
  const vehicle_id = String(formData.get("vehicle_id") || "") || null;
  const scheduled_date = String(formData.get("scheduled_date"));
  const scheduled_time = String(formData.get("scheduled_time") || "") || null;
  const notes = String(formData.get("notes") || "") || null;
  const status: CallStatus = driver_id ? "ASSIGNED" : "OPEN";

  const { data, error } = await supabase.from("calls")
    .insert({ patient_id, institution_id, complaint_id, driver_id, vehicle_id,
              scheduled_date, scheduled_time, notes, status })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/calls");
  redirect(`/calls/${data.id}`);
}

export async function updateCall(id: string, formData: FormData) {
  const supabase = createSupabaseServerClient();
  const patient_id = String(formData.get("patient_id"));
  const institution_id = String(formData.get("institution_id"));
  const complaint_id = String(formData.get("complaint_id"));
  const driver_id = String(formData.get("driver_id") || "") || null;
  const vehicle_id = String(formData.get("vehicle_id") || "") || null;
  const scheduled_date = String(formData.get("scheduled_date"));
  const scheduled_time = String(formData.get("scheduled_time") || "") || null;
  const notes = String(formData.get("notes") || "") || null;

  // Read current status to promote OPEN→ASSIGNED when a driver is now set.
  const { data: existing } = await supabase.from("calls").select("status,driver_id").eq("id", id).single();
  let status = existing?.status as CallStatus;
  if (status === "OPEN" && driver_id) status = "ASSIGNED";
  if (status === "ASSIGNED" && !driver_id) status = "OPEN";

  const { error } = await supabase.from("calls")
    .update({ patient_id, institution_id, complaint_id, driver_id, vehicle_id,
              scheduled_date, scheduled_time, notes, status })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/calls");
  revalidatePath(`/calls/${id}`);
  redirect(`/calls/${id}`);
}

export async function deleteCall(id: string) {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("calls").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/calls");
  redirect("/calls");
}

export async function cancelCall(id: string) {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("calls")
    .update({ status: "CANCELLED", cancelled_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/calls");
  revalidatePath(`/calls/${id}`);
}

/** Driver-facing transitions. Writes matching *_at timestamp automatically. */
export async function transitionCall(id: string, to: CallStatus) {
  const session = await getSessionUser();
  if (!session) throw new Error("Not authenticated");

  const supabase = createSupabaseServerClient();
  const patch: Record<string, unknown> = { status: to };
  const now = new Date().toISOString();
  if (to === "RECEIVED") patch.received_at = now;
  if (to === "ON_THE_WAY") patch.departed_at = now;
  if (to === "ARRIVED") patch.arrived_at = now;
  if (to === "COMPLETED") patch.completed_at = now;
  if (to === "CANCELLED") patch.cancelled_at = now;

  const { error } = await supabase.from("calls").update(patch).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/driver");
  revalidatePath(`/driver/calls/${id}`);
  revalidatePath("/");
  revalidatePath(`/calls/${id}`);
}
