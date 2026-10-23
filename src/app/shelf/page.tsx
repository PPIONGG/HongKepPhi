import type { Metadata } from "next";
import { TapeRoom } from "@/components/shelf/TapeRoom";
import { glowFromTagParam } from "@/components/shelf/tapes";
import { SITE_NAME } from "@/lib/site";

const title = "ชั้นเทป";
const description =
  "ห้องปิดไฟอยู่ ส่องไฟฉายหาเทปเรื่องผีที่ปองฟังแล้วเก็บไว้ ม้วนไหนน่าฟังก็หยิบออกมาเปิดปกดูได้เลย";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/shelf" },
  openGraph: {
    title,
    description,
    url: "/shelf",
    siteName: SITE_NAME,
    locale: "th_TH",
    type: "website",
    images: "/opengraph-image",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default async function ShelfPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string | string[] }>;
}) {
  const { tag } = await searchParams;
  return <TapeRoom initialGlow={glowFromTagParam(tag)} />;
}
