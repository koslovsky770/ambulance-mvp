"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("אימייל או סיסמה שגויים");
      setLoading(false);
      return;
    }
    router.refresh();
    router.push("/");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="label" htmlFor="email">אימייל</label>
        <input id="email" type="email" className="input" required
          value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" dir="ltr" />
      </div>
      <div>
        <label className="label" htmlFor="password">סיסמה</label>
        <input id="password" type="password" className="input" required
          value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" dir="ltr" />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={loading} className="btn btn-primary w-full btn-lg">
        {loading ? "מתחבר..." : "התחברות"}
      </button>
    </form>
  );
}
