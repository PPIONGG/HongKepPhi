import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Dossier } from "@/components/dossier/Dossier";
import { getSeriesForStory } from "@/data/series";
import {
  getPostedNeighbors,
  getRelatedStories,
  getStoryBySlug,
  stories,
} from "@/data/stories";

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

  const posted = getPostedNeighbors(story.slug);
  const onTrail = new Set([posted.prev?.slug, posted.next?.slug]);
  // ขอเผื่อไว้สองใบ เพราะแฟ้มก่อนหน้ากับถัดไปปักอยู่บนบอร์ดแล้ว ไม่ต้องปักซ้ำ
  const related = getRelatedStories(story.slug, 5)
    .filter((item) => !onTrail.has(item.slug))
    .slice(0, 3);

  return (
    <Dossier
      story={story}
      posted={posted}
      related={related}
      series={getSeriesForStory(story.slug)?.series}
    />
  );
}
