import type { Story } from "@/lib/types";

/**
 * เพิ่มเรื่องใหม่: ก็อปปี้ก้อนด้านล่าง แล้วแปะไว้บนสุดของอาร์เรย์
 *
 * {
 *   slug: "ชื่อ-ภาษาอังกฤษ-สั้นๆ",
 *   catalog: "HK-012",
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
    slug: "hong-jam-pen",
    catalog: "HK-011",
    title: "คืนสยอง ห้องจำเป็น",
    guest: "คุณธอห์ณ",
    channel: "THE GHOST RADIO",
    youtubeId: "2-u9-RuHUjc",
    duration: "43:02",
    listenedAt: "2026-08-11",
    category: "hotel",
    featured: true,
    excerpt: "โรงแรมที่ไม่ได้เลือก ห้องที่ไม่มีในแผนผัง ฟังจบแล้วนอนหันหลังให้ประตูไม่ได้",
    note: "ฟังตอนตีสองหลังเลิกงาน เรื่องเริ่มจากทริปทางใต้ที่ห้องเต็มจนต้องย้ายไปห้องที่พนักงานยื่นให้แบบไม่เต็มใจ รายละเอียดเรื่องกุญแจ สำเนาใบจอง และเสียงจากห้องติดกันมันแน่นกว่าจังหวะผีโผล่ เก็บไว้เพราะเป็นเรื่องโรงแรมที่ทำให้กลัวระบบมากกว่าเงา",
    tags: ["โรงแรม", "ภาคใต้", "ห้องพัก"],
  },
  {
    slug: "tukkata-thi-hoi-yu",
    catalog: "HK-010",
    title: "ตุ๊กตาที่ห้อยอยู่",
    guest: "คุณเจสซี่",
    channel: "THE GHOST RADIO",
    youtubeId: "0TaTdWX7d_Y",
    duration: "59:49",
    listenedAt: "2026-08-08",
    category: "home",
    excerpt: "ไม่สะดุ้งตอนผีโผล่ สะดุ้งตอนเธอพูดถึงตุ๊กตาที่ห้อยนิ่งๆ",
    note: "เรื่องบ้านที่ของเล่นไม่ได้อยู่ในที่ที่ควรอยู่ จังหวะที่เจสซี่เล่าช้าลงตอนพูดถึงตุ๊กตาที่ห้อยอยู่เฉยๆ ทำให้ห้องฟังเงียบกว่าปกติ เก็บไว้เพราะหลอนแบบของในบ้าน ไม่ใช่หลอนแบบป่าทึบ",
    tags: ["บ้าน", "ตุ๊กตา", "ของในบ้าน"],
  },
  {
    slug: "ban-ngan-sop",
    catalog: "HK-009",
    title: "เล่นกับเพื่อนที่บ้านงานศพ",
    guest: "คุณเวฟ",
    channel: "THE GHOST RADIO",
    youtubeId: "3iVmq1R9Iy0",
    duration: "22:42",
    listenedAt: "2026-08-09",
    category: "home",
    excerpt: "สั้น กระชับ และทิ้งภาพเด็กเล่นในบ้านที่มีศพไว้ในหัวทั้งคืน",
    note: "คลิปสั้นกว่าที่ห้องนี้ชอบเก็บ แต่จบแล้ววน ภาพบ้านงานศพกับกลุ่มเด็กที่ยังเล่นกันต่อมันทิ่มตรงๆ ไม่ยืด ไม่มีมุกแทรกเยอะ เหมาะกับคืนที่อยากฟังจบในรอบเดียวแล้วปิดไฟ",
    tags: ["บ้าน", "งานศพ", "วัยเด็ก"],
  },
  {
    slug: "pa-khlung-khang-phi",
    catalog: "HK-008",
    title: "ป่าคลั่ง ขังผี",
    guest: "คุณเอก ตายแน่",
    channel: "THE GHOST RADIO",
    youtubeId: "uPeAxB5iqOg",
    duration: "1:17:22",
    listenedAt: "2026-07-22",
    category: "forest",
    excerpt: "เรื่องป่าที่หลอนเพราะหลงทาง มากกว่าเพราะผีโผล่ให้เห็น",
    note: "คุณตาของคนรู้จักหนีออกจากบ้านแล้วหลงป่า ฟังไปนานกว่าชั่วโมงแล้วยังไม่เบื่อ เพราะรายละเอียดการเดิน แสง และจังหวะที่ป่าเริ่มไม่ยอมให้ออก เก็บไว้เป็นเรื่องป่าหลักของชั้นนี้",
    tags: ["ป่า", "หลงทาง", "คุณตา"],
  },
  {
    slug: "rongram-kao-poed-mai",
    catalog: "HK-007",
    title: "โรงแรมเก่าที่เปิดใหม่",
    guest: "คุณไผ่",
    channel: "THE GHOST RADIO",
    youtubeId: "BZCktYfsc_Q",
    duration: "35:11",
    listenedAt: "2026-07-03",
    category: "hotel",
    excerpt: "พนักงานโรงแรมเล่ายี่สิบปีให้หลัง รายละเอียดงานกะดึกแน่นมาก",
    note: "ชอบเรื่องที่คนในสถานที่เล่าเอง คุณไผ่ทำงานที่โรงแรมเก่าที่เปิดใหม่ เหตุการณ์ย้อนไปสองสิบปี เสียงเดินในโถง ห้องที่แขกไม่ยอมเข้า และวิธีที่พนักงานคุยกันเรื่องนี้ตอนพักบุหรี่ ฟังแล้วรู้สึกเหมือนได้ยินจากหลังเคาน์เตอร์ไม่ใช่จากเวที",
    tags: ["โรงแรม", "ที่ทำงาน", "กะดึก"],
  },
  {
    slug: "rongram-tour",
    catalog: "HK-006",
    title: "โรงแรมทัวร์",
    guest: "คุณมิ้ม",
    channel: "THE GHOST RADIO",
    youtubeId: "VHq8nVAUbck",
    duration: "1:00:15",
    listenedAt: "2026-06-18",
    category: "hotel",
    excerpt: "นักศึกษาแปดสิบชีวิตเข้าโรงแรมเดียวกัน แล้วค่อยๆ เริ่มเห็นคนละอย่าง",
    note: "เรื่องกลุ่มใหญ่ที่หลอนเพราะคนละคนยืนยันคนละรายละเอียด มิ้มเล่าช้าแต่ฉากห้องน้ำ โถง และเพื่อนที่ไม่อยากกลับเข้าห้องทำให้ฟังต่อไม่หยุด เก็บไว้เป็นเรื่องโรงแรมแบบยกแก๊ง ไม่ใช่แบบคนเดียว",
    tags: ["โรงแรม", "นักศึกษา", "ทัวร์"],
  },
  {
    slug: "poed-term-nan",
    catalog: "HK-005",
    title: "เปิดเทอมนั้น ฉันเกือบตาย",
    guest: "คุณโบนัส",
    channel: "THE GHOST RADIO",
    youtubeId: "3SC29wiDgZs",
    duration: "41:21",
    listenedAt: "2026-05-30",
    category: "school",
    excerpt: "ครูใหม่ในโรงเรียนติดชายแดน เรื่องที่หลอนเพราะความโดดเดี่ยวก่อนจะเป็นผี",
    note: "ไม่ใช่เรื่องผีโรงเรียนแบบห้องดนตรีทั่วไป เป็นครูที่ไปสอนที่ชายแดนแล้วยังไม่รู้จักใคร บรรยากาศบ้านพักครูและสนามตอนค่ำทำให้รู้สึกใกล้ตัว เก็บไว้เพราะหลอนแบบสถานที่ทำงานใหม่",
    tags: ["โรงเรียน", "ครู", "ชายแดน"],
  },
  {
    slug: "ha-sip-jet-rongram-derm",
    catalog: "HK-004",
    title: "527 โรงแรมเดิม",
    guest: "คุณเวฟ",
    channel: "THE GHOST RADIO",
    youtubeId: "HExIDNuuq68",
    duration: "35:08",
    listenedAt: "2026-05-12",
    category: "hotel",
    excerpt: "กลับไปโรงแรมเดิมหลังแข่งวิชาการหนึ่งปี ห้องเดิมเลขเดิม แต่บรรยากาศไม่ยอมเป็นแบบเดิม",
    note: "โครงเรื่องชัด: ไปแข่ง กลับมาอีกปี ขอห้องเดิม แล้วของที่เคยอยู่ไม่ได้อยู่ที่เดิม ชอบจังหวะที่เวฟจำรายละเอียดห้องได้แม่นเกินไปจนฟังแล้วขนลุกเอง โดยที่คลิปยังไม่ต้องเร่ง",
    tags: ["โรงแรม", "นักเรียน", "กลับไปที่เดิม"],
  },
  {
    slug: "sayong-khwan-wat-pa",
    catalog: "HK-003",
    title: "สยองขวัญวัดป่า",
    channel: "SHOCKTUBE",
    youtubeId: "ICCIdY6ea0M",
    duration: "34:23",
    listenedAt: "2026-04-21",
    category: "temple",
    excerpt: "วัดที่ฟังแล้วไม่ใช่สถานที่ศักดิ์สิทธิ์สงบ แต่เป็นพื้นที่ที่มีกฎที่ไม่เขียนไว้",
    note: "สำเนียงเล่าต่างจากเดอะโกส ชัดเจน ตรง และทิ้งความลับของวัดป่าไว้จนจบตอน เก็บไว้เพราะอยากมีเรื่องวัดในชั้นที่ไม่ใช่เรื่องเล่าแบบรายการยาว ฟังรอบเดียวจบ แล้วยังไม่อยากไปวัดป่าคนเดียว",
    tags: ["วัด", "ป่า", "ตอนจบ"],
  },
  {
    slug: "ha-ruang-hoed",
    catalog: "HK-002",
    title: "หลอนจัดหนัก ห้าเรื่องโหดผีโคตรดุ",
    channel: "Thairath Studio",
    youtubeId: "DcrFxoiOEls",
    duration: "3:29:16",
    listenedAt: "2026-03-08",
    category: "mix",
    excerpt: "คลิปรวมยาว สำหรับคืนที่อยากเปิดทิ้งไว้แล้วเดินไปทำอย่างอื่นไม่ได้",
    note: "ไม่ใช่เรื่องเดี่ยว แต่เป็นชุดที่คัดมาฟังตอนทำงานดึก มีทั้งมหาลัยและเรื่องตามติด เก็บไว้เป็นชั้นรวมเผื่อคืนที่อยากให้มีเสียงเล่ายาวๆ โดยไม่ต้องเลือกคลิปใหม่ทุกชั่วโมง",
    tags: ["รวมเรื่อง", "ฟังยาว", "มหาลัย"],
  },
  {
    slug: "ruam-pa-chud-si",
    catalog: "HK-001",
    title: "รวมเรื่องสยองขวัญในป่า ชุดที่ 4",
    channel: "ผีเล่าเรื่อง",
    youtubeId: "Ox2uyF9oqqg",
    duration: "3:25:40",
    listenedAt: "2026-02-14",
    category: "forest",
    excerpt: "เปิดทิ้งไว้สามชั่วโมง ป่าในคลิปทำให้ไม่อยากจอดรถข้างทาง",
    note: "คลิปรวมป่าที่ห้องนี้เปิดตอนขับรถไกลๆ ตอนกลางคืน แล้วต้องปิดเพราะเริ่มมองไหล่ทางมากไป เก็บไว้เป็นชั้นฟังยาวของป่า ใช้ตอนอยากได้บรรยากาศต่อเนื่องโดยไม่ต้องคลิกคลิปใหม่",
    tags: ["ป่า", "รวมเรื่อง", "ฟังยาว"],
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
