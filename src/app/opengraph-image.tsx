import { stories } from "@/data/stories";
import { OG_CONTENT_TYPE, OG_SIZE, composeCard, pngResponse } from "@/lib/og";
import { OG_COLORS } from "@/lib/site";

export const alt = "ห้องเก็บผี — ชั้นวางเรื่องผีที่ฟังจาก YouTube แล้วเก็บไว้";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  const png = await composeCard({
    shapesSvg: `<rect x="72" y="82" width="56" height="4" fill="${OG_COLORS.ember}"/>`,
    texts: [
      {
        text: "HONG KEP PHI",
        size: 16,
        color: OG_COLORS.ember,
        left: 146,
        top: 70,
        letterSpacing: 8,
      },
      { text: "ห้องเก็บผี", size: 82, color: OG_COLORS.paper, left: 72, top: 190 },
      {
        text: "ไม่ใช่คลังเรื่องผีทั้งอินเทอร์เน็ต เป็นชั้นวางของคนที่ฟัง YouTube ดึกๆ แล้วเก็บเฉพาะเรื่องที่ยังวนอยู่ในหัว",
        size: 26,
        color: OG_COLORS.dust,
        left: 72,
        top: 372,
        maxWidth: 900,
      },
      {
        text: `${stories.length} เรื่องในตู้`,
        size: 20,
        color: OG_COLORS.dust,
        left: 72,
        top: 510,
      },
    ],
  });

  return pngResponse(png);
}
