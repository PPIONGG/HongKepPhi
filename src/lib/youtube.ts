import type { Story } from "./types";

export function youtubeWatchUrl(id: string) {
  return `https://www.youtube.com/watch?v=${id}`;
}

export function youtubeEmbedUrl(id: string, autoplay = false) {
  const base = `https://www.youtube-nocookie.com/embed/${id}`;
  return autoplay ? `${base}?autoplay=1` : base;
}

export function youtubeThumb(id: string, quality: "hq" | "max" = "hq") {
  return quality === "max"
    ? `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`
    : `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

export function formatListenedAt(isoDate: string) {
  const date = new Date(`${isoDate}T00:00:00`);
  return new Intl.DateTimeFormat("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function latestListenedAt(stories: Story[]) {
  return stories.reduce((latest, story) =>
    story.listenedAt > latest ? story.listenedAt : latest,
  stories[0]?.listenedAt ?? "");
}
