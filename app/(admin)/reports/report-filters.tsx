"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { STATUS_HE, type CallStatus } from "@/lib/status";

const STATUSES: CallStatus[] = ["OPEN","ASSIGNED","RECEIVED","ON_THE_WAY","ARRIVED","COMPLETED","CANCELLED"];

export function ReportFilters({ drivers, institutions, patients }: {
  drivers: { id: string; profile: { name: string } | null }[];
  institutions: { id: string; name: string }[];
  patients: { id: string; name: string }[];
}) {
  const router = useRouter();
  const sp = useSearchParams();
  const [v, setV] = useState({
    from: sp.get("from") ?? "",
    to: sp.get("to") ?? "",
    status: sp.get("status") ?? "",
    driver: sp.get("driver") ?? "",
    institution: sp.get("institution") ?? "",
    patient: sp.get("patient") ?? "",
  });

  function apply(e: React.FormEvent) {
    e.preventDefault();
    const p = new URLSearchParams();
    for (const [k, val] of Object.entries(v)) if (val) p.set(k, val);
    router.push(`/reports?${p.toString()}`);
  }
  function reset() {
    setV({ from: "", to: "", status: "", driver: "", institution: "", patient: "" });
    router.push("/reports");
  }
  return (
    <form onSubmit={apply} className="card grid grid-cols-2 md:grid-cols-6 gap-2">
      <input type="date" className="input" value={v.from} onChange={e => setV({ ...v, from: e.target.value })} />
      <input type="date" className="input" value={v.to} onChange={e => setV({ ...v, to: e.target.value })} />
      <select className="input" value={v.status} onChange={e => setV({ ...v, status: e.target.value })}>
        <option value="">כל הסטטוסים</option>
        {STATUSES.map(s => <option key={s} value={s}>{STATUS_HE[s]}</option>)}
      </select>
      <select className="input" value={v.driver} onChange={e => setV({ ...v, driver: e.target.value })}>
        <option value="">כל הנהגים</option>
        {drivers.map(d => <option key={d.id} value={d.id}>{d.profile?.name ?? "—"}</option>)}
      </select>
      <select className="input" value={v.institution} onChange={e => setV({ ...v, institution: e.target.value })}>
        <option value="">כל המוסדות</option>
        {institutions.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
      </select>
      <select className="input" value={v.patient} onChange={e => setV({ ...v, patient: e.target.value })}>
        <option value="">כל המטופלים</option>
        {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
      </select>
      <div className="col-span-2 md:col-span-6 flex gap-2 justify-end">
        <button type="button" onClick={reset} className="btn btn-secondary">איפוס</button>
        <button type="submit" className="btn btn-primary">סנן</button>
      </div>
    </form>
  );
}
