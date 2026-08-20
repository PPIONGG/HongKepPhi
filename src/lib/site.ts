import packageJson from "../../package.json";

/** ที่อยู่จริงของห้องนี้ ใช้เป็นฐานของ metadata, sitemap และ og:image */
export const SITE_URL = "https://hong-kep-phi.vercel.app";

/** เลขรุ่นจาก package.json เลื่อนเมื่อปล่อยของรอบใหม่ */
export const SITE_VERSION = packageJson.version;

export function siteBuildLabel() {
  const sha = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7);
  return sha ? `รุ่น ${SITE_VERSION} · ${sha}` : `รุ่น ${SITE_VERSION}`;
}

export const SITE_NAME = "ห้องเก็บผี";

export const SITE_AUTHOR = {
  name: "Thammasorn Lueadtaharn",
  github: "https://github.com/PPIONGG",
  facebook: "https://www.facebook.com/iampingpong.tammasorn/",
  /** ใส่ลิงก์เต็ม เช่น https://line.me/ti/p/... */
  line: "",
  /** ใส่ลิงก์เต็ม เช่น https://instagram.com/... */
  instagram: "",
} as const;

/** สีจาก globals.css ใช้ซ้ำในรูป og ที่วาดด้วย ImageResponse (ใช้ตัวแปร CSS ไม่ได้) */
export const OG_COLORS = {
  night: "#120d09",
  cabinet: "#1b1510",
  paper: "#f3e6d0",
  dust: "#c4ae90",
  ember: "#d2652a",
} as const;
