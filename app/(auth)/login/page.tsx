import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <main className="min-h-screen grid place-items-center bg-slate-50 p-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 h-12 w-12 rounded-2xl bg-slate-900 text-white grid place-items-center text-2xl font-bold">א</div>
          <h1 className="text-2xl font-bold text-slate-900">מערכת אמבולנסים</h1>
          <p className="mt-1 text-sm text-slate-500">התחברות לחשבון</p>
        </div>
        <div className="card">
          <LoginForm />
        </div>
        <p className="mt-4 text-center text-xs text-slate-400">
          חשבון דמו: admin@demo.local · driver@demo.local · סיסמה: demo1234
        </p>
      </div>
    </main>
  );
}
