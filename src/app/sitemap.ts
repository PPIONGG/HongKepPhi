import type { MetadataRoute } from "next";
import { stories } from "@/data/stories";
import { SITE_URL } from "@/lib/site";
import { latestListenedAt } from "@/lib/youtube";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(latestListenedAt(stories)),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/about`,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    ...stories.map((story) => ({
      url: `${SITE_URL}/stories/${story.slug}`,
      lastModified: new Date(story.listenedAt),
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
  ];
}
