import Link from "next/link";
import { getCallColor, STATUS_HE, COLOR_CLASS, COLOR_DOT, COLOR_ROW_TINT, type CallStatus } from "@/lib/status";

type Row = {
  id: string;
  status: CallStatus;
  scheduled_date: string;
  scheduled_time: string | null;
  notes: string | null;
  patient: { name: string } | null;
  institution: { name: string } | null;
  complaint: { name: string } | null;
  driver: { profile: { name: string } | null } | null;
  vehicle: { vehicle_number: string } | null;
};

const BAR_BG: Record<string, string> = {
  open: "bg-red-600",
  today: "bg-orange-500",
  completed: "bg-green-600",
  cancelled: "bg-slate-400",
};

export function CallList({ calls }: { calls: Row[] }) {
  if (calls.length === 0) {
    return <div className="card text-center text-slate-500">אין קריאות להצגה</div>;
  }
  return (
    <>
      {/* Desktop table */}
      <div className="card overflow-x-auto p-0 hidden md:block">
        <table className="table">
          <thead>
            <tr>
              <th></th>
              <th>סטטוס</th>
              <th>מטופל</th>
              <th>מוסד</th>
              <th>תלונה</th>
              <th>נהג</th>
              <th>רכב</th>
              <th>תאריך</th>
              <th>שעה</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {calls.map(c => {
              const color = getCallColor(c.status, c.scheduled_date);
              return (
                <tr key={c.id} className={COLOR_ROW_TINT[color]}>
                  <td className="w-1 p-0">
                    <div className={`h-full w-1.5 ${BAR_BG[color]}`} style={{ minHeight: 40 }} />
                  </td>
                  <td>
                    <span className={`pill border ${COLOR_CLASS[color]}`}>
                      <span className={`h-2 w-2 rounded-full ${COLOR_DOT[color]}`} />
                      {STATUS_HE[c.status]}
                    </span>
                  </td>
                  <td className="font-medium text-slate-900">{c.patient?.name ?? "—"}</td>
                  <td>{c.institution?.name ?? "—"}</td>
                  <td>{c.complaint?.name ?? "—"}</td>
                  <td>{c.driver?.profile?.name ?? "—"}</td>
                  <td>{c.vehicle?.vehicle_number ?? "—"}</td>
                  <td>{formatDate(c.scheduled_date)}</td>
                  <td>{c.scheduled_time?.slice(0, 5) ?? "—"}</td>
                  <td>
                    <Link href={`/calls/${c.id}`} className="text-sm text-slate-700 hover:underline">
                      פרטים
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-2">
        {calls.map(c => {
          const color = getCallColor(c.status, c.scheduled_date);
          return (
            <Link href={`/calls/${c.id}`} key={c.id}
              className={`card block active:bg-slate-100 border-r-4 ${COLOR_ROW_TINT[color]}`}
              style={{ borderRightColor: barColorHex(color) }}>
              <div className="flex items-center justify-between">
                <span className={`pill border ${COLOR_CLASS[color]}`}>
                  <span className={`h-2 w-2 rounded-full ${COLOR_DOT[color]}`} />
                  {STATUS_HE[c.status]}
                </span>
                <span className="text-xs text-slate-500">
                  {formatDate(c.scheduled_date)} {c.scheduled_time?.slice(0, 5) ?? ""}
                </span>
              </div>
              <div className="mt-2 font-medium text-slate-900">{c.patient?.name ?? "—"}</div>
              <div className="text-sm text-slate-600">{c.institution?.name ?? "—"} · {c.complaint?.name ?? "—"}</div>
              <div className="mt-1 text-xs text-slate-500">
                נהג: {c.driver?.profile?.name ?? "—"} · רכב: {c.vehicle?.vehicle_number ?? "—"}
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}

function barColorHex(color: string) {
  return { open: "#dc2626", today: "#f97316", completed: "#16a34a", cancelled: "#94a3b8" }[color] ?? "#94a3b8";
}

function formatDate(d: string) {
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
}
