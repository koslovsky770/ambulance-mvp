"use client";
import { STATUS_HE, type CallStatus } from "@/lib/status";

export function ExportCsvButton({ rows }: { rows: any[] }) {
  function download() {
    const headers = ["תאריך", "שעה", "מטופל", "מוסד", "תלונה", "נהג", "רכב", "סטטוס", "התקבלה", "יציאה", "הגעה", "סיום", "ביטול"];
    const csvRows = rows.map(r => [
      r.scheduled_date, r.scheduled_time?.slice(0, 5) ?? "",
      r.patient?.name ?? "", r.institution?.name ?? "",
      r.complaint?.name ?? "", r.driver?.profile?.name ?? "",
      r.vehicle?.vehicle_number ?? "",
      STATUS_HE[r.status as CallStatus] ?? r.status,
      r.received_at ?? "", r.departed_at ?? "", r.arrived_at ?? "",
      r.completed_at ?? "", r.cancelled_at ?? "",
    ]);
    const escape = (s: any) => {
      const v = String(s ?? "");
      return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
    };
    const csv = [headers, ...csvRows].map(r => r.map(escape).join(",")).join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `calls-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <button onClick={download} className="btn btn-secondary" disabled={rows.length === 0}>
      ייצוא CSV
    </button>
  );
}
