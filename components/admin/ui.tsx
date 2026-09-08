import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/** Page header: title, one-line purpose, optional actions on the right. */
export function AdminPage({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-[90rem]">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-ink text-3xl md:text-4xl">{title}</h1>
          {description ? (
            <p className="text-stone mt-2 max-w-[64ch]">{description}</p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex flex-wrap items-center gap-2">{actions}</div>
        ) : null}
      </header>
      <div className="mt-8 space-y-8">{children}</div>
    </div>
  );
}

export function Panel({
  title,
  aside,
  children,
  className,
}: {
  title?: string;
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "bg-paper min-w-0 rounded-[var(--radius-lg)] border border-[color:var(--nh-border)]",
        className,
      )}
    >
      {title ? (
        <div className="flex items-center justify-between gap-4 border-b border-[color:var(--nh-border)] px-5 py-3">
          <h2 className="u-eyebrow text-ink">{title}</h2>
          {aside}
        </div>
      ) : null}
      <div className="p-5">{children}</div>
    </section>
  );
}

export function StatTile({
  label,
  value,
  hint,
  tone = "ink",
}: {
  label: string;
  value: string | number;
  hint?: string;
  tone?: "ink" | "gold" | "scarlet";
}) {
  const valueColor =
    tone === "gold"
      ? "text-[color:var(--nh-gold-ink)]"
      : tone === "scarlet"
        ? "text-[color:var(--nh-scarlet-ink)]"
        : "text-ink";
  return (
    <div className="bg-paper rounded-[var(--radius-lg)] border border-[color:var(--nh-border)] p-5">
      <p className="u-eyebrow text-fog">{label}</p>
      <p className={cn("mt-2 font-mono text-3xl font-semibold tabular-nums", valueColor)}>
        {typeof value === "number" ? value.toLocaleString("en-US") : value}
      </p>
      {hint ? <p className="text-fog mt-1 text-xs">{hint}</p> : null}
    </div>
  );
}

const PILL: Record<string, string> = {
  new: "bg-[color:var(--nh-gold-soft)] text-[color:var(--nh-gold-ink)]",
  contacted: "bg-[color:var(--nh-blue-soft)] text-[color:var(--nh-blue-ink)]",
  done: "bg-[color:var(--nh-silver-soft)] text-[color:var(--nh-silver-ink)]",
  pending: "bg-[color:var(--nh-gold-soft)] text-[color:var(--nh-gold-ink)]",
  approved: "bg-[color:var(--nh-blue-soft)] text-[color:var(--nh-blue-ink)]",
  retired: "bg-[color:var(--nh-silver-soft)] text-[color:var(--nh-silver-ink)]",
  failed: "bg-[color:var(--nh-scarlet-soft)] text-[color:var(--nh-scarlet-ink)]",
  open: "bg-[color:var(--nh-blue-soft)] text-[color:var(--nh-blue-ink)]",
  closed: "bg-[color:var(--nh-silver-soft)] text-[color:var(--nh-silver-ink)]",
  waitlist: "bg-[color:var(--nh-gold-soft)] text-[color:var(--nh-gold-ink)]",
  tbd: "bg-[color:var(--nh-silver-soft)] text-[color:var(--nh-silver-ink)]",
  built: "bg-[color:var(--nh-blue-soft)] text-[color:var(--nh-blue-ink)]",
  preview: "bg-[color:var(--nh-gold-soft)] text-[color:var(--nh-gold-ink)]",
  planned: "bg-[color:var(--nh-silver-soft)] text-[color:var(--nh-silver-ink)]",
  optional: "bg-[color:var(--nh-purple-soft)] text-[color:var(--nh-purple-ink)]",
  active: "bg-[color:var(--nh-blue-soft)] text-[color:var(--nh-blue-ink)]",
  invited: "bg-[color:var(--nh-gold-soft)] text-[color:var(--nh-gold-ink)]",
  "to confirm": "bg-[color:var(--nh-silver-soft)] text-[color:var(--nh-silver-ink)]",
  connected: "bg-[color:var(--nh-blue-soft)] text-[color:var(--nh-blue-ink)]",
  "not configured":
    "bg-[color:var(--nh-scarlet-soft)] text-[color:var(--nh-scarlet-ink)]",
  "n/a": "bg-[color:var(--nh-bone)] text-stone",
};

export function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "u-eyebrow inline-flex items-center rounded-full px-2.5 py-1 whitespace-nowrap",
        PILL[status] ?? "text-stone bg-[color:var(--nh-bone)]",
      )}
    >
      {status}
    </span>
  );
}

/** Minimal table. Columns render a cell from each row; rows scroll on phones. */
export function DataTable<T>({
  rows,
  columns,
  rowKey,
  empty = "Nothing here yet.",
}: {
  rows: ReadonlyArray<T>;
  columns: ReadonlyArray<{
    key: string;
    label: string;
    cell: (row: T) => ReactNode;
    className?: string;
  }>;
  rowKey: (row: T) => string;
  empty?: string;
}) {
  if (rows.length === 0) {
    return <p className="text-fog py-8 text-center text-sm">{empty}</p>;
  }
  return (
    <div className="-mx-5 overflow-x-auto">
      <table className="w-full min-w-[40rem] text-sm">
        <thead>
          <tr className="border-b border-[color:var(--nh-border)]">
            {columns.map((c) => (
              <th
                key={c.key}
                scope="col"
                className={cn(
                  "u-eyebrow text-fog px-5 pb-3 text-left font-semibold",
                  c.className,
                )}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[color:var(--nh-border)]">
          {rows.map((r) => (
            <tr key={rowKey(r)} className="hover:bg-cream/60">
              {columns.map((c) => (
                <td key={c.key} className={cn("px-5 py-3 align-top", c.className)}>
                  {c.cell(r)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** A button that looks real but does nothing yet — labelled so. */
export function PreviewButton({
  children,
  tone = "primary",
}: {
  children: ReactNode;
  tone?: "primary" | "ghost" | "gold";
}) {
  const cls =
    tone === "gold"
      ? "bg-[color:var(--nh-gold)] text-ink"
      : tone === "ghost"
        ? "text-ink border border-[color:var(--nh-border)] bg-paper"
        : "bg-ink text-cream";
  return (
    <button
      type="button"
      disabled
      title="Preview — not wired yet"
      className={cn(
        "inline-flex h-9 cursor-not-allowed items-center gap-2 rounded-[var(--radius-sm)] px-3 text-sm font-semibold opacity-80",
        cls,
      )}
    >
      {children}
    </button>
  );
}

export function Mono({ children }: { children: ReactNode }) {
  return <span className="font-mono text-[0.8125rem]">{children}</span>;
}

export function formatWhen(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function formatUsd(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}
