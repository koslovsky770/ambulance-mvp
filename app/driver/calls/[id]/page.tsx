import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { STATUS_HE, getCallColor, COLOR_CLASS, COLOR_DOT, NEXT_STATUS, type CallStatus } from "@/lib/status";
import { transitionCall } from "@/lib/calls";

export default async function DriverCallDetail({ params }: { params: { id: string } }) {
  const supabase = createSupabaseServerClient();
  const { data: call } = await supabase.from("calls")
    .select(`id, status, scheduled_date, scheduled_time, notes,
             received_at, departed_at, arrived_at, completed_at,
             patient:patients(name, phone),
             institution:institutions(name, address, phone),
             complaint:complaints(name),
             vehicle:vehicles(vehicle_number)`)
    .eq("id", params.id).maybeSingle();
  if (!call) notFound();
  const c = call as any;
  const status = c.status as CallStatus;
  const color = getCallColor(status, c.scheduled_date);
  const next = NEXT_STATUS[status];

  const nextLabel: Partial<Record<CallStatus, string>> = {
    RECEIVED: "התקבלה",
    ON_THE_WAY: "יצאתי לדרך",
    ARRIVED: "הגעתי",
    COMPLETED: "סיום נסיעה",
  };

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="flex items-center justify-between">
          <span className={`pill border ${COLOR_CLASS[color]}`}>
            <span className={`h-2 w-2 rounded-full ${COLOR_DOT[color]}`} />
            {STATUS_HE[status]}
          </span>
          <span className="text-sm text-slate-500">
            {formatDate(c.scheduled_date)} {c.scheduled_time?.slice(0, 5) ?? ""}
          </span>
        </div>
        <h1 className="mt-3 text-xl font-bold text-slate-900">{c.patient?.name}</h1>
        {c.patient?.phone && (
          <a href={`tel:${c.patient.phone}`} className="text-sm text-slate-600 hover:underline" dir="ltr">
            {c.patient.phone}
          </a>
        )}
        <div className="mt-3 space-y-1 text-sm">
          <Row label="מוסד" value={c.institution?.name} />
          <Row label="כתובת" value={c.institution?.address} />
          <Row label="תלונה" value={c.complaint?.name} />
          <Row label="רכב" value={c.vehicle?.vehicle_number} />
        </div>
        {c.notes && (
          <div className="mt-3">
            <div className="label">הערות</div>
            <div className="text-sm text-slate-700 whitespace-pre-wrap">{c.notes}</div>
          </div>
        )}
      </div>

      {next && (
        <form action={async () => { "use server"; await transitionCall(params.id, next); }}>
          <button className="btn btn-primary btn-lg w-full">{nextLabel[next]}</button>
        </form>
      )}
      {status !== "COMPLETED" && status !== "CANCELLED" && status !== "OPEN" && (
        <form action={async () => { "use server"; await transitionCall(params.id, "CANCELLED"); }}>
          <button className="btn btn-secondary w-full">ביטול קריאה</button>
        </form>
      )}

      <div className="card">
        <div className="label mb-2">ציר זמן</div>
        <ul className="text-sm text-slate-700 space-y-1">
          <TimelineRow label="התקבלה" at={c.received_at} />
          <TimelineRow label="יצא לדרך" at={c.departed_at} />
          <TimelineRow label="הגיע" at={c.arrived_at} />
          <TimelineRow label="הסתיימה" at={c.completed_at} />
        </ul>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-slate-500">{label}</span>
      <span className="text-slate-900 text-left">{value ?? "—"}</span>
    </div>
  );
}
function TimelineRow({ label, at }: { label: string; at: string | null }) {
  return (
    <li className="flex justify-between">
      <span>{label}</span>
      <span className="text-slate-500">{at ? new Date(at).toLocaleString("he-IL") : "—"}</span>
    </li>
  );
}
function formatDate(d: string) {
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
}
