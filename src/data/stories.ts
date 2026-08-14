import type { Story } from "@/lib/types";

/**
 * เพิ่มเรื่องใหม่: ก็อปปี้ก้อนด้านล่าง แล้วแปะไว้บนสุดของอาร์เรย์
 *
 * {
 *   slug: "ชื่อ-ภาษาอังกฤษ-สั้นๆ",
 *   catalog: "HK-002",
 *   title: "ชื่อเรื่องตามคลิป",
 *   guest: "คุณ... (ถ้ามี)",
 *   channel: "ชื่อช่อง",
 *   youtubeId: "วางเฉพาะรหัสหลัง v=",
 *   duration: "43:02",
 *   listenedAt: "2026-08-10",
 *   category: "hotel", // home | hotel | school | forest | temple | road | mix
 *   featured: false,
 *   excerpt: "ประโยคเดียวว่าทำไมถึงเก็บ",
 *   note: "บันทึกของเจ้าของห้อง หลังฟังจบ",
 *   tags: ["โรงแรม", "ภาคใต้"],
 * }
 */
export const stories: Story[] = [
  {
    slug: "thi-kao",
    catalog: "HK-001",
    title: "ที่เก่า",
    guest: "คุณเค",
    channel: "THE GHOST RADIO",
    youtubeId: "RxVlHkLj0IM",
    duration: "35:15",
    listenedAt: "2026-08-14",
    category: "home",
    featured: true,
    excerpt: "เรื่องหมู่บ้านที่เริ่มจากเพื่อนบ้านและรักต้องห้าม แล้วค่อยๆ หนักไปที่สถานที่เดิม",
    note: "เล่าช้าๆ ตั้งแต่ความสัมพันธ์ในวัยเรียนจนถึงจุดที่สถานที่เดิมเข้ามามีบทบาท รายละเอียดชีวิตประจำวันและการคุยกันของกลุ่มเพื่อนทำให้เรื่องไม่ใช่ผีโผล่ทันที แต่เป็นการสะสมความหนักใจก่อนจะถึงส่วนที่เกี่ยวกับที่เก่า เก็บไว้เพราะเป็นแนวเรื่องชีวิตชนบทที่หลอนจากความสัมพันธ์มากกว่าจากภาพหลอนตรงๆ",
    tags: ["บ้าน", "ที่เก่า", "เชียงใหม่"],
  },
];

export function getStoryBySlug(slug: string) {
  return stories.find((story) => story.slug === slug);
}

export function getFeaturedStory() {
  return stories.find((story) => story.featured) ?? stories[0];
}

export function getNeighborStories(slug: string) {
  const index = stories.findIndex((story) => story.slug === slug);
  if (index < 0) return { prev: undefined, next: undefined };
  return {
    prev: stories[index === 0 ? stories.length - 1 : index - 1],
    next: stories[index === stories.length - 1 ? 0 : index + 1],
  };
}

export function getRelatedStories(slug: string, limit = 3) {
  const current = getStoryBySlug(slug);
  if (!current) return [];
  const sameRoom = stories.filter(
    (story) => story.slug !== slug && story.category === current.category,
  );
  if (sameRoom.length >= limit) return sameRoom.slice(0, limit);
  const extras = stories.filter(
    (story) =>
      story.slug !== slug &&
      !sameRoom.some((item) => item.slug === story.slug),
  );
  return [...sameRoom, ...extras].slice(0, limit);
}
