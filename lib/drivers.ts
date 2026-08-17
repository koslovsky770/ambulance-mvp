"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";

/**
 * MVP-only: creates a Supabase auth user via signUp (email confirmation is
 * disabled by default on new Supabase projects). Then inserts profile + driver.
 * For production use the service-role admin API instead.
 */
export async function createDriver(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const phone = String(formData.get("phone") || "") || null;
  if (!name || !email || !password) throw new Error("שם, אימייל וסיסמה נדרשים");

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
  const { data: signup, error: signupErr } = await admin.auth.signUp({ email, password });
  if (signupErr) throw new Error("יצירת המשתמש נכשלה: " + signupErr.message);
  const userId = signup.user?.id;
  if (!userId) throw new Error("לא התקבל user id");

  const supabase = createSupabaseServerClient();
  const { error: profileErr } = await supabase.from("profiles")
    .insert({ id: userId, name, role: "driver", active: true });
  if (profileErr) throw new Error("יצירת profile נכשלה: " + profileErr.message);
  const { error: driverErr } = await supabase.from("drivers")
    .insert({ profile_id: userId, phone, active: true });
  if (driverErr) throw new Error("יצירת רשומת נהג נכשלה: " + driverErr.message);

  revalidatePath("/drivers");
  redirect("/drivers");
}

export async function toggleDriverActive(driverId: string, active: boolean) {
  const supabase = createSupabaseServerClient();
  await supabase.from("drivers").update({ active }).eq("id", driverId);
  const { data: d } = await supabase.from("drivers").select("profile_id").eq("id", driverId).single();
  if (d?.profile_id) {
    await supabase.from("profiles").update({ active }).eq("id", d.profile_id);
  }
  revalidatePath("/drivers");
}
