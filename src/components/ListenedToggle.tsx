"use client";

import { useListened } from "./ListenedProvider";

export function ListenedToggle({
  slug,
  className = "",
}: {
  slug: string;
  className?: string;
}) {
  const { heard, ready, toggle } = useListened();
  const on = heard.has(slug);

  return (
    <button
      type="button"
      onClick={() => toggle(slug)}
      disabled={!ready}
      aria-pressed={on}
      className={`inline-flex min-h-11 cursor-pointer items-center justify-center border px-3 text-sm transition-colors duration-200 disabled:cursor-wait ${
        on
          ? "border-sage/40 bg-sage/10 text-sage"
          : "border-paper/15 text-dust hover:border-paper/30 hover:text-paper"
      } ${className}`}
    >
      {on ? "ฟังแล้ว" : "กดว่าฟังแล้ว"}
    </button>
  );
}
