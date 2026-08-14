import type { Series } from "@/lib/types";

/**
 * เพิ่มชุดใหม่: ก็อปก้อนด้านล่างแล้วแปะต่อท้ายอาร์เรย์
 *
 * ตอนไหนที่ยังไม่ได้เก็บเข้าตู้ ให้ใส่แค่ order กับ title
 * พอเก็บเข้ามาแล้วค่อยเติม slug — เว็บอัปเดตสถานะเองทั้งชุด
 *
 * ไฟล์นี้ห้าม import จาก @/data/stories ความสัมพันธ์เดินทางเดียวเสมอ
 */
export const seriesList: Series[] = [
  {
    slug: "khun-k",
    title: "เรื่องเล่าของคุณเค",
    blurb: "สามคลิปที่คุณเคเล่าต่อกัน ฟังเรียงแล้วประติดประต่อได้",
    episodes: [
      { order: 1, title: "ที่เก่า", slug: "thi-kao" },
      { order: 2, title: "บังเอิญ", slug: "bang-oen" },
      { order: 3, title: "ขอให้จบ", slug: "kho-hai-job" },
    ],
  },
];

export function getSeriesForStory(storySlug: string) {
  for (const series of seriesList) {
    const episode = series.episodes.find((item) => item.slug === storySlug);
    if (episode) return { series, episode };
  }
  return undefined;
}
