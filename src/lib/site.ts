/** ที่อยู่จริงของห้องนี้ ใช้เป็นฐานของ metadata, sitemap และ og:image */
export const SITE_URL = "https://hong-kep-phi.vercel.app";

export const SITE_NAME = "ห้องเก็บผี";

/** สีจาก globals.css ใช้ซ้ำในรูป og ที่วาดด้วย ImageResponse (ใช้ตัวแปร CSS ไม่ได้) */
export const OG_COLORS = {
  night: "#120d09",
  cabinet: "#1b1510",
  paper: "#f3e6d0",
  dust: "#c4ae90",
  ember: "#d2652a",
} as const;
