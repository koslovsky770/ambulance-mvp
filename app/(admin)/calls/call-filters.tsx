"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { STATUS_HE, type CallStatus } from "@/lib/status";

const STATUSES: CallStatus[] = ["OPEN","ASSIGNED","RECEIVED","ON_THE_WAY","ARRIVED","COMPLETED","CANCELLED"];

export function CallFilters({ drivers, institutions }: {
  drivers: { id: string; profile: { name: string } | null }[];
  institutions: { id: string; name: string }[];
}) {
  const router = useRouter();
  const sp = useSearchParams();
  const [values, setValues] = useState({
    q: sp.get("q") ?? "",
    status: sp.get("status") ?? "",
    driver: sp.get("driver") ?? "",
    institution: sp.get("institution") ?? "",
    from: sp.get("from") ?? "",
    to: sp.get("to") ?? "",
  });

  function apply(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(values)) if (v) params.set(k, v);
    router.push(`/calls?${params.toString()}`);
  }
  function reset() {
    setValues({ q: "", status: "", driver: "", institution: "", from: "", to: "" });
    router.push("/calls");
  }

  return (
    <form onSubmit={apply} className="card grid grid-cols-2 md:grid-cols-7 gap-2">
      <input className="input md:col-span-2" placeholder="חיפוש שם/מוסד/נהג"
        value={values.q} onChange={e => setValues({ ...values, q: e.target.value })} />
      <select className="input" value={values.status} onChange={e => setValues({ ...values, status: e.target.value })}>
        <option value="">כל הסטטוסים</option>
        {STATUSES.map(s => <option key={s} value={s}>{STATUS_HE[s]}</option>)}
      </select>
      <select className="input" value={values.driver} onChange={e => setValues({ ...values, driver: e.target.value })}>
        <option value="">כל הנהגים</option>
        {drivers.map(d => <option key={d.id} value={d.id}>{d.profile?.name ?? "—"}</option>)}
      </select>
      <select className="input" value={values.institution} onChange={e => setValues({ ...values, institution: e.target.value })}>
        <option value="">כל המוסדות</option>
        {institutions.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
      </select>
      <input type="date" className="input" value={values.from} onChange={e => setValues({ ...values, from: e.target.value })} />
      <input type="date" className="input" value={values.to} onChange={e => setValues({ ...values, to: e.target.value })} />
      <div className="col-span-2 md:col-span-7 flex gap-2 justify-end">
        <button type="button" onClick={reset} className="btn btn-secondary">איפוס</button>
        <button type="submit" className="btn btn-primary">סנן</button>
      </div>
    </form>
  );
}
