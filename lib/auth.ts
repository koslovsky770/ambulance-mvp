import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type Role = "admin" | "driver";

export async function getSessionUser() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, name, role, active")
    .eq("id", user.id)
    .maybeSingle();
  return profile ? { user, profile } : null;
}

export async function requireRole(role: Role) {
  const session = await getSessionUser();
  if (!session) redirect("/login");
  if (session.profile.role !== role) {
    redirect(session.profile.role === "driver" ? "/driver" : "/");
  }
  return session;
}
