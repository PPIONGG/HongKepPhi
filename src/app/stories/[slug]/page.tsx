import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DecryptedText } from "@/components/reactbits/DecryptedText";
import { ContentWarnings } from "@/components/ContentWarnings";
import { RelatedStories } from "@/components/RelatedStories";
import { SeriesBox } from "@/components/SeriesBox";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { StoryThumb } from "@/components/StoryThumb";
import { TagList } from "@/components/TagList";
import { YoutubeButton } from "@/components/YoutubeButton";
import { YoutubeEmbed } from "@/components/YoutubeEmbed";
import { ListenedToggle } from "@/components/ListenedToggle";
import { getSeriesForStory } from "@/data/series";
import {
  getPostedNeighbors,
  getRelatedStories,
  getStoryBySlug,
  stories,
} from "@/data/stories";
import { CATEGORIES } from "@/lib/types";
import { formatListenedAt } from "@/lib/youtube";

type StoryPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return stories.map((story) => ({ slug: story.slug }));
}

export async function generateMetadata({
  params,
}: StoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const story = getStoryBySlug(slug);
  if (!story) return { title: "ไม่พบบันทึก" };

  const description = story.excerpt;
  const url = `/stories/${story.slug}`;

  return {
    title: story.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: story.title,
      description,
      url,
      type: "article",
      publishedTime: story.listenedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: story.title,
      description,
    },
  };
}

export default async function StoryPage({ params }: StoryPageProps) {
  const { slug } = await params;
  const story = getStoryBySlug(slug);
  if (!story) notFound();

  const related = getRelatedStories(story.slug);
  const posted = getPostedNeighbors(story.slug);
  const seriesEntry = getSeriesForStory(story.slug);

  return (
    <article data-sticky-listen>
      <header className="relative isolate overflow-hidden bg-night">
        <div className="absolute inset-0">
          <StoryThumb
            youtubeId={story.youtubeId}
            alt={`ภาพปกคลิป ${story.title}`}
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-night via-night/80 to-night/40" />
        </div>
        <div className="relative mx-auto max-w-5xl px-4 pt-4 pb-6 sm:px-6 sm:pt-8 sm:pb-10">
          <Link
            href="/"
            className="inline-flex min-h-11 cursor-pointer items-center text-sm text-paper/80 hover:text-paper"
          >
            ← กลับชั้นวาง
          </Link>
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px] tracking-[0.16em] text-dust uppercase sm:mt-8 sm:gap-x-4">
            <span className="border border-night/10 bg-paper px-2 py-1 text-night">
              <DecryptedText text={story.catalog} />
            </span>
            <span className="text-sage">{CATEGORIES[story.category].label}</span>
            <time dateTime={story.listenedAt}>
              เก็บเมื่อ {formatListenedAt(story.listenedAt)}
            </time>
          </div>
          <h1 className="mt-3 max-w-3xl font-serif text-[1.85rem] leading-[1.15] font-semibold text-balance text-paper sm:mt-4 sm:text-6xl">
            {story.title}
          </h1>
          <p className="mt-3 text-sm text-dust sm:mt-4 sm:text-base">
            {story.guest ? `${story.guest} · ` : ""}
            {story.channel} ·{" "}
            <DecryptedText
              text={story.duration}
              animateOn="hover"
              characters="0123456789:"
              parentClassName="cursor-default"
            />
          </p>
        </div>
      </header>

      <div className="mx-auto w-full max-w-5xl px-4 pt-4 pb-36 sm:px-6 sm:pt-8 lg:pb-16">
        <ContentWarnings warnings={story.warnings} className="mb-5" />

        <YoutubeEmbed youtubeId={story.youtubeId} title={story.title} />

        <div className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_240px] lg:gap-10">
          <RevealOnScroll className="border border-paper/10 bg-slip px-4 py-6 sm:px-8 sm:py-7">
            <p className="font-mono text-[11px] tracking-[0.24em] text-ember uppercase">
              ใบจดของเจ้าของห้อง
            </p>
            <p className="mt-4 max-w-prose text-base leading-relaxed text-pretty text-paper/90 sm:text-lg">
              {story.note}
            </p>
            <TagList tags={story.tags} className="mt-6" />
            <div className="mt-8 hidden gap-3 lg:flex lg:flex-wrap lg:items-center">
              <YoutubeButton youtubeId={story.youtubeId} title={story.title} size="lg" />
              <ListenedToggle slug={story.slug} />
            </div>
          </RevealOnScroll>

          <aside className="h-fit border border-paper/10 bg-cabinet p-4">
            <p className="text-sm leading-relaxed text-dust">
              คลิปเป็นของ {story.channel} ห้องนี้แค่เก็บทางกลับไปฟัง
            </p>
            <p className="mt-4 font-mono text-[11px] tracking-[0.16em] text-dust uppercase">
              ไล่ตามที่ปองลง
            </p>
            <p className="mt-1 font-mono text-[11px] text-dust">
              เรื่อง {posted.position} จาก {posted.total}
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-1">
              {posted.prev ? (
                <Link
                  href={`/stories/${posted.prev.slug}`}
                  className="min-h-11 min-w-0 cursor-pointer border border-paper/10 px-3 py-2 text-sm text-paper hover:border-ember"
                >
                  <span className="block text-[11px] text-dust">เรื่องก่อน</span>
                  <span className="line-clamp-2">{posted.prev.title}</span>
                </Link>
              ) : (
                <p className="px-1 py-2 text-sm text-dust">นี่เรื่องแรกที่ลง</p>
              )}
              {posted.next ? (
                <Link
                  href={`/stories/${posted.next.slug}`}
                  className="min-h-11 min-w-0 cursor-pointer border border-paper/10 px-3 py-2 text-sm text-paper hover:border-ember"
                >
                  <span className="block text-[11px] text-dust">เรื่องถัดไป</span>
                  <span className="line-clamp-2">{posted.next.title}</span>
                </Link>
              ) : (
                <p className="px-1 py-2 text-sm text-dust">ไล่ครบแล้ว</p>
              )}
            </div>
          </aside>
        </div>

        {seriesEntry && (
          <SeriesBox series={seriesEntry.series} currentSlug={story.slug} />
        )}

        <RelatedStories stories={related} />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-paper/10 bg-night/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden">
        <div className="flex flex-col gap-2">
          <YoutubeButton youtubeId={story.youtubeId} title={story.title} size="lg" full />
          <ListenedToggle slug={story.slug} className="w-full" />
        </div>
      </div>
    </article>
  );
}
