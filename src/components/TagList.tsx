import Link from "next/link";
import { tagHref } from "@/lib/channels";

export function TagList({
  tags,
  activeTag,
  cabinet,
  className = "",
}: {
  tags: string[];
  activeTag?: string;
  cabinet?: string;
  className?: string;
}) {
  if (tags.length === 0) return null;

  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag) => {
        const active = tag === activeTag;
        return (
          <li key={tag}>
            <Link
              href={tagHref(tag, cabinet)}
              aria-label={`ดูเรื่องที่ติดแท็ก ${tag}`}
              className={`inline-flex min-h-8 cursor-pointer items-center border px-3 py-1 text-sm transition-colors duration-200 ${
                active
                  ? "border-ember bg-ember/15 text-paper"
                  : "border-paper/12 text-dust hover:border-ember/50 hover:text-paper"
              }`}
            >
              {tag}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
