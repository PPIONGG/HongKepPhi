export const CATEGORIES = {
  home: { label: "บ้าน", hint: "บ้าน ห้องเช่า คอนโด" },
  hotel: { label: "โรงแรม", hint: "โรงแรม ที่พัก" },
  school: { label: "โรงเรียน", hint: "โรงเรียน มหาลัย" },
  forest: { label: "ป่าเขา", hint: "ป่า เขา ทางเปลี่ยว" },
  temple: { label: "วัด", hint: "วัด สถานที่ศักดิ์สิทธิ์" },
  road: { label: "ถนน", hint: "รถ ทาง เดินทาง" },
  hospital: { label: "โรงพยาบาล", hint: "โรงพยาบาล คลินิก ห้องดับจิต" },
  military: { label: "ทหาร", hint: "ค่ายทหาร เกณฑ์ทหาร" },
  water: { label: "ทะเล/แม่น้ำ", hint: "ทะเล เรือ แม่น้ำ คนจมน้ำ" },
  ruins: { label: "ตึกร้าง", hint: "ตึกร้าง คอนโดร้าง โรงงานร้าง" },
  mix: { label: "รวมเรื่อง", hint: "คลิปรวมหลายตอน" },
  other: { label: "อื่นๆ", hint: "ที่ที่ยังไม่มีชั้นของตัวเอง" },
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
  excerpt: string;
  note: string;
  tags: string[];
  /** เหตุการณ์หนักในเรื่อง สำหรับเตือนก่อนคนกดออกไปฟัง */
  warnings?: string[];
};

export type SeriesEpisode = {
  order: number;
  title: string;
  /** มีเมื่อเก็บเข้าตู้แล้วเท่านั้น ไม่มี = ยังไม่ได้เก็บ */
  slug?: string;
};

export type Series = {
  slug: string;
  title: string;
  blurb: string;
  episodes: SeriesEpisode[];
};
