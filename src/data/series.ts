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
  {
    slug: "khun-kan",
    title: "โรงพยาบาลของคุณกัน",
    blurb: "เรื่องจากโรงพยาบาลเดียวกัน จักรวาลเดียวกัน ฟังก่อนหรือหลังก็ได้",
    episodes: [
      { order: 1, title: "เหตุเกิดที่ชั้น 20", slug: "chan-20" },
      { order: 2, title: "คนไข้ห้ามออกจากห้องนะคะ" },
    ],
  },
  {
    slug: "tat-sin-jai-phit-phlat",
    title: "ตัดสินใจผิดพลาด",
    blurb: "ซีรีส์สามตอนของคุณอาร์ม จอมหักมุม ต้องฟังเรียงตามลำดับ",
    episodes: [
      { order: 1, title: "ปฐมบท", slug: "tat-sin-jai-phit-phlat-1" },
      { order: 2, title: "เรื่องผี" },
      { order: 3, title: "ของฝาก", slug: "tat-sin-jai-phit-phlat-3" },
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
