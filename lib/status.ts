export type CallStatus =
  | "OPEN" | "ASSIGNED" | "RECEIVED" | "ON_THE_WAY" | "ARRIVED" | "COMPLETED" | "CANCELLED";

export const STATUS_HE: Record<CallStatus, string> = {
  OPEN: "פתוחה",
  ASSIGNED: "שויכה",
  RECEIVED: "התקבלה",
  ON_THE_WAY: "בדרך",
  ARRIVED: "הגיע",
  COMPLETED: "הסתיימה",
  CANCELLED: "בוטלה",
};

export type CallColor = "open" | "today" | "completed" | "cancelled";

/** סעיף 6 באפיון — סטטוס גובר על תאריך. */
export function getCallColor(status: CallStatus, scheduledDate: string): CallColor {
  if (status === "CANCELLED") return "cancelled";
  if (status === "COMPLETED") return "completed";
  const today = new Date().toISOString().slice(0, 10);
  if (scheduledDate === today) return "today";
  return "open";
}

export const COLOR_CLASS: Record<CallColor, string> = {
  open: "bg-red-600 text-white border-red-700",
  today: "bg-orange-500 text-white border-orange-600",
  completed: "bg-green-600 text-white border-green-700",
  cancelled: "bg-slate-400 text-white border-slate-500",
};

export const COLOR_DOT: Record<CallColor, string> = {
  open: "bg-white ring-2 ring-white/60",
  today: "bg-white ring-2 ring-white/60",
  completed: "bg-white ring-2 ring-white/60",
  cancelled: "bg-white ring-2 ring-white/60",
};

/** Left-side row accent — a thick colored bar so you can scan the table at a glance. */
export const COLOR_ROW_BAR: Record<CallColor, string> = {
  open: "before:bg-red-600",
  today: "before:bg-orange-500",
  completed: "before:bg-green-600",
  cancelled: "before:bg-slate-400",
};

/** Soft row background tint, subtle enough not to fight with the pill. */
export const COLOR_ROW_TINT: Record<CallColor, string> = {
  open: "bg-red-50/40",
  today: "bg-orange-50/40",
  completed: "bg-green-50/40",
  cancelled: "bg-slate-50/60",
};

/** Legal transitions used to gate driver actions. */
export const NEXT_STATUS: Partial<Record<CallStatus, CallStatus>> = {
  ASSIGNED: "RECEIVED",
  RECEIVED: "ON_THE_WAY",
  ON_THE_WAY: "ARRIVED",
  ARRIVED: "COMPLETED",
};
