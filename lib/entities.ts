"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type Table = "patients" | "vehicles" | "institutions" | "complaints";

const REDIRECT_MAP: Record<Table, string> = {
  patients: "/patients",
  vehicles: "/vehicles",
  institutions: "/institutions",
  complaints: "/complaints",
};

export async function upsertEntity(table: Table, id: string | null, formData: FormData) {
  const supabase = createSupabaseServerClient();
  const payload: Record<string, unknown> = {};
  for (const [k, v] of formData.entries()) {
    if (k === "id") continue;
    const val = String(v);
    if (val === "" && k !== "name" && k !== "vehicle_number") continue;
    payload[k] = k === "active" ? (val === "on" || val === "true") : val;
  }
  // Checkbox missing means false for `active`
  if ("active" in payload === false && (table === "vehicles" || table === "complaints")) {
    payload.active = false;
  }
  const q = id
    ? supabase.from(table).update(payload).eq("id", id)
    : supabase.from(table).insert(payload);
  const { error } = await q;
  if (error) throw new Error(error.message);
  revalidatePath(REDIRECT_MAP[table]);
  redirect(REDIRECT_MAP[table]);
}

export async function deleteEntity(table: Table, id: string) {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(REDIRECT_MAP[table]);
}
