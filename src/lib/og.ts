import { join } from "node:path";
import sharp from "sharp";
import { OG_COLORS } from "./site";

/** ขนาดมาตรฐานของการ์ดแชร์ ใช้ทั้ง og และ twitter */
export const OG_SIZE = { width: 1200, height: 630 };

export const OG_CONTENT_TYPE = "image/png";

const FONT_FILE = join(process.cwd(), "assets/NotoSerifThai-SemiBold.ttf");
const FONT_FAMILY = "Noto Serif Thai";

/**
 * ทำไมไม่ใช้ ImageResponse จาก next/og
 *
 * satori ที่อยู่ข้างใน ImageResponse วางวรรณยุกต์ที่ซ้อนบนสระบนไม่ได้
 * "เรื่อง" จะออกมาเป็น "เรือง" และ "ที่" เป็น "ที" (ลองมาแล้วทั้ง
 * Noto Serif Thai, Noto Sans Thai และ Sarabun — พังเหมือนกันหมด
 * เพราะเป็นที่ตัวเรนเดอร์ ไม่ใช่ฟอนต์)
 *
 * sharp ใช้ pango + harfbuzz ซึ่งจัดสระไทยถูก เลยประกอบการ์ดด้วย sharp แทน
 * รูปพวกนี้ถูกสร้างตอน build (เป็น SSG) sharp จึงรันบนเครื่อง build เท่านั้น
 */
type TextLayer = {
  text: string;
  size: number;
  color: string;
  left: number;
  top: number;
  /** ความกว้างสูงสุดก่อนตัดบรรทัด ไม่ใส่ = บรรทัดเดียว */
  maxWidth?: number;
  letterSpacing?: number;
};

function escapeMarkup(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function renderText(layer: TextLayer) {
  const spacing = layer.letterSpacing
    ? ` letter_spacing="${Math.round(layer.letterSpacing * 1024)}"`
    : "";

  const image = sharp({
    text: {
      text: `<span foreground="${layer.color}"${spacing}>${escapeMarkup(layer.text)}</span>`,
      font: `${FONT_FAMILY} ${layer.size}`,
      fontfile: FONT_FILE,
      rgba: true,
      width: layer.maxWidth ?? OG_SIZE.width,
      ...(layer.maxWidth ? { wrap: "word" as const } : {}),
      dpi: 72,
    },
  });

  return { input: await image.png().toBuffer(), left: layer.left, top: layer.top };
}

/**
 * ดึงภาพปกคลิปมาครอบเต็มการ์ด คืน null ถ้าโหลดไม่ได้ จะได้ถอยไปใช้พื้นไล่สี
 *
 * ปกคลิปผีมักมีตัวหนังสือใหญ่ของช่องอยู่แล้ว ถ้าวางดิบๆ จะตีกับชื่อเรื่องของเรา
 * เลยเบลอกับหรี่แสงให้เหลือแค่บรรยากาศ
 */
async function coverFromUrl(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const buffer = Buffer.from(await response.arrayBuffer());
    return await sharp(buffer)
      .resize(OG_SIZE.width, OG_SIZE.height, { fit: "cover" })
      .blur(14)
      .modulate({ brightness: 0.55, saturation: 0.7 })
      .toBuffer();
  } catch {
    return null;
  }
}

function gradientBackground(overlay?: string) {
  return Buffer.from(
    `<svg width="${OG_SIZE.width}" height="${OG_SIZE.height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="${overlay ? 1 : 0.4}" y2="${overlay ? 0 : 1}">
          ${overlay ?? `<stop offset="0" stop-color="#1a120d"/><stop offset="0.55" stop-color="${OG_COLORS.night}"/><stop offset="1" stop-color="#0d0907"/>`}
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g)"/>
    </svg>`,
  );
}

function shapes(svg: string) {
  return Buffer.from(
    `<svg width="${OG_SIZE.width}" height="${OG_SIZE.height}" xmlns="http://www.w3.org/2000/svg">${svg}</svg>`,
  );
}

/** ภาพปกคมชัดใบเล็ก วางทับพื้นเบลอ ให้เรื่องยังมีหน้าตาของตัวเอง */
async function insetFromUrl(url: string, width: number, height: number) {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const buffer = Buffer.from(await response.arrayBuffer());
    return await sharp(buffer).resize(width, height, { fit: "cover" }).toBuffer();
  } catch {
    return null;
  }
}

export async function composeCard({
  thumbUrl,
  inset,
  overlaySvg,
  shapesSvg,
  texts,
}: {
  thumbUrl?: string;
  inset?: { left: number; top: number; width: number; height: number };
  overlaySvg?: string;
  shapesSvg?: string;
  texts: TextLayer[];
}) {
  const cover = thumbUrl ? await coverFromUrl(thumbUrl) : null;
  const layers = [];

  if (cover) {
    layers.push({ input: cover, left: 0, top: 0 });
    if (overlaySvg) {
      layers.push({ input: shapes(overlaySvg), left: 0, top: 0 });
    }
  } else {
    layers.push({ input: gradientBackground(), left: 0, top: 0 });
  }

  if (thumbUrl && inset) {
    const patch = await insetFromUrl(thumbUrl, inset.width, inset.height);
    if (patch) layers.push({ input: patch, left: inset.left, top: inset.top });
  }

  if (shapesSvg) layers.push({ input: shapes(shapesSvg), left: 0, top: 0 });
  for (const text of texts) layers.push(await renderText(text));

  return sharp({
    create: {
      width: OG_SIZE.width,
      height: OG_SIZE.height,
      channels: 4,
      background: OG_COLORS.night,
    },
  })
    .composite(layers)
    .png()
    .toBuffer();
}

export function pngResponse(buffer: Buffer) {
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": OG_CONTENT_TYPE,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
