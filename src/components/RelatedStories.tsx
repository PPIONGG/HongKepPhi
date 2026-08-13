import Link from "next/link";
import type { Story } from "@/lib/types";
import { StoryThumb } from "./StoryThumb";

export function RelatedStories({ stories }: { stories: Story[] }) {
  if (stories.length === 0) return null;

  return (
    <section aria-labelledby="related-heading" className="mt-12 sm:mt-16">
      <p className="font-mono text-[11px] tracking-[0.28em] text-dust uppercase">
        ชั้นเดียวกัน
      </p>
      <h2 id="related-heading" className="mt-2 font-serif text-2xl text-pretty text-paper sm:text-3xl">
        เรื่องอื่นที่เก็บไว้ใกล้กัน
      </h2>
      <div className="mt-5 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:mt-6 sm:gap-4 lg:grid-cols-3">
        {stories.map((story) => (
          <Link
            key={story.slug}
            href={`/stories/${story.slug}`}
            className="group cursor-pointer border border-paper/10 bg-cabinet transition duration-200 hover:-translate-y-0.5 hover:border-ember/30"
          >
            <div className="relative aspect-video overflow-hidden bg-night">
              <StoryThumb
                youtubeId={story.youtubeId}
                alt={`ภาพปกคลิป ${story.title}`}
                sizes="(min-width: 768px) 30vw, 100vw"
                className="object-cover transition duration-300 group-hover:scale-105"
              />
            </div>
            <div className="px-3 py-3">
              <p className="font-mono text-[10px] tracking-[0.16em] text-dust">
                {story.catalog}
              </p>
              <p className="mt-1 font-serif text-lg leading-snug text-paper">
                {story.title}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
