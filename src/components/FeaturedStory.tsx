import Link from "next/link";
import { Play } from "lucide-react";
import { getFirstPostedStory } from "@/data/stories";
import type { Story } from "@/lib/types";
import { youtubeWatchUrl } from "@/lib/youtube";
import { WarningChip } from "./ContentWarnings";
import { ListenedToggle } from "./ListenedToggle";
import { StoryThumb } from "./StoryThumb";

export function FeaturedStory({ story }: { story: Story }) {
  const firstPosted = getFirstPostedStory();

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
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/35 to-transparent lg:via-night/80 lg:to-night/45" />
        <div className="absolute inset-0 hidden bg-gradient-to-r from-night/85 via-night/40 to-transparent lg:block" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col justify-end px-4 pt-5 pb-8 sm:px-6 sm:pt-6 lg:min-h-[72dvh] lg:pt-16 lg:pb-16">
        <div className="rise-in max-w-3xl">
          <p
            id="featured-heading"
            className="font-mono text-[11px] tracking-[0.28em] text-ember uppercase"
          >
            เริ่มจากเรื่องนี้
          </p>

          <h1 className="mt-3 font-serif text-[1.85rem] leading-[1.15] font-semibold text-balance text-paper sm:text-4xl lg:mt-4 lg:text-6xl">
            {story.title}
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-paper/80 sm:text-base">
            {story.guest ? `${story.guest} · ` : ""}
            {story.duration}
          </p>

          <p className="mt-4 max-w-xl text-base leading-relaxed text-pretty text-paper/90 sm:mt-5 sm:text-lg">
            {story.excerpt}
          </p>

          <WarningChip warnings={story.warnings} className="mt-4" />

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
              <span className="text-base font-medium">ฟังเลย · {story.duration}</span>
            </a>
            <Link
              href={`/stories/${story.slug}`}
              className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center px-2 text-sm text-dust underline-offset-4 hover:text-paper hover:underline sm:w-auto sm:min-h-14"
            >
              อ่านที่ปองจดไว้
            </Link>
            <ListenedToggle slug={story.slug} />
          </div>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-5">
            <a
              href="#shelf"
              className="inline-flex min-h-11 cursor-pointer items-center text-sm text-dust hover:text-paper"
            >
              หรือเลือกเรื่องอื่นด้านล่าง
            </a>
            {firstPosted && firstPosted.slug !== story.slug ? (
              <Link
                href={`/stories/${firstPosted.slug}`}
                className="inline-flex min-h-11 cursor-pointer items-center text-sm text-dust hover:text-paper"
              >
                หรือไล่ฟังจากเรื่องแรกที่ลง
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
