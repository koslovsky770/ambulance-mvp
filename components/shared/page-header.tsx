import Link from "next/link";

export function PageHeader({ title, actionHref, actionLabel }: {
  title: string; actionHref?: string; actionLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
      {actionHref && actionLabel && (
        <Link href={actionHref} className="btn btn-primary">{actionLabel}</Link>
      )}
    </div>
  );
}
