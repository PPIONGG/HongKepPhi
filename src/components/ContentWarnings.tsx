import { TriangleAlert } from "lucide-react";

export function ContentWarnings({
  warnings,
  className = "",
}: {
  warnings?: string[];
  className?: string;
}) {
  if (!warnings || warnings.length === 0) return null;

  return (
    <aside
      aria-label="คำเตือนเนื้อหา"
      className={`border-l-2 border-ember bg-cabinet/60 px-4 py-3 ${className}`}
    >
      <p className="flex items-center gap-2 font-mono text-[11px] tracking-[0.24em] text-ember uppercase">
        <TriangleAlert className="size-3.5" aria-hidden />
        คำเตือน
      </p>
      <p className="mt-2 text-sm leading-relaxed text-paper/85">
        เรื่องนี้มี: {warnings.join(" · ")}
      </p>
    </aside>
  );
}

export function WarningChip({
  warnings,
  className = "",
}: {
  warnings?: string[];
  className?: string;
}) {
  if (!warnings || warnings.length === 0) return null;

  const [first, ...rest] = warnings;
  const label = rest.length > 0 ? `${first} +${rest.length}` : first;

  return (
    <p
      className={`inline-flex items-center gap-1.5 border border-ember/40 px-2 py-0.5 text-[11px] text-ember-soft ${className}`}
    >
      <TriangleAlert className="size-3" aria-hidden />
      <span className="sr-only">คำเตือนเนื้อหา: </span>
      <span>{label}</span>
    </p>
  );
}
