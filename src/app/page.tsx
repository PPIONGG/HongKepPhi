import { FeaturedStory } from "@/components/FeaturedStory";
import { StoryShelf } from "@/components/StoryShelf";
import { stories } from "@/data/stories";
import { parseCabinet, storiesInCabinet } from "@/lib/channels";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string | string[]; cabinet?: string | string[] }>;
}) {
  const { tag, cabinet } = await searchParams;
  const activeTag = Array.isArray(tag) ? tag[0] : tag;
  const activeCabinet = parseCabinet(cabinet);
  const inCabinet = storiesInCabinet(stories, activeCabinet);
  const featured = inCabinet[0];

  return (
    <div>
      {featured ? <FeaturedStory story={featured} /> : null}

      <div className="mx-auto w-full max-w-6xl px-4 pt-8 pb-8 sm:px-6 sm:pt-12">
        <StoryShelf
          stories={stories}
          featuredSlug={featured?.slug}
          activeTag={activeTag}
          activeCabinet={activeCabinet}
        />
      </div>
    </div>
  );
}
