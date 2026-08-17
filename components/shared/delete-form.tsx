"use client";

export function DeleteButton({ action, confirmText = "למחוק?" }: {
  action: () => Promise<void>; confirmText?: string;
}) {
  return (
    <form action={async () => { await action(); }}>
      <button
        type="submit"
        className="text-sm text-red-600 hover:underline"
        onClick={(e) => { if (!confirm(confirmText)) e.preventDefault(); }}
      >
        מחק
      </button>
    </form>
  );
}
