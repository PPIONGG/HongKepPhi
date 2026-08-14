import { getStoryBySlug, stories } from "@/data/stories";
import { OG_CONTENT_TYPE, OG_SIZE, composeCard, pngResponse } from "@/lib/og";
import { OG_COLORS } from "@/lib/site";
import { CATEGORIES } from "@/lib/types";
import { youtubeThumb } from "@/lib/youtube";

export const alt = "บันทึกหนึ่งใบจากห้องเก็บผี";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return stories.map((story) => ({ slug: story.slug }));
}

/** ใบปกคมชัดทางขวา วางในกรอบเหมือนรูปติดผนัง */
const INSET = { left: 700, top: 176, width: 432, height: 243 };

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = getStoryBySlug(slug);

  if (!story) {
    return pngResponse(
      await composeCard({
        texts: [
          { text: "ห้องเก็บผี", size: 64, color: OG_COLORS.paper, left: 72, top: 280 },
        ],
      }),
    );
  }

  const meta = [story.guest, story.channel, story.duration]
    .filter(Boolean)
    .join(" · ");

  const png = await composeCard({
    thumbUrl: youtubeThumb(story.youtubeId, "max"),
    inset: INSET,
    // หรี่พื้นเบลอลงอีกทางซ้าย ให้ตัวหนังสืออ่านสบาย
    overlaySvg: `
      <defs>
        <linearGradient id="veil" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="${OG_COLORS.night}" stop-opacity="0.96"/>
          <stop offset="0.55" stop-color="${OG_COLORS.night}" stop-opacity="0.8"/>
          <stop offset="1" stop-color="${OG_COLORS.night}" stop-opacity="0.68"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#veil)"/>`,
    shapesSvg: `
      <rect x="68" y="62" width="132" height="40" fill="${OG_COLORS.paper}"/>
      <rect x="${INSET.left - 10}" y="${INSET.top - 10}" width="${INSET.width + 20}" height="${INSET.height + 20}" fill="none" stroke="${OG_COLORS.paper}" stroke-opacity="0.22" stroke-width="2"/>
      <rect x="68" y="540" width="44" height="3" fill="${OG_COLORS.ember}"/>`,
    texts: [
      {
        text: story.catalog,
        size: 17,
        color: OG_COLORS.night,
        left: 86,
        top: 73,
        letterSpacing: 3,
      },
      {
        text: CATEGORIES[story.category].label,
        size: 17,
        color: OG_COLORS.ember,
        left: 224,
        top: 73,
        letterSpacing: 3,
      },
      {
        text: story.title,
        size: 54,
        color: OG_COLORS.paper,
        left: 68,
        top: 268,
        maxWidth: 570,
      },
      { text: meta, size: 22, color: OG_COLORS.dust, left: 68, top: 470, maxWidth: 570 },
      {
        text: "ห้องเก็บผี",
        size: 18,
        color: OG_COLORS.dust,
        left: 128,
        top: 528,
        letterSpacing: 4,
      },
    ],
  });

  return pngResponse(png);
}
