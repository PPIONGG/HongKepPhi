export const CATEGORIES = {
  home: { label: "บ้าน", hint: "บ้าน ห้องเช่า คอนโด" },
  hotel: { label: "โรงแรม", hint: "โรงแรม ที่พัก" },
  school: { label: "โรงเรียน", hint: "โรงเรียน มหาลัย" },
  forest: { label: "ป่าเขา", hint: "ป่า เขา ทางเปลี่ยว" },
  temple: { label: "วัด", hint: "วัด สถานที่ศักดิ์สิทธิ์" },
  road: { label: "ถนน", hint: "รถ ทาง เดินทาง" },
  mix: { label: "รวมเรื่อง", hint: "คลิปรวมหลายตอน" },
} as const;

export type CategoryId = keyof typeof CATEGORIES;

export type Story = {
  slug: string;
  catalog: string;
  title: string;
  guest?: string;
  channel: string;
  youtubeId: string;
  duration: string;
  listenedAt: string;
  category: CategoryId;
  featured?: boolean;
  excerpt: string;
  note: string;
  tags: string[];
};
