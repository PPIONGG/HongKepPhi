"use client";

import { useListened } from "./ListenedProvider";

export function ListenedBadge({ slug }: { slug: string }) {
  const { heard, ready } = useListened();
  if (!ready || !heard.has(slug)) return null;

  return (
    <span className="absolute left-2 bottom-2 bg-sage/90 px-2 py-1 font-mono text-[10px] tracking-[0.16em] text-night">
      ฟังแล้ว
    </span>
  );
}
