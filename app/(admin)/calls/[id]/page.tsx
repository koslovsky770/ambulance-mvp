import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/shared/page-header";
import { STATUS_HE, getCallColor, COLOR_CLASS, COLOR_DOT, type CallStatus } from "@/lib/status";
import { cancelCall, deleteCall } from "@/lib/calls";

export default async function CallDetailPage({ params }: { params: { id: string } }) {
  const supabase = createSupabaseServerClient();
  const { data: call } = await supabase.from("calls")
    .select(`id,status,scheduled_date,scheduled_time,notes,
             received_at,departed_at,arrived_at,completed_at,cancelled_at,created_at,
             patient:patients(id,name,identity_number,phone),
             institution:institutions(id,name,address,phone),
             complaint:complaints(id,name),
             driver:drivers(id, profile:profiles(name), phone),
             vehicle:vehicles(id,vehicle_number,name)`)
    .eq("id", params.id).maybeSingle();
  if (!call) notFound();
  const c = call as any;
  const color = getCallColor(c.status as CallStatus, c.scheduled_date);
  const active = !["COMPLETED", "CANCELLED"].includes(c.status);

  return (
    <div className="max-w-3xl">
      <PageHeader title="פרטי קריאה" />

      <div className="card space-y-4">
        <div className="flex items-center justify-between">
          <span className={`pill border ${COLOR_CLASS[color]}`}>
            <span className={`h-2 w-2 rounded-full ${COLOR_DOT[color]}`} />
            {STATUS_HE[c.status as CallStatus]}
          </span>
          <div className="text-sm text-slate-500">
            נוצרה {new Date(c.created_at).toLocaleString("he-IL")}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Info label="מטופל" value={c.patient?.name} sub={c.patient?.phone} />
          <Info label="מוסד" value={c.institution?.name} sub={c.institution?.address} />
          <Info label="תלונה" value={c.complaint?.name} />
          <Info label="נהג" value={c.driver?.profile?.name} sub={c.driver?.phone} />
          <Info label="רכב" value={c.vehicle?.vehicle_number} sub={c.vehicle?.name} />
          <Info label="תאריך ושעה" value={`${formatDate(c.scheduled_date)} ${c.scheduled_time?.slice(0,5) ?? ""}`} />
        </div>

        {c.notes && (
          <div>
            <div className="label">הערות</div>
            <div className="text-sm text-slate-700 whitespace-pre-wrap">{c.notes}</div>
          </div>
        )}

        <div className="border-t border-slate-100 pt-3">
          <div className="label">ציר זמן</div>
          <ul className="text-sm text-slate-700 space-y-1">
            <TimelineRow label="התקבלה" at={c.received_at} />
            <TimelineRow label="יצא לדרך" at={c.departed_at} />
            <TimelineRow label="הגיע" at={c.arrived_at} />
            <TimelineRow label="הסתיימה" at={c.completed_at} />
            <TimelineRow label="בוטלה" at={c.cancelled_at} />
          </ul>
        </div>
      </div>

      <div className="mt-4 flex gap-2 justify-end">
        {active && (
          <form action={async () => { "use server"; await cancelCall(params.id); }}>
            <button className="btn btn-secondary">ביטול קריאה</button>
          </form>
        )}
        <Link href={`/calls/${params.id}/edit`} className="btn btn-secondary">עריכה</Link>
        <form action={async () => { "use server"; await deleteCall(params.id); }}>
          <button className="btn btn-danger">מחיקה</button>
        </form>
      </div>
    </div>
  );
}

function Info({ label, value, sub }: { label: string; value?: string | null; sub?: string | null }) {
  return (
    <div>
      <div className="label">{label}</div>
      <div className="text-slate-900">{value ?? "—"}</div>
      {sub && <div className="text-xs text-slate-500">{sub}</div>}
    </div>
  );
}

function TimelineRow({ label, at }: { label: string; at: string | null }) {
  return (
    <li className="flex justify-between">
      <span>{label}</span>
      <span className="text-slate-500">
        {at ? new Date(at).toLocaleString("he-IL") : "—"}
      </span>
    </li>
  );
}

function formatDate(d: string) {
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
}
