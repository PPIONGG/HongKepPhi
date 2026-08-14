import Link from "next/link";
import type { Series } from "@/lib/types";

export function SeriesBox({
  series,
  currentSlug,
}: {
  series: Series;
  currentSlug: string;
}) {
  const episodes = [...series.episodes].sort((a, b) => a.order - b.order);
  const collected = episodes.filter((episode) => episode.slug).length;

  return (
    <section
      aria-labelledby="series-heading"
      className="mt-12 border border-paper/10 bg-cabinet/60 px-4 py-6 sm:mt-16 sm:px-6"
    >
      <p className="font-mono text-[11px] tracking-[0.24em] text-ember uppercase">
        ชุดเรื่อง
      </p>
      <h2
        id="series-heading"
        className="mt-2 font-serif text-2xl leading-snug text-pretty text-paper"
      >
        {series.title}
      </h2>
      <p className="mt-2 max-w-prose text-sm leading-relaxed text-pretty text-dust">
        {series.blurb}
      </p>
      <p className="mt-1 font-mono text-[11px] tracking-wide text-dust">
        เก็บแล้ว {collected} จาก {episodes.length} ตอน
      </p>

      <ol className="mt-5 flex flex-col gap-2">
        {episodes.map((episode) => {
          const isCurrent = episode.slug === currentSlug;
          const order = String(episode.order).padStart(2, "0");

          if (isCurrent) {
            return (
              <li
                key={episode.order}
                aria-current="true"
                className="flex items-center gap-3 border border-ember bg-ember/15 px-3 py-2.5"
              >
                <span className="font-mono text-[11px] text-ember">{order}</span>
                <span className="text-sm text-paper">{episode.title}</span>
                <span className="ml-auto font-mono text-[10px] tracking-[0.16em] text-ember uppercase">
                  กำลังอ่าน
                </span>
              </li>
            );
          }

          if (episode.slug) {
            return (
              <li key={episode.order}>
                <Link
                  href={`/stories/${episode.slug}`}
                  className="flex min-h-11 cursor-pointer items-center gap-3 border border-paper/12 px-3 py-2.5 transition-colors duration-200 hover:border-ember/50 hover:bg-shelf"
                >
                  <span className="font-mono text-[11px] text-dust">{order}</span>
                  <span className="text-sm text-paper">{episode.title}</span>
                  <span className="ml-auto font-mono text-[10px] tracking-[0.16em] text-dust uppercase">
                    เก็บแล้ว
                  </span>
                </Link>
              </li>
            );
          }

          return (
            <li
              key={episode.order}
              className="flex items-center gap-3 border border-dashed border-paper/12 px-3 py-2.5"
            >
              <span className="font-mono text-[11px] text-dust/60">{order}</span>
              <span className="text-sm text-dust/70">{episode.title}</span>
              <span className="ml-auto font-mono text-[10px] tracking-[0.16em] text-dust/60 uppercase">
                ยังไม่ได้เก็บ
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
