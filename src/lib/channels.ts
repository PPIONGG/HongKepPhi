import type { Story } from "./types";

/** ค่าเริ่มต้นของบ้าน: เข้าห้องมาแล้วอยู่ตู้แรก */
export const ORIGINAL_CABINET = "the-ghost-radio";
export const ALL_CABINETS = "all";

export type ChannelInfo = {
  slug: string;
  name: string;
  short: string;
  blurb: string;
  original?: boolean;
  youtube?: string;
};

/**
 * จดทะเบียนช่องที่มีตู้เป็นเรื่องของตัวเอง
 * ตู้ที่จดแล้วโชว์แม้ยังไม่มีเรื่อง ช่องที่ยังไม่จดก็มีตู้ได้เมื่อมีเรื่อง
 * ใช้ชื่อใน story.channel ให้ตรงกับ name
 */
export const CHANNELS: ChannelInfo[] = [
  {
    slug: ORIGINAL_CABINET,
    name: "THE GHOST RADIO",
    short: "วิทยุผี",
    blurb: "ตู้แรกของปอง รายการที่ฟังแล้วหยิบมาให้ก่อน",
    original: true,
  },
  {
    slug: "tang-makkaporn",
    name: "Tang Makkaporn",
    short: "ตังค์",
    blurb: "ตู้ต่อไปของปอง เปิดไว้แล้ว รอหยิบเรื่องใส่",
    youtube: "https://www.youtube.com/@tangmakkaporn",
  },
];

export function parseCabinet(raw: string | string[] | undefined) {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value) return ORIGINAL_CABINET;
  return value;
}

export function channelSlug(channelName: string) {
  const known = CHANNELS.find((item) => item.name === channelName);
  if (known) return known.slug;
  return (
    channelName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\u0e00-\u0e7f]+/g, "-")
      .replace(/^-+|-+$/g, "") || "channel"
  );
}

export function channelInfo(channelName: string): ChannelInfo {
  return (
    CHANNELS.find((item) => item.name === channelName) ?? {
      slug: channelSlug(channelName),
      name: channelName,
      short: channelName,
      blurb: "",
    }
  );
}

export function storiesInCabinet(stories: Story[], cabinet: string) {
  if (cabinet === ALL_CABINETS) return stories;
  return stories.filter((story) => channelSlug(story.channel) === cabinet);
}

export function presentCabinets(stories: Story[]) {
  const bySlug = new Map<string, ChannelInfo>();
  for (const channel of CHANNELS) {
    bySlug.set(channel.slug, channel);
  }
  for (const story of stories) {
    const info = channelInfo(story.channel);
    if (!bySlug.has(info.slug)) bySlug.set(info.slug, info);
  }
  return [...bySlug.values()].sort((a, b) => {
    if (a.original) return -1;
    if (b.original) return 1;
    const aIndex = CHANNELS.findIndex((item) => item.slug === a.slug);
    const bIndex = CHANNELS.findIndex((item) => item.slug === b.slug);
    if (aIndex >= 0 && bIndex >= 0) return aIndex - bIndex;
    if (aIndex >= 0) return -1;
    if (bIndex >= 0) return 1;
    return a.name.localeCompare(b.name, "th");
  });
}
