import { getSeriesForStory, seriesList } from "@/data/series";
import { presentCabinets, storiesInCabinet, type ChannelInfo } from "@/lib/channels";
import type { CategoryId, Story } from "@/lib/types";

export type TapePalette = {
  body: string;
  label: string;
  stripe: string;
};

// เป็น Record ของทุกหมวด เพิ่มหมวดใน CATEGORIES แล้วบิลด์จะไม่ผ่านจนกว่าจะเลือกสีตลับให้
const PALETTES: Record<CategoryId, TapePalette> = {
  home: { body: "#2b2119", label: "#efe3c6", stripe: "#c0392b" },
  hotel: { body: "#2c1a1f", label: "#f2d6da", stripe: "#9b2c45" },
  school: { body: "#1a2230", label: "#d6e2f2", stripe: "#2e5fa3" },
  forest: { body: "#1c2617", label: "#dde8c6", stripe: "#4f7a28" },
  temple: { body: "#3a2412", label: "#f0c35a", stripe: "#7a3b0c" },
  road: { body: "#262421", label: "#f0e3a4", stripe: "#c9921a" },
  hospital: { body: "#1b2724", label: "#cfe5d8", stripe: "#2f7f68" },
  military: { body: "#23261a", label: "#e0dcbf", stripe: "#5d6b2f" },
  water: { body: "#14262b", label: "#cde8ee", stripe: "#1f7a8c" },
  ruins: { body: "#262220", label: "#e3ddd6", stripe: "#7d6e63" },
  mix: { body: "#2a1f12", label: "#f5dfc2", stripe: "#d2652a" },
  other: { body: "#241e2c", label: "#dcd0ea", stripe: "#6a4fa3" },
};

const SERIES_BANDS = ["#c0392b", "#2e86c1", "#d4ac0d"];

export type Tape = {
  story: Story;
  spineNumber: string;
  width: number;
  height: number;
  palette: TapePalette;
  seriesBand: string | null;
  newest: boolean;
};

export type Cabinet = {
  channel: ChannelInfo;
  tapes: Tape[];
};

export function durationSeconds(duration: string) {
  return duration.split(":").reduce((total, part) => total * 60 + Number(part), 0);
}

function slugHash(slug: string) {
  let hash = 0;
  for (const char of slug) hash = (hash * 31 + char.charCodeAt(0)) % 10007;
  return hash;
}

function seriesBand(slug: string) {
  const entry = getSeriesForStory(slug);
  if (!entry) return null;
  return SERIES_BANDS[seriesList.indexOf(entry.series) % SERIES_BANDS.length];
}

function buildTape(story: Story, newest: boolean): Tape {
  const minutes = Math.round(durationSeconds(story.duration) / 60);
  return {
    story,
    spineNumber: story.catalog.replace(/^HK-/, ""),
    width: Math.round(Math.max(52, 20 + minutes * 0.98)),
    height: 196 + (slugHash(story.slug) % 4) * 9,
    palette: PALETTES[story.category],
    seriesBand: seriesBand(story.slug),
    newest,
  };
}

export function buildCabinets(stories: Story[]): Cabinet[] {
  const newestSlug = stories[0]?.slug;
  return presentCabinets(stories).map((channel) => ({
    channel,
    tapes: storiesInCabinet(stories, channel.slug).map((story) =>
      buildTape(story, story.slug === newestSlug),
    ),
  }));
}

/**
 * สิ่งที่ทำให้เทปเรืองแสงมีได้ทีละอย่าง
 * text ไม่เคยเป็นช่องว่างล้วน ช่องค้นที่ยังไม่มีตัวอักษรนับเป็น none
 */
export type GlowQuery =
  | { kind: "none" }
  | { kind: "tag"; tag: string }
  | { kind: "text"; text: string };

export const NO_GLOW: GlowQuery = { kind: "none" };

export function glowFromTagParam(raw: string | string[] | undefined): GlowQuery {
  const tag = (Array.isArray(raw) ? raw[0] : raw)?.trim();
  return tag ? { kind: "tag", tag } : NO_GLOW;
}

export function glowFromSearch(text: string): GlowQuery {
  return text.trim() ? { kind: "text", text } : NO_GLOW;
}

export function tapeMatches(tape: Tape, query: GlowQuery) {
  switch (query.kind) {
    case "none":
      return false;
    case "tag":
      return tape.story.tags.includes(query.tag);
    case "text": {
      const { title, guest, catalog, tags } = tape.story;
      return [title, guest ?? "", catalog, ...tags]
        .join(" ")
        .toLowerCase()
        .includes(query.text.trim().toLowerCase());
    }
  }
}
