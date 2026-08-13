import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DecryptedText } from "@/components/reactbits/DecryptedText";
import { RelatedStories } from "@/components/RelatedStories";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { StoryThumb } from "@/components/StoryThumb";
import { YoutubeButton } from "@/components/YoutubeButton";
import { YoutubeEmbed } from "@/components/YoutubeEmbed";
import {
  getNeighborStories,
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
  return {
    title: story.title,
    description: story.excerpt,
  };
}

export default async function StoryPage({ params }: StoryPageProps) {
  const { slug } = await params;
  const story = getStoryBySlug(slug);
  if (!story) notFound();

  const related = getRelatedStories(story.slug);
  const { prev, next } = getNeighborStories(story.slug);

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

      <div className="mx-auto w-full max-w-5xl px-4 pt-4 pb-28 sm:px-6 sm:pt-8 lg:pb-16">
        <YoutubeEmbed youtubeId={story.youtubeId} title={story.title} />

        <div className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_240px] lg:gap-10">
          <RevealOnScroll className="border border-paper/10 bg-slip px-4 py-6 sm:px-8 sm:py-7">
            <p className="font-mono text-[11px] tracking-[0.24em] text-ember uppercase">
              ใบจดของเจ้าของห้อง
            </p>
            <p className="mt-4 max-w-prose text-base leading-relaxed text-pretty text-paper/90 sm:text-lg">
              {story.note}
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {story.tags.map((tag) => (
                <li
                  key={tag}
                  className="border border-paper/12 px-3 py-1 text-sm text-dust"
                >
                  {tag}
                </li>
              ))}
            </ul>
            <div className="mt-8 hidden lg:block">
              <YoutubeButton youtubeId={story.youtubeId} title={story.title} size="lg" />
            </div>
          </RevealOnScroll>

          <aside className="h-fit border border-paper/10 bg-cabinet p-4">
            <p className="text-sm leading-relaxed text-dust">
              คลิปเป็นของ {story.channel} ห้องนี้แค่เก็บทางกลับไปฟัง
            </p>
            <p className="mt-4 font-mono text-[11px] tracking-[0.16em] text-dust uppercase">
              ใบถัดไปในตู้
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-1">
              {prev ? (
                <Link
                  href={`/stories/${prev.slug}`}
                  className="min-h-11 min-w-0 cursor-pointer border border-paper/10 px-3 py-2 text-sm text-paper hover:border-ember"
                >
                  <span className="block text-[11px] text-dust">ก่อนหน้า</span>
                  <span className="line-clamp-2">{prev.title}</span>
                </Link>
              ) : null}
              {next ? (
                <Link
                  href={`/stories/${next.slug}`}
                  className="min-h-11 min-w-0 cursor-pointer border border-paper/10 px-3 py-2 text-sm text-paper hover:border-ember"
                >
                  <span className="block text-[11px] text-dust">ถัดไป</span>
                  <span className="line-clamp-2">{next.title}</span>
                </Link>
              ) : null}
            </div>
          </aside>
        </div>

        <RelatedStories stories={related} />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-paper/10 bg-night/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden">
        <YoutubeButton youtubeId={story.youtubeId} title={story.title} size="lg" full />
      </div>
    </article>
  );
}
