import Link from "next/link";
import { Play } from "lucide-react";
import { CATEGORIES, type Story } from "@/lib/types";
import { formatListenedAt, youtubeWatchUrl } from "@/lib/youtube";
import { DecryptedText } from "./reactbits/DecryptedText";
import { ShinyText } from "./reactbits/ShinyText";
import { StoryThumb } from "./StoryThumb";

export function FeaturedStory({ story }: { story: Story }) {
  return (
    <section aria-labelledby="featured-heading" className="relative isolate bg-night lg:min-h-[72dvh]">
      <div className="relative aspect-[16/10] overflow-hidden sm:aspect-video lg:absolute lg:inset-0 lg:aspect-auto">
        <StoryThumb
          youtubeId={story.youtubeId}
          alt={`ภาพปกคลิป ${story.title}`}
          priority
          sizes="100vw"
          className="object-cover object-center lg:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/20 to-transparent lg:via-night/70 lg:to-night/25" />
        <div className="absolute inset-0 hidden bg-gradient-to-r from-night/70 via-transparent to-night/20 lg:block" />
        <span className="absolute left-4 top-4 border border-night/10 bg-paper px-2.5 py-1 font-mono text-[11px] tracking-[0.18em] text-night lg:hidden">
          <DecryptedText text={story.catalog} />
        </span>
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col justify-end px-4 pt-5 pb-8 sm:px-6 sm:pt-6 lg:min-h-[72dvh] lg:pt-16 lg:pb-16">
        <div className="rise-in max-w-3xl">
          <p className="hidden font-display text-4xl leading-none lg:block">
            <ShinyText text="ห้องเก็บผี" speed={2.4} delay={3} />
          </p>
          <div className="flex flex-wrap items-center gap-3 lg:mt-6">
            <span className="hidden border border-night/10 bg-paper px-2.5 py-1 font-mono text-[11px] tracking-[0.18em] text-night lg:inline">
              <DecryptedText text={story.catalog} />
            </span>
            <p
              id="featured-heading"
              className="font-mono text-[11px] tracking-[0.28em] text-ember uppercase"
            >
              เรื่องที่เพิ่งเก็บ
            </p>
          </div>

          <h1 className="mt-3 font-serif text-[1.85rem] leading-[1.15] font-semibold text-balance text-paper sm:text-4xl lg:mt-4 lg:text-6xl">
            {story.title}
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-dust sm:text-base">
            {story.guest ? `${story.guest} · ` : ""}
            {story.channel} · {CATEGORIES[story.category].label} · {story.duration}
          </p>

          <p className="mt-4 max-w-xl text-base leading-relaxed text-pretty text-paper/90 sm:mt-5 sm:text-lg">
            {story.excerpt}
          </p>

          <p className="mt-3 font-mono text-[11px] tracking-wide text-dust">
            เก็บเมื่อ {formatListenedAt(story.listenedAt)}
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center">
            <a
              href={youtubeWatchUrl(story.youtubeId)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-3 bg-ember px-4 text-night shadow-[0_0_40px_rgba(210,101,42,0.4)] transition duration-200 hover:bg-ember-soft active:scale-[0.98] sm:w-auto sm:min-h-14 sm:justify-start sm:pr-5 sm:pl-2"
            >
              <span className="grid size-9 place-items-center rounded-full bg-night/10 sm:size-10">
                <Play className="size-5 fill-current" aria-hidden />
              </span>
              <span className="text-base font-medium">เปิดฟังบน YouTube</span>
            </a>
            <Link
              href={`/stories/${story.slug}`}
              className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center border border-paper/20 bg-night/35 px-5 text-sm text-paper backdrop-blur-sm transition-colors duration-200 hover:border-ember hover:text-ember-soft sm:w-auto sm:min-h-14"
            >
              อ่านว่าทำไมถึงเก็บ
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
