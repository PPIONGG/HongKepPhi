import Link from "next/link";
import { CATEGORIES, type Story } from "@/lib/types";
import { formatListenedAt } from "@/lib/youtube";
import { WarningChip } from "./ContentWarnings";
import { ListenedBadge } from "./ListenedBadge";
import { ListenedToggle } from "./ListenedToggle";
import { SpotlightCard } from "./reactbits/SpotlightCard";
import { StoryThumb } from "./StoryThumb";
import { YoutubeButton } from "./YoutubeButton";

export function StoryCard({
  story,
  index = 0,
}: {
  story: Story;
  index?: number;
}) {
  return (
    <SpotlightCard
      as="article"
      className="stagger-card group flex h-full flex-col overflow-hidden border border-paper/10 bg-cabinet/90 transition duration-200 active:bg-shelf sm:hover:-translate-y-1 sm:hover:border-ember/35 sm:hover:bg-shelf sm:hover:shadow-[0_16px_40px_rgba(0,0,0,0.35)]"
      style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
    >
      <Link href={`/stories/${story.slug}`} className="block cursor-pointer">
        <div className="relative bg-frame p-1.5 pb-6 sm:p-2 sm:pb-7">
          <span
            aria-hidden
            className="absolute top-0 left-1/2 z-10 h-3 w-14 -translate-x-1/2 -translate-y-1/2 rotate-[-6deg] bg-tape/80 sm:w-16"
          />
          <div className="relative aspect-video overflow-hidden bg-night">
            <StoryThumb
              youtubeId={story.youtubeId}
              alt={`ภาพปกคลิป ${story.title}`}
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition duration-300 sm:group-hover:scale-[1.04]"
            />
            <span className="absolute left-2 top-2 bg-night/80 px-2 py-1 font-mono text-[10px] tracking-[0.16em] text-paper">
              {story.catalog}
            </span>
            <span className="absolute right-2 bottom-2 bg-night/80 px-2 py-1 font-mono text-[11px] text-paper">
              {story.duration}
            </span>
            <ListenedBadge slug={story.slug} />
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-2.5 px-4 pt-3 pb-3 sm:gap-3 sm:pt-4">
          <div className="flex items-center justify-between gap-3 text-[11px] tracking-wide text-dust">
            <span className="border border-sage/30 px-2 py-0.5 text-sage">
              {CATEGORIES[story.category].label}
            </span>
            <time dateTime={story.listenedAt}>{formatListenedAt(story.listenedAt)}</time>
          </div>
          <h3 className="font-serif text-[1.3rem] leading-snug font-semibold text-pretty text-paper sm:text-[1.45rem]">
            {story.title}
          </h3>
          <p className="text-sm text-dust">
            {story.guest ? `${story.guest} · ` : ""}
            {story.channel}
          </p>
          <p className="line-clamp-2 text-sm leading-relaxed text-paper/80 sm:line-clamp-3">
            {story.excerpt}
          </p>
        </div>
      </Link>
      <div className="mt-auto flex flex-col items-start gap-2 px-4 pt-1 pb-3">
        <WarningChip warnings={story.warnings} />
      </div>
      <div className="flex flex-col gap-2 px-4 pb-4 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <ListenedToggle slug={story.slug} />
        <YoutubeButton youtubeId={story.youtubeId} title={story.title} full="mobile" />
      </div>
    </SpotlightCard>
  );
}
